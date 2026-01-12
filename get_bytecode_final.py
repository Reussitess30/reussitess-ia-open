import requests
url = "https://api.polygonscan.com/api"
params = {
    "module": "proxy",
    "action": "eth_getCode",
    "address": "0xB37531727fC07c6EED4f97F852A115B428046EB2",
    "tag": "latest",
    "apikey": "SBQYXZE71Y18ZE8VC9NZTM7GQ14KX6B695"
}
r = requests.get(url, params=params)
print(r.json()["result"][:200] + "...")
