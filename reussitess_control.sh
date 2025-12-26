#!/bin/bash
# ==========================================================
# REUSSITESS© MASTER KEY - PANNEAU DE CONTRÔLE GLOBAL
# DROITS : ADMINISTRATEUR SUPRÊME
# ==========================================================

case "$1" in
    start)
        echo "🚀 Lancement de l'infrastructure Reussitess©..."
        python3 reussitess_engine.py &
        python3 reussitess_blackbox.py &
        python3 reussitess_analytics.py &
        echo "✅ Tous les modules sont ACTIFS."
        ;;
    stop)
        echo "🛑 Arrêt sécurisé de tous les modules..."
        pkill -f reussitess_
        echo "✅ Système mis en veille (Mode Ghost)."
        ;;
    status)
        echo "📊 État des processus :"
        ps aux | grep reussitess_ | grep -v grep
        ;;
    clean)
        python3 reussitess_maintenance.py
        ;;
    *)
        echo "Usage: ./reussitess_control.sh {start|stop|status|clean}"
        ;;
esac
