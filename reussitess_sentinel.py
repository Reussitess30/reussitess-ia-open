# ==========================================================
# REUSSITESS® SENTINEL — SURVEILLANCE RÉELLE 24/7
# Sentinelles ST-001 à ST-006 actives
# ==========================================================
import requests, time, json
from datetime import datetime

CONTRACT = "0xB37531727fC07c6EED4f97F852A115B428046EB2"
SITE_URL = "https://reussitess.fr"

def log(emoji, msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {emoji} {msg}")

def st001_prix_reuss():
    try:
        r = requests.get(f"https://api.dexscreener.com/latest/dex/tokens/{CONTRACT}", timeout=10)
        pair = r.json().get("pairs", [{}])[0]
        prix = pair.get("priceUsd", "N/A")
        vol = pair.get("volume", {}).get("h24", "N/A")
        liq = pair.get("liquidity", {}).get("usd", "N/A")
        change = pair.get("priceChange", {}).get("h24", "N/A")
        log("💎", f"ST-001 | REUSS: ${prix} | Vol24h: ${vol} | Liq: ${liq} | Δ24h: {change}%")
    except: log("⚠️", "ST-001 | DexScreener indisponible")

def st002_actualites():
    try:
        r = requests.get("https://www.rfi.fr/fr/rss", timeout=10)
        import re
        titles = re.findall(r'<title>(.*?)</title>', r.text)[1:3]
        for t in titles:
            log("📰", f"ST-002 | RFI: {t[:60]}")
    except: log("⚠️", "ST-002 | RFI indisponible")

def st003_meteo():
    try:
        r = requests.get("https://api.open-meteo.com/v1/forecast?latitude=16.26&longitude=-61.55&current_weather=true", timeout=10)
        w = r.json()["current_weather"]
        log("🌤️", f"ST-003 | Météo Guadeloupe: {w['temperature']}°C | Vent: {w['windspeed']}km/h")
    except: log("⚠️", "ST-003 | Météo indisponible")

def st004_iss():
    try:
        r = requests.get("http://api.open-notify.org/iss-now.json", timeout=10)
        p = r.json()["iss_position"]
        log("🛸", f"ST-004 | ISS: Lat {float(p['latitude']):.2f}° | Lon {float(p['longitude']):.2f}°")
    except: log("⚠️", "ST-004 | ISS indisponible")

def st005_crypto():
    try:
        r = requests.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,matic-network&vs_currencies=usd", timeout=10)
        d = r.json()
        btc = d.get("bitcoin", {}).get("usd", "N/A")
        eth = d.get("ethereum", {}).get("usd", "N/A")
        pol = d.get("matic-network", {}).get("usd", "N/A")
        log("📊", f"ST-005 | BTC: ${btc} | ETH: ${eth} | POL: ${pol}")
    except: log("⚠️", "ST-005 | CoinGecko indisponible")

def st006_site():
    try:
        r = requests.get(SITE_URL, timeout=10)
        status = "✅ EN LIGNE" if r.status_code == 200 else "❌ HORS LIGNE"
        log("🌐", f"ST-006 | Site {SITE_URL}: {status}")
    except: log("❌", f"ST-006 | Site HORS LIGNE")

def run():
    log("🚀", "QUANTUM NEXUS — 6 SENTINELLES ACTIVES")
    log("🛡️", f"Surveillance: {CONTRACT[:20]}...")
    cycle = 0
    while True:
        cycle += 1
        log("🔄", f"═══ CYCLE #{cycle} ═══")
        st001_prix_reuss()
        st002_actualites()
        st003_meteo()
        st004_iss()
        st005_crypto()
        st006_site()
        log("⏳", "Prochain scan dans 60s...")
        print()
        time.sleep(60)

if __name__ == "__main__":
    run()
