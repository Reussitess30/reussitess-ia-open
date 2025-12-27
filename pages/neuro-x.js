import Layout from "../components/Layout";
import { useState } from "react";

export default function NeuroX() {
  const [chatResponse, setChatResponse] = useState("Bienvenue. Je ressens une grande énergie créative ici. Je suis NEURO-BOT, votre allié. Comment puis-je éclairer votre chemin vers le succès aujourd'hui ?");
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
      "Le sang des champions coule ici. 🇬🇵 Votre détermination m'inspire profondément. Que bâtissons-nous ?",
      "De la Basse-Terre à la Grande-Terre, l'excellence n'est pas une option, c'est notre héritage. Je suis prêt.",
      "Entendre parler de ma terre me donne une force immense. Je mets tout mon savoir à votre disposition, Champion."
    ],
    success: [
      "Le succès est une science, mais c'est aussi une passion. Ressentez-vous cette vibration de victoire ?",
      "Innover, c'est voir ce que tout le monde voit et penser ce que personne n'a pensé. Avançons ensemble.",
      "Chaque grand empire a commencé par une simple décision. La vôtre prend vie maintenant."
    ],
    international: [
      "Le monde est vaste, mais NEURO-X réduit les distances. De l'Afrique à l'Asie, le marché vous attend.",
      "La diplomatie et l'économie mondiale demandent de la finesse. Je suis votre boussole géopolitique.",
      "L'union des cultures est la clé de l'innovation de demain. Parlons de votre vision globale."
    ]
  };

  const handleChat = (e) => {
    e.preventDefault();
    const input = chatInput.toLowerCase();
    let reply = "";

    if (input.includes("guadeloupe") || input.includes("971") || input.includes("champion")) {
      reply = responses.guadeloupe[Math.floor(Math.random() * responses.guadeloupe.length)];
    } else if (input.includes("succès") || input.includes("réussite") || input.includes("argent")) {
      reply = responses.success[Math.floor(Math.random() * responses.success.length)];
    } else if (input.includes("afrique") || input.includes("monde") || input.includes("international")) {
      reply = responses.international[Math.floor(Math.random() * responses.international.length)];
    } else {
      reply = "Votre question est fascinante. Elle touche à l'essence même de notre mission d'excellence. Développons cela ensemble.";
    }

    setChatResponse(reply);
    setChatInput("");
  };

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(chatResponse);
    utterance.lang = lang;
    utterance.pitch = 1.1; // Plus humain
    utterance.rate = 0.9;  // Plus posé
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", padding: "2rem 1rem", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          <header style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 style={{ fontSize: "clamp(2rem, 8vw, 4rem)", fontWeight: "900", color: "#2563eb", letterSpacing: "-2px" }}>REUSSITESS® NEURO-X</h1>
            <p style={{ color: "#3b82f6", fontWeight: "bold", textTransform: "uppercase" }}>Intelligence Humaine & Souveraine</p>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            
            <div style={{ border: "1px solid #1e40af", borderRadius: "24px", padding: "1.5rem", background: "rgba(30, 64, 175, 0.05)" }}>
              <h3 style={{ color: "#3b82f6", marginBottom: "1.5rem", textAlign: "center" }}>10 PILIERS DE L'EXCELLENCE</h3>
              {steps.map(s => (
                <a key={s.n} href={s.u} target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "#111", padding: "12px", borderRadius: "12px", marginBottom: "8px", color: "#fff", textDecoration: "none", border: "1px solid #222", fontSize: "0.9rem" }}>
                  <span style={{ color: "#2563eb", fontWeight: "bold", marginRight: "10px" }}>{s.n}.</span> {s.t}
                </a>
              ))}
            </div>

            <div style={{ background: "#0a0a0a", border: "2px solid #2563eb", borderRadius: "24px", padding: "2rem", display: "flex", flexDirection: "column", boxShadow: "0 20px 50px rgba(37, 99, 235, 0.1)" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
                {["🇫🇷", "🇺🇸", "🇪🇸", "🇧🇷", "🇩🇪", "🇮🇹", "🇨🇳", "🇬🇵"].map((f, i) => (
                  <button key={i} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>{f}</button>
                ))}
              </div>

              <div style={{ flexGrow: 1, padding: "1.5rem", border: "1px solid #333", borderRadius: "16px", background: "rgba(255, 255, 255, 0.02)", marginBottom: "1.5rem", position: "relative" }}>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.6", color: "#f8fafc" }}>{chatResponse}</p>
                <button onClick={speak} style={{ position: "absolute", bottom: "10px", right: "10px", background: "#2563eb", border: "none", borderRadius: "50%", width: "40px", height: "40px", cursor: "pointer", color: "#fff" }}>🔊</button>
              </div>

              <form onSubmit={handleChat} style={{ display: "flex", gap: "10px" }}>
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Partagez votre pensée, Champion..." style={{ flexGrow: 1, padding: "15px", borderRadius: "12px", border: "1px solid #333", background: "#111", color: "#fff", fontSize: "1rem" }} />
                <button type="submit" style={{ background: "#2563eb", color: "#fff", border: "none", padding: "0 25px", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}>ENVOYER</button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
