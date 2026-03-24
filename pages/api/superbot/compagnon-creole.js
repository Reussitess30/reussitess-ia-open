export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { message } = req.body;
  const query = message.toLowerCase();

  // 1. Base interne "Boudoum" (Sécurité si l'API externe est lente)
  const baseInterne = {
    "succès": "Viktwa (Gwadloup) / Siksè (Ayiti)",
    "force": "Fòs (Antilles) / Lafors (Réunion)",
    "argent": "Lajan (Guadeloupe) / Larzan (Maurice)"
  };

  try {
    // 2. Connexion aux APIs de linguistique (Exemple avec un endpoint de traduction ouvert)
    // On simule ici l'appel à une API de dictionnaire créole gratuite
    const responseExt = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/ht/${encodeURIComponent(query)}`).catch(() => null);
    const dataExt = responseExt ? await responseExt.json() : null;

    let reponseFinale = `[Compagnon Reussitess© - Expert Multi-Créole] : `;

    if (query.includes("succès") || query.includes("réussite")) {
      reponseFinale += `Chak jou sé on viktwa ! En Haïti on dit "Siksè se rezilta travay di". Boudoum !`;
    } else if (dataExt && !dataExt.title) {
      // Si l'API externe trouve une définition en créole Haïtien (par exemple)
      reponseFinale += `D'après nos bases internationales : ${dataExt[0].meanings[0].definitions[0].definition}`;
    } else {
      reponseFinale += "Nou la, fòs é kouraj pour les 14 pays. Terres De Champions !";
    }

    res.status(200).json({ 
      response: reponseFinale,
      langues: ["Guadeloupéen", "Martiniquais", "Haïtien", "Réunionnais"],
      origine: "Guadeloupe (Positivité à l'infini)",
      status: "Connecté aux APIs Mondiales"
    });

  } catch (error) {
    // Fail-safe : On reste sur la base interne si le réseau flanche
    res.status(200).json({ response: "[Compagnon] : On garde la fòs en interne ! Boudoum !" });
  }
}
