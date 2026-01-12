from solcx import compile_standard
import json, os

# Auto-detect Solidity file
sol_files = [f for f in os.listdir('.') if f.endswith('.sol')]
if not sol_files:
    print("❌ Aucun fichier .sol trouvé")
    exit(1)
source_file = sol_files[0]  # Prend le premier
print("📂 Utilise: {}".format(source_file))

with open(source_file, 'r') as f:
    source = f.read()

print("⚙️ Compile v0.8.27...")
compiled = compile_standard({
    "language": "Solidity",
    "sources": {source_file: {"content": source}},
    "settings": {
        "optimizer": {"enabled": True, "runs": 200},
        "evmVersion": "paris",
        "outputSelection": {"*": {"*": ["bin"]}}
    }
}, solc_version="0.8.27")

contract_name = list(compiled['contracts'][source_file].keys())[0]
contract = compiled['contracts'][source_file][contract_name]

print("✅ BYTECODE:")
print(contract['bin'][:1024])
print("Taille: {} bytes".format(int(len(contract['bin'])/2)))

with open('REUSSITESS_bytecode.hex', 'w') as f:
    f.write(contract['bin'])
print("✅ REUSSITESS_bytecode.hex généré !")
