#!/data/data/com.termux/files/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
OUTDIR="$HOME/reussitess-backup"
STANDARD_JSON="$OUTDIR/standard-json-input.json"
SOLC_VERSION="0.8.31"
RPC="https://polygon-rpc.com"

mkdir -p "$OUTDIR"

CONTRACT_NAME="${1:-}"
CONTRACT_ADDR="${2:-}"

# find all .sol files
mapfile -t SOLFILES < <(find "$ROOT" -type f -name '*.sol' | sed "s|$ROOT/||")
if [ ${#SOLFILES[@]} -eq 0 ]; then
  echo "Aucun fichier .sol trouvé dans $ROOT. Quitte."
  exit 1
fi

echo "Found ${#SOLFILES[@]} .sol files."

# 1) generate standard json via a small python script
GEN_PY="$OUTDIR/gen_standard_json.py"
cat > "$GEN_PY" <<'PY'
import os,sys,json
root=sys.argv[1]; out=sys.argv[2]
sources={}
for dirpath,_,filenames in os.walk(root):
    for fn in filenames:
        if fn.endswith('.sol'):
            path=os.path.join(dirpath,fn)
            key=os.path.relpath(path, root).replace("\\","/")
            try:
                with open(path,'r',encoding='utf-8') as f:
                    sources[key] = {"content": f.read()}
            except:
                with open(path,'r',encoding='latin-1') as f:
                    sources[key] = {"content": f.read()}
standard_input = {
  "language": "Solidity",
  "sources": sources,
  "settings": {
    "optimizer": { "enabled": False, "runs": 200 },
    "outputSelection": {
      "*": {
        "*": ["abi", "evm.bytecode.object", "evm.deployedBytecode.object", "metadata"]
      }
    }
  }
}
os.makedirs(os.path.dirname(out), exist_ok=True)
with open(out,'w',encoding='utf-8') as fh:
    json.dump(standard_input, fh, indent=2, ensure_ascii=False)
print(out)
PY

python3 "$GEN_PY" "$ROOT" "$STANDARD_JSON" >/dev/null && echo "Standard JSON écrit : $STANDARD_JSON"

# contract name inference
if [ -z "$CONTRACT_NAME" ]; then
  mapfile -t DECLS < <(grep -Rho --exclude-dir=node_modules -E "contract [A-Za-z0-9_]+" "$ROOT" | awk '{print $2}' | sort -u)
  if [ ${#DECLS[@]} -eq 1 ]; then
    CONTRACT_NAME="${DECLS[0]}"
    echo "Auto-detected contract name: $CONTRACT_NAME"
  else
    echo "Plusieurs (ou aucune) declarations de contract trouvées. Spécifie CONTRACT_NAME en argument."
    printf 'Found declarations:\n'
    printf ' - %s\n' "${DECLS[@]}"
    exit 2
  fi
fi

if [ -z "$CONTRACT_ADDR" ]; then
  echo "Fournis l'adresse du contrat comme second argument."
  exit 2
fi

# ensure node present
if ! command -v node >/dev/null 2>&1; then
  echo "Installation de nodejs (pkg)..."
  pkg install -y nodejs
fi

# install solc locally
NPM_DIR="$OUTDIR/npm_solc"
mkdir -p "$NPM_DIR"
if [ ! -d "$NPM_DIR/node_modules/solc" ]; then
  echo "Installation de solc@$SOLC_VERSION dans $NPM_DIR..."
  (cd "$NPM_DIR" && npm init -y >/dev/null 2>&1 && npm install solc@"$SOLC_VERSION" --no-fund --no-audit) || {
    echo "Erreur npm install solc"
    exit 3
  }
fi

# create js compiler runner
COMPILE_JS="$OUTDIR/compile_solc.js"
cat > "$COMPILE_JS" <<'JS'
const fs = require('fs');
const npmDir = process.argv[2];
const stdPath = process.argv[3];
const solc = require(npmDir + '/node_modules/solc');
const std = JSON.parse(fs.readFileSync(stdPath, 'utf8'));
const out = JSON.parse(solc.compile(JSON.stringify(std)));
fs.writeFileSync(process.env.HOME + '/reussitess-backup/solc-output.json', JSON.stringify(out, null, 2));
console.log('solc compile done');
JS

node "$COMPILE_JS" "$NPM_DIR" "$STANDARD_JSON"

OUT_JSON="$HOME/reussitess-backup/solc-output.json"
if [ ! -f "$OUT_JSON" ]; then
  echo "Compilation failed: $OUT_JSON not produced"
  exit 4
fi
echo "Compilation terminée, output: $OUT_JSON"

# find contract key using a small python script
FIND_KEY_PY="$OUTDIR/find_contract_key.py"
cat > "$FIND_KEY_PY" <<'PY'
import sys,json
out=json.load(open(sys.argv[1]))
name=sys.argv[2]
found=[]
for src,contracts in out.get('contracts',{}).items():
    for c in contracts.keys():
        if c==name:
            found.append(src+"::"+c)
if found:
    print(found[0])
else:
    # print NOTFOUND and candidate list
    print("NOTFOUND")
    cand=set()
    for src,contracts in out.get('contracts',{}).items():
        for c in contracts.keys():
            cand.add(c)
    for c in sorted(cand):
        print(c)
PY

python3 "$FIND_KEY_PY" "$OUT_JSON" "$CONTRACT_NAME" > /data/data/com.termux/files/home/reussitess-backup/contract_key.txt || true
if grep -q '^NOTFOUND' /data/data/com.termux/files/home/reussitess-backup/contract_key.txt; then
  echo "Le contrat $CONTRACT_NAME n'a pas été trouvé dans la compilation. Contrats disponibles :"
  sed -n '2,200p' /data/data/com.termux/files/home/reussitess-backup/contract_key.txt
  exit 5
fi
CONTRACT_KEY=$(sed -n '1p' /data/data/com.termux/files/home/reussitess-backup/contract_key.txt)
echo "Using compiled contract key: $CONTRACT_KEY"

# extract compiled deployed bytecode via a small python script
EXTRACT_PY="$OUTDIR/extract_byte.py"
cat > "$EXTRACT_PY" <<'PY'
import sys,json
out=json.load(open(sys.argv[1]))
key=sys.argv[2]
src,cn = key.split("::",1)
print(out['contracts'][src][cn].get('evm',{}).get('deployedBytecode',{}).get('object','') or '')
PY

COMPILED_BYTE=$(python3 "$EXTRACT_PY" "$OUT_JSON" "$CONTRACT_KEY")
if [ -z "$COMPILED_BYTE" ]; then
  echo "Compiled deployedBytecode empty. Possibly libraries/abstract contract."
  exit 6
fi

# get on-chain code
RPC_RES="$OUTDIR/rpc_tx.json"
curl -s -X POST -H 'Content-Type: application/json' --data "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_getCode\",\"params\":[\"$CONTRACT_ADDR\",\"latest\"]}" "$RPC" > "$RPC_RES"
ONCHAIN_BYTE=$(jq -r '.result // empty' "$RPC_RES" | sed 's/^0x//' | tr 'A-F' 'a-f' || true)
if [ -z "$ONCHAIN_BYTE" ]; then
  echo "Impossible de récupérer le bytecode on-chain (voir $RPC_RES)"
  exit 7
fi

cmp_comp=$(echo "$COMPILED_BYTE" | sed 's/^0x//' | tr 'A-F' 'a-f')
echo "Longueurs (hex chars): compiled=$(( ${#cmp_comp} )), onchain=$(( ${#ONCHAIN_BYTE} ))"

if [ "$cmp_comp" = "$ONCHAIN_BYTE" ]; then
  echo "MATCH EXACT — bytecode compilé == on-chain"
  MATCH=1
else
  if [[ "$ONCHAIN_BYTE" == "${cmp_comp}"* ]] || [[ "$cmp_comp" == "${ONCHAIN_BYTE}"* ]]; then
    echo "Match partiel (prefix)"
    MATCH=1
  else
    echo "DIFFERENCE: bytecodes diffèrent"
    MATCH=0
  fi
fi

# copy outputs
cp -v "$STANDARD_JSON" "$OUTDIR/standard-json-input.json" || true
termux-setup-storage >/dev/null 2>&1 || true
cp -v "$OUTDIR/standard-json-input.json" /storage/emulated/0/Download/standard-json-input.json || true

echo "Fichiers écrits:"
ls -l "$OUTDIR/standard-json-input.json" "$OUT_JSON" "$OUTDIR/solc-output.json" "$RPC_RES" 2>/dev/null || true

if [ "${MATCH:-0}" -eq 1 ]; then
  echo "OK: tu peux coller $OUTDIR/standard-json-input.json dans Polygonscan -> Verify -> Verify via Standard JSON Input"
  exit 0
else
  echo "Erreur: les bytecodes ne correspondent pas. Colle ~/reussitess-backup/solc-output.json ici pour diagnostic."
  exit 8
fi
