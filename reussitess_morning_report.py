import requests
from datetime import datetime
import os

CONTRACT = "0xB37531727fC07c6EED4f97F852A115B428046EB2"
SITE_URL = "https://reussitess-global-nexus-jfgk.vercel.app"
LOG_FILE = os.path.expanduser("~/reussitess-global-nexus/logs/morning_report.log")
os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)

def get_token():
    try:
        r = requests.get(f"https://api.dexscreener.com/latest/dex/tokens/{CONTRACT}", timeout=10)
        pairs = r.json().get("pairs")
        return pairs[0] if pairs else None
    except: return None

def get_matic():
    try:
        r = requests.get("https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd,eur", timeout=10)
        return r.json().get("matic-network", {})
    except: return {}

def check_site():
    try:
        import time
        start = time.time()
        r = requests.get(SITE_URL, timeout=10)
        return r.status_code == 200, round((time.time()-start)*1000)
    except: return False, 0

def main():
    lines = []
    lines.append("="*50)
    lines.append("☀️  MORNING REPORT REUSSITESS®971 — BOUDOUM!")
    lines.append(f"📅  {datetime.now().strftime('%A %d %B %Y — %H:%M')}")
    lines.append("="*50)
    online, speed = check_site()
    lines.append(f"\n🌐 SITE : {'✅ EN LIGNE' if online else '❌ HORS LIGNE'} ({speed}ms)")
    token = get_token()
    lines.append(f"\n💎 TOKEN REUSS")
    if token:
        lines.append(f"   Prix    : ${token.get('priceUsd','N/A')}")
        lines.append(f"   Var 24h : {token.get('priceChange',{}).get('h24','N/A')}%")
        lines.append(f"   Volume  : ${token.get('volume',{}).get('h24','N/A')}")
        lines.append(f"   Liq     : ${token.get('liquidity',{}).get('usd','N/A')}")
    else:
        lines.append("   ⚠️ Non disponible")
    matic = get_matic()
    lines.append(f"\n🔷 POL : ${matic.get('usd','N/A')} | €{matic.get('eur','N/A')}")
    lines.append(f"\n🛍️  26 boutiques Amazon | 14 pays | ID: fb942837")
    lines.append("\n"+"="*50)
    lines.append("🏆 REUSSITESS®971 — POSITIVITÉ À L'INFINI 🇬🇵")
    lines.append("="*50)
    report = "\n".join(lines)
    print(report)
    with open(LOG_FILE, "a") as f:
        f.write(report + "\n\n")

if __name__ == "__main__":
    main()
