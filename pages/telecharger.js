/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import Head from "next/head";
import Layout from "../components/Layout";

export default function Telecharger() {
  return (
    <Layout>
      <Head><title>Télécharger REUSSITESS AI — Android & iOS</title></Head>
      <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0f172a,#1e293b)", padding:"2rem 1rem", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        
        <div style={{ fontSize:"4rem", marginBottom:"1rem" }}>🦋</div>
        <h1 style={{ color:"white", fontWeight:900, fontSize:"2rem", textAlign:"center", marginBottom:"0.5rem" }}>REUSSITESS<span style={{color:"#f59e0b"}}>®971 AI</span></h1>
        <p style={{ color:"#94a3b8", textAlign:"center", marginBottom:"2rem" }}>L'assistant IA caribéen — Terres de Champions 🇬🇵</p>

        <div style={{ width:"100%", maxWidth:"400px", display:"flex", flexDirection:"column", gap:"1rem" }}>
          
          {/* Android APK */}
          <a href="https://github.com/Reussitess30/ReussitessApp/releases/download/v1.0.0/reussitess-ai-v1.0.0.apk" 
             target="_blank" rel="noopener noreferrer"
             style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"1.2rem", background:"linear-gradient(135deg,#10b981,#065f46)", borderRadius:"16px", textDecoration:"none", color:"white" }}>
            <span style={{fontSize:"2.5rem"}}>🤖</span>
            <div>
              <div style={{fontWeight:700, fontSize:"1.1rem"}}>Télécharger pour Android</div>
              <div style={{fontSize:"0.85rem", opacity:0.8}}>APK direct — v1.0.0</div>
            </div>
          </a>

          {/* iOS - bientôt */}
          <div style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"1.2rem", background:"rgba(255,255,255,0.05)", borderRadius:"16px", border:"1px solid rgba(255,255,255,0.1)", color:"white", opacity:0.6 }}>
            <span style={{fontSize:"2.5rem"}}>🍎</span>
            <div>
              <div style={{fontWeight:700, fontSize:"1.1rem"}}>iOS — Bientôt disponible</div>
              <div style={{fontSize:"0.85rem", opacity:0.8}}>App Store — En cours</div>
            </div>
          </div>

          {/* PWA */}
          <a href="https://reussitess.fr" 
             target="_blank" rel="noopener noreferrer"
             style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"1.2rem", background:"linear-gradient(135deg,#3b82f6,#1d4ed8)", borderRadius:"16px", textDecoration:"none", color:"white" }}>
            <span style={{fontSize:"2.5rem"}}>🌐</span>
            <div>
              <div style={{fontWeight:700, fontSize:"1.1rem"}}>Version Web (PWA)</div>
              <div style={{fontSize:"0.85rem", opacity:0.8}}>Installer depuis le navigateur</div>
            </div>
          </a>

        </div>

        <p style={{ color:"#64748b", fontSize:"0.8rem", textAlign:"center", marginTop:"2rem" }}>
          REUSSITESS®971 — SIRET: 444699979700031<br/>
          Gourbeyre, Guadeloupe 🇬🇵
        </p>
        <p style={{ color:"#f59e0b", fontWeight:700, marginTop:"0.5rem" }}>Boudoum ! 🦋</p>
      </div>
    </Layout>
  );
}
