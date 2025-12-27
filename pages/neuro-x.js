import Layout from "../components/Layout";
import { useState } from "react";

export default function NeuroX() {
  const [chatResponse, setChatResponse] = useState("On bèl bonjou! Je suis NEURO-BOT. 'Piti a piti, zwazo ka fè nich a'y'. Je suis là pour bâtir votre empire avec vous, étape par étape. Que faisons-nous aujourd'hui ?");
  const [chatInput, setChatInput] = useState("");
  const [lang, setLang] = useState("fr-FR");

  const steps = [
    { n: "1", t: "Opportunités Afrique (BAD)", u: "https://www.afdb.org/fr" },
    { n: "2", t: "Aide Internationale (ONU)", u: "https://www.un.org/fr" },
    { n: "3", t: "Boutique en Ligne (Commerce)", u: "https://www.economie.gouv.fr" },
    { n: "4", t: "Logistique Mondiale (Douanes)", u: "https://www.douane.gouv.fr" },
    { n: "5", t: "Identité & Langue (CNRS)", u: "https://www.cnrs.fr" },
    { n: "6", t: "Patrimoine Caraïbe (UNESCO)", u: "https://whc.unesco.org" },
    { n: "7", t: "Propriété Intellectuelle (INPI)", u: "https://www.inpi.fr" },
    { n: "8", t: "Innovation & IA (Etalab)", u: "https://www.etalab.gouv.fr" },
    { n: "9", t: "Dépassement de Soi (OMS)", u: "https://www.who.int/fr" },
    { n: "10", t: "Épanouissement (ODD)", u: "https://www.un.org/sustainabledevelopment/fr/" }
  ];

  const responses = {
    guadeloupe: [
      "Respect Champion! 'Sa ki ta-w, dlo pa ka chayé-y'. Votre destin est entre vos mains, et je suis là pour le sécuriser.",
      "La Guadeloupe produit des génies. 'Koulèv ki vlé grandi ka rété nan tou a-y' : restons concentrés sur notre croissance interne.",
      "Gwadloup sé tè a chanypon. Je ressens la force de nos ancêtres dans votre projet. Avançons avec dignité."
    ],
    success: [
      "L'excellence demande de la patience. 'Pasans sé rimèd a tout maladi'. Votre succès se construit avec précision.",
      "Innover, c'est oser. 'Si ou pa bat tanbou, ou pa ka dansé'. Battons le tambour du succès mondial ensemble.",
      "La réussite est un marathon. 'Chyen ni kat pat, mé i pa ka pran kat chimen'. Restons focalisés sur votre objectif principal."
    ],
    action: [
      "Il est temps d'agir. 'Sé an mizi an mizi moun ka vini mèt a kaz'. Chaque petite action aujourd'hui construit votre palais de demain.",
      "N'ayez pas peur de l'ampleur de la tâche. 'Dèyè mòn, ni mòn'. Chaque obstacle franchi vous rend plus fort."
    ]
  };

  const handleChat = (e) => {
    e.preventDefault();
    const input = chatInput.toLowerCase();
    let reply = "";

    if (input.includes("guadeloupe") || input.includes("971") || input.includes("champion")) {
      reply = responses.guadeloupe[Math.floor(Math.random() * responses.guadeloupe.length)];
    } else if (input.includes("succès") || input.includes("réussite") || input.includes("stratégie")) {
      reply = responses.success[Math.floor(Math.random() * responses.success.length)];
    } else if (input.includes("faire") || input.includes("action") || input.includes("commencer")) {
      reply = responses.action[Math.floor(Math.random() * responses.action.length)];
    } else {
      reply = "Votre vision m'intéresse. 'Pawòl an bouch pa chaj'. Passons à l'action concrète via nos 10 piliers d'excellence.";
    }

    setChatResponse(reply);
    setChatInput("");
  };

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(chatResponse);
    utterance.lang = lang;
    utterance.pitch = 1.0;
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", padding: "2rem 1rem", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          <header style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 style={{ fontSize: "clamp(2rem, 8vw, 4rem)", fontWeight: "900", color: "#2563eb", textShadow: "0 0 20px rgba(37, 99, 235, 0.3)" }}>REUSSITESS® NEURO-X</h1>
            <p style={{ color: "#3b82f6", fontWeight: "bold", letterSpacing: "3px" }}>L'EXCELLENCE • L'INNOVATION • LE SUCCÈS</p>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem" }}>
            
            <div style={{ border: "1px solid #1e40af", borderRadius: "24px", padding: "1.5rem", background: "rgba(30, 64, 175, 0.05)" }}>
              <h3 style={{ color: "#3b82f6", marginBottom: "1.5rem", textAlign: "center", fontSize: "1.1rem" }}>LE PLAN DES CHAMPIONS</h3>
              {steps.map(s => (
                <a key={s.n} href={s.u} target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#111", padding: "12px", borderRadius: "12px", marginBottom: "8px", color: "#fff", textDecoration: "none", border: "1px solid #222", fontSize: "0.9rem", transition: "0.3s" }}>
                  <span style={{ color: "#2563eb", fontWeight: "bold", marginRight: "10px" }}>{s.n}.</span> {s.t}
                </a>
              ))}
            </div>

            <div style={{ background: "#0a0a0a", border: "2px solid #2563eb", borderRadius: "24px", padding: "2rem", display: "flex", flexDirection: "column", boxShadow: "0 25px 60px rgba(37, 99, 235, 0.15)" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "1.5rem" }}>
                {["🇫🇷", "🇺🇸", "🇬🇵", "🇧🇷", "🇩🇪", "🇮🇹", "🇨🇳"].map((f, i) => (
                  <span key={i} style={{ fontSize: "1.5rem", cursor: "pointer" }}>{f}</span>
                ))}
              </div>

              <div style={{ flexGrow: 1, padding: "1.8rem", border: "1px solid #333", borderRadius: "20px", background: "linear-gradient(145deg, #0f172a, #000)", marginBottom: "1.5rem", position: "relative" }}>
                <p style={{ fontSize: "1.15rem", lineHeight: "1.6", color: "#f1f5f9", fontStyle: "italic" }}>"{chatResponse}"</p>
                <button onClick={speak} style={{ position: "absolute", bottom: "15px", right: "15px", background: "#2563eb", border: "none", borderRadius: "50%", width: "45px", height: "45px", cursor: "pointer", color: "#fff", boxShadow: "0 0 15px rgba(37, 99, 235, 0.4)" }}>🔊</button>
              </div>

              <form onSubmit={handleChat} style={{ display: "flex", gap: "10px" }}>
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Échangez avec votre allié..." style={{ flexGrow: 1, padding: "15px", borderRadius: "15px", border: "1px solid #333", background: "#111", color: "#fff", fontSize: "1rem" }} />
                <button type="submit" style={{ background: "#2563eb", color: "#fff", border: "none", padding: "0 30px", borderRadius: "15px", cursor: "pointer", fontWeight: "bold" }}>ENVOYER</button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
