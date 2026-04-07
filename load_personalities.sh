#!/bin/bash

PERSONALITIES_FILE=~/reussitess-global-nexus/personalities.txt

while IFS="|" read -r territory name url; do
    echo "[INFO] Traitement: $name ($territory)"
    content=$(curl -s "$url")
    redis-cli SET "domtom:$territory:$name" "$content"
    redis-cli PERSIST "domtom:$territory:$name"
    echo "[OK] $name injecté dans Redis"
done < "$PERSONALITIES_FILE"
