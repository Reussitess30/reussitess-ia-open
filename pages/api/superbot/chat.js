export default async function handler(req, res) {
  const { message } = req.body;

  // Logique du bot Reussitess©
  if (message.includes('Guyane')) {
    return res.status(200).json({ text: getPolitiquesGuyane() });
  }
  
  if (message.includes('Reunion')) {
    return res.status(200).json({ text: getPolitiquesReunion() });
  }

  res.status(200).json({ text: "Reussitess© à votre écoute. Terres De Champions Positivité à l'infini Boudoum !" });
}

function getPolitiquesGuyane() {
  return `🏢 Élus Officiels de Guyane (2025-2026)
- Gabriel Serville : Président de la CTG.
- Députés : Jean-Victor Castor et Davy Rimane.`;
}

function getPolitiquesReunion() {
  return `🌴 Élus Officiels de La Réunion (2025-2026)
- Huguette Bello : Présidente du Conseil Régional.
- Cyrille Melchior : Président du Conseil Départemental.`;
}
