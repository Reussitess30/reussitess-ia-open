import requests
import time
import os
from datetime import datetime

SITE_URL = "https://reussitess-global-nexus-jfgk.vercel.app"
LOG_FILE = os.path.expanduser("~/reussitess-global-nexus/logs/sentinelle.log")
CHECK_INTERVAL = 60

ENDPOINTS = ["/", "/investir-reuss", "/boutiques", "/bibliotheque", "/calculateur-amazon"]

os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)

def log(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def check_site():
    results = []
    for endpoint in ENDPOINTS:
        url = SITE_URL + endpoint
        try:
            start = time.time()
            r = requests.get(url, timeout=10)
            elapsed = round((time.time() - start) * 1000)
            status = "✅ OK" if r.status_code == 200 else f"⚠️ {r.status_code}"
            results.append(f"{status} {endpoint} ({elapsed}ms)")
        except Exception as e:
            results.append(f"❌ ERREUR {endpoint}: {str(e)[:50]}")
    return results

def get_reuss_price():
    try:
        r = requests.get("https://api.dexscreener.com/latest/dex/tokens/0xB37531727fC07c6EED4f97F852A115B428046EB2", timeout=10)
        data = r.json()
        if data.get("pairs"):
            pair = data["pairs"][0]
            return f"💎 REUSS: ${pair.get('priceUsd','N/A')} | Vol 24h: ${pair.get('volume',{}).get('h24','N/A')}"
        return "💎 REUSS: Prix non disponible"
    except:
        return "💎 REUSS: Erreur"

def main():
    log("🚀 SENTINELLE REUSSITESS®971 ACTIVÉE — Guadeloupe 🇬🇵 BOUDOUM!")
    while True:
        log("--- SCAN ---")
        for r in check_site():
            log(r)
        log(get_reuss_price())
        log(f"⏳ Prochain scan dans {CHECK_INTERVAL}s...")
        time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    main()
