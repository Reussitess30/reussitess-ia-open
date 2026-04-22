/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
// Système de voix multilingue pour le bot REUSSITESS®971
export class VoiceSystem {
  constructor() {
    this.synthesis = null;
    this.voices = [];
    this.currentVoice = null;
    this.isSupported = false;
    this.init();
  }

  init() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synthesis = window.speechSynthesis;
      this.isSupported = true;

      // Charger les voix disponibles
      this.loadVoices();

      // Écouter les changements de voix
      if (this.synthesis.onvoiceschanged !== undefined) {
        this.synthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    this.voices = this.synthesis.getVoices();

    // Sélectionner la meilleure voix française
    const frenchVoices = this.voices.filter(
      (voice) => voice.lang.startsWith("fr") || voice.lang.includes("FR"),
    );

    // Priorité : voix française féminine ou masculine de qualité
    this.currentVoice =
      frenchVoices.find((v) => v.name.includes("Amélie")) ||
      frenchVoices.find((v) => v.name.includes("Thomas")) ||
      frenchVoices.find((v) => v.name.includes("French")) ||
      frenchVoices[0] ||
      this.voices[0];
  }

  speak(text, options = {}) {
    if (!this.isSupported || !text) return;

    // Arrêter toute parole en cours
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Configuration
    utterance.voice = this.currentVoice;
    utterance.rate = options.rate || 0.95; // Légèrement plus lent pour clarté
    utterance.pitch = options.pitch || 1.1; // Légèrement plus aigu
    utterance.volume = options.volume || 1.0;
    utterance.lang = options.lang || "fr-FR";

    // Callbacks
    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = options.onError;

    this.synthesis.speak(utterance);
  }

  stop() {
    if (this.isSupported) {
      this.synthesis.cancel();
    }
  }

  pause() {
    if (this.isSupported) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.isSupported) {
      this.synthesis.resume();
    }
  }

  isSpeaking() {
    return this.isSupported && this.synthesis.speaking;
  }

  getAvailableVoices() {
    return this.voices;
  }

  setVoice(voiceName) {
    const voice = this.voices.find((v) => v.name === voiceName);
    if (voice) {
      this.currentVoice = voice;
    }
  }
}

// Instance singleton
let voiceSystemInstance = null;

export function getVoiceSystem() {
  if (typeof window === "undefined") return null;

  if (!voiceSystemInstance) {
    voiceSystemInstance = new VoiceSystem();
  }
  return voiceSystemInstance;
}

// Fonction pour nettoyer le texte avant la synthèse vocale
export function cleanTextForSpeech(text) {
  return text
    .replace(
      /🇬🇵|🌍|🏆|✨|💪|🔥|🎯|🚀|📚|💼|🎓|💰|🤝|🌟|😊|👍|⚡|🎉|💡|🌱|⚽|🎨|🎵|🎬|💻|📝|❓|🛍|📧|🆘|💬|📢|🔭|🏰|👤|🌏|🌐|💎|📜|📦|🛠|🏝|🌺|📖|📅/g,
      "",
    )
    .replace(/•/g, ",")
    .replace(/BOUDOUM/g, "Boudoum")
    .replace(/REUSSITESS®971/g, "Réussite 971")
    .replace(/DOM-TOM/g, "Dom Tom")
    .trim();
}

export default getVoiceSystem;
