#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import redis

# Configuration Redis
REDIS_HOST = "localhost"   # ou l'IP du serveur Redis
REDIS_PORT = 6379
REDIS_DB = 0

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB, decode_responses=True)

# Chemin vers le dossier des modules et whitepaper
BASE_DIR = os.path.expanduser("~/reussitess-global-nexus")
MODULES_DIR = os.path.join(BASE_DIR, "modules")
WHITEPAPER_FILE = os.path.join(BASE_DIR, "whitepaper_reel.md")

def store_file_in_redis(key, filepath):
    """Stocke le contenu d'un fichier dans Redis et rend la clé persistante"""
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            r.set(key, content)
            r.persist(key)  # empêche l'expiration
            print(f"[OK] {key} -> Redis")
    else:
        print(f"[❌] Fichier introuvable: {filepath}")

# Stocker tous les fichiers du dossier modules
for filename in os.listdir(MODULES_DIR):
    filepath = os.path.join(MODULES_DIR, filename)
    if os.path.isfile(filepath):
        key = f"modules:{filename}"
        store_file_in_redis(key, filepath)

# Stocker le whitepaper
store_file_in_redis("whitepaper_reel.md", WHITEPAPER_FILE)

print("✅ Tous les fichiers sont désormais en mémoire Redis et persistants.")
