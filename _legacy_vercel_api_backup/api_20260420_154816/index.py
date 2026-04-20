import os
import redis
from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI()

# Configuration Redis avec Timeout pour éviter de bloquer la page
REDIS_URL = os.getenv("REDIS_URL")

def get_redis():
    if not REDIS_URL:
        return None
    return redis.from_url(REDIS_URL, decode_responses=True, socket_connect_timeout=1)

@app.get("/", response_class=HTMLResponse)
def home():
    status_redis = "🔴 Non configuré"
    try:
        r = get_redis()
        if r and r.ping():
            status_redis = "🟢 Opérationnel (Cloud)"
    except:
        status_redis = "🟠 Erreur de connexion"

    return f"""
    <html>
        <head>
            <title>Reussitess© - Terres de Champions</title>
            <style>
                body {{ background: #0f172a; color: white; font-family: 'Segoe UI', sans-serif; text-align: center; padding: 50px; }}
                .card {{ border: 2px solid #38bdf8; border-radius: 15px; padding: 30px; display: inline-block; background: #1e293b; }}
                h1 {{ color: #38bdf8; font-size: 2.5em; margin-bottom: 10px; }}
                .status {{ font-weight: bold; padding: 10px; border-radius: 5px; background: #334155; }}
            </style>
        </head>
        <body>
            <h1>Reussitess©</h1>
            <p>Guadeloupe - "Terres De Champions Positivité à l'infini Boudoum"</p>
            <div class="card">
                <h2>Système de Monitoring</h2>
                <p class="status">Serveur : Online ✅</p>
                <p class="status">Base Redis : {status_redis}</p>
                <p>14 Pays Cibles : France, Canada, Singapour, Australie...</p>
            </div>
        </body>
    </html>
    """

@app.get("/analyse/{{region}}/{{nom}}")
def analyser(region: str, nom: str):
    try:
        r = get_redis()
        if not r: return {{"error": "Lien Redis manquant dans ENV"}}
        key = f"domtom:{{region}}:{{nom}}"
        data = r.hgetall(key)
        return data if data else {{"error": "Champion inconnu"}}
    except Exception as e:
        return {{"error": str(e)}}
