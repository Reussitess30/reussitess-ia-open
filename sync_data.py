import os
import redis
from dotenv import load_dotenv

load_dotenv() # Charge le lien depuis le fichier .env

# Connexions
local_r = redis.Redis(host='localhost', port=6379, decode_responses=True)
cloud_url = os.getenv("REDIS_URL")
cloud_r = redis.from_url(cloud_url, decode_responses=True)

print("📡 Connexion au Cloud Upstash...")

def migrer_donnees():
    keys = list(local_r.scan_iter("domtom:*"))
    if not keys:
        print("❌ Aucune donnée trouvée sur Termux.")
        return

    for key in keys:
        # On vérifie si c'est un Hash (ton nouveau format) ou un String
        k_type = local_r.type(key)
        if k_type == "hash":
            data = local_r.hgetall(key)
            cloud_r.hset(key, mapping=data)
            print(f"✅ HASH synchronisé : {key}")
        else:
            val = local_r.get(key)
            cloud_r.set(key, val)
            print(f"✅ STRING synchronisé : {key}")

if __name__ == "__main__":
    migrer_donnees()
    print("\n🌍 Tes champions sont maintenant en ligne sur Reussitess.fr !")
