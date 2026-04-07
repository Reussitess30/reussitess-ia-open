#!/bin/bash

# page à modifier
FILE="page.html"

# REUSSITESS Radio
sed -i 's|href="https://reussitess.fr"|href="https://reussitess.fr"|g' "$FILE"

# Gwoka Session
sed -i 's|href="https://la1ere.francetvinfo.fr/guadeloupe/programmes"|href="https://la1ere.francetvinfo.fr/guadeloupe/programmes"|g' "$FILE"

# Caraïbes Business
sed -i 's|href="https://la1ere.francetvinfo.fr"|href="https://la1ere.francetvinfo.fr"|g' "$FILE"

# Diasporas Africa
sed -i 's|href="https://www.rfi.fr/fr/podcasts"|href="https://www.rfi.fr/fr/podcasts"|g' "$FILE"

# Créole Talk
# (si tu as un vrai lien, remplace ci-dessous)
sed -i 's|href="#"|href="https://creoletalk.example.com"|g' "$FILE"

# RFI Afrique (même que Diasporas Africa ?)
sed -i 's|href="https://www.rfi.fr/fr/podcasts"|href="https://www.rfi.fr/fr/podcasts"|g' "$FILE"

echo "Liens mis à jour !"
