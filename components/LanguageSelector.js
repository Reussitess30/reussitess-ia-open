/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
"use client";

import { useTranslation } from "./GlobalTranslator";

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useTranslation();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      style={{
        padding: "0.5rem",
        border: "1px solid #d1d5db",
        borderRadius: "0.5rem",
        background: "white",
        color: "#374151",
        fontSize: "0.9rem",
      }}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
}
