import Layout from "../components/Layout";
import { useState } from "react";

export default function NeuroX() {
  const [activeData, setActiveData] = useState("VOTRE PARCOURS VERS L'EXCELLENCE COMMENCE ICI. SÉLECTIONNEZ UN AXE DE RÉUSSITE.");

  const sections = [
    { 
      title: "🌍 Afrique & Aide Internationale", 
      links: [
        { n: "Banque Africaine de Développement", u: "https://www.afdb.org/fr/topics-and-sectors/sectors/private-sector-development" },
        { n: "Boutique en Ligne : Shopify Guide", u: "https://www.shopify.com/fr/blog/creer-boutique-en-ligne" },
        { n: "AFD - Entreprendre au Sud", u: "https://www.afd.fr/fr/page-thematique-axe/entrepreneuriat" }
      ],
      desc: "Accédez aux financements et guides pour bâtir votre empire numérique entre la Caraïbe et l'Afrique."
    },
    { 
      title: "🚀 Entrepreneuriat & Créativité", 
      links: [
        { n: "Success Stories (Forbes)", u: "https://www.forbes.com/leadership/" },
        { n: "Conseils de Leaders (Harvard)", u: "https://hbr.org/topic/entrepreneurship" },
        { n: "Apprendre à Entreprendre (Coursera)", u: "https://www.coursera.org/browse/business/entrepreneurship" }
      ],
      desc: "Témoignages de ceux qui ont transformé une idée en succès mondial. Étudiez les stratégies des champions."
    },
    { 
      title: "🧠 Dépassement de Soi & Culture", 
      links: [
        { n: "Études Créoles & Identité", u: "http://www.potomitan.info/" },
        { n: "Psychologie du Succès (TedTalks)", u: "https://www.ted.com/playlists/171/the_psychology_of_self_improv" },
        { n: "Épanouissement Humain", u: "https://www.un.org/sustainabledevelopment/fr/objectifs-de-developpement-durable/" }
      ],
      desc: "L'homme au centre du projet. Maîtrisez votre mental et honorez votre culture pour briser tous les plafonds."
    }
  ];

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: "2rem 1rem", fontFamily: "sans-serif" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          <header style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 style={{ fontSize: "clamp(2rem, 8vw, 4rem)", fontWeight: "900", color: "#2563eb", marginBottom: "10px" }}>REUSSITESS® NEURO-X</h1>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#fff", textTransform: "uppercase", letterSpacing: "3px" }}>
              L'excellence • L'innovation • Le succès
            </div>
            <p style={{ color: "#3b82f6", marginTop: "10px", fontWeight: "bold", fontSize: "1.1rem" }}>GUADELOUPE, TERRE DE CHAMPIONS & HUB MONDIAL</p>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
            
            <div style={{ border: "1px solid #1e40af", borderRadius: "20px", padding: "1.5rem", background: "rgba(30, 64, 175, 0.1)" }}>
              {sections.map((sec) => (
                <div key={sec.title} style={{ marginBottom: "2rem" }}>
                  <h3 style={{ color: "#3b82f6", borderBottom: "1px solid #333", paddingBottom: "5px" }}>{sec.title}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                    {sec.links.map(link => (
                      <button 
                        key={link.n}
                        onClick={() => setActiveData(sec.desc)}
                        style={{ textAlign: "left", background: "#111", border: "1px solid #333", color: "#fff", padding: "12px", borderRadius: "8px", cursor: "pointer", transition: "0.2s" }}
                        onMouseOver={(e) => e.target.style.background = "#1e3a8a"}
                        onMouseOut={(e) => e.target.style.background = "#111"}
                      >
                        <a href={link.u} target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "none", fontSize: "0.9rem", display: "block" }}>
                          {link.n} <span style={{ float: "right", color: "#3b82f6" }}>➜</span>
                        </a>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#050505", border: "2px solid #2563eb", borderRadius: "20px", padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: "0 0 40px rgba(37, 99, 235, 0.2)" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "900", marginBottom: "1.5rem", color: "#3b82f6", textAlign: "center" }}>RADAR DE RÉUSSITE</h2>
              <div style={{ padding: "1.5rem", border: "1px solid #1e40af", borderRadius: "10px", minHeight: "150px", background: "rgba(37, 99, 235, 0.05)" }}>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#e2e8f0", textAlign: "center" }}>{activeData}</p>
              </div>
              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <p style={{ color: "#666", fontSize: "0.8rem", fontStyle: "italic" }}>
                  "Le succès n'est pas la clé du bonheur. Le bonheur est la clé du succès."
                </p>
              </div>
            </div>

          </div>

          <footer style={{ marginTop: "4rem", textAlign: "center", padding: "20px", borderTop: "1px solid #222" }}>
            <p style={{ fontSize: "0.9rem", color: "#444" }}>
              Reussitess® NEURO-X : L'outil ultime pour le dépassement de soi et l'entrepreneuriat planétaire.
            </p>
          </footer>
        </div>
      </div>
    </Layout>
  );
}
