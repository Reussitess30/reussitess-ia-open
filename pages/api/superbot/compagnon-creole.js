export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { message } = req.body;

  // Base de données interne du Compagnon (Dictionnaire & Proverbes)
  const dictionnaire = {
    "succès": "viktwa",
    "force": "fòs",
    "argent": "lajan",
    "travail": "travay"
  };

  // Logique du Compagnon : Il parle Créole et Français de Guadeloupe
  let reponseCompagnon = `[Compagnon Reussitess©] : On s'occupe de tout pour les 14 pays ! `;
  
  if (message.toLowerCase().includes("succès")) {
    reponseCompagnon += "Chak jou sé on viktwa (Chaque jour est un succès). Boudoum !";
  } else {
    reponseCompagnon += "Nou la, on lâche rien. Terres De Champions !";
  }

  res.status(200).json({ 
    response: reponseCompagnon,
    origine: "Guadeloupe (Gwadloup)",
    status: "Actif"
  });
}
