import Layout from "../components/Layout";
import { useState } from "react";

export default function NeuroX() {
  const [activeData, setActiveData] = useState("SYSTÈME NEURO-X : SÉLECTIONNEZ UN AXE DE RÉUSSITE POUR DÉPLOYER VOTRE POTENTIEL.");

  const sections = [
    { 
      title: "🌍 Afrique & Opportunités Globales", 
      links: [
        { n: "BAD - Financement Privé", u: "https://www.afdb.org/fr/topics-and-sectors/sectors/private-sector-development" },
        { n: "ZLECAF - Marché Unique Africain", u: "https://au-afcfta.org/fr/" },
        { n: "Boutique en ligne : Guide Complet", u: "https://www.shopify.com/fr/blog/creer-boutique-en-ligne" }
      ],
      desc: "L'axe Guadeloupe-Afrique est le futur. Utilisez ces liens pour financer et structurer votre boutique mondiale."
    },
    { 
      title: "🚀 Entrepreneuriat & Championnat", 
      links: [
        { n: "Forbes - Histoires de Succès", u: "https://www.forbes.com/leadership/" },
        { n: "Harvard - Stratégies de Croissance", u: "https://hbr.org/topic/entrepreneurship" },
        { n: "CCI Guadeloupe - Entreprendre", u: "https://www.guadeloupe.cci.fr/" }
      ],
      desc: "Étudiez les méthodes des champions. L'excellence n'est pas un acte, c'est une habitude."
    },
    { 
      title: "🧠 Mental & Culture de Réussite", 
      links: [
        { n: "Potomitan - Culture & Langue", u: "http://www.potomitan.info/" },
        { n: "Psychologie de la Victoire", u: "https://www.ted.com/playlists/171/the_psychology_of_self_improv" },
        { n: "Le Dépassement de Soi (Conseils)", u: "https://www.un.org/sustainabledevelopment/fr/" }
      ],
      desc: "Reconnaissez votre valeur. La Guadeloupe est une terre de champions. Utilisez votre culture comme une force."
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

            <div style={{ background: "#050505", border: "2px solid #2563eb", borderRadius: "20px", padding: "2.5rem", boxShadow: "0 0 40px rgba(37, 99, 235, 0.2)" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "900", marginBottom: "1.5rem", color: "#3b82f6", textAlign: "center" }}>RADAR DE RÉUSSITE</h2>
              <div style={{ padding: "1.5rem", border: "1px solid #1e40af", borderRadius: "10px", minHeight: "120px", background: "rgba(37, 99, 235, 0.05)", marginBottom: "2rem" }}>
                <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "#e2e8f0", textAlign: "center" }}>{activeData}</p>
              </div>
              
              <div style={{ borderTop: "1px solid #333", paddingTop: "1rem" }}>
                <h4 style={{ color: "#fff", fontSize: "0.9rem", marginBottom: "10px" }}>🔑 LES CLÉS DU SUCCÈS :</h4>
                <ul style={{ fontSize: "0.85rem", color: "#94a3b8", listStyle: "none", padding: 0 }}>
                  <li>✅ 1. Vision claire (Neuro-X Vision)</li>
                  <li>✅ 2. Discipline de champion (Rigueur 971)</li>
                  <li>✅ 3. Apprentissage continu (Liens réels)</li>
                  <li>✅ 4. Action immédiate (Entrepreneuriat)</li>
                  <li>✅ 5. Résilience et Foi en soi</li>
                </ul>
              </div>
            </div>

          </div>

          <footer style={{ marginTop: "4rem", textAlign: "center", padding: "20px", borderTop: "1px solid #222" }}>
            <p style={{ fontSize: "0.9rem", color: "#444" }}>
              © 2025 REUSSITESS® NEURO-X - L'Excellence Caribéenne au service de l'épanouissement humain mondial.
            </p>
          </footer>
        </div>
      </div>
    </Layout>
  );
}
