#!/bin/bash

# --- Fichiers à injecter ---
PERSONALITIES_FILE="$HOME/reussitess-global-nexus/personalities.txt"
DATASETS_FILE="$HOME/reussitess-global-nexus/datasets_links.txt"
ROUTES_FILE="$HOME/reussitess-global-nexus/routes.txt"

# --- Injecter personnalités DOM-TOM ---
while IFS="|" read -r territory name url; do
    echo "[INFO] Traitement personnalité: $name ($territory)"
    content=$(curl -s "$url")
    redis-cli SET "domtom:$territory:$name" "$content"
    redis-cli PERSIST "domtom:$territory:$name"
    echo "[OK] $name injecté dans Redis"
done < "$PERSONALITIES_FILE"

# --- Injecter datasets ---
while IFS="|" read -r platform name url; do
    echo "[INFO] Traitement dataset: $name ($platform)"
    redis-cli SET "datasets:$platform:$name" "$url"
    redis-cli PERSIST "datasets:$platform:$name"
    echo "[OK] $name injecté dans Redis"
done < "$DATASETS_FILE"

# --- Injecter routes ---
echo "[INFO] Injection routes"
redis-cli SET "reussitess:routes" "$(cat $ROUTES_FILE)"
redis-cli PERSIST "reussitess:routes"
echo "[OK] Routes injectées dans Redis"

echo "[DONE] Toutes les données sont en mémoire Redis et persistantes"
