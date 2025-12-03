#!/data/data/com.termux/files/usr/bin/bash

# Script de nettoyage et redémarrage pour REUSSITESS Global Nexus
# Résout les problèmes de ports occupés (EADDRINUSE)

echo "🧹 Nettoyage des processus http-server et node..."

# Arrêter tous les jobs en arrière-plan
jobs -p | xargs -r kill 2>/dev/null

# Tuer tous les processus http-server
pkill -f "http-server" 2>/dev/null

# Tuer les processus node sur les ports spécifiques
for port in 8080 8081 8082 3000; do
    pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo "   Arrêt du processus sur le port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null
    fi
done

# Alternative si lsof n'est pas disponible
ps aux | grep -E 'http-server|next dev' | grep -v grep | awk '{print $2}' | xargs -r kill -9 2>/dev/null

echo "✅ Nettoyage terminé"
echo ""
echo "📋 État actuel des ports :"
netstat -tuln | grep -E ':(8080|8081|8082|3000)' 2>/dev/null || echo "   Aucun processus actif sur les ports 8080-8082, 3000"

echo ""
echo "🚀 Options de redémarrage :"
echo ""
echo "Pour Next.js (dev) :"
echo "   cd ~/reussitess-global-nexus && npm run dev"
echo ""
echo "Pour http-server (port 8080) :"
echo "   cd ~/reussitess-global-nexus && npx http-server -p 8080"
echo ""
echo "Pour réussitess971_v2 (port 8081) :"
echo "   cd ~/reussitess-global-nexus && npx http-server public/reussitess971_v2 -p 8081"
echo ""
echo "Pour réussitess971_v2 (port 8082) :"
echo "   cd ~/reussitess-global-nexus && npx http-server public/reussitess971_v2 -p 8082"
