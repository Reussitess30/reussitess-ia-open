/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { message } = req.body;
  const query = (message || "").toLowerCase();

  // 1. Armure de Secours (Dictionnaire Local Infaillible)
  const dictionnaireLocal = {
    "succès": "Viktwa (Gwadloup) / Siksè (Ayiti)",
    "réussite": "Réyitit (Gwadloup) / Réyisit (Martinik)",
    "force": "Fòs (Antilles) / Lafors (Réunion)",
    "argent": "Lajan (Gwadloup) / Larzan (Maurice)",
    "travail": "Travay (Kréyòl)",
    "merci": "Mèsi",
    "bonjour": "Bo jou / Bonjou"
  };

  // 2. URLs des APIs Mondiales (Glosbe + MyMemory)
  const queryEnc = encodeURIComponent(query);
  const apis = [
    `https://api.mymemory.translated.net/get?q=${queryEnc}&langpair=fr|ht`,
    `https://glosbe.com/gapi/translate?from=fra&dest=gcf&format=json&phrase=${queryEnc}`
  ];

  try {
    // 3. Appel en Parallèle (Vitesse Max pour les 14 pays)
    const [resMyMemory, resGlosbe] = await Promise.all([
      fetch(apis[0]).then(r => r.json()).catch(() => null),
      fetch(apis[1]).then(r => r.json()).catch(() => null)
    ]);

    let intelligence = "[Compagnon Reussitess© - Expert Multi-Créole] : ";
    
    // Extraction des données APIs
    const tradHaitien = resMyMemory?.responseData?.translatedText;
    const tradGwadloup = resGlosbe?.tuc?.[0]?.phrase?.text;

    // 4. Logique de priorité : Local > API Gwadloup > API Ayiti
    const motLocal = Object.keys(dictionnaireLocal).find(k => query.includes(k));

    if (motLocal) {
      intelligence += `En direct des Terres De Champions : ${dictionnaireLocal[motLocal]}. `;
    } else if (tradGwadloup) {
      intelligence += `Gwadloup dit : "${tradGwadloup}". `;
    } else if (tradHaitien && tradHaitien !== query) {
      intelligence += `Ayiti dit : "${tradHaitien}". `;
    } else {
      intelligence += "Nou la, fòs é kouraj pour les 14 pays ! Boudoum !";
    }

    res.status(200).json({ 
      response: intelligence,
      origine: "Guadeloupe (Positivité à l'infini)",
      mode: motLocal ? "Local (Armure)" : "Connecté (API)",
      status: "Actif"
    });

  } catch (e) {
    // Fail-safe ultime : Zéro plantage
    res.status(200).json({ response: "[Compagnon] : On garde la fòs en interne ! Boudoum !" });
  }
}
