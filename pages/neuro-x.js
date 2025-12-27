import Layout from "../components/Layout";
import { useState } from "react";

export default function NeuroX() {
  const [scanResult, setScanResult] = useState("SYSTÈME PRÊT : SCAN MONDIAL ACTIF");
  
  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: "4rem 2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "4rem", fontWeight: "900", color: "#2563eb", fontStyle: "italic" }}>NEURO-X© GLOBAL</h1>
        <p style={{ letterSpacing: "0.3em", marginBottom: "3rem" }}>ARBITRAGE SOUVERAIN SANS FRONTIÈRES</p>
        
        <div style={{ padding: "3rem", border: "2px solid #2563eb", borderRadius: "30px", background: "rgba(37, 99, 235, 0.05)" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{scanResult}</h2>
          <p style={{ color: "#94a3b8" }}>Couverture : 100% du Globe Terrestre</p>
          <div style={{ marginTop: "2rem", fontSize: "1.5rem", fontWeight: "bold" }}>
            TOTAL SUPPLY : 2,000,000,000 Reussitess©
          </div>
          <p style={{ marginTop: "1rem", fontFamily: "monospace", color: "#3b82f6" }}>Owner: 0x69f42aa645a43a84e1143d416a4c81a88df01549</p>
        </div>

        <div style={{ marginTop: "4rem" }}>
          <button onClick={() => setScanResult("SCAN EN COURS... SYNCHRONISATION MONDIALE...")} style={{ background: "#2563eb", color: "white", padding: "1.5rem 3rem", borderRadius: "50px", fontWeight: "900", border: "none", cursor: "pointer" }}>
            ACTIVER LE SCANNER PLANÉTAIRE
          </button>
        </div>
      </div>
    </Layout>
  );
}
