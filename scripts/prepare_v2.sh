#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
src="$repo_root/reussitess971"
dst="$repo_root/public/reussitess971_v2"

echo "Repo root: $repo_root"
echo "Source dir: $src"
echo "Destination dir: $dst"

mkdir -p "$dst"

if [ -f "$src/index.html" ]; then
  cp -v "$src/index.html" "$dst/index.html"
else
  echo "ERROR: source index.html not found in $src" >&2
  exit 2
fi

echo "Copying assets from $src to $dst ..."
cp -av "$src"/* "$dst"/ || true

echo "Updating asset paths in $dst/index.html ..."
sed -i 's|/reussitess971/|./|g' "$dst/index.html"

echo "Checking referenced assets in index.html..."
grep -oP '(?<=src=\"|href=\"|src=\x27|href=\x27)[^\"\\x27]+' "$dst/index.html" | while read -r asset; do
  if [[ "$asset" == ./* ]]; then
    path="$dst/${asset#./}"
    if [ ! -f "$path" ]; then
      echo "MISSING ASSET: $path"
    fi
  fi
done

echo "Done. Files present in $dst:"
ls -la "$dst"
echo "Next: git add $dst and commit (see instructions)."
