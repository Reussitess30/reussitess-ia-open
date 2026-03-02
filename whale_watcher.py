import requests
import time
from datetime import datetime

CONTRACT = "0xB37531727fC07c6EED4f97F852A115B428046EB2"

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

def get_token_stats():
    try:
        r = requests.get(f"https://api.dexscreener.com/latest/dex/tokens/{CONTRACT}", timeout=10)
        data = r.json()
        if data.get("pairs"):
            pair = data["pairs"][0]
            return pair
    except:
        pass
    return None

def get_recent_tx():
    try:
        r = requests.get(f"https://api.polygonscan.com/api?module=account&action=tokentx&contractaddress={CONTRACT}&sort=desc&offset=10&page=1&apikey=2ZPHAAZFKZTN26Q5HAVYB8KTYP1BUXICYX", timeout=10)
        data = r.json()
        if data.get("status") == "1":
            return data.get("result", [])
    except:
        pass
    return []

def watch():
    log("🐳 WHALE WATCHER REUSSITESS®971 ACTIVÉ")
    log(f"🔍 Token : {CONTRACT}")
    seen = set()
    while True:
        stats = get_token_stats()
        if stats:
            log(f"💎 Prix: ${stats.get('priceUsd','N/A')} | Vol 24h: ${stats.get('volume',{}).get('h24','N/A')} | Liq: ${stats.get('liquidity',{}).get('usd','N/A')}")
            change = stats.get('priceChange',{}).get('h24','N/A')
            log(f"📈 Variation 24h: {change}%")
        else:
            log("⚠️ Stats non disponibles")
        txs = get_recent_tx()
        new = [tx for tx in txs if tx.get("hash") not in seen]
        for tx in new:
            seen.add(tx["hash"])
            value = int(tx.get("value",0)) / (10**int(tx.get("tokenDecimal",18)))
            log(f"💸 TX: {value:,.0f} REUSS | {tx.get('from','')[:10]}... → {tx.get('to','')[:10]}...")
        if not new:
            log("😴 Aucune nouvelle transaction")
        log("⏳ Prochain scan dans 30s...")
        time.sleep(30)

if __name__ == "__main__":
    watch()
