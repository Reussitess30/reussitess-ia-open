import os, subprocess, requests, time
from datetime import datetime

BASE_DIR = os.path.expanduser("~/reussitess-global-nexus")
SITE_URL = "https://reussitess-global-nexus-jfgk.vercel.app"
LOG_FILE = os.path.join(BASE_DIR, "logs", "auto_guerison.log")
os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)

FICHIERS = ["pages/index.js","pages/investir-reuss.js","pages/boutiques.js","components/Layout.js","components/BotAssistant.js","public/manifest.json","public/icon-192x192.png","vercel.json","next.config.js","package.json"]
ENDPOINTS = ["/","/investir-reuss","/boutiques","/calculateur-amazon"]

def log(msg, level="INFO"):
    icons = {"INFO":"ℹ️","OK":"✅","WARN":"⚠️","ERROR":"❌"}
    line = f"[{datetime.now().strftime('%H:%M:%S')}] {icons.get(level,'ℹ️')} {msg}"
    print(line)
    with open(LOG_FILE,"a") as f: f.write(line+"\n")

def verifier_fichiers():
    manquants = []
    for f in FICHIERS:
        path = os.path.join(BASE_DIR, f)
        if os.path.exists(path) and os.path.getsize(path) > 0:
            log(f"{f} OK", "OK")
        else:
            log(f"MANQUANT: {f}", "ERROR")
            manquants.append(f)
    return manquants

def verifier_site():
    erreurs = []
    for ep in ENDPOINTS:
        try:
            r = requests.get(SITE_URL+ep, timeout=10)
            log(f"{ep} : HTTP {r.status_code}", "OK" if r.status_code==200 else "WARN")
            if r.status_code != 200: erreurs.append(ep)
        except Exception as e:
            log(f"{ep} : {str(e)[:40]}", "ERROR")
            erreurs.append(ep)
    return erreurs

def main():
    log("🛡️ AUTO-GUÉRISON REUSSITESS®971 DÉMARRÉE")
    mf = verifier_fichiers()
    es = verifier_site()
    score = max(0, 100 - len(mf)*10 - len(es)*15)
    log(f"Score santé : {score}/100", "OK" if score>=80 else "WARN")
    log("BOUDOUM! 🇬🇵 Terres de Champions")

if __name__ == "__main__":
    main()
