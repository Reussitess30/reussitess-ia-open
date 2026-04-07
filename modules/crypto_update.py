
import requests, time

def get_crypto_prices():
    try:
        url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,matic-network&vs_currencies=eur,usd"
        r = requests.get(url, timeout=5)
        data = r.json()

        return {
            "BTC": data.get("bitcoin", {}),
            "ETH": data.get("ethereum", {}),
            "POLY": data.get("matic-network", {})
        }
    except:
        return {"error": "API indisponible"}

