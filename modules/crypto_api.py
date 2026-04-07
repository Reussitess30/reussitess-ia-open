import requests

def crypto_reuss_token():
    try:
        url = "https://api.coingecko.com/api/v3/simple/price?ids=polygon&vs_currencies=usd"
        r = requests.get(url, timeout=5)
        data = r.json()

        price = data.get("polygon", {}).get("usd")

        if price:
            return f"REUSS Token (proxy Polygon): {price}$"
        else:
            return "Prix indisponible"

    except:
        return "Prix REUSS Token indisponible"
