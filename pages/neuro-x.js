import Layout from "../components/Layout";
import { useState } from "react";

export default function NeuroX() {
  const [activeData, setActiveData] = useState("SÉLECTIONNEZ UN AXE DE RÉUSSITE POUR DÉPLOYER L'ANALYSE");

  const sections = [
    { 
      title: "Identité & Langue Créole", 
      links: [
        { n: "Apprendre le Créole (Lexilogos)", u: "https://www.lexilogos.com/creole_antillais.htm" },
        { n: "Potomitan : Études Créoles", u: "http://www.potomitan.info/" }
      ],
      desc: "Étude scientifique et promotion des langues créoles. L'innovation passe par la maîtrise de notre identité."
    },
    { 
      title: "Culture & Patrimoine Caraïbe", 
      links: [
        { n: "Fondation Clément (Art)", u: "https://www.fondation-clement.org/" },
        { n: "Musée Mémorial ACTe", u: "https://memorial-acte.fr/" }
      ],
      desc: "L'excellence culturelle comme pilier du succès mondial. La Caraïbe, terre de génie et d'innovation."
    },
    { 
      title: "Nœuds Technologiques Mondiaux", 
      links: [
        { n: "GitHub Global Flow", u: "https://github.com/trending" },
        { n: "MIT Technology Review", u: "https://www.technologyreview.com/" }
      ],
      desc: "Veille stratégique sur les technologies de rupture."
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
            <p style={{ color: "#3b82f6", marginTop: "10px", fontWeight: "bold", fontSize: "1.1rem" }}>GUADELOUPE, TERRE DE CHAMPIONS</p>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
            
            {/* PANNEAU DE CONTRÔLE INTERACTIF */}
            <div style={{ border: "1px solid #1e40af", borderRadius: "20px", padding: "1.5rem", background: "rgba(30, 64, 175, 0.1)" }}>
              {sections.map((sec) => (
                <div key={sec.title} style={{ marginBottom: "2rem" }}>
                  <h3 style={{ color: "#3b82f6", borderBottom: "1px solid #333", paddingBottom: "5px" }}>{sec.title}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                    {sec.links.map(link => (
                      <button 
                        key={link.n}
                        onClick={() => setActiveData(sec.desc)}
                        style={{ textAlign: "left", background: "#111", border: "1px solid #333", color: "#fff", padding: "10px", borderRadius: "8px", cursor: "pointer" }}
                      >
                        <a href={link.u} target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "none", fontSize: "0.9rem" }}>
                          {link.n} <span style={{ color: "#3b82f6" }}>→</span>
                        </a>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* MONITEUR DE VISION - TOUT EST ACHEVÉ */}
            <div style={{ background: "#050505", border: "2px solid #2563eb", borderRadius: "20px", padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: "0 0 40px rgba(37, 99, 235, 0.2)" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "900", marginBottom: "1.5rem", color: "#3b82f6", textAlign: "center" }}>ANALYSEUR STRATÉGIQUE RÉEL</h2>
              <div style={{ padding: "1.5rem", border: "1px solid #1e40af", borderRadius: "10px", minHeight: "120px" }}>
                <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "#e2e8f0" }}>{activeData}</p>
              </div>
              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <span style={{ padding: "8px 15px", background: "#2563eb", borderRadius: "50px", fontSize: "0.7rem", fontWeight: "bold" }}>SYSTÈME DÉPLOYÉ ET OPÉRATIONNEL</span>
              </div>
            </div>

          </div>

          <footer style={{ marginTop: "4rem", textAlign: "center", padding: "20px", borderTop: "1px solid #222" }}>
            <p style={{ fontSize: "0.9rem", color: "#666" }}>
              Invention Reussitess® NEURO-X : Propulser la culture Caribéenne vers l'excellence mondiale.
            </p>
          </footer>
        </div>
      </div>
    </Layout>
  );
}
