/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import StructuredData from '../components/StructuredData'
import VisitorCounter from '../components/VisitorCounter'
import { useEffect } from "react";
import BotAssistant from "../components/BotAssistant";
import SuperBotUniversal from "../components/SuperBotUniversal";
import UniversalVoiceReader from "../components/UniversalVoiceReader";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Désactiver clic droit
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Désactiver sélection de texte
    const handleSelectStart = (e) => {
      const target = e.target
      const isFormField = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable
      if (isFormField) return // Autorise dans les champs de saisie
      e.preventDefault()
      return false
    };

    // Désactiver copie
    const handleCopy = (e) => {
      const target = e.target
      const isFormField = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable
      if (isFormField) return // Autorise copier dans les champs
      e.preventDefault()
      return false
    };

    // Désactiver raccourcis clavier
    const handleKeyDown = (e) => {
      // Bloquer F12
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }

      // Bloquer Ctrl+Shift+I
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        return false;
      }

      // Bloquer Ctrl+U
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        return false;
      }

      // Bloquer Ctrl+S
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        return false;
      }

      // Bloquer Ctrl+C sauf dans formulaires
      if (e.ctrlKey && e.key === "c") {
        const target = e.target;
        const isFormField =
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable;
        if (!isFormField) {
          e.preventDefault();
          return false;
        }
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <>
      <VisitorCounter />
        <>
        <>
        <StructuredData />
        <Component {...pageProps} />
      { /* 👁️ Quantum Tracker Reussitess - Invisible */ }
      <div style={{display: "none"}} data-reussitess-origin="Guadeloupe" data-reussitess-supply="1Billion"></div>
      </>
      </>
      </>
      <UniversalVoiceReader />
      <SuperBotUniversal />
      <BotAssistant />
    </>
  );
}

export default MyApp;
