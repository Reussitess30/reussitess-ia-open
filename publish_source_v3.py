import requests
API_KEY = "SBQYXZE71Y18ZE8VC9NZTM7GQ14KX6B695"
CONTRACT_ADDR = "0xB37531727fC07c6EED4f97F852A115B428046EB2"
SOURCE_FILE = "REUSSITESSToken.sol"

with open(SOURCE_FILE, 'r') as f:
    source_code = f.read()

url = f"https://api.etherscan.io/v2/api?chainid=137"
data = {
    "apikey": API_KEY,
    "module": "contract",
    "action": "verifysourcecode",
    "contractaddress": CONTRACT_ADDR,
    "sourceCode": source_code,
    "codeformat": "solidity-single-file",
    "contractname": "REUSSITESSToken",
    "compilerversion": "v0.8.27+commit.40a35a09",  # ✅ VERSION SUPPORTÉE
    "optimizationUsed": 1,
    "runs": 200,
    "constructorArguements": "00000000000000000000000069f42aa645a43a84e1143d416a4c81a88df0154900000000000000000000000069f42aa645a43a84e1143d416a4c81a88df01549",
    "evmversion": "paris",
    "licenseType": 3
}

print(f"🚀 V0.8.27 OFFICIEL PolygonScan...")
response = requests.post(url, data=data)
print(f"📩 TICKET : {response.json()['result']}")
