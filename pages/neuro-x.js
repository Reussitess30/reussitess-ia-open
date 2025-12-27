import Layout from "../components/Layout";
import { useState, useEffect } from "react";

export default function NeuroX() {
  const [logs, setLogs] = useState(["[SYSTÈME] : Initialisation du Noyau de Convergence..."]);
  const [powerLevel, setPowerLevel] = useState(0);

  useEffect(() => {
    const messages = [
      "Connexion aux flux mondiaux établie...",
      "Analyse des nœuds de réussite (Europe/Asie/Amérique/Afrique)...",
      "Calcul de l'arbitrage universel en cours...",
      "Souveraineté NEURO-X confirmée.",
      "INTERFACE DE DÉCISION STRATÉGIQUE : ACTIVE"
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setLogs(prev => [...prev, `[LOG] : ${messages[i]}`]);
        setPowerLevel(prev => prev + 20);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: "#000", color: "#00ff41", padding: "2rem", fontFamily: "'Courier New', monospace" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", border: "2px solid #1e40af", padding: "2rem", borderRadius: "10px", boxShadow: "0 0 50px rgba(30, 64, 175, 0.5)" }}>
          
          <div style={{ textAlign: "center", borderBottom: "1px solid #1e40af", marginBottom: "2rem", paddingBottom: "1rem" }}>
            <h1 style={{ color: "#fff", fontSize: "2.5rem", margin: 0 }}>REUSSITESS® NEURO-X</h1>
            <p style={{ color: "#3b82f6", letterSpacing: "5px" }}>INVENTION SOUVERAINE PLANÉTAIRE</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            <div style={{ background: "#050505", border: "1px solid #333", padding: "1.5rem", borderRadius: "8px", textAlign: "center" }}>
              <div style={{ width: "150px", height: "150px", border: "2px solid #3b82f6", borderRadius: "50%", margin: "0 auto", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <div style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, background: "conic-gradient(from 0deg, transparent, #2563eb)", animation: "rotate 2s linear infinite", opacity: 0.3 }}></div>
                <span style={{ color: "#fff", fontSize: "0.8rem", fontWeight: "bold", zIndex: 1 }}>VISION MONDE</span>
              </div>
              <p style={{ marginTop: "1rem", color: "#fff" }}>STATUT : SCAN GLOBAL ACTIF</p>
            </div>

            <div style={{ background: "#050505", border: "1px solid #333", padding: "1.5rem", borderRadius: "8px", fontSize: "0.8rem", height: "250px", overflowY: "auto", color: "#00ff41" }}>
              {logs.map((log, index) => (
                <div key={index} style={{ marginBottom: "8px", borderLeft: "2px solid #1e40af", paddingLeft: "10px" }}>{log}</div>
              ))}
            </div>
          </div>
        </div>
        <style jsx>{` @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
      </div>
    </Layout>
  );
}
