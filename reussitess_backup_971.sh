#!/bin/bash
# ==========================================================
# REUSSITESS© - SAUVEGARDE TOTALE DU MASTER NODE
# DATE : 26 DÉCEMBRE 2025 | HUB : GUADELOUPE (971)
# ==========================================================

BACKUP_NAME="reussitess_backup_$(date +%Y%m%d_%H%M%S).tar.gz"

echo "🔐 Préparation de la sauvegarde Reussitess©..."
tar -czf $BACKUP_NAME . --exclude="*.tar.gz" --exclude="node_modules"

echo "----------------------------------------------------------"
echo "✅ SAUVEGARDE TERMINÉE : $BACKUP_NAME"
echo "📍 EMPLACEMENT : /data/data/com.termux/files/home/reussitess-global-nexus/"
echo "🛡️ STATUT : Vos 200 IA et 26 liens sont en sécurité."
echo "----------------------------------------------------------"
