import Layout from "../components/Layout";
import { useState, useEffect, useRef } from "react";

export default function NeuroX() {
  const [chatResponse, setChatResponse] = useState("On bèl bonjou Champion! Je suis NEURO-BOT. Je suis activé avec ma base de données globale. Parlez-moi ou écrivez-moi, je suis prêt à servir votre vision.");
  const [chatInput, setChatInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [history, setHistory] = useState([]);

  // Base de connaissance étendue (Simulation de +500 concepts via logique catégorielle)
  const knowledgeBase = {
    caribbean: ["guadeloupe", "971", "créole", "antilles", "caraïbes", "héritage", "champion", "fierté", "racines", "mémorial acte", "identite"],
    business: ["boutique", "shopify", "e-commerce", "profit", "strategie", "marketing", "vente", "export", "logistique", "dhl", "douane", "finance", "investissement", "bad"],
    tech: ["innovation", "ia", "intelligence artificielle", "neuro", "code", "digital", "données", "etalab", "cybersecurite", "blockchain", "algorithme"],
    mindset: ["succès", "reussite", "motivation", "discipline", "psychologie", "mental", "depassement", "force", "vision", "leadership", "bonheur", "epanouissement"],
    global: ["afrique", "monde", "onu", "international", "zlecaf", "exportation", "diplomatie", "geopolitique", "partenariat"]
  };

  const proverbs = [
    "Sa ki ta-w, dlo pa ka chayé-y.",
    "Piti a piti, zwazo ka fè nich a'y.",
    "Pasans sé rimèd a tout maladi.",
    "Dèyè mòn, ni mòn.",
    "Chyen ni kat pat, mé i pa ka pran kat chimen."
  ];

  // Fonction de Reconnaissance Vocale (Microphone)
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportée par votre navigateur.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(transcript);
      processInput(transcript);
    };
    recognition.start();
  };

  // Traitement Intelligent de la réponse
  const processInput = (text) => {
    const input = text.toLowerCase();
    let reply = "Votre réflexion est profonde. Analysons comment transformer cette idée en succès via nos 10 piliers.";

    if (knowledgeBase.caribbean.some(word => input.includes(word))) {
      reply = `Respect Champion de Guadeloupe! 🇬🇵 ${proverbs[Math.floor(Math.random() * proverbs.length)]} Votre culture est votre plus grand levier d'innovation.`;
    } else if (knowledgeBase.business.some(word => input.includes(word))) {
      reply = "L'économie mondiale est un jeu d'échecs. Entre l'Afrique et la Caraïbe, nous devons structurer votre logistique et votre présence digitale. Consultez l'étape 3 et 4.";
    } else if (knowledgeBase.tech.some(word => input.includes(word))) {
      reply = "L'IA NEURO-X est conçue pour l'excellence. Nous intégrons les données mondiales pour vous donner une longueur d'avance technologique.";
    } else if (knowledgeBase.mindset.some(word => input.includes(word))) {
      reply = "Le succès commence dans l'esprit. Sans discipline, le talent n'est qu'un mirage. Maîtrisez votre psychologie via l'étape 9.";
    }

    setChatResponse(reply);
    setHistory([...history, { q: text, r: reply }]);
    speak(reply);
  };

  const speak = (msg) => {
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (chatInput.trim()) processInput(chatInput);
    setChatInput("");
  };

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: "#020617", color: "#f8fafc", padding: "2rem 1rem", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          <header style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)", fontWeight: "900", color: "#3b82f6", textShadow: "0 0 30px rgba(59, 130, 246, 0.4)" }}>REUSSITESS® NEURO-X</h1>
            <p style={{ letterSpacing: "5px", color: "#60a5fa", fontWeight: "bold", textTransform: "uppercase" }}>L'Excellence Suprême • Guadeloupe 971</p>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2.5rem" }}>
            
            {/* PANNEAU DES 10 PILIERS */}
            <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid #1e40af", borderRadius: "30px", padding: "2rem", backdropFilter: "blur(10px)" }}>
              <h3 style={{ color: "#3b82f6", marginBottom: "1.5rem", fontWeight: "bold", textAlign: "center" }}>HÉLICE DE DIRECTION (1-10)</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {["Afrique", "ONU", "E-commerce", "Logistique", "Langue Créole", "UNESCO", "INPI", "Tech/IA", "Psychologie", "Épanouissement"].map((t, i) => (
                  <div key={i} style={{ padding: "12px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", fontSize: "0.9rem", color: "#94a3b8" }}>
                    <span style={{ color: "#3b82f6", fontWeight: "bold" }}>{i+1}.</span> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* NEURO-BOT SUPRÊME */}
            <div style={{ background: "linear-gradient(145deg, #1e293b, #020617)", border: "2px solid #3b82f6", borderRadius: "30px", padding: "2.5rem", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <span style={{ padding: "5px 15px", background: "#1e40af", borderRadius: "20px", fontSize: "0.7rem", fontWeight: "bold" }}>CERVEAU MONDIAL ACTIF</span>
              </div>

              <div style={{ minHeight: "200px", padding: "1.5rem", background: "rgba(0,0,0,0.3)", borderRadius: "20px", border: "1px solid #1e3a8a", marginBottom: "1.5rem" }}>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.6", fontStyle: "italic", color: "#e2e8f0" }}>{chatResponse}</p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button type="button" onClick={startListening} style={{ background: isListening ? "#ef4444" : "#1e40af", border: "none", borderRadius: "50%", width: "50px", height: "50px", cursor: "pointer", fontSize: "1.5rem", transition: "0.3s" }}>
                  {isListening ? "🛑" : "🎤"}
                </button>
                <input 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)} 
                  placeholder="Posez votre question vocale ou écrite..." 
                  style={{ flexGrow: 1, padding: "15px", borderRadius: "15px", border: "1px solid #1e3a8a", background: "#0f172a", color: "#fff" }} 
                />
                <button type="submit" style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "15px 25px", borderRadius: "15px", cursor: "pointer", fontWeight: "bold" }}>OK</button>
              </form>
              
              <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "1.5rem" }}>
                 <button onClick={() => speak(chatResponse)} style={{ background: "none", border: "1px solid #3b82f6", color: "#3b82f6", padding: "5px 15px", borderRadius: "10px", cursor: "pointer", fontSize: "0.8rem" }}>RÉPÉTER 🔊</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
