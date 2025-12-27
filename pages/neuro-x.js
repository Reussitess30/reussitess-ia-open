import Layout from "../components/Layout";
import { useState } from "react";

export default function NeuroX() {
  const [activeStep, setActiveStep] = useState(null);
  const [chatResponse, setChatResponse] = useState("Système NEURO-X prêt. Langue configurée. Sélectionnez un pilier ou parlez-moi.");
  const [chatInput, setChatInput] = useState("");
  const [lang, setLang] = useState("fr-FR");

  const steps = [
    { 
      n: "1", t: "Afrique", 
      links: [
        { n: "Banque Africaine (BAD)", u: "https://www.afdb.org/fr" },
        { n: "Portail ZLECAF", u: "https://au-afcfta.org/fr/" },
        { n: "Investir en Afrique", u: "https://www.africainvest.com" }
      ],
      d: "Expertise sur la Zone de Libre-Échange Continentale et les financements d'infrastructures souveraines." 
    },
    { 
      n: "2", t: "ONU", 
      links: [
        { n: "Objectifs ODD", u: "https://www.un.org/sustainabledevelopment/fr/" },
        { n: "UNESCO Culture", u: "https://fr.unesco.org" },
        { n: "PNUD Développement", u: "https://www.undp.org/fr" }
      ],
      d: "Accès aux programmes mondiaux de développement et aux cadres de diplomatie économique." 
    },
    { 
      n: "3", t: "E-commerce", 
      links: [
        { n: "Vendre en ligne (FR)", u: "https://www.economie.gouv.fr/entreprises/vendre-en-ligne" },
        { n: "Shopify Global", u: "https://www.shopify.com" },
        { n: "Amazon Seller", u: "https://sellercentral.amazon.fr" }
      ],
      d: "Maîtrise de la vente omnicanale et des flux financiers numériques sur les 14 pays." 
    },
    { 
      n: "4", t: "Logistique", 
      links: [
        { n: "Douanes FR", u: "https://www.douane.gouv.fr" },
        { n: "DHL Express", u: "https://www.dhl.com" },
        { n: "Port de Jarry (Gwad)", u: "http://www.guadeloupe-portcaraibes.com" }
      ],
      d: "Gestion du fret, des incoterms et de l'exportation stratégique depuis la Caraïbe." 
    },
    { 
      n: "5", t: "Langue Créole", 
      links: [
        { n: "Potomitan (Référence)", u: "https://www.potomitan.info" },
        { n: "Culture Caraïbe", u: "https://www.caraibe-culture.fr" },
        { n: "Dictionnaire Créole", u: "https://www.cnrtl.fr" }
      ],
      d: "Souveraineté linguistique et promotion de l'identité comme levier de croissance." 
    },
    { 
      n: "6", t: "UNESCO", 
      links: [
        { n: "Patrimoine Mondial", u: "https://whc.unesco.org/fr/list/" },
        { n: "Mémoire du Monde", u: "https://fr.unesco.org/programme/mow" },
        { n: "Convention 2005", u: "https://fr.unesco.org/creativity/" }
      ],
      d: "Expertise en soft-power et valorisation des biens culturels d'exception." 
    },
    { 
      n: "7", t: "INPI", 
      links: [
        { n: "Protéger sa marque", u: "https://www.inpi.fr" },
        { n: "OMPI (International)", u: "https://www.wipo.int/portal/fr/" },
        { n: "Dépôt Brevets", u: "https://www.inpi.fr/brevets" }
      ],
      d: "Bouclier juridique pour Reussitess© et sécurisation de l'adresse 0x69f4...1549." 
    },
    { 
      n: "8", t: "Tech/IA", 
      links: [
        { n: "IA Souveraine (Etalab)", u: "https://www.etalab.gouv.fr" },
        { n: "NVIDIA AI", u: "https://www.nvidia.com/fr-fr/ai-data-science/" },
        { n: "Open Data", u: "https://www.data.gouv.fr" }
      ],
      d: "Infrastructures numériques avancées pour les 2 milliards de Reussitess©." 
    },
    { 
      n: "9", t: "Psychologie", 
      links: [
        { n: "Santé Mentale (OMS)", u: "https://www.who.int/fr" },
        { n: "Neurosciences Succès", u: "https://www.brainfacts.org" },
        { n: "Leadership Institute", u: "https://www.leadershipinstitute.org" }
      ],
      d: "Préparation mentale et résilience des champions de haute performance." 
    },
    { 
      n: "10", t: "Épanouissement", 
      links: [
        { n: "Objectifs Durables", u: "https://www.un.org/sustainabledevelopment/fr/" },
        { n: "Bien-être Global", u: "https://www.worldhappiness.report" },
        { n: "Impact Social", u: "https://www.avise.org" }
      ],
      d: "Réussite holistique alignant richesse financière et équilibre de vie." 
    }
  ];

  const changeLang = (l, msg) => {
    setLang(l);
    setChatResponse(msg);
    speak(msg, l);
  };

  const speak = (msg, lCode = lang) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(msg);
    u.lang = lCode; u.rate = 0.95;
    window.speechSynthesis.speak(u);
  };

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", padding: "40px 20px" }}>
        <h1 style={{ textAlign: "center", fontSize: "3rem", fontWeight: "900", color: "#3b82f6", marginBottom: "50px" }}>REUSSITESS® NEURO-X</h1>
        
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "40px" }}>
          
          {/* PILIERS GAUCHE */}
          <div style={{ background: "#0f0f0f", border: "1px solid #1e40af", borderRadius: "24px", padding: "30px" }}>
            <h3 style={{ color: "#3b82f6", marginBottom: "25px" }}>PROGRAMME D'EXCELLENCE</h3>
            {steps.map(s => (
              <button key={s.n} onClick={() => { setActiveStep(s); speak(s.d); }} style={{ width: "100%", textAlign: "left", background: activeStep?.n === s.n ? "#1e40af" : "#1a1a1a", border: "1px solid #333", color: "#fff", padding: "16px", borderRadius: "12px", marginBottom: "12px", cursor: "pointer", fontSize: "1rem" }}>
                <span style={{ fontWeight: "bold", color: "#3b82f6", marginRight: "10px" }}>{s.n}.</span> {s.t}
              </button>
            ))}
          </div>

          {/* BOT & SOURCES DROITE */}
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            
            {/* BOT MULTILINGUE */}
            <div style={{ background: "#0a0a0a", border: "2px solid #2563eb", borderRadius: "24px", padding: "30px" }}>
              <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginBottom: "25px" }}>
                <span onClick={() => changeLang("fr-FR", "Bonjour Champion. Je parle Français.")} style={{ fontSize: "2rem", cursor: "pointer" }}>🇫🇷</span>
                <span onClick={() => changeLang("en-US", "Hello Champion. I now speak English.")} style={{ fontSize: "2rem", cursor: "pointer" }}>🇺🇸</span>
                <span onClick={() => changeLang("es-ES", "Hola Campeón. Hablo español ahora.")} style={{ fontSize: "2rem", cursor: "pointer" }}>🇪🇸</span>
                <span onClick={() => changeLang("pt-BR", "Olá Campeão. Eu falo português.")} style={{ fontSize: "2rem", cursor: "pointer" }}>🇧🇷</span>
                <span onClick={() => changeLang("hi-IN", "Namastē Champion. Ma͠i hindī bōlatā hūm̐.")} style={{ fontSize: "2rem", cursor: "pointer" }}>🇮🇳</span>
              </div>
              <div style={{ background: "#000", padding: "20px", borderRadius: "15px", border: "1px solid #222", minHeight: "120px" }}>
                <p style={{ fontSize: "1.1rem", color: "#ddd" }}>{chatResponse}</p>
              </div>
            </div>

            {/* LIENS MULTIPLES */}
            {activeStep && (
              <div style={{ background: "#111", border: "1px solid #3b82f6", borderRadius: "24px", padding: "30px", animation: "fadeIn 0.5s" }}>
                <h3 style={{ color: "#3b82f6", marginBottom: "15px" }}>{activeStep.t} : SOURCES OFFICIELLES</h3>
                <p style={{ color: "#aaa", marginBottom: "20px" }}>{activeStep.d}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {activeStep.links.map((link, idx) => (
                    <a key={idx} href={link.u} target="_blank" rel="noopener noreferrer" style={{ background: "#000", padding: "15px", borderRadius: "10px", border: "1px solid #2563eb", color: "#fff", textDecoration: "none", fontWeight: "bold", textAlign: "center" }}>
                      {link.n} ➜
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      <style jsx>{` @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } `}</style>
    </Layout>
  );
}
