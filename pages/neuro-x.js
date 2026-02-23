async function fetchWikipedia(term) {
  try {
    const r = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`)
    const d = await r.json()
    return d.extract ? '📚 **Wikipedia :** ' + d.extract.substring(0, 300) + '...' : null
  } catch(e) { return null }
}

import Layout from "../components/Layout";
import { useState } from "react";

export default function NeuroX() {
  const [activeStep, setActiveStep] = useState(null);
  const [chatResponse, setChatResponse] = useState("Système REUSSITESS® prêt. Audit complet des 10 piliers pour les 14 pays souverains disponible.");
  const [chatInput, setChatInput] = useState("");
  const [lang, setLang] = useState("fr-FR");

  const steps = [
    { 
      n: "1", t: "Afrique", 
      links: [{ n: "BAD (Privé)", u: "https://www.afdb.org/fr/topics-and-sectors/sectors/private-sector-development" }, { n: "ZLECAF", u: "https://au-afcfta.org/fr/" }], 
      d: "Focus stratégique sur la Zone de Libre-Échange Continentale Africaine (ZLECAF). Nous analysons les flux d'investissements pour les PME et le développement des infrastructures souveraines sur le continent." 
    },
    { 
      n: "2", t: "ONU", 
      links: [{ n: "ODD 2030", u: "https://www.un.org/sustainabledevelopment/fr/" }, { n: "Pacte Mondial", u: "https://pactemondial.org" }], 
      d: "Alignement sur les 17 Objectifs de Développement Durable. Utilisation des cadres onusiens pour la diplomatie économique et l'accès aux fonds de développement internationaux." 
    },
    { 
      n: "3", t: "E-commerce", 
      links: [{ n: "Vendre en ligne", u: "https://www.economie.gouv.fr/entreprises/vendre-en-ligne" }, { n: "Amazon Seller", u: "https://sellercentral.amazon.fr" }], 
      d: "Maîtrise de la vente omnicanale. Intégration des 2 milliards de Reussitess© comme moteur de transaction pour les marchés européens, américains et africains." 
    },
    { 
      n: "4", t: "Logistique", 
      links: [{ n: "Douanes", u: "https://www.douane.gouv.fr" }, { n: "DHL Global", u: "https://www.dhl.com" }], 
      d: "Gestion du fret international, Incoterms 2020 et dédouanement numérique. Optimisation des chaînes d'approvisionnement pour les 14 pays cibles." 
    },
    { 
      n: "5", t: "Langue Créole", 
      isSpecial: true,
      d: "Le créole est une langue riche et vivante, parlée dans le monde entier. C'est le socle de la souveraineté culturelle et de l'identité des territoires Reussitess©." 
    },
    { 
      n: "6", t: "UNESCO", 
      links: [{ n: "Patrimoine Mondial", u: "https://whc.unesco.org/fr/list/" }, { n: "Patrimoine Immatériel", u: "https://ich.unesco.org/fr/home" }], 
      d: "Valorisation du soft-power. Inscription de l'excellence culturelle et artisanale au registre mondial pour augmenter la valeur immatérielle de la marque." 
    },
    { 
      n: "7", t: "INPI", 
      links: [{ n: "Protection Marque", u: "https://www.inpi.fr" }, { n: "e-Soleau", u: "https://www.inpi.fr/services-et-outils/e-soleau" }], 
      d: "Sécurisation juridique absolue des actifs Reussitess© et de l'adresse 0x69f4...1549. Protection de la propriété intellectuelle et des brevets technologiques." 
    },
    { 
      n: "8", t: "Tech/IA", 
      links: [{ n: "IA Souveraine", u: "https://www.etalab.gouv.fr" }, { n: "NVIDIA AI", u: "https://www.nvidia.com/fr-fr/" }], 
      d: "Intelligence artificielle prédictive pour l'analyse des marchés financiers. Développement d'infrastructures de données souveraines pour les 14 pays." 
    },
    { 
      n: "9", t: "Psychologie", 
      links: [{ n: "OMS (Mental)", u: "https://www.who.int/fr" }, { n: "Neuro-succès", u: "https://www.brainfacts.org" }], 
      d: "Neuro-performance : préparation mentale des leaders, gestion du stress et résilience psychologique pour atteindre la haute performance durable." 
    },
    { 
      n: "10", t: "Épanouissement", 
      links: [{ n: "Bien-être Global", u: "https://www.worldhappiness.report" }, { n: "Impact Social", u: "https://www.avise.org" }], 
      d: "Mission ultime de Reussitess© : l'équilibre parfait entre la richesse financière, la santé physique et l'impact social positif dans le monde." 
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
    let r = "Je suis l'IA NEURO-X. Je peux vous détailler chacun de nos 10 piliers stratégiques.";
    if (input.includes("créole")) r = "Le créole est notre identité. Piti a piti, zwazo ka fè nich a'y. Nous couvrons la Guadeloupe, Martinique, Guyane, Réunion et Haïti.";
    if (input.includes("guadeloupe")) r = "La Guadeloupe est un hub économique majeur. Le portail régional offre des opportunités uniques de croissance.";
    setChatResponse(r); speak(r);
  };

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", padding: "40px 20px" }}>
        <h1 style={{ textAlign: "center", fontSize: "2.8rem", fontWeight: "900", color: "#3b82f6", marginBottom: "40px" }}>REUSSITESS® NEURO-X</h1>
        
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "30px" }}>
          
          {/* PANNEAU DES 10 PILIERS */}
          <div style={{ background: "#0f0f0f", border: "1px solid #1e40af", borderRadius: "24px", padding: "25px" }}>
            <h3 style={{ color: "#3b82f6", marginBottom: "20px" }}>PROGRAMME D'EXCELLENCE</h3>
            {steps.map(s => (
              <button key={s.n} onClick={() => { setActiveStep(s); speak(s.d); }} style={{ width: "100%", textAlign: "left", background: activeStep?.n === s.n ? "#1e40af" : "#1a1a1a", border: "1px solid #333", color: "#fff", padding: "14px", borderRadius: "12px", marginBottom: "10px", cursor: "pointer" }}>
                <span style={{ fontWeight: "bold", color: "#3b82f6", marginRight: "10px" }}>{s.n}.</span> {s.t}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            {/* BOT MULTILINGUE */}
            <div style={{ background: "#0a0a0a", border: "2px solid #2563eb", borderRadius: "24px", padding: "25px" }}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginBottom: "20px" }}>
                <span onClick={() => changeLang("fr-FR", "Bonjour.")} style={{ fontSize: "2rem", cursor: "pointer" }}>🇫🇷</span>
                <span onClick={() => changeLang("en-US", "Hello.")} style={{ fontSize: "2rem", cursor: "pointer" }}>🇺🇸</span>
                <span onClick={() => changeLang("es-ES", "Hola.")} style={{ fontSize: "2rem", cursor: "pointer" }}>🇪🇸</span>
                <span onClick={() => changeLang("it-IT", "Buongiorno.")} style={{ fontSize: "2rem", cursor: "pointer" }}>🇮🇹</span>
                <span onClick={() => changeLang("pt-BR", "Olá.")} style={{ fontSize: "2rem", cursor: "pointer" }}>🇧🇷</span>
                <span onClick={() => changeLang("de-DE", "Hallo.")} style={{ fontSize: "2rem", cursor: "pointer" }}>🇩🇪</span>
              </div>
              <div style={{ background: "#000", padding: "15px", borderRadius: "12px", border: "1px solid #222" }}>
                <p style={{ color: "#ddd", fontSize: "1.1rem" }}>{chatResponse}</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); processInput(chatInput); setChatInput(""); }} style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Interroger l'IA..." style={{ flexGrow: 1, background: "#111", border: "1px solid #333", color: "#fff", padding: "12px", borderRadius: "10px" }} />
                <button type="submit" style={{ background: "#2563eb", border: "none", color: "#fff", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>OK</button>
              </form>
            </div>

            {/* AFFICHAGE DES INFOS AU CLIC */}
            {activeStep && (
              <div style={{ background: "#111", border: "1px solid #3b82f6", borderRadius: "24px", padding: "25px", animation: "fadeIn 0.5s" }}>
                <h3 style={{ color: "#3b82f6", marginBottom: "15px" }}>{activeStep.t} : ANALYSE DÉTAILLÉE</h3>
                <p style={{ color: "#eee", marginBottom: "20px", lineHeight: "1.6" }}>{activeStep.d}</p>

                {activeStep.n === "5" && (
                  <>
                    <h4 style={{ color: "#22c55e", marginBottom: "10px" }}>🌴 DOM-TOM : Opportunités, Culture et Identité</h4>
                    <ul style={{ listStyle: "none", padding: 0, marginBottom: "20px" }}>
                      <li style={{ marginBottom: "8px" }}><a href="https://www.regionguadeloupe.fr/aides-et-services/toutes-les-aides/" target="_blank" style={{ color: "#ccc", textDecoration: "none" }}><strong style={{ color: "#22c55e" }}>Guadeloupe :</strong> Région et opportunités économiques ➜</a></li>
                      <li style={{ marginBottom: "8px" }}><a href="https://www.martinique.org" target="_blank" style={{ color: "#ccc", textDecoration: "none" }}><strong style={{ color: "#22c55e" }}>Martinique :</strong> Tourisme et patrimoine ➜</a></li>
                      <li style={{ marginBottom: "8px" }}><a href="https://www.guyane.cci.fr" target="_blank" style={{ color: "#ccc", textDecoration: "none" }}><strong style={{ color: "#22c55e" }}>Guyane :</strong> Guides économiques (CCI) ➜</a></li>
                      <li style={{ marginBottom: "8px" }}><a href="https://www.regionreunion.com/economie" target="_blank" style={{ color: "#ccc", textDecoration: "none" }}><strong style={{ color: "#22c55e" }}>La Réunion :</strong> Investissements et croissance ➜</a></li>
                    </ul>
                    <h4 style={{ color: "#a855f7", marginBottom: "10px" }}>🗣️ Langue et Culture Créoles</h4>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      <li style={{ marginBottom: "8px" }}><a href="https://www.potomitan.info" target="_blank" style={{ color: "#ccc", textDecoration: "none" }}><strong style={{ color: "#a855f7" }}>Potomitan :</strong> Dictionnaire créole ➜</a></li>
                      <li style={{ marginBottom: "8px" }}><a href="https://www.lexilogos.com/creole_dictionnaire.htm" target="_blank" style={{ color: "#ccc", textDecoration: "none" }}><strong style={{ color: "#a855f7" }}>Lexilogos :</strong> Portail ressources ➜</a></li>
                    </ul>
                  </>
                )}

                {!activeStep.isSpecial && activeStep.links && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {activeStep.links.map((link, idx) => (
                      <a key={idx} href={link.u} target="_blank" rel="noopener noreferrer" style={{ background: "#000", padding: "12px", borderRadius: "10px", border: "1px solid #3b82f6", color: "#fff", textDecoration: "none", fontWeight: "bold", textAlign: "center" }}>
                        {link.n} ➜
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{` @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } `}</style>
    </Layout>
  );
}
