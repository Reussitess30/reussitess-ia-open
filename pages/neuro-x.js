import Layout from "../components/Layout";
import { useState } from "react";

export default function NeuroX() {
  const [scanResult, setScanResult] = useState("EN ATTENTE D'ACTIVATION...");
  
  const countries = [
    "France", "Angleterre", "Italie", "Allemagne", "Suède", 
    "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", 
    "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"
  ];

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: "4rem 2rem" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "900", textAlign: "center", color: "#2563eb" }}>NEURO-X©</h1>
        <p style={{ textAlign: "center", marginBottom: "3rem" }}>Arbitrage Souverain - 2,000,000,000 Reussitess©</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem" }}>
          {countries.map(country => (
            <button 
              key={country}
              onMouseEnter={() => setScanResult(`JURIDICTION : ${country.toUpperCase()} - VALIDÉ`)}
              style={{ background: "#111", border: "1px solid #222", padding: "1rem", borderRadius: "10px", color: "white" }}
            >
              {country}
            </button>
          ))}
        </div>

        <div style={{ marginTop: "3rem", padding: "2rem", border: "2px solid #2563eb", borderRadius: "20px", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", color: "#3b82f6" }}>{scanResult}</h2>
          <p style={{ fontSize: "0.8rem", marginTop: "1rem", color: "#444" }}>Owner: 0x69f42aa645a43a84e1143d416a4c81a88df01549</p>
        </div>
      </div>
    </Layout>
  );
}
