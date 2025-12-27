import Layout from "../components/Layout";
import { useState } from "react";

export default function NeuroX() {
  const [activeData, setActiveData] = useState("SÉLECTIONNEZ UNE ÉTAPE POUR DÉPLOYER LE PLAN D'ACTION.");

  const steps = [
    { n: "1", t: "Opportunités Afrique", u: "https://www.afdb.org/fr", d: "Analyser les marchés émergents et les secteurs en forte croissance." },
    { n: "2", t: "Aide Internationale", u: "https://au-afcfta.org/fr/", d: "Capter les aides régionales et les accords de libre-échange." },
    { n: "3", t: "Boutique en Ligne", u: "https://www.shopify.com/fr", d: "Digitaliser votre offre pour toucher une clientèle planétaire." },
    { n: "4", t: "Logistique & Flux", u: "https://www.dhl.com/fr-fr/", d: "Maîtriser l'envoi de marchandises de la Guadeloupe vers le monde." },
    { n: "5", t: "Identité & Créole", u: "http://www.potomitan.info/", d: "Utiliser la langue et la culture comme socle de différenciation." },
    { n: "6", t: "Patrimoine Caraïbe", u: "https://memorial-acte.fr/", d: "S'ancrer dans l'histoire pour bâtir un futur de champion." },
    { n: "7", t: "Propriété Intellectuelle", u: "https://www.inpi.fr/", d: "Sécuriser vos marques, brevets et concepts Reussitess®." },
    { n: "8", t: "Innovation Tech", u: "https://github.com/trending", d: "Intégrer l'IA et les nouvelles technologies dans votre projet." },
    { n: "9", t: "Dépassement de Soi", u: "https://www.ted.com/topics/self-improvement", d: "Forger un mental d'acier pour surmonter tous les obstacles." },
    { n: "10", t: "Épanouissement Humain", u: "https://www.un.org/sustainabledevelopment/fr/", d: "Réussir pour soi, pour sa terre et pour l'humanité." }
  ];

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: "2rem 1rem", fontFamily: "sans-serif" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          <header style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 style={{ fontSize: "clamp(2rem, 8vw, 4rem)", fontWeight: "900", color: "#2563eb" }}>REUSSITESS® NEURO-X</h1>
            <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#fff", textTransform: "uppercase", letterSpacing: "3px" }}>L'excellence • L'innovation • Le succès</div>
            <p style={{ color: "#3b82f6", fontWeight: "bold", marginTop: "10px" }}>GUADELOUPE, TERRE DE CHAMPIONS</p>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            
            {/* LISTE DES 10 ÉTAPES */}
            <div style={{ border: "1px solid #1e40af", borderRadius: "20px", padding: "1.5rem", background: "rgba(30, 64, 175, 0.1)" }}>
              <h3 style={{ color: "#3b82f6", marginBottom: "1.5rem", textAlign: "center" }}>LE CHEMIN DU CHAMPION (1-10)</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {steps.map((step) => (
                  <button 
                    key={step.n} 
                    onClick={() => setActiveData(step.d)} 
                    style={{ textAlign: "left", background: "#111", border: "1px solid #333", color: "#fff", padding: "12px", borderRadius: "8px", cursor: "pointer", transition: "0.2s" }}
                  >
                    <span style={{ color: "#2563eb", fontWeight: "900", marginRight: "10px" }}>{step.n}.</span>
                    <a href={step.u} target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "none" }}>{step.t} ➜</a>
                  </button>
                ))}
              </div>
            </div>

            {/* ANALYSEUR EN TEMPS RÉEL */}
            <div style={{ background: "#050505", border: "2px solid #2563eb", borderRadius: "20px", padding: "2.5rem", position: "sticky", top: "20px", height: "fit-content" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "900", marginBottom: "1.5rem", color: "#3b82f6", textAlign: "center" }}>MONITEUR DE STRATÉGIE</h2>
              <div style={{ padding: "1.5rem", border: "1px solid #1e40af", borderRadius: "10px", minHeight: "200px", background: "rgba(37, 99, 235, 0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontSize: "1.2rem", lineHeight: "1.6", color: "#e2e8f0", textAlign: "center", fontStyle: "italic" }}>{activeData}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
