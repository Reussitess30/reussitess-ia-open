"use client";
import { useState } from "react";

const LANGUAGES = [
  { code: "fr-FR",  label: "FR", flag: "🇫🇷", name: "Français",          target: "French" },
  { code: "en-US",  label: "EN", flag: "🇬🇧", name: "English",           target: "English" },
  { code: "es-ES",  label: "ES", flag: "🇪🇸", name: "Español",           target: "Spanish" },
  { code: "pt-BR",  label: "PT", flag: "🇧🇷", name: "Português",         target: "Brazilian Portuguese" },
  { code: "fr-FR",  label: "KW", flag: "🌴", name: "Kréyòl Gwadloup",   target: "Antillean Creole (Guadeloupe)" },
  { code: "ar-SA",  label: "AR", flag: "🇸🇦", name: "العربية",           target: "Arabic" },
];

export default function LanguageBot({ text }) {
  const [active, setActive]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [speaking, setSpeaking]   = useState(false);
  const [translated, setTranslated] = useState(null);

  const translateText = async (lang) => {
    // French — no translation needed
    if (lang.label === "FR") return text;

    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages: [{
            role: "user",
            content: `Translate the following text to ${lang.target}. Return ONLY the translation, no explanation, no quotes:\n\n${text}`,
          }],
        }),
      });
      const data = await response.json();
      return data.content?.[0]?.text || text;
    } catch {
      return text;
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = async (lang) => {
    // Stop if same language clicked again
    window.speechSynthesis.cancel();
    if (active === lang.label) {
      setActive(null);
      setSpeaking(false);
      setTranslated(null);
      return;
    }

    setActive(lang.label);
    setSpeaking(false);
    setTranslated(null);

    const result = await translateText(lang);
    setTranslated(result);

    const utterance = new SpeechSynthesisUtterance(result);
    utterance.lang = lang.code;
    utterance.rate = 0.92;
    utterance.pitch = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend   = () => { setSpeaking(false); setActive(null); };
    utterance.onerror = () => { setSpeaking(false); setActive(null); };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ marginTop: "0.75rem" }}>
      {/* Boutons langues */}
      <div style={{
        display: "flex",
        gap: "0.4rem",
        flexWrap: "wrap",
        alignItems: "center",
      }}>
        <span style={{ fontSize: "0.65rem", color: "#64748b", marginRight: "0.2rem" }}>
          🔊
        </span>
        {LANGUAGES.map((lang) => {
          const isActive = active === lang.label;
          return (
            <button
              key={lang.label}
              onClick={() => handleSpeak(lang)}
              title={`Écouter en ${lang.name}`}
              style={{
                background: isActive
                  ? "linear-gradient(135deg, #7c3aed, #5b21b6)"
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${isActive ? "#7c3aed" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "20px",
                padding: "0.2rem 0.55rem",
                color: isActive ? "white" : "#94a3b8",
                fontSize: "0.7rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                transition: "all 0.2s",
                outline: "none",
              }}
            >
              {lang.flag} {lang.label}
              {isActive && loading  && <span>⏳</span>}
              {isActive && speaking && <span style={{ animation: "pulse 1s infinite" }}>🔊</span>}
            </button>
          );
        })}
      </div>

      {/* Texte traduit (affiché discrètement) */}
      {translated && active && (
        <div style={{
          marginTop: "0.5rem",
          padding: "0.5rem 0.75rem",
          background: "rgba(124,58,237,0.08)",
          borderLeft: "2px solid #7c3aed",
          borderRadius: "6px",
          color: "#c4b5fd",
          fontSize: "0.8rem",
          lineHeight: "1.4",
          direction: active === "AR" ? "rtl" : "ltr",
        }}>
          {translated}
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
