"use client";
import Link from "next/link";

export default function Investir() {
  return (
    <div style={{ minHeight: "100vh", padding: "2rem", background: "#020617", color: "white", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden" }}>
      
      {/* Animation de fond Scan Line */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "2px", background: "rgba(0, 255, 65, 0.5)", boxShadow: "0 0 15px #00ff41", zIndex: 50, animation: "scan 4s linear infinite" }}></div>

      <div style={{ maxWidth: "800px", width: "100%", background: "linear-gradient(145deg, #0f172a 0%, #020617 100%)", padding: "2.5rem", borderRadius: "40px", border: "1px solid #00ff41", boxShadow: "0 0 50px rgba(0, 255, 65, 0.15)", position: "relative", zIndex: 10 }}>
        
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 className="neuro-title" style={{ fontSize: "1.8rem", color: "#00ff41", fontWeight: "900", letterSpacing: "2px", textShadow: "0 0 10px rgba(0,255,65,0.5)" }}>
            REUSSITESS®NEURO-X
          </h1>
          <div style={{ background: "#ffd700", color: "black", display: "inline-block", padding: "0.2rem 0.8rem", borderRadius: "5px", fontWeight: "bold", fontSize: "0.7rem", animation: "pulse 2s infinite", marginTop: "10px" }}>
            IA PRÉDICTIVE ACTIVÉE
          </div>
        </div>

        <section style={{ marginBottom: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "#e2e8f0" }}>
            L'infrastructure de calcul <strong>NEURO-X</strong> sécurise l'avantage stratégique de nos 14 pays partenaires via le protocole REUSSITESS®.
          </p>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2.5rem" }}>
          <div style={{ border: "1px solid rgba(0,255,65,0.2)", padding: "1.2rem", borderRadius: "20px", background: "rgba(0,0,0,0.2)" }}>
            <h3 style={{ color: "#00ff41", fontSize: "1rem" }}>Analyse Souveraine</h3>
            <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Indépendance totale des flux de données au sein des 14 nations.</p>
          </div>
          <div style={{ border: "1px solid rgba(255,215,0,0.2)", padding: "1.2rem", borderRadius: "20px", background: "rgba(0,0,0,0.2)" }}>
            <h3 style={{ color: "#ffd700", fontSize: "1rem" }}>Accès Privé</h3>
            <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Détention du jeton REUSSITESS® obligatoire pour l'interopérabilité.</p>
          </div>
        </div>

        <div style={{ background: "#000", padding: "1.5rem", borderRadius: "20px", textAlign: "center", border: "1px solid #334155" }}>
          <p style={{ fontSize: "0.6rem", color: "#888", marginBottom: "8px" }}>SMART CONTRAT RÉSEAU NEURO-X</p>
          <code style={{ fontSize: "0.9rem", color: "#00ff41", fontWeight: "bold", wordBreak: "break-all" }}>0x4b3bFf4b58d22Ad363bb260e22032414d4CfdDB8</code>
        </div>

        <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
          <Link href="/" style={{ background: "#00ff41", color: "black", padding: "1rem 2.5rem", borderRadius: "50px", textDecoration: "none", fontWeight: "900", fontSize: "0.9rem", boxShadow: "0 0 20px rgba(0, 255, 65, 0.3)", display: "inline-block" }}>
            RETOUR À L'UNITÉ CENTRALE
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        .neuro-title { animation: glow 3s ease-in-out infinite alternate; }
        @keyframes glow { from { text-shadow: 0 0 10px #00ff41; } to { text-shadow: 0 0 20px #00ff41; } }
      `}</style>
      
      <p style={{ marginTop: "2rem", fontSize: "0.6rem", opacity: 0.4 }}>© 2025 REUSSITESS®NEURO-X Division</p>
    </div>
  );
}
