"use client";
import Layout from "../../components/Layout";
import Link from "next/link";

export default function Investir() {
  return (
    <Layout>
      <div style={{ minHeight: "80vh", padding: "4rem 2rem", background: "#0f172a", color: "white", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#ffd700", fontWeight: "900", marginBottom: "2rem" }}>PACTE D'INVESTISSEMENT REUSSITESS©</h1>
        
        <div style={{ maxWidth: "800px", margin: "0 auto", background: "rgba(255,255,255,0.05)", padding: "2rem", borderRadius: "20px", border: "1px solid #ffd700" }}>
          <h2 style={{ color: "#00ff41" }}>💎 Opportunité Élite - REUSS-VENTURE 1.0</h2>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.6", marginTop: "1rem" }}>
            Vous entrez dans un écosystème fermé reliant la <strong>MedTech (MLC Health)</strong> et la finance décentralisée. 
            L'investissement REUSSITESS© est un pilier de croissance pour nos 14 nations partenaires.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
            <div style={{ padding: "1rem", background: "rgba(0,0,0,0.3)", borderRadius: "10px" }}>
              <h3 style={{ color: "#ffd700" }}>OFFRE TOTALE</h3>
              <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>1 000 000 000 UNITÉS</p>
            </div>
            <div style={{ padding: "1rem", background: "rgba(0,0,0,0.3)", borderRadius: "10px" }}>
              <h3 style={{ color: "#ffd700" }}>ZONES</h3>
              <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>14 PAYS AUTORISÉS</p>
            </div>
          </div>

          <div style={{ marginTop: "3rem", padding: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p style={{ color: "#888" }}>ADRESSE OFFICIELLE DU CONTRAT :</p>
            <code style={{ display: "block", background: "#000", padding: "10px", borderRadius: "5px", color: "#00ff41", wordBreak: "break-all", marginTop: "10px" }}>
              0x4b3bFf4b58d22Ad363bb260e22032414d4CfdDB8
            </code>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <Link href="/" style={{ color: "#ffd700", textDecoration: "none", fontWeight: "bold" }}>← Retour à l'accueil</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
