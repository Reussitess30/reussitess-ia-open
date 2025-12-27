import Layout from "../components/Layout";
import { useState } from "react";

export default function NeuroX() {
  const [activeStep, setActiveStep] = useState(null);
  const [chatResponse, setChatResponse] = useState("REUSSITESS® NEURO-X activé. Je maîtrise les 10 piliers et les nuances culturelles des zones créolophones. Comment puis-je vous aider ?");
  const [chatInput, setChatInput] = useState("");
  const [lang, setLang] = useState("fr-FR");

  const steps = [
    { n: "1", t: "Afrique", links: [{ n: "BAD Secteur Privé", u: "https://www.afdb.org/fr" }, { n: "ZLECAF Officiel", u: "https://au-afcfta.org/fr/" }, { n: "Investir Afrique", u: "https://www.africainvest.com" }], d: "Stratégie de croissance sur le continent : financements et marchés émergents." },
    { n: "2", t: "ONU", links: [{ n: "Objectifs ODD", u: "https://www.un.org/sustainabledevelopment/fr/" }, { n: "PNUD", u: "https://www.undp.org/fr" }, { n: "Pacte Mondial", u: "https://pactemondial.org" }], d: "Cadre international pour un développement éthique et durable." },
    { n: "3", t: "E-commerce", links: [{ n: "Vendre en ligne", u: "https://www.economie.gouv.fr/entreprises/vendre-en-ligne" }, { n: "Shopify Global", u: "https://www.shopify.com" }, { n: "Amazon Seller", u: "https://sellercentral.amazon.fr" }], d: "Vente mondiale et intégration des 2 milliards de Reussitess©." },
    { n: "4", t: "Logistique", links: [{ n: "Douanes FR", u: "https://www.douane.gouv.fr" }, { n: "DHL Global", u: "https://www.dhl.com" }, { n: "Port Caraïbes", u: "http://www.guadeloupe-portcaraibes.com" }], d: "Flux physiques et optimisation du hub logistique de Jarry." },
    { n: "5", t: "Langue Créole", 
      links: [
        { n: "Dictionnaire Créole (CNTL)", u: "https://www.cnrtl.fr/definition/cr%C3%A9ole" },
        { n: "Histoire & Aires Créolophones", u: "https://www.axl.cefan.ulaval.ca/monde/creoles.htm" },
        { n: "Culture Caraïbe (Patrimoine)", u: "https://www.culture.gouv.fr/Thematiques/Langues-de-France/Agir-pour-les-langues/Les-langues-creoles" },
        { n: "Créole Haïtien (Akademi)", u: "https://www.akademikreyol.net" }
      ], 
      d: "Souveraineté linguistique. Ce pilier couvre l'histoire et l'usage du créole en Guadeloupe, Martinique, Guyane, Réunion et Haïti." 
    },
    { n: "6", t: "UNESCO", links: [{ n: "Patrimoine Mondial", u: "https://whc.unesco.org/fr/list/" }, { n: "Patrimoine Immatériel", u: "https://ich.unesco.org/fr/home" }, { n: "Culture & Développement", u: "https://fr.unesco.org" }], d: "Valorisation internationale de l'excellence et du soft-power." },
    { n: "7", t: "INPI", links: [{ n: "Protéger sa marque", u: "https://www.inpi.fr" }, { n: "OMPI International", u: "https://www.wipo.int/portal/fr/" }, { n: "e-Soleau", u: "https://www.inpi.fr/services-et-outils/e-soleau" }], d: "Sécurisation des actifs liés à l'adresse 0x69f4...1549." },
    { n: "8", t: "Tech/IA", links: [{ n: "IA Souveraine", u: "https://www.etalab.gouv.fr" }, { n: "Innovation Data", u: "https://www.data.gouv.fr" }, { n: "NVIDIA AI", u: "https://www.nvidia.com/fr-fr/" }], d: "Développement d'algorithmes pour les 14 pays souverains." },
    { n: "9", t: "Psychologie", links: [{ n: "Santé Mentale OMS", u: "https://www.who.int/fr" }, { n: "Performance Mentale", u: "https://www.santepubliquefrance.fr" }, { n: "Leadership Institute", u: "https://www.leadershipinstitute.org" }], d: "Neuro-performance et résilience des champions mondiaux." },
    { n: "10", t: "Épanouissement", links: [{ n: "Bien-être Global", u: "https://www.info.gouv.fr" }, { n: "Impact Social", u: "https://www.avise.org" }, { n: "Objectifs Durables", u: "https://www.un.org/sustainabledevelopment/fr/" }], d: "Équilibre entre réussite financière et harmonie humaine." }
  ];

  const changeLang = (l, msg) => {
    setLang(l); setChatResponse(msg); speak(msg, l);
  };

  const speak = (msg, lCode = lang) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(msg);
    u.lang = lCode; u.rate = 0.95;
    window.speechSynthesis.speak(u);
  };

  const processInput = (text) => {
    const input = text.toLowerCase();
    let r = "Mon expertise sur les 14 pays me permet de vous répondre avec précision. Que voulez-vous savoir ?";
    if (input.includes("créole") || input.includes("guadeloupe") || input.includes("martinique") || input.includes("guyane") || input.includes("haïti") || input.includes("réunion")) {
      r = "Le créole est une langue de résistance et d'innovation parlée de la Caraïbe à l'Océan Indien. C'est le socle de notre identité Reussitess®.";
    }
    setChatResponse(r); speak(r);
  };

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", padding: "40px 20px" }}>
        <h1 style={{ textAlign: "center", fontSize: "2.8rem", fontWeight: "900", color: "#3b82f6", marginBottom: "40px" }}>REUSSITESS® NEURO-X</h1>
        
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "35px" }}>
          
          <div style={{ background: "#0f0f0f", border: "1px solid #1e40af", borderRadius: "24px", padding: "25px" }}>
            <h3 style={{ color: "#3b82f6", marginBottom: "20px" }}>10 PILIERS STRATÉGIQUES</h3>
            {steps.map(s => (
              <button key={s.n} onClick={() => { setActiveStep(s); speak(s.d); }} style={{ width: "100%", textAlign: "left", background: activeStep?.n === s.n ? "#1e40af" : "#1a1a1a", border: "1px solid #333", color: "#fff", padding: "14px", borderRadius: "12px", marginBottom: "10px", cursor: "pointer" }}>
                <span style={{ fontWeight: "bold", color: "#3b82f6", marginRight: "10px" }}>{s.n}.</span> {s.t}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            <div style={{ background: "#0a0a0a", border: "2px solid #2563eb", borderRadius: "24px", padding: "25px" }}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "20px" }}>
                <span onClick={() => changeLang("fr-FR", "Bonjour Champion.")} style={{ fontSize: "2rem", cursor: "pointer" }} title="Français">🇫🇷</span>
                <span onClick={() => changeLang("en-US", "Hello Champion.")} style={{ fontSize: "2rem", cursor: "pointer" }} title="English">🇺🇸</span>
                <span onClick={() => changeLang("es-ES", "Hola Campeón.")} style={{ fontSize: "2rem", cursor: "pointer" }} title="Español">🇪🇸</span>
                <span onClick={() => changeLang("it-IT", "Buongiorno Campione.")} style={{ fontSize: "2rem", cursor: "pointer" }} title="Italiano">🇮🇹</span>
                <span onClick={() => changeLang("pt-BR", "Olá Campeão.")} style={{ fontSize: "2rem", cursor: "pointer" }} title="Português">🇧🇷</span>
                <span onClick={() => changeLang("de-DE", "Hallo Champion.")} style={{ fontSize: "2rem", cursor: "pointer" }} title="Deutsch">🇩🇪</span>
              </div>
              <div style={{ background: "#000", padding: "20px", borderRadius: "15px", border: "1px solid #222", minHeight: "100px" }}>
                <p style={{ fontSize: "1.1rem", color: "#ddd" }}>{chatResponse}</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); processInput(chatInput); setChatInput(""); }} style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Posez votre question..." style={{ flexGrow: 1, background: "#111", border: "1px solid #333", color: "#fff", padding: "12px", borderRadius: "10px" }} />
                <button type="submit" style={{ background: "#2563eb", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "10px", cursor: "pointer" }}>OK</button>
              </form>
            </div>

            {activeStep && (
              <div style={{ background: "#111", border: "1px solid #3b82f6", borderRadius: "24px", padding: "25px" }}>
                <h3 style={{ color: "#3b82f6", marginBottom: "12px" }}>{activeStep.t} : ANALYSE</h3>
                <p style={{ color: "#ccc", marginBottom: "20px" }}>{activeStep.d}</p>
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
    </Layout>
  );
}
