import Layout from "../components/Layout";
import Link from "next/link";
import { useState } from "react";

export default function NeuroX() {
  const [activeStep, setActiveStep] = useState(null);
  const [chatResponse, setChatResponse] = useState("Système NEURO-X opérationnel. Base de 1000 axes chargée. Je suis prêt à analyser vos stratégies pour les 14 pays souverains.");
  const [chatInput, setChatInput] = useState("");
  const [lang, setLang] = useState("fr-FR");

  const steps = [
    { 
      n: "1", t: "Afrique", u: "https://www.afdb.org/fr/topics-and-sectors/sectors/private-sector-development", 
      d: "L'axe Afrique intègre les mécanismes de la ZLECAF (Zone de Libre-Échange Continentale Africaine) et les instruments financiers de la BAD. Il couvre la restructuration industrielle, le financement des PME souveraines et l'expansion des marchés de consommation entre Lagos, Kinshasa et Nairobi." 
    },
    { 
      n: "2", t: "ONU", u: "https://www.un.org/sustainabledevelopment/fr/objectifs-de-developpement-durable/", 
      d: "Cadre normatif mondial basé sur les 17 Objectifs de Développement Durable (ODD). Cet axe traite de la diplomatie climatique, du droit international humanitaire et des fonds de développement mondiaux pour stabiliser les économies en transition." 
    },
    { 
      n: "3", t: "E-commerce", u: "https://www.economie.gouv.fr/entreprises/vendre-en-ligne", 
      d: "Ingénierie du commerce numérique global : logistique du 'dernier kilomètre', plateformes de paiement sécurisées (Stripe, PayPal), optimisation fiscale du dropshipping légal et stratégies d'acquisition client via l'IA marketing sur les 14 pays." 
    },
    { 
      n: "4", t: "Logistique", u: "https://www.douane.gouv.fr/fiche/les-fondamentaux-du-dedouanement", 
      d: "Maîtrise des flux de marchandises : Incoterms 2020, gestion des entrepôts sous douane, optimisation du fret aérien et maritime depuis le port de Jarry vers les hubs mondiaux comme Singapour ou le Canada." 
    },
    { 
      n: "5", t: "Langue Créole", u: "https://www.potomitan.info/", 
      d: "Souveraineté linguistique et culturelle : Potomitan est la référence académique pour la promotion des cultures créoles. Cet axe explore la sémantique, l'histoire et l'utilisation du Créole comme vecteur d'innovation identitaire." 
    },
    { 
      n: "6", t: "UNESCO", u: "https://whc.unesco.org/fr/list/", 
      d: "Expertise en patrimoine mondial : Protection des sites d'exception, valorisation du patrimoine immatériel et économie de la culture. Une stratégie de soft-power pour faire rayonner l'excellence caribéenne." 
    },
    { 
      n: "7", t: "INPI", u: "https://www.inpi.fr/proteger-vos-creations", 
      d: "Bouclier juridique Reussitess© : Dépôts de brevets, protection des dessins et modèles, et enregistrement de marques auprès de l'adresse 0x69f4...1549. Sécurisation totale de l'actif immatériel." 
    },
    { 
      n: "8", t: "Tech/IA", u: "https://www.etalab.gouv.fr/intelligence-artificielle", 
      d: "Déploiement de l'intelligence artificielle souveraine : Machine Learning, traitement du langage naturel (NLP), éthique des algorithmes et infrastructures Cloud pour les 2 milliards de Reussitess©." 
    },
    { 
      n: "9", t: "Psychologie", u: "https://www.who.int/fr/news-room/fact-sheets/detail/mental-health-strengthening-our-response", 
      d: "Neuro-performance et résilience : Études sur la psychologie du succès, la gestion du stress en haute performance et les protocoles de santé mentale de l'OMS pour les leaders et champions." 
    },
    { 
      n: "10", t: "Épanouissement", u: "https://www.un.org/sustainabledevelopment/fr/objectifs-de-developpement-durable/", 
      d: "Vision holistique du succès : Alignement de la richesse financière avec le bien-être social, environnemental et spirituel. C'est l'étape finale du cycle de réussite NEURO-X." 
    }
  ];

  const speak = (msg) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(msg);
    u.lang = lang; u.rate = 0.95;
    window.speechSynthesis.speak(u);
  };

  const processInput = (text) => {
    const input = text.toLowerCase();
    let r = "Mon analyse giga-base sur les 14 pays (France, Angleterre, Italie, Allemagne, Suède, Singapour, Australie, Espagne, Brésil, Royaume-Uni, Inde, Nouvelle-Zélande, USA, Canada) suggère une approche multidimensionnelle.";
    
    if (input.includes("guadeloupe") || input.includes("champion")) {
      r = "Respect Champion ! En Guadeloupe, nous bâtissons l'avenir. 'Sa ki ta-w, dlo pa ka chayé-y'. Le projet Reussitess© est sécurisé sur l'adresse 0x69f4... et prêt pour l'exportation mondiale.";
    } else if (input.includes("créole")) {
      r = "Le Créole n'est pas qu'une langue, c'est une technologie de communication ancestrale et moderne. L'étape 5 via Potomitan vous donne les outils pour l'intégrer à votre marque.";
    }
    setChatResponse(r); speak(r);
  };

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", padding: "10px", fontFamily: "sans-serif" }}>
        
        {/* BOUTON ACCUEIL DISCRET */}
        <div style={{ position: "absolute", top: "15px", left: "15px", zIndex: 10 }}>
          <Link href="/"><button style={{ background: "#222", border: "1px solid #444", color: "#aaa", padding: "5px 12px", borderRadius: "5px", fontSize: "0.8rem", cursor: "pointer" }}>🏠 ACCUEIL</button></Link>
        </div>

        <div style={{ maxWidth: "1300px", margin: "0 auto", paddingTop: "50px" }}>
          <h1 style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: "900", color: "#3b82f6", marginBottom: "30px" }}>REUSSITESS® NEURO-X</h1>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "20px" }}>
            
            {/* PANNEAU GAUCHE : LES 10 TITRES */}
            <div style={{ background: "#0f0f0f", border: "1px solid #1e40af", borderRadius: "20px", padding: "20px" }}>
              <h3 style={{ color: "#3b82f6", marginBottom: "15px", fontSize: "1rem" }}>PROGRAMME D'EXCELLENCE</h3>
              {steps.map(s => (
                <button key={s.n} onClick={() => { setActiveStep(s); speak(s.d); }} style={{ width: "100%", textAlign: "left", background: activeStep?.n === s.n ? "#1e40af" : "#1a1a1a", border: "1px solid #333", color: "#fff", padding: "12px", borderRadius: "10px", marginBottom: "8px", cursor: "pointer", fontSize: "0.9rem" }}>
                  <span style={{ fontWeight: "bold", color: "#3b82f6" }}>{s.n}.</span> {s.t}
                </button>
              ))}
            </div>

            {/* PANNEAU DROITE : BOT & INFOS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* INTERFACE DU BOT */}
              <div style={{ background: "#0a0a0a", border: "2px solid #2563eb", borderRadius: "20px", padding: "20px" }}>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "15px" }}>
                  {["🇫🇷", "🇺🇸", "🇬🇵", "🇧🇷", "🇮🇳", "🇨🇦"].map((f, i) => (
                    <span key={i} onClick={() => setLang("fr-FR")} style={{ fontSize: "1.5rem", cursor: "pointer" }}>{f}</span>
                  ))}
                </div>
                <div style={{ background: "#000", padding: "15px", borderRadius: "12px", border: "1px solid #222", minHeight: "120px", position: "relative" }}>
                  <p style={{ fontSize: "0.95rem", lineHeight: "1.5", color: "#ddd" }}>{chatResponse}</p>
                  <button onClick={() => speak(chatResponse)} style={{ position: "absolute", bottom: "10px", right: "10px", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>🔊</button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); processInput(chatInput); setChatInput(""); }} style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Interroger NEURO-X..." style={{ flexGrow: 1, background: "#111", border: "1px solid #333", color: "#fff", padding: "12px", borderRadius: "10px" }} />
                  <button type="submit" style={{ background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>OK</button>
                </form>
              </div>

              {/* AFFICHAGE DES LIENS ET INFOS DÉTAILLÉES */}
              {activeStep && (
                <div style={{ background: "#111", border: "1px solid #3b82f6", borderRadius: "20px", padding: "20px", animation: "fadeIn 0.5s" }}>
                  <h3 style={{ color: "#3b82f6", marginBottom: "10px" }}>{activeStep.t}</h3>
                  <p style={{ fontSize: "0.9rem", color: "#ccc", marginBottom: "15px" }}>{activeStep.d}</p>
                  <div style={{ background: "#000", padding: "15px", borderRadius: "10px", border: "1px solid #2563eb" }}>
                    <p style={{ color: "#3b82f6", fontSize: "0.7rem", marginBottom: "5px" }}>SOURCE OFFICIELLE VÉRIFIÉE :</p>
                    <a href={activeStep.u} target="_blank" rel="noopener noreferrer" style={{ color: "#fff", fontWeight: "bold", fontSize: "1rem", wordBreak: "break-all" }}>{activeStep.u} ➜</a>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      <style jsx>{` @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } `}</style>
    </Layout>
  );
}
