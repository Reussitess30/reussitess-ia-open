"use client";
import Link from "next/link";

export default function Investir() {
  const addToken = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: '0x4b3bFf4b58d22Ad363bb260e22032414d4CfdDB8',
              symbol: 'REUSS',
              decimals: 18,
            },
          },
        });
      } catch (error) { console.error(error); }
    } else { alert("Installez MetaMask pour ajouter le token automatiquement."); }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "1.5rem", background: "#020617", color: "white", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", overflowX: "hidden" }}>
      
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "2px", background: "#00ff41", boxShadow: "0 0 15px #00ff41", zIndex: 50, animation: "scan 4s linear infinite" }}></div>

      <div style={{ maxWidth: "1000px", width: "100%", background: "rgba(15, 23, 42, 0.8)", padding: "2rem", borderRadius: "30px", border: "1px solid #00ff41", backdropFilter: "blur(10px)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", color: "#00ff41", fontWeight: "900", letterSpacing: "1px", whiteSpace: "nowrap" }}>
            REUSSITESS®NEURO-X : L'IA PRÉDICTIVE SOUVERAINE DES 14 NATIONS
          </h1>
          <p style={{ color: "#ffd700", fontSize: "0.8rem", marginTop: "5px" }}>CONFORMITÉ RÉGLEMENTAIRE INTERNATIONALE - ÉDITION 2025</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <section style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "20px" }}>
            <h3 style={{ color: "#00ff41", fontSize: "1rem" }}>🛠 FONCTIONNEMENT RÉEL</h3>
            <p style={{ fontSize: "0.85rem", lineHeight: "1.6", color: "#94a3b8" }}>
              NEURO-X n'est pas un chatbot. C'est un <strong>Oracle de Calcul Prédictif</strong>. Il utilise le machine learning pour analyser les indicateurs macro-économiques (PIB, Inflation, Flux) des 14 pays partenaires (France, USA, Canada, etc.) afin d'anticiper les ruptures de marché. Le token REUSS est le carburant (Gas) nécessaire pour interroger l'IA.
            </p>
          </section>

          <section style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "20px" }}>
            <h3 style={{ color: "#ffd700", fontSize: "1rem" }}>⚖️ CADRE JURIDIQUE MICA & SEC</h3>
            <p style={{ fontSize: "0.85rem", lineHeight: "1.6", color: "#94a3b8" }}>
              En conformité avec le règlement européen <strong>MiCA</strong> et les directives internationales, REUSSITESS® est classé comme <strong>Utility Token</strong>. 
              L'acquisition du jeton n'est pas un investissement passif mais un droit d'usage technologique. La responsabilité juridique est limitée aux 14 juridictions autorisées.
            </p>
          </section>
        </div>

        <div style={{ border: "1px solid #334155", padding: "1.5rem", borderRadius: "20px", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "0.9rem", textAlign: "center", marginBottom: "1rem" }}>🔧 PROTOCOLE DE DÉTENTION (WALLET)</h3>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <code style={{ background: "#000", padding: "0.8rem", borderRadius: "10px", color: "#00ff41", fontSize: "0.8rem" }}>
              CONTRAT : 0x4b3bFf4b58d22Ad363bb260e22032414d4CfdDB8
            </code>
            <button onClick={addToken} style={{ background: "#00ff41", color: "black", border: "none", padding: "0.8rem 1.5rem", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
              + AJOUTER AU WALLET (MetaMask)
            </button>
          </div>
        </div>

        <div style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: "1.5", textAlign: "justify", padding: "1rem", borderTop: "1px solid #334155" }}>
          <strong>Avertissement sur les risques :</strong> Conformément aux règles de l'AMF et des régulateurs des 14 pays : La volatilité des crypto-actifs peut entraîner une perte totale du capital. Vérifiez votre éligibilité territoriale avant toute transaction. Le projet NEURO-X est une propriété intellectuelle déposée (®).
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link href="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.9rem" }}>← Retour au Portail Central</Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
      `}</style>
    </div>
  );
}
