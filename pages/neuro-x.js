import Layout from "../components/Layout";
import { useState } from "react";

export default function NeuroX() {
  const [activeStep, setActiveStep] = useState(null);
  const [chatResponse, setChatResponse] = useState("Système REUSSITESS® opérationnel. Posez-moi vos questions sur nos 10 piliers stratégiques pour les 14 pays.");
  const [chatInput, setChatInput] = useState("");
  const [lang, setLang] = useState("fr-FR");

  const steps = [
    { 
      n: "1", t: "Afrique", 
      links: [
        { n: "BAD (Secteur Privé)", u: "https://www.afdb.org/fr/topics-and-sectors/sectors/private-sector-development" },
        { n: "Portail ZLECAF", u: "https://au-afcfta.org/fr/" }
      ],
      d: "L'Afrique représente un marché de 1,3 milliard de personnes. Notre stratégie s'appuie sur la ZLECAF pour réduire les barrières douanières et sur les financements de la BAD pour soutenir les PME souveraines et l'industrialisation locale." 
    },
    { 
      n: "2", t: "ONU", 
      links: [
        { n: "Agenda 2030 (ODD)", u: "https://www.agenda-2030.fr/17-objectifs-de-developpement-durable/" },
        { n: "Pacte Mondial ONU", u: "https://pactemondial.org" }
      ],
      d: "Alignement total sur les 17 Objectifs de Développement Durable. Nous utilisons le cadre onusien pour garantir une croissance éthique, la protection du climat et l'accès aux fonds de développement internationaux." 
    },
    { 
      n: "3", t: "E-commerce", 
      links: [
        { n: "Vendre en ligne (Gouv)", u: "https://www.economie.gouv.fr/entreprises/vendre-en-ligne" },
        { n: "Stratégies Cross-border", u: "https://entreprendre.service-public.gouv.fr" }
      ],
      d: "Ingénierie du commerce numérique : optimisation des tunnels de vente, logistique du dernier kilomètre et intégration des 2 milliards de Reussitess© comme moteur de transaction globale sécurisée." 
    },
    { 
      n: "4", t: "Logistique", 
      links: [
        { n: "Douanes (Bases)", u: "https://www.douane.gouv.fr/fiche/les-fondamentaux-du-dedouanement" },
        { n: "Port Caraïbes (Jarry)", u: "http://www.guadeloupe-portcaraibes.com" }
      ],
      d: "Maîtrise des flux : Incoterms 2020, dédouanement numérique et exploitation du hub de Jarry en Guadeloupe comme pont logistique entre l'Europe, l'Afrique et les Amériques." 
    },
    { 
      n: "5", t: "Langue Créole", 
      links: [
        { n: "Dictionnaire (CNRS)", u: "https://www.cnrs.fr/fr/actualite/les-langues-creoles-un-laboratoire-pour-la-linguistique" },
        { n: "Patrimoine (Ministère)", u: "https://www.culture.gouv.fr/Thematiques/Langues-de-France/Agir-pour-les-langues/Les-langues-creoles" }
      ],
      d: "Souveraineté linguistique : 'Sa ki ta-w, dlo pa ka chayé-y'. Le Créole est traité comme un actif culturel majeur. Nous collaborons avec les instances académiques pour valoriser cette identité dans le business mondial." 
    },
    { 
      n: "6", t: "UNESCO", 
      links: [
        { n: "Patrimoine Mondial", u: "https://whc.unesco.org/fr/list/" },
        { n: "Patrimoine Immatériel", u: "https://ich.unesco.org/fr/home" }
      ],
      d: "Expertise en Soft-Power. Nous inscrivons l'excellence caribéenne dans le registre du patrimoine mondial pour accroître la valeur immatérielle de nos projets et attirer le tourisme de haut niveau." 
    },
    { 
      n: "7", t: "INPI", 
      links: [
        { n: "Protéger ses idées", u: "https://www.inpi.fr/ressources/propriete-intellectuelle/droit-dauteur" },
        { n: "e-Soleau (Preuve)", u: "https://www.inpi.fr/services-et-outils/e-soleau" }
      ],
      d: "Protection juridique totale. Utilisation de l'e-Soleau pour horodater les créations Reussitess© et sécurisation des actifs intellectuels liés à l'adresse 0x69f4...1549." 
    },
    { 
      n: "8", t: "Tech/IA", 
      links: [
        { n: "IA Souveraine", u: "https://www.etalab.gouv.fr/intelligence-artificielle" },
        { n: "Infrastructures IA", u: "https://www.data.gouv.fr" }
      ],
      d: "IA générative et prédictive appliquée aux marchés des 14 pays. Nous développons des algorithmes propriétaires pour analyser les tendances de consommation et optimiser les revenus en Reussitess©." 
    },
    { 
      n: "9", t: "Psychologie", 
      links: [
        { n: "Santé Mentale (OMS)", u: "https://www.who.int/fr/news-room/fact-sheets/detail/mental-health-strengthening-our-response" },
        { n: "Performance Mentale", u: "https://www.santepubliquefrance.fr/maladies-et-traumatismes/sante-mentale" }
      ],
      d: "Neuro-performance : Gestion du stress, résilience et psychologie du succès. Selon l'OMS, la santé mentale est le socle de toute réussite durable pour un leader ou un champion." 
    },
    { 
      n: "10", t: "Épanouissement", 
      links: [
        { n: "Bien-être (Info Gouv)", u: "https://www.info.gouv.fr/grand-dossier/parlons-sante-mentale" },
        { n: "Impact Social", u: "https://www.avise.org" }
      ],
      d: "Conclusion du cycle : l'épanouissement est l'équilibre entre la richesse financière et l'impact social. C'est la mission ultime de REUSSITESS© pour chaque individu dans nos 14 pays." 
    }
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
    let r = "Je connais parfaitement ce domaine. Quel aspect des 14 pays souhaitez-vous approfondir ?";
    
    if (input.includes("afrique")) r = "L'Afrique est le futur. Avec la ZLECAF et le soutien de la BAD, nous bâtissons des ponts commerciaux solides.";
    if (input.includes("créole")) r = "Le Créole est notre force identitaire. 'Piti a piti, zwazo ka fè nich a'y'. Nous protégeons cette langue comme un trésor.";
    if (input.includes("0x69f4")) r = "Cette adresse est le cœur financier de Reussitess©, sécurisant 2 milliards d'unités pour notre expansion.";
    if (input.includes("guadeloupe")) r = "La Guadeloupe est notre socle, le hub logistique et culturel vers le monde entier.";
    
    setChatResponse(r); speak(r);
  };

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", padding: "40px 20px" }}>
        <h1 style={{ textAlign: "center", fontSize: "3rem", fontWeight: "900", color: "#3b82f6", marginBottom: "50px" }}>REUSSITESS® NEURO-X</h1>
        
        <div style={{ maxWidth: "1300px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "40px" }}>
          
          <div style={{ background: "#0f0f0f", border: "1px solid #1e40af", borderRadius: "24px", padding: "30px" }}>
            <h3 style={{ color: "#3b82f6", marginBottom: "25px" }}>PROGRAMME D'EXCELLENCE</h3>
            {steps.map(s => (
              <button key={s.n} onClick={() => { setActiveStep(s); speak(s.d); }} style={{ width: "100%", textAlign: "left", background: activeStep?.n === s.n ? "#1e40af" : "#1a1a1a", border: "1px solid #333", color: "#fff", padding: "16px", borderRadius: "12px", marginBottom: "12px", cursor: "pointer", fontSize: "1rem" }}>
                <span style={{ fontWeight: "bold", color: "#3b82f6", marginRight: "10px" }}>{s.n}.</span> {s.t}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <div style={{ background: "#0a0a0a", border: "2px solid #2563eb", borderRadius: "24px", padding: "30px" }}>
              <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginBottom: "25px" }}>
                <span onClick={() => changeLang("fr-FR", "Bonjour. Je suis votre expert Reussitess.")} style={{ fontSize: "2.5rem", cursor: "pointer" }}>🇫🇷</span>
                <span onClick={() => changeLang("en-US", "Hello. I am your Reussitess expert.")} style={{ fontSize: "2.5rem", cursor: "pointer" }}>🇺🇸</span>
              </div>
              <div style={{ background: "#000", padding: "20px", borderRadius: "15px", border: "1px solid #222", minHeight: "120px" }}>
                <p style={{ fontSize: "1.2rem", color: "#ddd", fontWeight: "500" }}>{chatResponse}</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); processInput(chatInput); setChatInput(""); }} style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Posez une question à l'IA..." style={{ flexGrow: 1, background: "#111", border: "1px solid #333", color: "#fff", padding: "15px", borderRadius: "12px" }} />
                <button type="submit" style={{ background: "#2563eb", color: "#fff", border: "none", padding: "15px 25px", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>ENVOYER</button>
              </form>
            </div>

            {activeStep && (
              <div style={{ background: "#111", border: "1px solid #3b82f6", borderRadius: "24px", padding: "30px" }}>
                <h3 style={{ color: "#3b82f6", marginBottom: "15px" }}>{activeStep.t} : ANALYSE & SOURCES</h3>
                <p style={{ color: "#eee", marginBottom: "25px", fontSize: "1.05rem", lineHeight: "1.6" }}>{activeStep.d}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {activeStep.links.map((link, idx) => (
                    <a key={idx} href={link.u} target="_blank" rel="noopener noreferrer" style={{ background: "#000", padding: "18px", borderRadius: "12px", border: "1px solid #2563eb", color: "#fff", textDecoration: "none", fontWeight: "bold", textAlign: "center" }}>
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
