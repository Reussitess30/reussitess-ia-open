import time

# Simuler les clés GROQ
API_KEYS = ["ta_cle_1_de_Vercel", "ta_cle_2_de_Vercel", "ta_cle_3_de_Vercel"]

def call_api(key):
    # Ici tu mets ton vrai appel API
    time.sleep(1)  # simulation
    return f"réponse de {key}"

# Tester chaque clé et mesurer latence
latencies = {}
for key in API_KEYS:
    start = time.time()
    response = call_api(key)
    latency = time.time() - start
    latencies[key] = latency
    print(f"{key} -> {latency:.2f} secondes")

# Choisir la clé la plus rapide
best_key = min(latencies, key=latencies.get)
print(f"\nClé la plus rapide : {best_key}")
