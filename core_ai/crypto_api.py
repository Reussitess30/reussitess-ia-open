import requests

def crypto_reuss_token():
    """
    Retourne le prix actuel du REUSS Token (Polygon) depuis CoinGecko
    """
    try:
        url = "https://api.coingecko.com/api/v3/simple/price?ids=reuss-token&vs_currencies=usd"
        response = requests.get(url)
        data = response.json()
        price = data.get("reuss-token", {}).get("usd")
        if price:
            return f"💎 Prix REUSS Token : ${price} USD"
        return "Prix REUSS Token indisponible"
    except Exception as e:
        return f"Erreur API REUSS Token : {e}"

