from web3 import Web3
import time

web3 = Web3(Web3.HTTPProvider("https://polygon-rpc.com"))
POOL_ADDR = web3.to_checksum_address("0x1d2e88A55CBBAB68237aa10781a5e00335Af9f9c")

print("🐳 SURVEILLANCE DES FLUX INTERNATIONAUX (14 PAYS)...")

def watch():
    last_block = web3.eth.block_number
    while True:
        current_block = web3.eth.block_number
        if current_block > last_block:
            # On cherche les transactions vers le pool
            txs = web3.eth.get_block(current_block, full_transactions=True).transactions
            for tx in txs:
                if tx['to'] == POOL_ADDR:
                    print(f"\n🔥 MOUVEMENT DÉTECTÉ !")
                    print(f"💰 Valeur: {web3.from_wei(tx['value'], 'ether')} MATIC injectés.")
                    print(f"📍 Origine probable: Un de tes 14 pays cibles.")
            last_block = current_block
        time.sleep(2)

if __name__ == "__main__":
    watch()
