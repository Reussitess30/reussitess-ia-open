/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const DEFIS = {
  entrepreneur: [
    { defi: "Contacte 1 partenaire potentiel aujourd hui — un message suffit.", categorie: "Business", emoji: "💼" },
    { defi: "Ecris les 3 priorites de ton business pour cette semaine.", categorie: "Strategie", emoji: "🎯" },
    { defi: "Analyse 1 concurrent caribeen et note ce qu il fait bien.", categorie: "Veille", emoji: "🔍" },
    { defi: "Cree 1 contenu pour ta marque aujourd hui.", categorie: "Marketing", emoji: "📢" },
    { defi: "Calcule ton CA de la semaine et fixe un objectif +10%.", categorie: "Finance", emoji: "📊" },
  ],
  etudiant: [
    { defi: "Revise 1 sujet difficile pendant 25 minutes (methode Pomodoro).", categorie: "Etudes", emoji: "📚" },
    { defi: "Recherche 1 bourse ou opportunite disponible pour ton profil.", categorie: "Opportunite", emoji: "🎓" },
    { defi: "Lis 10 pages d un livre qui te fait progresser.", categorie: "Lecture", emoji: "📖" },
    { defi: "Prends des notes organisees sur 1 cours de la journee.", categorie: "Organisation", emoji: "✏" },
    { defi: "Contacte 1 mentor ou professionnel de ton domaine.", categorie: "Reseau", emoji: "🤝" },
  ],
  sportif: [
    { defi: "Fais 20 minutes de cardio sans excuse — maintenant.", categorie: "Cardio", emoji: "🏃" },
    { defi: "Bois 2 litres d eau aujourd hui et note ton energie.", categorie: "Hydratation", emoji: "💧" },
    { defi: "Etire-toi 10 minutes ce soir pour recuperer.", categorie: "Recuperation", emoji: "🧘" },
    { defi: "Bats ton record personnel sur 1 exercice de ton choix.", categorie: "Performance", emoji: "🏆" },
    { defi: "Prepare ton repas sportif optimal pour demain.", categorie: "Nutrition", emoji: "🥗" },
  ],
  general: [
    { defi: "Ecris 3 choses pour lesquelles tu es reconnaissant(e) aujourd hui.", categorie: "Gratitude", emoji: "🙏" },
    { defi: "Appelle quelqu un que tu n as pas contacte depuis longtemps.", categorie: "Liens", emoji: "❤" },
    { defi: "Coupe les reseaux sociaux pendant 2h et fais quelque chose de concret.", categorie: "Focus", emoji: "🎯" },
    { defi: "Apprends 1 mot en creole caribeen et utilise-le dans la journee.", categorie: "Culture", emoji: "🌴" },
    { defi: "Fais 1 action vers ton reve principal — aussi petite soit-elle.", categorie: "Vision", emoji: "🚀" },
  ],
};

const MOTIVATIONS = [
  "Te a chanpion yo — Tu es sur la bonne voie ! BOUDOUM ! 🥁",
  "Positivite a l infini — Chaque defi accompli te rapproche de ta victoire.",
  "Reussitess971 croit en toi — Fos e kouraj.",
  "Les champions caribeens ne lachent pas — Tu es l un d eux.",
  "BOUDOUM — Le tambour de la Caraibe bat pour toi aujourd hui.",
];

export default function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Methode non autorisee' });
  const profil = (req.query.profil || req.body?.profil || "general").toLowerCase();
  const liste = DEFIS[profil] || DEFIS.general;
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const defi = liste[seed % liste.length];
  const motivation = MOTIVATIONS[seed % MOTIVATIONS.length];
  res.status(200).json({
    defi: defi.defi,
    categorie: defi.categorie,
    emoji: defi.emoji,
    motivation,
    reuss_reward: 10,
    profil,
    date: today.toISOString().split('T')[0],
    status: "Actif",
  });
}
