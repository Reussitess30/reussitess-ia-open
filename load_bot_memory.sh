#!/bin/bash

# =========================================
# 🔹 Chemins des fichiers sources
# =========================================
DATASETS_FILE="/data/data/com.termux/files/home/reussitess-global-nexus/datasets_links.txt"
PERSONALITIES_FILE="/data/data/com.termux/files/home/reussitess-global-nexus/personalities.txt"

# =========================================
# 🔹 Charger les datasets dans Redis
# =========================================
if [ -f "$DATASETS_FILE" ]; then
    echo "[INFO] Injection des datasets dans Redis..."
    while IFS="|" read -r platform name url; do
        echo "[INFO] Traitement dataset: $name ($platform)"
        redis-cli SET "datasets:$platform:$name" "$url"
        redis-cli PERSIST "datasets:$platform:$name"
        echo "[OK] $name injecté dans Redis"
    done < "$DATASETS_FILE"
else
    echo "[WARN] Fichier datasets_links.txt introuvable."
fi

# =========================================
# 🔹 Charger les personnalités DOM-TOM dans Redis
# =========================================
if [ -f "$PERSONALITIES_FILE" ]; then
    echo "[INFO] Injection des personnalités DOM-TOM dans Redis..."
    while IFS="|" read -r territory name url; do
        echo "[INFO] Traitement personnalité: $name ($territory)"
        content=$(curl -s "$url")
        redis-cli SET "domtom:$territory:$name" "$content"
        redis-cli PERSIST "domtom:$territory:$name"
        echo "[OK] $name injecté dans Redis"
    done < "$PERSONALITIES_FILE"
else
    echo "[WARN] Fichier personalities.txt introuvable."
fi

echo "[INFO] Injection terminée ✅"
