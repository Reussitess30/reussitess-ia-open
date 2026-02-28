"use client";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [reussPrice, setReussPrice] = useState(null);
  const CONTRACT = "0xB37531727fC07c6EED4f97F852A115B428046EB2";

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONTRACT}`)
        const data = await res.json()
        if (data.pairs && data.pairs.length > 0) setReussPrice(data.pairs[0])
      } catch(e) {}
    }
    fetchPrice()
    const interval = setInterval(fetchPrice, 30000)
    return () => clearInterval(interval)
  }, [])

  const quizCategories = [
    { id: "Gastronomie", name: "Gastronomie", icon: "🍽️", color: "#ff6b6b" },
    { id: "Histoire", name: "Histoire", icon: "📚", color: "#4ecdc4" },
    { id: "Géographie", name: "Géographie", icon: "🌍", color: "#45b7d1" },
    { id: "Sciences", name: "Sciences", icon: "🔬", color: "#96ceb4" },
    { id: "Art", name: "Art", icon: "🎨", color: "#ffeaa7" },
    { id: "Musique", name: "Musique", icon: "🎵", color: "#fd79a8" },
    { id: "Cinéma", name: "Cinéma", icon: "🎬", color: "#a29bfe" },
    { id: "Sport", name: "Sport", icon: "⚽", color: "#74b9ff" },
    { id: "Tech", name: "Technologie", icon: "💻", color: "#00b894" },
    { id: "Langue", name: "Langues", icon: "🗣️", color: "#fdcb6e" },
    { id: "Maths", name: "Mathématiques", icon: "🔢", color: "#e17055" },
    { id: "Politique", name: "Politique", icon: "🏛️", color: "#636e72" },
    { id: "Philosophie", name: "Philosophie", icon: "🤔", color: "#6c5ce7" },
    { id: "Innovations", name: "Innovations", icon: "💡", color: "#f39c12" },
    { id: "Environnement", name: "Environnement", icon: "🌱", color: "#27ae60" },
    { id: "Santé", name: "Santé", icon: "⚕️", color: "#e74c3c" },
    { id: "Business", name: "Business", icon: "💼", color: "#2c3e50" },
    { id: "Monuments", name: "Monuments", icon: "🏰", color: "#95a5a6" },
    { id: "Personnalités", name: "Personnalités", icon: "👤", color: "#d63031" },
    { id: "Culture_du_Monde", name: "Culture du Monde", icon: "🌏", color: "#00cec9" },
    { id: "Découvertes", name: "Découvertes", icon: "🔭", color: "#0984e3" },
    { id: "Internet", name: "Internet", icon: "🌐", color: "#6c5ce7" },
    { id: "Positivité", name: "Positivité", icon: "😊", color: "#fdcb6e" },
    { id: "Amazon_Affiliation", name: "Amazon Affiliation", icon: "🛍️", color: "#ff9f43" },
    { id: "Boutique_Motivation", name: "Boutique Motivation", icon: "🚀", color: "#ee5a6f" },
    { id: "GoMining", name: "Bitcoin Mining", icon: "⛏️", color: "#7c3aed" },
    { id: "Crypto", name: "Crypto & Blockchain", icon: "₿", color: "#f7931a" },
    { id: "Intelligence_Artificielle", name: "Intelligence Artificielle", icon: "🤖", color: "#00d2ff" },
    { id: "Entrepreneuriat", name: "Entrepreneuriat", icon: "🚀", color: "#e84393" },
    { id: "Finance_Personnelle", name: "Finance Personnelle", icon: "💰", color: "#2ecc71" },
    { id: "Immobilier", name: "Immobilier", icon: "🏠", color: "#e67e22" },
    { id: "Voyage", name: "Voyage", icon: "✈️", color: "#3498db" },
    { id: "Mode_Beaute", name: "Mode & Beauté", icon: "👗", color: "#e91e8c" },
    { id: "Cuisine_Antillaise", name: "Cuisine Antillaise", icon: "🥘", color: "#ff5722" },
    { id: "Afrique", name: "Afrique", icon: "🌍", color: "#4caf50" },
    { id: "Caraibes", name: "Caraïbes", icon: "🌴", color: "#00bcd4" },
    { id: "Developpement_Personnel", name: "Développement Personnel", icon: "🧘", color: "#9c27b0" },
    { id: "Leadership", name: "Leadership", icon: "👑", color: "#ffc107" },
    { id: "Marketing_Digital", name: "Marketing Digital", icon: "📱", color: "#e91e63" },
    { id: "Reseaux_Sociaux", name: "Réseaux Sociaux", icon: "📲", color: "#1da1f2" },
    { id: "Photographie", name: "Photographie", icon: "📸", color: "#607d8b" },
    { id: "Jeux_Video", name: "Jeux Vidéo", icon: "🎮", color: "#673ab7" },
    { id: "Astronomie", name: "Astronomie", icon: "🌌", color: "#1a237e" },
    { id: "Psychologie", name: "Psychologie", icon: "🧠", color: "#7b1fa2" },
    { id: "Droit", name: "Droit & Justice", icon: "⚖️", color: "#455a64" },
    { id: "Architecture", name: "Architecture", icon: "🏗️", color: "#795548" },
    { id: "Litterature", name: "Littérature", icon: "📖", color: "#558b2f" },
    { id: "Mythologie", name: "Mythologie", icon: "⚡", color: "#f44336" },
    { id: "Anime_Manga", name: "Anime & Manga", icon: "🎌", color: "#e53935" },
    { id: "Medecine", name: "Médecine", icon: "🩺", color: "#0097a7" },
    { id: "Afro_Caraibes_1", name: "Afro-Caraïbes & Indépendances", icon: "✊🏿", color: "#b45309" },
    { id: "Afro_Caraibes_2", name: "Grands Hommes Noirs & Inventeurs", icon: "🏆", color: "#047857" },
    { id: "USA_Essentiel", name: "USA — Voyage Essentiel", icon: "🇺🇸", color: "#1e3a5f" },
    { id: "France_Essentiel", name: "France — Voyage Essentiel", icon: "🇫🇷", color: "#002395" },
    { id: "Allemagne_Essentiel", name: "Allemagne — Voyage Essentiel", icon: "🇩🇪", color: "#dd0000" },
    { id: "Italie_Essentiel", name: "Italie — Voyage Essentiel", icon: "🇮🇹", color: "#009246" },
    { id: "Espagne_Essentiel", name: "Espagne — Voyage Essentiel", icon: "🇪🇸", color: "#c60b1e" },
    { id: "Canada_Essentiel", name: "Canada — Voyage Essentiel", icon: "🇨🇦", color: "#d80621" },
    { id: "UK_Essentiel", name: "Royaume-Uni — Voyage Essentiel", icon: "🇬🇧", color: "#012169" },
    { id: "Australie_Essentiel", name: "Australie — Voyage Essentiel", icon: "🇦🇺", color: "#00008b" },
    { id: "Belgique_Essentiel", name: "Belgique — Voyage Essentiel", icon: "🇧🇪", color: "#fdda00" },
    { id: "Inde_Essentiel", name: "Inde — Voyage Essentiel", icon: "🇮🇳", color: "#ff9933" },
    { id: "PaysBas_Essentiel", name: "Pays-Bas — Voyage Essentiel", icon: "🇳🇱", color: "#ae1c28" },
    { id: "Suede_Essentiel", name: "Suède — Voyage Essentiel", icon: "🇸🇪", color: "#006aa7" },
    { id: "Singapour_Essentiel", name: "Singapour — Voyage Essentiel", icon: "🇸🇬", color: "#ef3340" },
    { id: "Bresil_Essentiel", name: "Brésil — Voyage Essentiel", icon: "🇧🇷", color: "#009c3b" },
    { id: "Astrologie", name: "Astrologie — 12 Signes & Secrets", icon: "⭐", color: "#6d28d9" },
    { id: "Numerologie", name: "Numérologie — Chiffres & Destinées", icon: "🔢", color: "#7c3aed" },
    { id: "Graphologie", name: "Graphologie — Votre Écriture Révèle", icon: "✍️", color: "#4f46e5" },
    { id: "Spiritualite", name: "Spiritualité & Méditation Mondiale", icon: "🕊️", color: "#0e7490" },
    { id: "Symbolisme", name: "Symbolisme & Signes Sacrés", icon: "🔯", color: "#b45309" },
    { id: "Reves", name: "Rêves & Leur Interprétation", icon: "🌙", color: "#1e1b4b" },
    { id: "DeveloppementSoi", name: "Développement de Soi — Mindset Gagnant", icon: "🧠", color: "#0369a1" },
    { id: "DepassementSoi", name: "Dépassement de Soi — Performance", icon: "🏆", color: "#b91c1c" },
    { id: "IntelligenceEmotionnelle", name: "Intelligence Émotionnelle", icon: "❤️", color: "#be185d" },
    { id: "Communication", name: "Communication & Art de Convaincre", icon: "🗣️", color: "#0f766e" },
    { id: "GestionStress", name: "Gestion du Stress & Résilience", icon: "🧘", color: "#15803d" },
    { id: "FinancesPersonnelles", name: "Finances Personnelles & Liberté Financière", icon: "💰", color: "#92400e" },
    { id: "PlantesMediacinales", name: "Se Soigner par les Plantes", icon: "🌿", color: "#15803d" },
    { id: "HuilesEssentielles", name: "Huiles Essentielles & Aromathérapie", icon: "🌸", color: "#db2777" },
    { id: "Nutrition", name: "Nutrition & Alimentation Saine", icon: "🥗", color: "#16a34a" },
    { id: "MedecinesDouces", name: "Médecines Douces du Monde", icon: "🏥", color: "#0891b2" },
    { id: "PlantesAntilles", name: "Plantes des Antilles & Remèdes Créoles", icon: "🌺", color: "#b45309" },
    { id: "JeuneDetox", name: "Jeûne Intermittent & Détox", icon: "⚡", color: "#7c3aed" },
    { id: "CuisineAntillaise", name: "Cuisine Antillaise — Recettes & Secrets", icon: "🦀", color: "#b45309" },
    { id: "GastronomieAfricaine", name: "Gastronomie Africaine & Diaspora", icon: "🌍", color: "#15803d" },
    { id: "EpicesMonde", name: "Épices du Monde — Saveurs & Secrets", icon: "🌶️", color: "#dc2626" },
    { id: "VinsSpiriteux", name: "Vins & Spiritueux du Monde", icon: "🍷", color: "#7e22ce" },
    { id: "StreetFood", name: "Street Food Mondiale", icon: "🍜", color: "#0369a1" },
    { id: "DroitsCitoyen", name: "Droits & Devoirs du Citoyen Français", icon: "🇫🇷", color: "#1d4ed8" },
    { id: "DroitTravail", name: "Droit du Travail — Ce que Tout Salarié Doit Savoir", icon: "⚖️", color: "#1e40af" },
    { id: "DroitConsommateur", name: "Droits du Consommateur", icon: "🛒", color: "#0f766e" },
    { id: "DroitsNumeriques", name: "Droits Numériques & RGPD", icon: "💻", color: "#6d28d9" },
    { id: "DroitFamille", name: "Droit de la Famille", icon: "👨‍👩‍👧‍👦", color: "#be185d" },
    { id: "DroitEtrangers", name: "Droit des Étrangers & Immigration", icon: "🌐", color: "#0369a1" },
    { id: "DroitNumerique2", name: "Droits du Numérique — Réseaux & Plateformes", icon: "📱", color: "#7c3aed" },
    { id: "Entrepreneuriat", name: "Astuces pour Réussir en Entrepreneuriat", icon: "🚀", color: "#0f172a" },
    { id: "MarketingDigital", name: "Marketing Digital & Réseaux Sociaux", icon: "📊", color: "#0369a1" },
    { id: "Crypto", name: "Cryptomonnaies & Blockchain pour Tous", icon: "₿", color: "#b45309" },
    { id: "Amazon", name: "Amazon & E-commerce — Secrets des Vendeurs", icon: "📦", color: "#f97316" },
    { id: "IntelligenceArtificielle", name: "Intelligence Artificielle — Ce que Tout le Monde Doit Savoir", icon: "🤖", color: "#6d28d9" },
  ];

  return (
    <Layout>
      <div style={{ minHeight: "70vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "4rem 1rem" }}>
        <div style={{ textAlign: "center", color: "white", zIndex: 1, maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ marginBottom: "1rem" }}><img src="/icon-512x512.png" alt="Reussitess®971" style={{ width: "120px", height: "120px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }} /></div>
          <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", fontWeight: "900", marginBottom: "1.5rem", textShadow: "0 4px 30px rgba(0,0,0,0.3)" }}>Reussitess®971</h1>

            {/* WIDGET REUSS LIVE */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "1rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(16,185,129,0.5)", borderRadius: "50px", padding: "0.6rem 1.5rem", marginBottom: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ color: "#a78bfa", fontWeight: "bold", fontSize: "0.9rem" }}>💎 REUSS</span>
              {reussPrice ? (
                <>
                  <span style={{ color: "#10b981", fontWeight: "900", fontSize: "1rem" }}>${parseFloat(reussPrice.priceUsd || 0).toFixed(8)}</span>
                  <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>Vol 24h: ${parseFloat(reussPrice.volume?.h24 || 0).toLocaleString()}</span>
                </>
              ) : (
                <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Chargement...</span>
              )}
              <a href="/investir-reuss" style={{ color: "#ffd700", fontSize: "0.8rem", textDecoration: "none", fontWeight: "bold" }}>Voir →</a>
            </div>
          
          {/* BOUTON AIRPODS */}
          <div style={{ marginBottom: "1.5rem" }}>
            <Link href="/passe-port-mondial" style={{ background: "#00ff41", color: "black", padding: "0.8rem 2rem", borderRadius: "50px", textDecoration: "none", fontSize: "1rem", fontWeight: "900", border: "2px solid #000" }}>
              🎧 ACCÈS AIRPODS PRO
            </Link>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
            <a href="https://mlc.health/fr/byg727" target="_blank" style={{ background: "#0072ff", color: "white", padding: "1rem 2rem", borderRadius: "50px", textDecoration: "none", fontWeight: "bold" }}>🩺 MLC Health</a>
            <p style={{ fontSize: "0.8rem", color: "#00c6ff", marginTop: "-5px", marginBottom: "10px", maxWidth: "300px" }}>Diagnostic Médical par IA & Prévention Santé - Rejoignez le futur de la MedTech</p>
            <Link href="/investir-reuss" style={{ background: "linear-gradient(135deg, #ffd700 0%, #b8860b 100%)", color: "black", padding: "1rem 2rem", borderRadius: "50px", textDecoration: "none", fontWeight: "900", border: "2px solid #fff" }}>💎 INVESTIR DANS Reussitess®NEURO-X</Link>
            <p style={{ fontSize: "0.8rem", color: "#00ff41", marginTop: "-5px", marginBottom: "15px", maxWidth: "300px" }}>L'Intelligence Artificielle de rupture pour les 14 pays partenaires.</p>
            <Link href="/champions" style={{ background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)", color: "#1e293b", padding: "1rem 2rem", borderRadius: "50px", textDecoration: "none", fontWeight: "900" }}>🏆 Passeport de Réussite</Link>
            <Link href="/visa-universel" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)", color: "white", padding: "1rem 2rem", borderRadius: "50px", textDecoration: "none", fontWeight: "900" }}>🌍 VISA UNIVERSEL</Link>
            <a href="https://reussitess-global-nexus-jfgk-git-copilo-3f98a8-porinus-projects.vercel.app/" target="_blank" style={{ background: "linear-gradient(135deg, #f5576c 0%, #f093fb 100%)", color: "white", padding: "1rem 2rem", borderRadius: "50px", textDecoration: "none", fontWeight: "bold" }}>🎯 Version Alternative</a>
            <a href="https://www.amazon.fr/shop/amourguadeloupe" target="_blank" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "white", padding: "1rem 2rem", borderRadius: "50px", textDecoration: "none", fontWeight: "bold" }}>🎮 🇫🇷 France Amazon Officiel</a>
            <Link href="/ia-passport" style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', color: 'white', padding: '1rem 2rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold' }}>🌍 IA PASSPORT MONDIAL - Révolution 2025</Link>
            <Link href="/neuro-x" style={{ background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)", color: "white", padding: "1rem 2rem", borderRadius: "50px", textDecoration: "none", fontWeight: "900", border: "2px solid rgba(255,255,255,0.3)" }}>🧠 Reussitess®NEURO-X</Link>
            <Link href="https://shop.reussitess.fr/" target="_blank" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "white", padding: "1rem 2rem", borderRadius: "50px", textDecoration: "none", fontWeight: "bold" }}>🏪 Visitez Notre Shop</Link>
            <a href="https://gomining.com/?ref=OT3GI2U" target="_blank" rel="noopener noreferrer" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)", color: "white", padding: "1rem 2rem", borderRadius: "50px", textDecoration: "none", fontWeight: "900", border: "2px solid rgba(167,139,250,0.5)", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>⛏️ Miner du Bitcoin — GoMining</a>
            <p style={{ fontSize: "0.8rem", color: "#c4b5fd", marginTop: "-5px", marginBottom: "10px", maxWidth: "300px" }}>NFT Mineur Bitcoin · $0.84/jour · Top 3% mondial · 130+ pays</p>
          </div>
        </div>
      </div>

      <div style={{ background: "#0f172a", padding: "5rem 0" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
          {quizCategories.map((quiz, index) => (
            <Link key={index} href={`/quiz/${quiz.id}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "20px", padding: "2rem", textAlign: "center", borderTop: `5px solid ${quiz.color}` }}>
                <div style={{ fontSize: "3rem" }}>{quiz.icon}</div>
                <h3 style={{ color: "white" }}>{quiz.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
