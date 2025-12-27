import Layout from "../components/Layout";
import { useState } from "react";

export default function NeuroX() {
  const [activeStep, setActiveStep] = useState(null);

  const steps = [
    { n: "1", t: "Opportunités Afrique (BAD)", u: "https://www.afdb.org/fr/projects-and-operations", d: "Accédez aux financements et aux projets de la Banque Africaine de Développement pour l'entrepreneuriat." },
    { n: "2", t: "Aide Internationale (ONU)", u: "https://www.un.org/fr/our-work/deliver-humanitarian-aid", d: "Ressources mondiales pour le développement et l'aide aux projets internationaux." },
    { n: "3", t: "Boutique en Ligne (Vendre)", u: "https://www.economie.gouv.fr/entreprises/creer-site-internet-vente-en-ligne", d: "Guide officiel pour structurer votre commerce numérique mondialement." },
    { n: "4", t: "Logistique Mondiale (Export)", u: "https://www.douane.gouv.fr/fiche/les-fondamentaux-du-dedouanement", d: "Maîtrisez les douanes et l'exportation de la Guadeloupe vers l'international." },
    { n: "5", t: "Identité & Langue (CNRS)", u: "https://www.cnrs.fr/fr/actualite/les-langues-creoles-un-laboratoire-pour-la-linguistique", d: "Études approfondies sur la puissance et l'évolution de la langue Créole." },
    { n: "6", t: "Patrimoine Caraïbe (UNESCO)", u: "https://whc.unesco.org/fr/list/", d: "Protection et valorisation de la culture et du génie Caribéen au patrimoine mondial." },
    { n: "7", t: "Propriété Intellectuelle (INPI)", u: "https://www.inpi.fr/proteger-vos-creations", d: "Sécurisez vos marques et inventions Reussitess® auprès de l'organisme officiel." },
    { n: "8", t: "Innovation & IA (Etalab)", u: "https://www.etalab.gouv.fr/", d: "Portail souverain sur la stratégie des données et de l'intelligence artificielle." },
    { n: "9", t: "Dépassement de Soi (OMS)", u: "https://www.who.int/fr/news-room/fact-sheets/detail/mental-health-strengthening-our-response", d: "Développement du potentiel humain et résilience mentale des champions." },
    { n: "10", t: "Épanouissement (ODD)", u: "https://www.un.org/sustainabledevelopment/fr/objectifs-de-developpement-durable/", d: "Les 17 piliers pour une réussite globale, durable et humaine." }
  ];

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: "#020617", color: "#f8fafc", padding: "2rem 1rem", fontFamily: "sans-serif" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          <header style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 style={{ fontSize: "clamp(2rem, 8vw, 4rem)", fontWeight: "900", color: "#3b82f6" }}>REUSSITESS® NEURO-X</h1>
            <p style={{ letterSpacing: "3px", color: "#60a5fa", fontWeight: "bold" }}>L'EXCELLENCE • L'INNOVATION • LE SUCCÈS</p>
            <p style={{ color: "#fff" }}>GUADELOUPE, TERRE DE CHAMPIONS 🇬🇵</p>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            
            {/* COLONNE GAUCHE : LES 10 TITRES CLIQUABLES */}
            <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid #1e40af", borderRadius: "24px", padding: "1.5rem" }}>
              <h3 style={{ color: "#3b82f6", marginBottom: "1.5rem", textAlign: "center" }}>PLAN D'ACTION SOUVERAIN</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {steps.map((step) => (
                  <button 
                    key={step.n} 
                    onClick={() => setActiveStep(step)} 
                    style={{ 
                      textAlign: "left", background: activeStep?.n === step.n ? "#1e40af" : "#0f172a", 
                      border: "1px solid #1e3a8a", color: "#fff", padding: "12px", borderRadius: "12px", cursor: "pointer", transition: "0.2s" 
                    }}
                  >
                    <span style={{ fontWeight: "900", marginRight: "10px" }}>{step.n}.</span> {step.t}
                  </button>
                ))}
              </div>
            </div>

            {/* COLONNE DROITE : AFFICHAGE DES INFOS ET LIENS REELS */}
            <div style={{ background: "linear-gradient(145deg, #1e293b, #020617)", border: "2px solid #3b82f6", borderRadius: "24px", padding: "2rem", display: "flex", flexDirection: "column", minHeight: "400px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#3b82f6", textAlign: "center", marginBottom: "2rem" }}>MONITEUR D'ANALYSE</h2>
              
              {activeStep ? (
                <div style={{ animation: "fadeIn 0.5s" }}>
                  <h3 style={{ color: "#fff", marginBottom: "1rem" }}>{activeStep.t}</h3>
                  <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#cbd5e1", marginBottom: "2rem" }}>{activeStep.d}</p>
                  
                  <div style={{ background: "#0f172a", padding: "20px", borderRadius: "15px", border: "1px solid #3b82f6", textAlign: "center" }}>
                    <p style={{ color: "#60a5fa", fontSize: "0.8rem", marginBottom: "10px", textTransform: "uppercase" }}>Source Officielle Vérifiée :</p>
                    <a 
                      href={activeStep.u} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: "#fff", fontWeight: "bold", fontSize: "1.2rem", textDecoration: "underline", wordBreak: "break-all" }}
                    >
                      {activeStep.u}
                    </a>
                    <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#94a3b8" }}>Cliquez sur le lien ci-dessus pour ouvrir le portail.</p>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", marginTop: "4rem", color: "#475569" }}>
                  <p style={{ fontSize: "1.2rem" }}>"Piti a piti, zwazo ka fè nich a'y."</p>
                  <p style={{ marginTop: "1rem" }}>Sélectionnez l'une des 10 étapes à gauche pour voir les informations et les liens réels.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Layout>
  );
}
