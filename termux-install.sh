#!/data/data/com.termux/files/usr/bin/bash

echo "🚀 REUSSSHIELD AI GUARDIAN - Installation automatique"
echo "=================================================="

# Étape 1: Prérequis
echo "📦 Installation des dépendances système..."
pkg update -y
pkg upgrade -y
pkg install git nodejs python docker docker-compose mongodb redis nginx -y

# Étape 2: Création dossiers
echo "📁 Création structure projet..."
mkdir -p ~/reussshield
cd ~/reussshield

# Étape 3: Backend (API + ML)
echo "⚙️ Téléchargement backend + ML..."
git clone https://github.com/Reussitess30/reussitess-global-nexus.git reussshield_backend
cd reussshield_backend
chmod +x quick-start.sh

echo "🐳 Démarrage Docker Compose (MongoDB + Redis + API)..."
docker-compose up -d

# Étape 4: Frontend
echo "🌐 Copie frontends HTML..."
cd ~/reussshield
cp ../reussitess-global-nexus/reussshield_ai_guardian.html .
cp ../reussitess-global-nexus/reussshield_revoke.html .

# Étape 5: Nginx config
echo "🛠️ Configuration Nginx..."
cat > nginx.conf << 'EOF'
server {
    listen 8080;
    root /data/data/com.termux/files/home/reussshield;
    index reussshield_ai_guardian.html;

    location / {
        try_files $uri $uri/ /reussshield_ai_guardian.html;
    }
}
EOF

nginx -c ~/reussshield/nginx.conf

echo "✅ INSTALLATION TERMINÉE !"
echo ""
echo "🚀 DÉMARRAGE EN 3 ÉTAPES:"
echo "ÉTAPE 1: cd ~/reussshield/reussshield_backend"
echo "ÉTAPE 2: ./quick-start.sh"
echo "ÉTAPE 3: Ouvre http://localhost:8080 dans ton navigateur"
echo ""
echo "🛡️ Frontend: http://localhost:8080/reussshield_ai_guardian.html"
echo "🔒 Revoke tool: http://localhost:8080/reussshield_revoke.html"
echo "📊 Mongo Express: http://localhost:8081"
echo "📈 Redis Commander: http://localhost:8082"
echo ""
echo "Status Docker: docker ps"
echo "Logs: docker-compose logs -f"
