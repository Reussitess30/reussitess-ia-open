import requests

def get_crypto_prices():
    url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,polygon,matic-network&vs_currencies=eur,usd"
    data = requests.get(url).json()
    BTC = data.get("bitcoin", {})
    ETH = data.get("ethereum", {})
    POLY = data.get("polygon") or data.get("matic-network", {})
    return BTC, ETH, POLY

BTC, ETH, POLY = get_crypto_prices()

