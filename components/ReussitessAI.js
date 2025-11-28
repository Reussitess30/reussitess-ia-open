'use client';
import { useState, useEffect, useRef } from 'react';

export default function ReussitessAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLang, setCurrentLang] = useState('fr-FR');
  const [userName, setUserName] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesEndRef = useRef(null);

  const languages = [
    { code: 'fr-FR', flag: '🇫🇷', name: 'Français', voiceName: ['Thomas', 'Daniel'] },
    { code: 'en-US', flag: '🇺🇸', name: 'English', voiceName: ['David', 'Mark'] },
    { code: 'es-ES', flag: '🇪🇸', name: 'Español', voiceName: ['Diego', 'Jorge'] },
    { code: 'de-DE', flag: '🇩🇪', name: 'Deutsch', voiceName: ['Hans', 'Dieter'] },
    { code: 'it-IT', flag: '🇮🇹', name: 'Italiano', voiceName: ['Luca', 'Paolo'] },
    { code: 'pt-BR', flag: '🇧🇷', name: 'Português', voiceName: ['Ricardo', 'Felipe'] },
    { code: 'ja-JP', flag: '🇯🇵', name: '日本語', voiceName: ['Ichiro', 'Kenji'] },
    { code: 'zh-CN', flag: '🇨🇳', name: '中文', voiceName: ['Yunyang', 'Kangkang'] }
  ];

  const greetings = {
    'fr-FR': 'Bonjour ! Je suis Alex, votre expert culturel mondial RÉUSSITESS ! Je connais 62 pays, 26 boutiques Amazon internationales, et je peux vous aider en 8 langues. Que voulez-vous découvrir ?',
    'en-US': 'Hello! I am Alex, your RÉUSSITESS world cultural expert! I know 62 countries, 26 Amazon stores, and I can help in 8 languages. What would you like to discover?',
    'es-ES': '¡Hola! Soy Alex, tu experto cultural mundial RÉUSSITESS! Conozco 62 países, 26 tiendas Amazon. ¿Qué quieres descubrir?',
    'de-DE': 'Hallo! Ich bin Alex, Ihr RÉUSSITESS Weltkulturexperte! Ich kenne 62 Länder, 26 Amazon-Läden. Was möchten Sie entdecken?',
    'it-IT': 'Ciao! Sono Alex, il tuo esperto culturale mondiale RÉUSSITESS! Conosco 62 paesi, 26 negozi Amazon. Cosa vuoi scoprire?',
    'pt-BR': 'Olá! Sou Alex, seu especialista cultural mundial RÉUSSITESS! Conheço 62 países, 26 lojas Amazon. O que você quer descobrir?',
    'ja-JP': 'こんにちは！アレックスです。62カ国、26のAmazonストアを知っています。',
    'zh-CN': '你好！我是Alex。我了解62个国家，26个亚马逊商店。'
  };

  const KNOWLEDGE = {
    france: 'FRANCE 🇫🇷 - 49 sites UNESCO ! Paris Tour Eiffel 324m, Louvre Joconde, Versailles Galerie Glaces 357 miroirs. Mont-Saint-Michel merveille. Châteaux Loire Chambord. Gastronomie patrimoine mondial: 400 fromages, vins Bordeaux Champagne.',
    italie: 'ITALIE 🇮🇹 - Record 58 sites UNESCO ! Rome Colisée gladiateurs, Vatican Chapelle Sixtine Michel-Ange. Venise 118 îlots gondoles. Florence David Renaissance. Pompéi figée 79 ap JC. Pizza napolitaine patrimoine UNESCO.',
    japon: 'JAPON 🇯🇵 - Tokyo Shibuya, Shinkansen 320km/h. Mont Fuji 3776m sacré. Kyoto 2000 temples Kinkaku-ji doré. Osaka château. Hiroshima mémorial paix. Sushi ramen tempura wagyu. Samouraï geisha manga.',
    usa: 'USA 🇺🇸 - New York Statue Liberté Times Square. Los Angeles Hollywood. San Francisco Golden Gate. Las Vegas. Miami Beach. Chicago. Yellowstone geysers. Grand Canyon. Burger BBQ pizza hot-dog.',
    guadeloupe: 'GUADELOUPE 🇬🇵 - Terre de Champions ! Thierry Henry (Champion Monde 1998), Teddy Riner (11 titres Monde judo), Marie-José Pérec (3 OR olympiques). Gwoka musique UNESCO. 384000 habitants paradis caribéen.',
    boutiques: '26 BOUTIQUES AMAZON 🛍️: USA amazon.com, France amazon.fr, Allemagne amazon.de, Italie amazon.it, Espagne amazon.es, Canada amazon.ca, UK amazon.co.uk, Inde amazon.in, Pays-Bas amazon.nl, Suède amazon.se, Singapour amazon.sg, Australie amazon.com.au, Belgique amazon.com.be, Brésil amazon.com.br'
  };

  useEffect(function() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(function() {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: greetings[currentLang] }]);
    }
  }, [isOpen, currentLang, messages.length]);

  // SYSTÈME VOCAL CORRIGÉ - VOIX MASCULINE STANDARD
  const speak = function(text) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.log('❌ Speech Synthesis non disponible');
      return;
    }

    // Arrêter toute parole en cours
    window.speechSynthesis.cancel();
    
    // Nettoyer le texte
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/[🇫🇷🇺🇸🇪🇸🇩🇪🇮🇹🇧🇷🇯🇵🇨🇳🇬🇵💬🗣️✅🚀📚🌍🛍️]/g, '')
      .replace(/\n/g, ' ')
      .substring(0, 500);

    console.log('🗣️ Parole:', cleanText.substring(0, 60) + '...');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // CONFIGURATION VOIX MASCULINE STANDARD
    utterance.lang = currentLang;
    utterance.rate = 0.95;      // Vitesse naturelle
    utterance.pitch = 0.75;     // Grave = masculin
    utterance.volume = 1.0;     // Volume maximum
    
    // SÉLECTION VOIX MASCULINE
    const voices = window.speechSynthesis.getVoices();
    console.log('🎤 Voix disponibles:', voices.length);
    
    if (voices.length > 0) {
      const langInfo = languages.find(l => l.code === currentLang);
      const langCode = currentLang.substring(0, 2);
      
      // Chercher voix masculine par nom
      let selectedVoice = null;
      
      if (langInfo && langInfo.voiceName) {
        for (const name of langInfo.voiceName) {
          selectedVoice = voices.find(v => 
            v.lang.startsWith(langCode) && v.name.includes(name)
          );
          if (selectedVoice) break;
        }
      }
      
      // Chercher 'Male' dans le nom
      if (!selectedVoice) {
        selectedVoice = voices.find(v => 
          v.lang.startsWith(langCode) && 
          (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('homme'))
        );
      }
      
      // Première voix de la langue
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith(langCode));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('✅ Voix sélectionnée:', selectedVoice.name, selectedVoice.lang);
      } else {
        console.log('⚠️ Voix par défaut utilisée');
      }
    }
    
    utterance.onstart = function() { 
      setIsSpeaking(true);
      console.log('▶️ Parole démarrée');
    };
    
    utterance.onend = function() { 
      setIsSpeaking(false);
      console.log('⏹️ Parole terminée');
    };
    
    utterance.onerror = function(e) { 
      setIsSpeaking(false);
      console.error('❌ Erreur parole:', e.error);
    };
    
    try {
      window.speechSynthesis.speak(utterance);
      console.log('🔊 Parole lancée');
    } catch (err) {
      console.error('❌ Erreur speak():', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = function() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      console.log('🛑 Parole arrêtée');
    }
  };

  const getResponse = function(query) {
    const q = query.toLowerCase();
    
    if (q.match(/je m'appelle|mon nom|appelle moi/)) {
      const match = query.match(/(?:je m'appelle|mon nom est|appelle moi)\s+(\w+)/i);
      if (match) {
        setUserName(match[1]);
        return 'Enchanté ' + match[1] + ' ! Je suis Alex, expert culturel RÉUSSITESS. Je connais 62 pays, 26 boutiques Amazon, et la culture mondiale. Que voulez-vous explorer ?';
      }
    }
    
    if (q.match(/france|paris|versailles|louvre|eiffel/)) return KNOWLEDGE.france;
    if (q.match(/italie|rome|venise|colisée|vatican|florence/)) return KNOWLEDGE.italie;
    if (q.match(/japon|tokyo|kyoto|sushi|manga/)) return KNOWLEDGE.japon;
    if (q.match(/usa|america|new york|los angeles/)) return KNOWLEDGE.usa;
    if (q.match(/guadeloupe|champion|thierry|teddy|gwoka|caribéen/)) return KNOWLEDGE.guadeloupe;
    if (q.match(/amazon|boutique|acheter|shopping|store/)) return KNOWLEDGE.boutiques;
    
    if (q.match(/qui es|présente|alex/)) {
      return 'Je suis Alex, assistant culturel RÉUSSITESS ! Je connais 62 pays (France 49 UNESCO, Italie 58 UNESCO record, Japon, USA, Guadeloupe...), 26 boutiques Amazon internationales, et je parle 8 langues avec vocal masculin naturel. Mon objectif: vous faire découvrir la richesse culturelle mondiale !';
    }
    
    const name = userName ? userName + ', ' : '';
    return name + 'je peux vous aider avec: FRANCE 49 UNESCO, ITALIE 58 UNESCO record, JAPON culture, USA diversité, GUADELOUPE champions, 26 BOUTIQUES Amazon, Culture patrimoine mondial. Que voulez-vous découvrir ?';
  };

  const handleSubmit = function(e) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(function(prev) { 
      return prev.concat({ role: 'user', content: userMessage }); 
    });
    
    setIsLoading(true);

    setTimeout(function() {
      const response = getResponse(userMessage);
      
      setMessages(function(prev) { 
        return prev.concat({ role: 'assistant', content: response }); 
      });
      
      if (autoSpeak) {
        setTimeout(function() {
          speak(response);
        }, 300);
      }
      
      setIsLoading(false);
    }, 500);
  };

  const speakLastMessage = function() {
    const assistantMsgs = messages.filter(function(m) { return m.role === 'assistant'; });
    if (assistantMsgs.length > 0) {
      speak(assistantMsgs[assistantMsgs.length - 1].content);
    }
  };

  return (
    <div className="fixed z-50">
      <button
        onClick={function() { setIsOpen(!isOpen); }}
        className="fixed bottom-8 right-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all animate-pulse"
        style={{ 
          boxShadow: '0 0 60px rgba(59, 130, 246, 0.8)',
          width: '90px',
          height: '90px'
        }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-5xl mb-1">💬</span>
          <span className="text-sm font-bold">ALEX</span>
        </div>
        {isSpeaking && (
          <span className="absolute -top-3 -right-3 flex h-8 w-8">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-8 w-8 bg-red-500 items-center justify-center">
              🔊
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-32 right-8 w-[680px] h-[850px] bg-white rounded-3xl shadow-2xl flex flex-col border-4 border-purple-600">
          
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-5xl shadow-lg">
                  🌍
                </div>
                <div>
                  <h3 className="font-bold text-2xl">Alex Expert Mondial</h3>
                  <p className="text-sm opacity-95">RÉUSSITESS • 62 Pays • 26 Amazon • 8 Langues</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={function() { setAutoSpeak(!autoSpeak); }}
                      className="text-xs bg-white/20 px-2 py-1 rounded-full hover:bg-white/30"
                    >
                      {autoSpeak ? '🔊' : '🔇'}
                    </button>
                    <button
                      onClick={speakLastMessage}
                      className="text-xs bg-white/20 px-2 py-1 rounded-full hover:bg-white/30"
                    >
                      🔁
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={function() { setIsOpen(false); stopSpeaking(); }} 
                className="hover:bg-white/20 p-2 rounded-xl text-2xl"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-3 border-b-2 flex gap-2 overflow-x-auto bg-gradient-to-r from-purple-50 to-pink-50">
            {languages.map(function(lang) {
              const isActive = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={function() { setCurrentLang(lang.code); stopSpeaking(); }}
                  className={isActive 
                    ? 'px-3 py-2 rounded-lg font-semibold whitespace-nowrap bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg text-sm'
                    : 'px-3 py-2 rounded-lg font-semibold whitespace-nowrap bg-white hover:bg-purple-100 text-gray-700 border-2 border-purple-200 text-sm'}
                >
                  {lang.flag} {lang.name}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-purple-50/30 to-white">
            {messages.map(function(msg, idx) {
              const isUser = msg.role === 'user';
              const htmlContent = msg.content
                .replace(/\*\*/g, '')
                .replace(/\n/g, '<br/>');
              
              return (
                <div key={idx} className={isUser ? 'flex justify-end' : 'flex justify-start'}>
                  <div 
                    className={isUser
                      ? 'max-w-[80%] p-4 rounded-2xl shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'max-w-[80%] p-4 rounded-2xl shadow-lg bg-white text-gray-800 border-2 border-purple-200'}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-purple-200 p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" />
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="text-gray-700 font-semibold text-sm">Alex analyse...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t-2 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={function(e) { setInput(e.target.value); }}
                placeholder="Posez votre question... 💬"
                className="flex-1 border-2 border-purple-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-3 focus:ring-purple-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg disabled:opacity-50"
              >
                🚀
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              🗣️ Voix masculine naturelle • Pitch 0.75 • Rate 0.95 • 8 langues
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
