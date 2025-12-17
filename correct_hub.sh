#!/bin/bash

# Chemin vers le fichier hub-international.js
FILE="pages/hub-international.js"

# Vérifie si le fichier existe
if [ ! -f "$FILE" ]; then
  echo "❌ Le fichier $FILE n'existe pas."
  exit 1
fi

# Backup du fichier initial au cas où
cp "$FILE" "$FILE.bak"
echo "🛠  Une sauvegarde a été créée : $FILE.bak"

# Supprime toutes les doublons 'target="_blank"' dans les balises <a>
sed -i 's/\(target="_blank"\)\(.*\)\(target="_blank"\)/\1\2/g' "$FILE"

# Vérifie s'il reste encore des doublons
DOUBLONS=$(grep 'target="_blank".*target="_blank"' "$FILE")
if [ -z "$DOUBLONS" ]; then
  echo "✅ Tous les doublons target=\"_blank\" ont été corrigés dans $FILE."
else
  echo "⚠️  Des doublons subsistent encore dans $FILE :"
  echo "$DOUBLONS"
fi
