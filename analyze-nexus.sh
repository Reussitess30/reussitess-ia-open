#!/bin/bash

echo "🔍 ANALYSE DE REUSSITESS GLOBAL NEXUS"
echo "======================================"
echo ""

# 1. Structure du projet
echo "📂 STRUCTURE DU PROJET:"
echo "----------------------"
tree -L 3 . 2>/dev/null || ls -la

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 2. Compter les fichiers par type
echo "📊 STATISTIQUES:"
echo "----------------"
echo "Scripts Bash : $(find . -name "*.sh" | wc -l)"
echo "Scripts Python : $(find . -name "*.py" | wc -l)"
echo "Scripts Node.js : $(find . -name "*.js" | wc -l)"
echo "Configs : $(find . -name "*.json" -o -name "*.yaml" -o -name "*.yml" | wc -l)"
echo ""

# 3. Fichiers principaux
echo "📄 FICHIERS PRINCIPAUX:"
echo "-----------------------"
find . -maxdepth 2 -type f \( -name "*.sh" -o -name "*.py" -o -name "*.js" \) | head -20

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 4. Chercher les IA
echo "🤖 RECHERCHE DES IA:"
echo "--------------------"
grep -r "ai\|bot\|automation" . --include="*.sh" --include="*.py" --include="*.js" | head -20

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 5. Processus actifs
echo "⚡ PROCESSUS ACTIFS:"
echo "--------------------"
ps aux | grep -i "reussitess\|nexus" | grep -v grep

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 6. Cron jobs
echo "⏰ TÂCHES PLANIFIÉES:"
echo "---------------------"
crontab -l 2>/dev/null | grep -i "reussitess\|nexus" || echo "Aucune tâche planifiée trouvée"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 7. README ou documentation
echo "📖 DOCUMENTATION:"
echo "-----------------"
if [ -f "README.md" ]; then
    echo "✅ README.md trouvé"
    head -30 README.md
else
    echo "❌ Pas de README.md"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 8. Dernières modifications
echo "🕐 ACTIVITÉ RÉCENTE:"
echo "--------------------"
find . -type f -mtime -7 | head -20

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "✅ Analyse terminée !"
echo ""
echo "💡 Prochaines étapes:"
echo "   1. Examinez la structure"
echo "   2. Identifiez les 200 IA"
echo "   3. Testez les fonctionnalités"
echo "   4. Optimisez le système"
echo ""
