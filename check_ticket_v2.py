import requests
API_KEY = "SBQYXZE71Y18ZE8VC9NZTM7GQ14KX6B695"
GUID = "1nh7uffeenbkanmrevjffaerp6qsnbfzyjgghzlmd7q62xxc8b"
url = f"https://api.etherscan.io/v2/api?chainid=137&module=contract&action=checkverifystatus&guid={GUID}&apikey={API_KEY}"
response = requests.get(url)
print(f"✅ STATUS : {response.json()['result']}")
