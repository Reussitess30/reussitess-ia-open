from modules.super_memory_routes import save_routes, recall_routes, print_routes

# Exemple : sauvegarder le contenu d'un fichier routes.txt dans Redis
with open('routes.txt', 'r') as f:
    routes_content = f.read()

save_routes(routes_content)

print("✅ Routes sauvegardées dans Redis.")
print("🔹 Aperçu des routes :")
print_routes(20)
