#!/usr/bin/env python3
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs, unquote
import json
import requests
from pathlib import Path

CACHE_FILE = Path("groq_cache.json")

# 🔑 Mets ta clé GROQ ici
GROQ_API_KEY = "TA_VRAIE_CLE_ICI"

# Charger cache
if CACHE_FILE.exists():
    with open(CACHE_FILE, "r", encoding="utf-8") as f:
        cache = json.load(f)
else:
    cache = {}

def save_cache():
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(cache, f, indent=2, ensure_ascii=False)

# 🔥 IA locale (ta base)
def search_local(prompt):
    data = cache.get("afrocaraibeen_knowledge", {})
    prompt = prompt.lower()

    for key, value in data.items():
        if key in prompt:
            return value

    return None

# 🤖 Appel GROQ réel
def call_groq(prompt):
    try:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "llama3-70b-8192",
            "messages": [{"role": "user", "content": prompt}]
        }

        r = requests.post(url, json=payload, headers=headers, timeout=10)
        if r.status_code == 200:
            return r.json()["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Erreur GROQ: {e}"

    return "⚠️ GROQ indisponible"

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path != "/api/groq":
            self.send_response(404)
            self.end_headers()
            return

        query = parse_qs(parsed.query)
        prompt = unquote(query.get("prompt", [""])[0])

        # 💾 cache
        if prompt in cache:
            result = cache[prompt]

        else:
            # 🔥 1. chercher local
            local_result = search_local(prompt)

            if local_result:
                result = local_result

            else:
                # 🤖 2. appel GROQ
                result = call_groq(prompt)

            # 💾 sauvegarde
            cache[prompt] = result
            save_cache()

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"response": result}).encode())

def run():
    port = 8000
    print(f"🚀 IA HYBRIDE: http://localhost:{port}/api/groq")
    HTTPServer(("0.0.0.0", port), Handler).serve_forever()

if __name__ == "__main__":
    run()
