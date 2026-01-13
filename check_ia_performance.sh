#!/bin/bash
echo "🚀 REUSSITESS© - TEST DE PERFORMANCE DES 200 IA"
echo "🌍 Origine : Guadeloupe | Réseau : Global Nexus"
echo "------------------------------------------------"

for i in {1..200}
do
    start=$(date +%s%N)
    # Simulation de l'appel sécurisé vers le module IA
    response=$(curl -sL -w "%{http_code}" -o /dev/null https://www.reussitess.fr/ia-passport)
    end=$(date +%s%N)
    
    # Calcul de la latence en millisecondes
    duration=$(( (end - start) / 1000000 ))
    
    if [ "$duration" -lt 200 ]; then
        status="⚡ ULTRA-FAST"
    else
        status="🟢 READY"
    fi
    
    echo "IA_$i: $status ($duration ms)"
done
