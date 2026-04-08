#!/bin/bash

# Chemin complet vers le fichier contenant les liens
DATASETS_FILE="/data/data/com.termux/files/home/reussitess-global-nexus/datasets_links.txt"

# Boucle sur chaque ligne du fichier
while IFS="|" read -r platform name url; do
    echo "[INFO] Traitement: $name ($platform)"
    redis-cli SET "datasets:$platform:$name" "$url"
    redis-cli PERSIST "datasets:$platform:$name"
    echo "[OK] $name injecté dans Redis"
done < "$DATASETS_FILE"
