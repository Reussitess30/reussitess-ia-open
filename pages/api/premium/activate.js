export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  
  const { userId } = req.body;
  
  if (userId === "rony.porinus@gmail.com") {
    res.json({
      status: "✅ PREMIUM ACTIVÉ 👑",
      userId: userId,
      expires: "2036-04-07",
      message: "1er testeur Reussitess Premium !"
    });
  } else {
    res.status(403).json({ error: "Accès réservé au créateur" });
  }
}
