import os
import redis
from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI()

# Connexion Cloud Upstash
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
r = redis.from_url(REDIS_URL, decode_responses=True)

@app.get("/", response_class=HTMLResponse)
def home():
    return """
    <html>
        <head>
            <title>Reussitess© - Terres de Champions</title>
            <style>
                body { background: #0f172a; color: white; font-family: sans-serif; text-align: center; padding: 50px; }
                .card { border: 2px solid #38bdf8; border-radius: 15px; padding: 20px; display: inline-block; margin-top: 20px; }
                h1 { color: #38bdf8; text-transform: uppercase; }
                .footer { margin-top: 30px; font-size: 0.8em; color: #94a3b8; }
            </style>
        </head>
        <body>
            <h1>Reussitess©</h1>
            <p>Guadeloupe - "Terres De Champions Positivité à l'infini Boudoum"</p>
            <div class="card">
                <h2>Système International Connecté</h2>
                <p>Statut : 🟢 Opérationnel (14 pays)</p>
                <p>Base de données : Connectée (Upstash)</p>
            </div>
            <div class="footer">Produit en Guadeloupe pour le monde entier.</div>
        </body>
    </html>
    """

@app.get("/analyse/{region}/{nom}")
def analyser(region: str, nom: str):
    key = f"domtom:{region}:{nom}"
    data = r.hgetall(key)
    return data if data else {"error": "Champion non trouvé"}
