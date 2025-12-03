#!/data/data/com.termux/files/usr/bin/bash

# Script de démarrage intelligent pour réussitess971_v2
# Trouve automatiquement un port disponible

PREFERRED_PORT=8081
START_PORT=8080
END_PORT=8090
DIRECTORY="public/reussitess971_v2"

echo "🔍 Recherche d'un port disponible..."

# Fonction pour vérifier si un port est disponible
is_port_available() {
    ! netstat -tuln 2>/dev/null | grep -q ":$1 " && ! lsof -ti:$1 2>/dev/null
}

# Essayer le port préféré d'abord
if is_port_available $PREFERRED_PORT; then
    PORT=$PREFERRED_PORT
    echo "✅ Port $PORT disponible"
else
    echo "⚠️  Port $PREFERRED_PORT occupé, recherche d'une alternative..."
    
    # Chercher un port disponible dans la plage
    PORT=""
    for ((p=$START_PORT; p<=$END_PORT; p++)); do
        if is_port_available $p; then
            PORT=$p
            echo "✅ Port $PORT disponible"
            break
        fi
    done
    
    if [ -z "$PORT" ]; then
        echo "❌ Aucun port disponible entre $START_PORT et $END_PORT"
        echo ""
        echo "Processus actifs sur ces ports :"
        netstat -tuln | grep -E ':(808[0-9]|809[0-9])'
        echo ""
        echo "💡 Exécutez d'abord le script de nettoyage :"
        echo "   bash ~/reussitess-global-nexus/scripts/cleanup_and_restart.sh"
        exit 1
    fi
fi

# Vérifier que le répertoire existe
if [ ! -d "$DIRECTORY" ]; then
    echo "❌ Erreur : Le répertoire $DIRECTORY n'existe pas"
    exit 1
fi

echo ""
echo "🚀 Démarrage de http-server..."
echo "   📁 Répertoire : $DIRECTORY"
echo "   🌐 Port : $PORT"
echo "   🔗 URL : http://127.0.0.1:$PORT/"
echo ""
echo "   Pour arrêter : Ctrl+C"
echo "   Pour arrêter en arrière-plan : fg puis Ctrl+C"
echo ""

# Démarrer http-server
cd ~/reussitess-global-nexus
npx http-server $DIRECTORY -p $PORT
