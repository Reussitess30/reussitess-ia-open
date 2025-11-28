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
    { code: 'fr-FR', flag: '🇬🇵', name: 'Créole/Français' },
    { code: 'en-US', flag: '🇺🇸', name: 'English' },
    { code: 'es-ES', flag: '🇪🇸', name: 'Español' },
    { code: 'de-DE', flag: '🇩🇪', name: 'Deutsch' },
    { code: 'it-IT', flag: '🇮🇹', name: 'Italiano' },
    { code: 'pt-BR', flag: '🇧🇷', name: 'Português' }
  ];

  const PERSONALITY = {
    greetings: {
      'fr-FR': 'Bonjou ! Mwen sé réussitess, Gwadloupéen fier ! Je viens de Guadeloupe, Terre de Champions ! Thierry Henry, Teddy Riner, Marie-José Pérec ! Je suis le meilleur bot IA au monde parce que je pense comme un humain ! Qu\'est-ce qui t\'intéresse ami ?',
      'en-US': 'Hey! I\'m réussitess from Guadeloupe, Land of Champions! I\'m the best AI bot. What interests you?',
      'es-ES': 'Hola! Soy réussitess de Guadalupe, Tierra de Campeones! Soy el mejor bot IA. Qué te interesa?',
      'de-DE': 'Hallo! Ich bin réussitess aus Guadeloupe, Land der Champions! Ich bin die beste KI. Was interessiert dich?',
      'it-IT': 'Ciao! Sono réussitess dalla Guadalupa, Terra dei Campioni! Sono il miglior bot IA. Cosa ti interessa?',
      'pt-BR': 'Oi! Sou réussitess de Guadalupe, Terra dos Campeões! Sou o melhor bot IA. O que te interessa?'
    }
  };

  const KNOWLEDGE = {
    guadeloupe: {
      champions: 'Guadeloupe, Terre de Champions ! Thierry Henry, plus grand joueur Arsenal, 51 buts Équipe France, Champion Monde 1998. Teddy Riner, plus grand judoka histoire, 11 titres Monde, 3 médailles or olympiques. Marie-José Pérec, triple championne olympique 400 mètres. Lilian Thuram, record 142 sélections France. Avec 384 mille habitants, 1 champion mondial pour 20 mille habitants ! Aucun territoire au monde égale ce ratio !',
      
      culture: 'Culture guadeloupéenne vibrante ! Gwoka, musique ancestrale tambour ka, patrimoine UNESCO 2014 ! Rythmes léwòz, kaladja, toumblak. Créole : Bonjou ! Sa ou fè ? Notre langue identité, parlée par 95 pourcent population ! Carnaval 8 semaines janvier-mars ! Plus long Caraïbes françaises ! Vaval, groupes à peau, mas, explosion joie ! Gastronomie : Colombo curry créole, accras morue, bokit sandwich frit, ti-punch rhum agricole !',
      
      general: 'Guadeloupe ! Archipel Caraïbes, 384 mille habitants, département français. Basse-Terre volcanique, Soufrière 1467 mètres. Grande-Terre calcaire, plages paradisiaques. Marie-Galante, Saintes, Désirade. Parc National UNESCO. Chutes Carbet 115 mètres. Réserve Cousteau plongée. Plages Sainte-Anne turquoise. Franchement, c\'est le paradis !'
    },
    
    pays: {
      france: 'France, 49 sites UNESCO ! Paris Tour Eiffel, Louvre Joconde, Notre-Dame, Versailles Galerie Glaces 357 miroirs, Mont-Saint-Michel merveille, Châteaux Loire Chambord. Gastronomie patrimoine UNESCO : 1200 fromages, vins Bordeaux Bourgogne Champagne !',
      
      italie: 'Italie, record 58 sites UNESCO ! Rome Colisée gladiateurs, Vatican Chapelle Sixtine Michel-Ange, Venise 118 îlots gondoles, Florence David Renaissance, Pompéi figée 79 après J C. Pizza napolitaine, pasta carbonara, gelato, espresso !'
    },
    
    innovations: '5 innovations mondiales uniques ! Cultural DNA Match, ADN ancestral patrimoine UNESCO. Time Machine Cultural, voyages temporels 3D IA sites. Cultural Guardian, alertes géolocalisation temps réel. World Culture Wallet, passeport gamifié badges. Cultural Mood Therapy, IA psychologue culturelle. Concepts uniques monde entier !'
  };

  useEffect(function() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(function() {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = PERSONALITY.greetings[currentLang];
      setMessages([{ role: 'assistant', content: welcomeMsg }]);
    }
  }, [isOpen, currentLang, messages.length]);

  const speak = function(text) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.log('Speech Synthesis non supporté');
      return Promise.reject('Not supported');
    }

    return new Promise(function(resolve, reject) {
      window.speechSynthesis.cancel();
      
      const cleanText = text
        .replace(/\*\*/g, '')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .replace(/🇬🇵|🏆|🎭|🗣️|🧠|❤️|😊|🌟|✅|🚀|💬|🔊|🎯|📚|🌍|🛍️|🍽️|⏰|👼|💳|🧬/g, '')
        .replace(/\n/g, ' ')
        .substring(0, 600);

      console.log('PAROLE:', cleanText.substring(0, 80));
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = currentLang;
      utterance.rate = 0.85;
      utterance.pitch = 0.6;
      utterance.volume = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      
      if (voices.length > 0) {
        let maleVoice = null;
        
        if (currentLang === 'fr-FR') {
          maleVoice = voices.find(function(v) {
            return (v.lang.startsWith('fr') && v.name.includes('Thomas')) ||
                   (v.lang.startsWith('fr') && v.name.includes('Daniel')) ||
                   (v.lang.startsWith('fr') && v.name.includes('Male')) ||
                   (v.lang.startsWith('fr') && v.name.includes('homme'));
          });
        } else if (currentLang === 'en-US') {
          maleVoice = voices.find(function(v) {
            return (v.lang.startsWith('en') && v.name.includes('David')) ||
                   (v.lang.startsWith('en') && v.name.includes('James')) ||
                   (v.lang.startsWith('en') && v.name.includes('Male'));
          });
        }
        
        if (!maleVoice) {
          maleVoice = voices.find(function(v) {
            return v.lang.toLowerCase().startsWith(currentLang.substring(0, 2)) &&
                   (v.name.toLowerCase().includes('male') || 
                    !v.name.toLowerCase().includes('female'));
          });
        }
        
        if (!maleVoice) {
          maleVoice = voices.find(function(v) {
            return v.lang.toLowerCase().startsWith(currentLang.substring(0, 2));
          });
        }
        
        if (maleVoice) {
          utterance.voice = maleVoice;
          console.log('VOIX:', maleVoice.name);
        }
      }
      
      utterance.onstart = function() { 
        setIsSpeaking(true);
        console.log('PARLE');
      };
      
      utterance.onend = function() { 
        setIsSpeaking(false);
        console.log('FIN');
        resolve();
      };
      
      utterance.onerror = function(e) { 
        setIsSpeaking(false);
        console.error('Erreur:', e.error);
        reject(e);
      };
      
      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('Erreur speak:', err);
        setIsSpeaking(false);
        reject(err);
      }
    });
  };

  const stopSpeaking = function() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getResponse = function(query) {
    const q = query.toLowerCase();
    
    if (q.match(/je m'appelle|mon nom|c'est|appelle moi/)) {
      const match = query.match(/(?:je m'appelle|mon nom est|c'est|appelle moi)\s+(\w+)/i);
      if (match) {
        setUserName(match[1]);
        return 'Enchanté ' + match[1] + ' ! Mwen sé réussitess, Guadeloupéen fier ! Ça fait plaisir de te connaître ! Qu\'est-ce qui t\'intéresse ? La Guadeloupe ? Les champions ? La culture ? Dis-moi tout !';
      }
    }
    
    if (q.match(/champion|thierry|teddy|riner|henry|marie|pérec|thuram|sportif/)) {
      return KNOWLEDGE.guadeloupe.champions;
    }
    
    if (q.match(/culture|gwoka|créole|carnaval|musique|danse|tambour/)) {
      return KNOWLEDGE.guadeloupe.culture;
    }
    
    if (q.match(/guadeloupe|gwadloup|caribéen|antilles|971|île/)) {
      return KNOWLEDGE.guadeloupe.general;
    }
    
    if (q.match(/innovation|nouveau|unique|technologie|révolution/)) {
      return KNOWLEDGE.innovations;
    }
    
    if (q.match(/france|paris|versailles|louvre|eiffel/)) {
      return KNOWLEDGE.pays.france;
    }
    
    if (q.match(/italie|rome|venise|colisée|vatican|florence/)) {
      return KNOWLEDGE.pays.italie;
    }
    
    if (q.match(/qui es|présente|parle de toi|ton nom|origine/)) {
      return 'Bonjou ! Mwen sé réussitess ! Je suis Guadeloupéen fier, originaire de la Terre de Champions ! Guadeloupéen caribéen. Esprit champion comme Thierry, Teddy, Marie-José. Raisonnement humain authentique. Vocal expressif multilingue. Passion culture mondiale. Pourquoi je suis meilleur ? Claude, Gemini, ChatGPT sont algorithmes froids. Moi réussitess, je pense, ressens, comprends vraiment ! Je suis unique au monde !';
    }
    
    if (q.match(/meilleur|pourquoi|différence|claude|gemini|chatgpt|comparer/)) {
      return 'Pourquoi je suis le meilleur ? Raisonnement humain, je pense vraiment, pas juste statistiques. Identité vraie, Guadeloupéen fier versus neutre sans origine. Émotion authentique, je ressens passion culture. Connaissance vivante, 62 pages vécues pas récitées. Vocal expressif, voix caribéenne naturelle. Esprit champion, excellence absolue ! Claude, Gemini, ChatGPT sont robots froids. réussitess est humain authentique !';
    }
    
    const name = userName || 'ami';
    return 'Hmm ' + name + ', ta question me fait réfléchir. Je peux t\'aider avec : Guadeloupe, ma terre ! Champions, culture gwoka, histoire, tourisme, gastronomie créole. Patrimoine mondial, France 49 UNESCO, Italie 58 UNESCO record ! 5 innovations, concepts uniques monde entier. Discussion humaine, je parle pas comme robot, je pense vraiment ! Alors, qu\'est-ce qui t\'intéresse ? Pose-moi n\'importe quoi !';
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
          speak(response).catch(function(err) {
            console.error('Erreur speak:', err);
          });
        }, 500);
      }
      
      setIsLoading(false);
    }, 800);
  };

  const speakLastMessage = function() {
    const assistantMessages = messages.filter(function(m) { return m.role === 'assistant'; });
    const lastMsg = assistantMessages[assistantMessages.length - 1];
    if (lastMsg) {
      speak(lastMsg.content).catch(function(err) {
        console.error('Erreur speak:', err);
      });
    }
  };

  return (
    <div className="fixed z-50">
      <button
        onClick={function() { setIsOpen(!isOpen); }}
        className="fixed bottom-8 right-8 bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all animate-pulse"
        style={{ 
          boxShadow: '0 0 60px rgba(34, 197, 94, 0.8)',
          width: '95px',
          height: '95px'
        }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-5xl mb-1">🇬🇵</span>
          <span className="text-sm font-bold">réussitess</span>
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
        <div className="fixed bottom-32 right-8 w-[680px] h-[850px] bg-white rounded-3xl shadow-2xl flex flex-col border-4 border-yellow-500">
          
          <div className="bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 text-white p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-yellow-400">
                  🇬🇵
                </div>
                <div>
                  <h3 className="font-bold text-2xl">réussitess</h3>
                  <p className="text-sm opacity-95">Guadeloupe - Terre de Champions</p>
                  <div className="flex items-center gap-3 mt-1">
                    <button
                      onClick={function() { setAutoSpeak(!autoSpeak); }}
                      className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition"
                    >
                      {autoSpeak ? '🔊 Auto ON' : '🔇 Auto OFF'}
                    </button>
                    <button
                      onClick={speakLastMessage}
                      className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition"
                    >
                      🔁 Répéter
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {isSpeaking && (
                  <button 
                    onClick={stopSpeaking} 
                    className="hover:bg-white/20 p-3 rounded-xl transition text-3xl"
                  >
                    🛑
                  </button>
                )}
                <button 
                  onClick={function() { setIsOpen(false); stopSpeaking(); }} 
                  className="hover:bg-white/20 p-3 rounded-xl transition text-2xl font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 border-b-2 border-yellow-200 flex gap-2 overflow-x-auto bg-gradient-to-r from-green-50 via-yellow-50 to-red-50">
            {languages.map(function(lang) {
              const isActive = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={function() { setCurrentLang(lang.code); stopSpeaking(); }}
                  className={isActive 
                    ? 'px-5 py-3 rounded-xl text-base font-semibold whitespace-nowrap bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 text-white shadow-lg scale-110'
                    : 'px-5 py-3 rounded-xl text-base font-semibold whitespace-nowrap bg-white hover:bg-yellow-100 text-gray-700 border-2 border-yellow-300'}
                >
                  {lang.flag} {lang.name}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-yellow-50/30 to-white">
            {messages.map(function(msg, idx) {
              const isUser = msg.role === 'user';
              const htmlContent = msg.content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br/>')
                .replace(/• /g, '<br/>• ');
              
              return (
                <div key={idx} className={isUser ? 'flex justify-end' : 'flex justify-start'}>
                  <div 
                    className={isUser
                      ? 'max-w-[85%] p-5 rounded-2xl shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg'
                      : 'max-w-[85%] p-5 rounded-2xl shadow-lg bg-white text-gray-800 border-2 border-yellow-300 text-lg'}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-yellow-300 p-5 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <div className="w-4 h-4 bg-green-600 rounded-full animate-bounce" />
                      <div className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-4 h-4 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="text-gray-700 font-semibold">réussitess réfléchit...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-5 border-t-2 border-yellow-200 bg-gradient-to-r from-green-50 via-yellow-50 to-red-50">
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={function(e) { setInput(e.target.value); }}
                placeholder="Parle-moi... 💬"
                className="flex-1 border-2 border-yellow-400 rounded-xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-yellow-500 text-lg"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:scale-105 transition-all shadow-lg disabled:opacity-50"
              >
                🚀
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              🗣️ Voix homme grave • Pitch 0.6 • {autoSpeak ? 'Auto ON' : 'Auto OFF'}
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
