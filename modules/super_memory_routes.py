import redis

# Connexion à Redis
r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

def save_routes(routes_content: str):
    """Sauvegarde l'arborescence des routes dans Redis et rend la clé persistante"""
    r.set("reussitess:routes", routes_content)
    r.persist("reussitess:routes")

def recall_routes() -> str:
    """Récupère l'arborescence des routes depuis Redis"""
    routes = r.get("reussitess:routes")
    if routes:
        return routes
    return "Aucune donnée de routes en mémoire."

def print_routes(limit: int = 50):
    """Affiche les premières lignes pour vérification"""
    routes = recall_routes()
    lines = routes.splitlines()
    for line in lines[:limit]:
        print(line)
