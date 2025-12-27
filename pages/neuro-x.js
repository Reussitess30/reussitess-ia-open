import Layout from "../components/Layout";
import { useState } from "react";

export default function NeuroX() {
  const [activeData, setActiveData] = useState("SÉLECTIONNEZ UNE ÉTAPE OU PARLEZ À NEURO-BOT.");
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("Bonjour ! Je suis NEURO-BOT. Je peux vous guider à travers les 10 piliers de l'excellence en 8 langues. Comment puis-je vous aider ?");

  const steps = [
    { n: "1", t: "Opportunités Afrique (BAD)", u: "https://www.afdb.org/fr", d: "Exploration des marchés émergents africains." },
    { n: "2", t: "Aide Internationale (ONU)", u: "https://www.un.org/fr", d: "Programmes mondiaux de développement." },
    { n: "3", t: "Boutique en Ligne (Commerce)", u: "https://www.economie.gouv.fr", d: "Guide pour le e-commerce mondial." },
    { n: "4", t: "Logistique Mondiale (Douanes)", u: "https://www.douane.gouv.fr", d: "Maîtrise des flux d'exportation." },
    { n: "5", t: "Identité & Langue (CNRS)", u: "https://www.cnrs.fr", d: "Richesse linguistique et créole." },
    { n: "6", t: "Patrimoine Caraïbe (UNESCO)", u: "https://whc.unesco.org", d: "Culture et héritage de la Caraïbe." },
    { n: "7", t: "Propriété Intellectuelle (INPI)", u: "https://www.inpi.fr", d: "Protection de vos innovations." },
    { n: "8", t: "Innovation & IA (Etalab)", u: "https://www.etalab.gouv.fr", d: "Futur technologique et données." },
    { n: "9", t: "Dépassement de Soi (OMS)", u: "https://www.who.int/fr", d: "Potentiel humain et santé mentale." },
    { n: "10", t: "Épanouissement (ODD)", u: "https://www.un.org/sustainabledevelopment/fr/", d: "Objectifs de réussite durable." }
  ];

  const handleChat = (e) => {
    e.preventDefault();
    const input = chatInput.toLowerCase();
    if (input.includes("créole") || input.includes("kréyòl")) {
      setChatResponse("Kréyòl sé nanm nou! Étape 5 explore notre langue, et l'Étape 6 notre patrimoine UNESCO.");
    } else if (input.includes("afrique") || input.includes("africa")) {
      setChatResponse("L'Afrique est une terre d'opportunités. Consultez l'Étape 1 pour la BAD et l'Étape 2 pour l'aide internationale.");
    } else if (input.includes("boutique") || input.includes("vendre")) {
      setChatResponse("Pour l'e-commerce, l'Étape 3 vous guide sur la création et l'Étape 4 sur la logistique internationale.");
    } else {
      setChatResponse("Je comprends. Pour l'excellence et le succès, je vous suggère d'explorer les 10 piliers. Quel domaine vous intéresse ?");
    }
    setChatInput("");
  };

  return (
    <Layout>
      <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: "2rem 1rem", fontFamily: "sans-serif" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          <header style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 style={{ fontSize: "clamp(2rem, 8vw, 4rem)", fontWeight: "900", color: "#2563eb" }}>REUSSITESS® NEURO-X</h1>
            <p style={{ fontWeight: "bold", color: "#3b82f6" }}>L'EXCELLENCE • L'INNOVATION • LE SUCCÈS | GUADELOUPE 971</p>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            
            {/* LES 10 PILIERS */}
            <div style={{ border: "1px solid #1e40af", borderRadius: "20px", padding: "1.5rem", background: "rgba(30, 64, 175, 0.1)" }}>
              <h3 style={{ color: "#3b82f6", marginBottom: "1.5rem", textAlign: "center" }}>AXES DE DIRECTION</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {steps.map((step) => (
                  <button key={step.n} onClick={() => setActiveData(step.d)} style={{ textAlign: "left", background: "#111", border: "1px solid #333", color: "#fff", padding: "10px", borderRadius: "8px", cursor: "pointer" }}>
                    <span style={{ color: "#2563eb", fontWeight: "900", marginRight: "10px" }}>{step.n}.</span>
                    <a href={step.u} target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "none" }}>{step.t}</a>
                  </button>
                ))}
              </div>
            </div>

            {/* NEURO-BOT ASSISTANT */}
            <div style={{ background: "#050505", border: "2px solid #2563eb", borderRadius: "20px", padding: "2rem", display: "flex", flexDirection: "column" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "900", marginBottom: "1rem", color: "#3b82f6", textAlign: "center" }}>🤖 NEURO-BOT MULTILINGUE</h2>
              <div style={{ flexGrow: 1, padding: "1rem", border: "1px solid #1e40af", borderRadius: "10px", background: "rgba(37, 99, 235, 0.05)", marginBottom: "1rem", minHeight: "150px" }}>
                <p style={{ fontSize: "0.95rem", color: "#e2e8f0" }}>{chatResponse}</p>
              </div>
              <form onSubmit={handleChat} style={{ display: "flex", gap: "10px" }}>
                <input 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Posez une question à NEURO-BOT..."
                  style={{ flexGrow: 1, padding: "10px", borderRadius: "5px", border: "1px solid #333", background: "#111", color: "#fff" }}
                />
                <button type="submit" style={{ background: "#2563eb", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>ENVOYER</button>
              </form>
              <div style={{ marginTop: "1rem", fontSize: "0.7rem", color: "#444", textAlign: "center" }}>
                8 LANGUES ACTIVÉES : FR | EN | ES | PT | DE | IT | ZH | KREYÒL
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
