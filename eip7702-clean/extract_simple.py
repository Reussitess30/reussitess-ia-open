from web3 import Web3

print("🔍 EXTRACTION DE L'INPUT DATA (MÉTHODE SIMPLE)\n")

tx_hash = "0x334d4cefac91d9b3550ae50f2bf30cbc4cf0bd88a8d764e9613fc0696c13f72c"

rpcs = [
    "https://polygon-rpc.com",
    "https://rpc-mainnet.matic.network",
]

w3 = None
for rpc in rpcs:
    try:
        w3 = Web3(Web3.HTTPProvider(rpc, request_kwargs={'timeout': 30}))
        if w3.is_connected():
            print(f"✅ Connecté via: {rpc}\n")
            break
    except:
        continue

if not w3:
    print("❌ Connexion impossible")
    exit()

print("📥 Récupération de la transaction...\n")

try:
    tx = w3.eth.get_transaction(tx_hash)
    
    print("🎯 TRANSACTION TROUVÉE!\n")
    print(f"📦 Block: {tx['blockNumber']}")
    print(f"👤 From: {tx['from']}")
    print(f"\n🔗 https://polygonscan.com/tx/{tx_hash}\n")
    
    # Extraire input data
    input_data = tx['input'].hex() if hasattr(tx['input'], 'hex') else tx['input']
    if not input_data.startswith('0x'):
        input_data = '0x' + input_data
    
    print(f"✅ Input Data extrait!")
    print(f"📊 Taille: {len(input_data)} chars ({len(input_data)//2} bytes)\n")
    
    # Sauvegarder
    with open("DEPLOYMENT_INPUT_DATA.txt", "w") as f:
        f.write(input_data)
    
    print("✅ Sauvegardé: DEPLOYMENT_INPUT_DATA.txt\n")
    
    # Extraire constructor args directement
    contract = "0xB37531727fC07c6EED4f97F852A115B428046EB2"
    deployed_code = w3.eth.get_code(Web3.to_checksum_address(contract)).hex()
    
    print("🔍 EXTRACTION DES CONSTRUCTOR ARGUMENTS...\n")
    print(f"📊 Runtime code: {len(deployed_code)} chars\n")
    
    if deployed_code[2:] in input_data:
        idx = input_data.index(deployed_code[2:])
        runtime_end = idx + len(deployed_code) - 2
        
        print(f"✅ Runtime code trouvé à position {idx}\n")
        
        if len(input_data) > runtime_end:
            constructor_args = input_data[runtime_end:]
            
            print(f"📦 Constructor Arguments trouvés!")
            print(f"Longueur: {len(constructor_args)} chars\n")
            
            if len(constructor_args) >= 128:
                recipient = "0x" + constructor_args[24:64]
                initial_owner = "0x" + constructor_args[88:128]
                
                print(f"✅ DÉCODÉS:")
                print(f"   recipient: {recipient}")
                print(f"   initialOwner: {initial_owner}\n")
                
                # Sauvegarder
                with open("CONSTRUCTOR_ARGS_FINAL.txt", "w") as f:
                    f.write(f"Constructor Arguments (hex, SANS 0x):\n")
                    f.write(f"{constructor_args}\n\n")
                    f.write(f"Décodés:\n")
                    f.write(f"recipient: {recipient}\n")
                    f.write(f"initialOwner: {initial_owner}\n")
                
                print("✅ Sauvegardé: CONSTRUCTOR_ARGS_FINAL.txt\n")
                
                print("="*70)
                print("📋 POUR VÉRIFICATION SUR POLYGONSCAN")
                print("="*70)
                print(f"\n1. Allez sur: https://polygonscan.com/verifyContract?a={contract}")
                print(f"\n2. Remplissez:")
                print(f"   - Compiler: Solidity (Single file)")
                print(f"   - Version: v0.8.31")
                print(f"   - License: MIT")
                print(f"   - Optimization: Yes, 200 runs")
                print(f"\n3. Constructor Arguments (SANS 0x):")
                print(f"   {constructor_args}")
                print(f"\n4. Code source: REUSSITESS_FINAL.sol")
                print("\n" + "="*70)
                
                # Créer un fichier récapitulatif
                with open("VERIFICATION_INSTRUCTIONS.txt", "w") as f:
                    f.write("VÉRIFICATION POLYGONSCAN\n")
                    f.write("="*70 + "\n\n")
                    f.write(f"URL: https://polygonscan.com/verifyContract?a={contract}\n\n")
                    f.write("Paramètres:\n")
                    f.write("- Compiler Type: Solidity (Single file)\n")
                    f.write("- Compiler Version: v0.8.31\n")
                    f.write("- License: MIT\n")
                    f.write("- Optimization: Yes\n")
                    f.write("- Runs: 200\n\n")
                    f.write("Constructor Arguments (SANS 0x):\n")
                    f.write(f"{constructor_args}\n\n")
                    f.write(f"recipient: {recipient}\n")
                    f.write(f"initialOwner: {initial_owner}\n")
                
                print("✅ Instructions complètes: VERIFICATION_INSTRUCTIONS.txt\n")
            else:
                print("⚠️ Arguments trop courts")
        else:
            print("⚠️ Pas d'arguments après le runtime code")
    else:
        print("⚠️ Runtime code non trouvé dans input data")
        print("Vérification du code source nécessaire")

except Exception as e:
    print(f"❌ Erreur: {e}")
