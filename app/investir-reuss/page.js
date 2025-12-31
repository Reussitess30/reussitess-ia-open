"use client";
import Link from "next/link";

export default function Investir() {
  return (
    <div style={{ minHeight: "100vh", padding: "2rem", background: "#020617", color: "white", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ maxWidth: "900px", width: "100%", background: "linear-gradient(145deg, #0f172a 0%, #020617 100%)", padding: "3rem", borderRadius: "40px", border: "1px solid #00ff41", boxShadow: "0 0 50px rgba(0, 255, 65, 0.2)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.8rem", color: "#00ff41", fontWeight: "900", letterSpacing: "1px" }}>REUSSITESS®NEURO-X</h1>
          <div style={{ background: "#ffd700", color: "black", display: "inline-block", padding: "0.2rem 1rem", borderRadius: "5px", fontWeight: "bold", fontSize: "0.8rem" }}>IA PRÉDICTIVE MONDIALE</div>
        </div>

        <section style={{ marginBottom: "2.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "1.2rem", lineHeight: "1.7", color: "#e2e8f0" }}>
            L'infrastructure <strong>REUSSITESS®NEURO-X</strong> est la première intelligence artificielle décentralisée capable de modéliser les flux économiques des 14 nations partenaires.
          </p>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "3rem" }}>
          <div style={{ border: "1px solid rgba(0,255,65,0.3)", padding: "1.5rem", borderRadius: "20px", background: "rgba(0,0,0,0.2)" }}>
            <h3 style={{ color: "#00ff41" }}>Calcul Souverain</h3>
            <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>Indépendance totale face aux IA traditionnelles. Vos données restent dans le cercle des 14 pays.</p>
          </div>
          <div style={{ border: "1px solid rgba(255,215,0,0.3)", padding: "1.5rem", borderRadius: "20px", background: "rgba(0,0,0,0.2)" }}>
            <h3 style={{ color: "#ffd700" }}>Token Utility</h3>
            <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>Le jeton REUSSITESS© alimente les processeurs de NEURO-X. Pas de token, pas d'accès.</p>
          </div>
        </div>

        <div style={{ background: "#000", padding: "2rem", borderRadius: "20px", textAlign: "center", border: "1px solid #334155" }}>
          <p style={{ fontSize: "0.7rem", color: "#888", marginBottom: "10px" }}>CONTRAT OFFICIEL RÉSEAU NEURO-X</p>
          <code style={{ fontSize: "1.1rem", color: "#00ff41", fontWeight: "bold", wordBreak: "break-all" }}>0x4b3bFf4b58d22Ad363bb260e22032414d4CfdDB8</code>
        </div>

        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <Link href="/" style={{ background: "#00ff41", color: "black", padding: "1.2rem 3rem", borderRadius: "50px", textDecoration: "none", fontWeight: "900", boxShadow: "0 0 20px rgba(0, 255, 65, 0.4)" }}>
            ACTIVER MON ACCÈS NEURO-X
          </Link>
        </div>
      </div>
    </div>
  );
}
