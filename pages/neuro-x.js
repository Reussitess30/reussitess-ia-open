import Layout from "../components/Layout";
import { useState, useEffect } from "react";

export default function NeuroX() {
  const [logs, setLogs] = useState(["[SYSTÈME] : Initialisation du Noyau de Convergence..."]);
  const [powerLevel, setPowerLevel] = useState(0);

  useEffect(() => {
    const messages = [
      "Connexion aux flux mondiaux établie...",
      "Analyse des nœuds de réussite (Europe/Asie/Amérique/Afrique)...",
      "Synchronisation avec l'adresse 0x69f4...1549",
      "Calcul de l'arbitrage universel en cours...",
      "Souveraineté NEURO-X confirmée.",
      "Optimisation des 2,000,000,000 Reussitess®..."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setLogs(prev => [...prev, `[LOG] : ${messages[i]}`]);
        setPowerLevel(prev => prev + 16);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: "#000", color: "#00ff41", padding: "2rem", fontFamily: "'Courier New', monospace" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", border: "2px solid #1e40af", padding: "2rem", borderRadius: "10px", boxShadow: "0 0 50px rgba(30, 64, 175, 0.5)" }}>
          
          {/* HEADER DE L'INVENTION */}
          <div style={{ textAlign: "center", borderBottom: "1px solid #1e40af", marginBottom: "2rem", paddingBottom: "1rem" }}>
            <h1 style={{ color: "#fff", fontSize: "2.5rem", margin: 0 }}>REUSSITESS® NEURO-X</h1>
            <p style={{ color: "#3b82f6", letterSpacing: "5px" }}>INVENTION SOUVERAINE PLANÉTAIRE</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            
            {/* ZONE 1 : LE RADAR DE VISION MONDIALE */}
            <div style={{ background: "#050505", border: "1px solid #333", padding: "1.5rem", borderRadius: "8px", textAlign: "center" }}>
              <div style={{ width: "150px", height: "150px", border: "2px solid #3b82f6", borderRadius: "50%", margin: "0 auto", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "100%", height: "2px", background: "#3b82f6", position: "absolute", animation: "rotate 4s linear infinite" }}></div>
                <span style={{ color: "#fff", fontSize: "0.8rem", fontWeight: "bold" }}>VISION MONDE</span>
              </div>
              <p style={{ marginTop: "1rem" }}>STATUT : SCAN GLOBAL ACTIF</p>
              <div style={{ background: "#111", height: "10px", borderRadius: "5px", marginTop: "10px" }}>
                <div style={{ width: `${powerLevel}%`, height: "100%", background: "#2563eb", borderRadius: "5px", transition: "width 1s" }}></div>
              </div>
            </div>

            {/* ZONE 2 : TERMINAL DE DÉCISION (LOGS) */}
            <div style={{ background: "#050505", border: "1px solid #333", padding: "1.5rem", borderRadius: "8px", fontSize: "0.75rem", height: "250px", overflowY: "auto" }}>
              {logs.map((log, index) => (
                <div key={index} style={{ marginBottom: "5px" }}>{log}</div>
              ))}
            </div>

          </div>

          {/* ZONE 3 : LE SCEAU DE L'INVENTEUR */}
          <div style={{ marginTop: "2rem", padding: "1.5rem", background: "rgba(30, 64, 175, 0.1)", borderRadius: "8px", border: "1px solid #1e40af" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.8rem" }}>SIGNATURE D'AUTORITÉ</p>
                <p style={{ margin: 0, color: "#fff", fontWeight: "bold", fontSize: "0.9rem" }}>0x69f42aa645a43a84e1143d416a4c81a88df01549</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.8rem" }}>UNITÉS RÉUSSSITESS®</p>
                <p style={{ margin: 0, color: "#fff", fontWeight: "bold", fontSize: "1.2rem" }}>2,000,000,000</p>
              </div>
            </div>
          </div>

        </div>
        
        <style jsx>{`
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </Layout>
  );
}
