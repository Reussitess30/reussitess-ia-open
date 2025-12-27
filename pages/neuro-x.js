import Layout from "../components/Layout";
import { useState } from "react";

export default function NeuroX() {
  const [activeData, setActiveData] = useState("SYSTÈME PRÊT : EN ATTENTE DE DIRECTION...");

  const globalNodes = [
    { name: "Souveraineté Économique", url: "https://www.imf.org/en/Data", desc: "Données financières mondiales en temps réel." },
    { name: "Nœuds Technologiques", url: "https://github.com/trending", desc: "Flux de développement open-source planétaire." },
    { name: "Ressources Énergétiques", url: "https://www.iea.org/data-and-statistics", desc: "Statistiques mondiales sur l'énergie." },
    { name: "Veille Géopolitique", url: "https://www.un.org/en/observances/data-protection-day", desc: "Protection des données et droits mondiaux." }
  ];

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: "3rem 1rem", fontFamily: "sans-serif" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          <header style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)", fontWeight: "900", color: "#2563eb", letterSpacing: "-2px", marginBottom: "10px" }}>REUSSITESS® NEURO-X</h1>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#fff", textTransform: "uppercase", letterSpacing: "2px" }}>
              L'excellence • L'innovation • Le succès
            </div>
            <p style={{ color: "#3b82f6", marginTop: "10px", fontWeight: "bold" }}>Reussitess®971 : Guadeloupe, terre de champions</p>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            
            <div style={{ border: "1px solid #1e40af", borderRadius: "20px", padding: "1.5rem", background: "rgba(30, 64, 175, 0.05)" }}>
              <h3 style={{ fontSize: "1rem", color: "#3b82f6", marginBottom: "1.5rem", textAlign: "center" }}>FLUX DE DIRECTION MONDIALE</h3>
              {globalNodes.map((node) => (
                <div key={node.name} style={{ marginBottom: "1rem" }}>
                  <button 
                    onClick={() => setActiveData(node.desc)}
                    style={{ width: "100%", textAlign: "left", background: "#111", border: "1px solid #333", color: "#fff", padding: "15px", borderRadius: "10px", cursor: "pointer", transition: "0.3s" }}
                  >
                    <strong>{node.name}</strong>
                    <br />
                    <a href={node.url} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", fontSize: "0.7rem", textDecoration: "none" }}>Consulter la source officielle →</a>
                  </button>
                </div>
              ))}
            </div>

            <div style={{ background: "#050505", border: "1px solid #1e40af", borderRadius: "20px", padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "900", marginBottom: "1rem", color: "#3b82f6" }}>MONITEUR NEURO-X</h2>
              <div style={{ padding: "2rem", border: "1px dashed #333", borderRadius: "15px", minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontSize: "1.1rem", fontStyle: "italic", color: "#94a3b8" }}>{activeData}</p>
              </div>
              <div style={{ marginTop: "2rem", fontSize: "0.7rem", color: "#444" }}>
                PROTOCOLE D'EXCELLENCE ACTIVÉ
              </div>
            </div>

          </div>

          <footer style={{ marginTop: "5rem", textAlign: "center", color: "#444", fontSize: "0.9rem" }}>
            <p>Propulsé par l'innovation Reussitess® — Depuis la Guadeloupe pour le monde entier.</p>
          </footer>
        </div>
      </div>
    </Layout>
  );
}
