import { useState, useEffect, useRef } from 'react';

export default function BotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLang, setCurrentLang] = useState('fr-FR');
  const messagesEndRef = useRef(null);

  const languages = [
    { code: 'fr-FR', flag: '🇫🇷', name: 'Français' },
    { code: 'en-US', flag: '🇺🇸', name: 'English' },
    { code: 'es-ES', flag: '🇪🇸', name: 'Español' },
    { code: 'de-DE', flag: '🇩🇪', name: 'Deutsch' },
    { code: 'it-IT', flag: '🇮🇹', name: 'Italiano' },
    { code: 'pt-BR', flag: '🇧🇷', name: 'Português' }
  ];

  const greetings = {
    'fr-FR': 'Bonjour ! Je suis votre assistant REUSSITESS. Je connais 61 pages de patrimoine mondial et 26 boutiques Amazon dans 14 pays sur 5 continents. Posez-moi vos questions !',
    'en-US': 'Hello! I am your REUSSITESS assistant. I know 61 pages of world heritage and 26 Amazon stores in 14 countries across 5 continents. Ask me anything!',
    'es-ES': '¡Hola! Soy tu asistente REUSSITESS. Conozco 61 páginas de patrimonio mundial y 26 tiendas Amazon en 14 países. ¡Pregúntame!',
    'de-DE': 'Hallo! Ich bin Ihr REUSSITESS-Assistent. Ich kenne 61 Seiten Weltkulturerbe und 26 Amazon-Shops in 14 Ländern. Fragen Sie mich!',
    'it-IT': 'Ciao! Sono il tuo assistente REUSSITESS. Conosco 61 pagine di patrimonio mondiale e 26 negozi Amazon in 14 paesi. Chiedimi!',
    'pt-BR': 'Olá! Sou seu assistente REUSSITESS. Conheço 61 páginas de patrimônio mundial e 26 lojas Amazon em 14 países. Pergunte-me!'
  };

  const knowledgeData = {
    france: {
      pays: 'France',
      capitale: 'Paris',
      population: '68 millions',
      unesco: '49 sites UNESCO - Record Europe',
      patrimoine: 'Tour Eiffel symbole mondial 1889, Versailles Louis XIV grandeur absolue, Mont-Saint-Michel abbaye marées Normandie, Châteaux Loire Renaissance Chambord Chenonceau, Vignobles Bordeaux vins premiers mondiaux, Lascaux art pariétal 17000 ans',
      culture: 'Gastronomie UNESCO repas français, Louvre musée plus visité Joconde, Mode Paris capitale Chanel Dior Louis Vuitton, Cinéma Festival Cannes Palme Or',
      economie: '7e économie mondiale, TGV record 574 km/h ferroviaire, Airbus co-leader avions civils, Nucléaire 70% électricité, Tourisme N1 mondial 90M visiteurs',
      url: '/bibliotheque/europe/france'
    },
    italie: {
      pays: 'Italie',
      capitale: 'Rome',
      population: '59 millions',
      unesco: '58 sites UNESCO - RECORD MONDIAL ABSOLU',
      patrimoine: 'Colisée Rome amphithéâtre 50000 places Empire, Pompéi ville fossilisée Vésuve 79 AD, Florence berceau Renaissance Médicis Michel-Ange, Venise lagune 118 îles république millénaire, Vatican Chapelle Sixtine plus petit État',
      culture: 'Renaissance Léonard Vinci Michel-Ange Raphaël révolution, Gastronomie pizza pasta cuisine plus influente, Opéra Verdi Puccini Pavarotti',
      economie: '8e économie mondiale, Ferrari Lamborghini supercars luxe, Mode Milan Armani Versace Prada, Tourisme 65M destination',
      url: '/bibliotheque/europe/italie'
    },
    allemagne: {
      pays: 'Allemagne',
      capitale: 'Berlin',
      population: '84 millions',
      unesco: '51 sites UNESCO',
      patrimoine: 'Neuschwanstein château conte fées Louis II inspiration Disney, Mur Berlin symbole Guerre froide chute 1989, Cathédrale Cologne gothique 157m, Bach Beethoven titans musique Berlin Philharmonique',
      culture: 'Philosophie Kant Hegel Nietzsche Marx Freud influence mondiale, Littérature Goethe Faust Schiller Grimm contes, Oktoberfest Munich fête bière 6M visiteurs',
      economie: '4e économie mondiale puissance, Mercedes BMW VW Audi Porsche automobile excellence, Siemens Bosch ingénierie leaders',
      url: '/bibliotheque/europe/allemagne'
    },
    royaumeuni: {
      pays: 'Royaume-Uni',
      capitale: 'Londres',
      population: '67 millions',
      unesco: '33 sites UNESCO',
      patrimoine: 'Tour Londres forteresse 1066 Joyaux Couronne, Stonehenge mégalithique 3000 BC mystère, Big Ben Westminster Parlement démocratie, Shakespeare plus grand écrivain Hamlet Romeo',
      culture: 'Beatles Rolling Stones Queen révolution rock, Anglais 1.5 milliard locuteurs lingua franca, Cinéma James Bond Harry Potter franchises',
      economie: '6e économie mondiale, City Londres 2e finance mondiale, Premier League football plus regardé',
      url: '/bibliotheque/europe/royaume-uni'
    },
    espagne: {
      pays: 'Espagne',
      capitale: 'Madrid',
      population: '47 millions',
      unesco: '50 sites UNESCO',
      patrimoine: 'Alhambra Grenade palais nasride architecture islamique, Sagrada Família Gaudí construction 1882 Art nouveau, Flamenco UNESCO danse passion gitane andalouse',
      culture: 'Tapas paella gastronomie méditerranéenne, Picasso Dalí Goya maîtres peinture, Don Quichotte Cervantes',
      economie: '14e économie mondiale, Tourisme 83M 2e mondial soleil plages, Zara Inditex fast fashion',
      url: '/bibliotheque/europe/espagne'
    },
    suede: {
      pays: 'Suède',
      capitale: 'Stockholm',
      population: '10.5 millions',
      unesco: '15 sites UNESCO',
      patrimoine: 'Stockholm Venise Nord 14 îles archipel, Palais Royal Drottningholm 1430 pièces plus grand habité, Laponie Sámi aurores boréales rennes',
      culture: 'Prix Nobel Alfred Stockholm depuis 1901 excellence, IKEA Kamprad design démocratique meubles kit, ABBA Dancing Queen Spotify streaming',
      economie: 'Modèle social scandinave, Qualité vie top égalité genre, Écologie zéro émission 2045',
      url: '/bibliotheque/europe/suede'
    },
    bresil: {
      pays: 'Brésil',
      capitale: 'Brasília',
      population: '215 millions',
      unesco: '23 sites UNESCO',
      patrimoine: 'Christ Rédempteur Rio 38m Corcovado 7 merveilles, Amazonie 5.5M km2 poumon planète biodiversité, Chutes Iguaçu 275 cascades Garganta Diabo, Brasília Niemeyer architecture moderniste',
      culture: 'Carnaval Rio 2M participants Sambodrome plus grande fête, Football 5 Coupes Monde Pelé Ronaldo Neymar religion, Samba Bossa Nova Tom Jobim UNESCO',
      economie: '9e économie mondiale, Agriculture 1er café sucre orange, Embraer 3e avions jets, Énergie 85% hydroélectrique bioéthanol',
      url: '/bibliotheque/amerique-sud/bresil'
    },
    singapour: {
      pays: 'Singapour',
      capitale: 'Singapour',
      population: '5.9 millions',
      patrimoine: 'Gardens Bay Supertrees 50m futuriste, Marina Bay Sands piscine toit plus haute, Changi meilleur aéroport cascade 40m, Merlion lion poisson emblème',
      culture: 'Food Paradise hawker cuisines chinoise malaise indienne, GP F1 nuit Marina Bay, Shopping Orchard Road luxe',
      economie: '3e hub financier mondial après Londres NYC, Port 1er maritime 37M EVP transhipment, Éducation PISA N1 mondiale',
      url: '/bibliotheque/asie-pacifique/singapour'
    },
    australie: {
      pays: 'Australie',
      capitale: 'Canberra',
      population: '26 millions',
      unesco: '20 sites UNESCO',
      patrimoine: 'Grande Barrière Corail 2300 km plus grand récif, Uluru Ayers Rock 348m sacré aborigène 30000 ans, Opéra Sydney voiles Utzon Harbour Bridge, Faune kangourous koalas 80% endémiques',
      culture: 'Surf Bondi Beach lifestyle BBQ outdoor, Aborigènes 65000 ans culture plus ancienne Dreamtime, Vegemite meat pies cuisine',
      economie: '13e économie mondiale, Mines 1er fer charbon or uranium, Éducation 8 universités Top 100, Qualité vie Melbourne Sydney top',
      url: '/bibliotheque/asie-pacifique/australie'
    },
    nouvellezelande: {
      pays: 'Nouvelle-Zélande',
      capitale: 'Wellington',
      population: '5.1 millions',
      unesco: '3 sites UNESCO',
      patrimoine: 'Milford Sound fjords glaciaires cascades 160m, Tongariro volcans Sauron Seigneur Anneaux, Culture Maori haka Te Reo langue officielle, Kiwi oiseau sans ailes endémique',
      culture: '1er vote femmes 1893 Kate Sheppard pionnière, Peter Jackson Weta Workshop 17 Oscars, All Blacks rugby 77% victoires haka Ka Mate',
      economie: 'Agriculture kiwi agneau laitiers export, Sports extrêmes bungy Queenstown, Qualité vie nature préservée',
      url: '/bibliotheque/asie-pacifique/nouvelle-zelande'
    },
    amazon: {
      info: 'REUSSITESS Global Nexus - 26 boutiques Amazon affiliées dans 14 pays sur 5 continents',
      pays: {
        usa: 'États-Unis - amazon.com',
        canada: 'Canada - amazon.ca',
        france: 'France - amazon.fr',
        allemagne: 'Allemagne - amazon.de',
        uk: 'Royaume-Uni - amazon.co.uk',
        italie: 'Italie - amazon.it',
        espagne: 'Espagne - amazon.es',
        paysbas: 'Pays-Bas - amazon.nl',
        belgique: 'Belgique - amazon.com.be',
        suede: 'Suède - amazon.se',
        australie: 'Australie - amazon.com.au',
        singapour: 'Singapour - amazon.sg',
        inde: 'Inde - amazon.in',
        bresil: 'Brésil - amazon.com.br'
      },
      url: '/hub-central'
    }
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
  }, [isOpen, currentLang]);

  const speak = function(text) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLang;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onstart = function() { setIsSpeaking(true); };
      utterance.onend = function() { setIsSpeaking(false); };
      utterance.onerror = function() { setIsSpeaking(false); };
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = function() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getResponse = function(userMessage) {
    const msgLower = userMessage.toLowerCase();
    
    const searchKeys = ['france', 'italie', 'allemagne', 'royaumeuni', 'espagne', 'suede', 'bresil', 'singapour', 'australie', 'nouvellezelande'];
    
    for (let i = 0; i < searchKeys.length; i++) {
      const key = searchKeys[i];
      const data = knowledgeData[key];
      
      if (msgLower.includes(key) || (data.pays && msgLower.includes(data.pays.toLowerCase()))) {
        let response = '📍 ' + data.pays + '\n\n';
        if (data.capitale) response = response + '🏛️ Capitale: ' + data.capitale + '\n';
        if (data.population) response = response + '👥 Population: ' + data.population + '\n';
        if (data.unesco) response = response + '🏛️ ' + data.unesco + '\n';
        if (data.patrimoine) response = response + '\n🎭 Patrimoine:\n' + data.patrimoine + '\n';
        if (data.culture) response = response + '\n🎨 Culture:\n' + data.culture + '\n';
        if (data.economie) response = response + '\n💼 Économie:\n' + data.economie + '\n';
        if (data.url) response = response + '\n➡️ [Voir page complète](' + data.url + ')';
        return response;
      }
    }

    if (msgLower.includes('royaume-uni') || msgLower.includes('uk') || msgLower.includes('angleterre')) {
      const data = knowledgeData.royaumeuni;
      let response = '📍 ' + data.pays + '\n\n';
      response = response + '🏛️ Capitale: ' + data.capitale + '\n';
      response = response + '👥 Population: ' + data.population + '\n';
      response = response + '🏛️ ' + data.unesco + '\n';
      response = response + '\n🎭 ' + data.patrimoine + '\n';
      response = response + '\n🎨 ' + data.culture + '\n';
      response = response + '\n💼 ' + data.economie + '\n';
      response = response + '\n➡️ [Voir page complète](' + data.url + ')';
      return response;
    }

    if (msgLower.includes('nouvelle-zelande') || msgLower.includes('nouvelle zelande') || msgLower.includes('nz')) {
      const data = knowledgeData.nouvellezelande;
      let response = '📍 ' + data.pays + '\n\n';
      response = response + '🏛️ Capitale: ' + data.capitale + '\n';
      response = response + '👥 Population: ' + data.population + '\n';
      response = response + '🏛️ ' + data.unesco + '\n';
      response = response + '\n🎭 ' + data.patrimoine + '\n';
      response = response + '\n🎨 ' + data.culture + '\n';
      response = response + '\n💼 ' + data.economie + '\n';
      response = response + '\n➡️ [Voir page complète](' + data.url + ')';
      return response;
    }
    
    if (msgLower.includes('amazon') || msgLower.includes('boutique') || msgLower.includes('shop')) {
      const data = knowledgeData.amazon;
      let response = '🛍️ ' + data.info + '\n\n';
      response = response + '**Nos 14 pays Amazon:**\n\n';
      const paysKeys = Object.keys(data.pays);
      for (let i = 0; i < paysKeys.length; i++) {
        response = response + '• ' + data.pays[paysKeys[i]] + '\n';
      }
      response = response + '\n➡️ [Voir toutes les boutiques](' + data.url + ')';
      return response;
    }

    if (msgLower.includes('bonjour') || msgLower.includes('salut') || msgLower.includes('hello') || msgLower.includes('hi')) {
      return greetings[currentLang];
    }

    if (msgLower.includes('bibliothèque') || msgLower.includes('library') || msgLower.includes('pages')) {
      return '📚 Notre bibliothèque mondiale contient 61 pages couvrant:\n\n🇪🇺 Europe (15 pays)\n🌍 Afrique (7 pays)\n🌏 Asie-Pacifique (11 pays)\n🏝️ DOM-TOM (10 territoires)\n🌎 Amériques (4 régions)\n🌊 Océanie (3 îles)\n\n[Voir la bibliothèque](/bibliotheque)';
    }

    if (msgLower.includes('aide') || msgLower.includes('help') || msgLower.includes('comment')) {
      return '💡 **Je peux vous aider avec:**\n\n📚 61 pages patrimoine mondial\n🛍️ 26 boutiques Amazon\n🗣️ 6 langues avec synthèse vocale\n\n**Exemples:**\n• "Parle-moi de la France"\n• "Italie patrimoine"\n• "Boutiques Amazon"';
    }

    return 'Je connais 61 pages de patrimoine mondial et 26 boutiques Amazon dans 14 pays. Posez-moi une question sur un pays ou les boutiques ! 🌍';
  };

  const handleSubmit = function(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(function(prev) { return prev.concat({ role: 'user', content: userMessage }); });
    setIsLoading(true);

    setTimeout(function() {
      try {
        const response = getResponse(userMessage);
        setMessages(function(prev) { return prev.concat({ role: 'assistant', content: response }); });
        speak(response);
      } catch (error) {
        setMessages(function(prev) { return prev.concat({ role: 'assistant', content: 'Désolé, une erreur est survenue. Réessayez !' }); });
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <div>
      <button
        onClick={function() { setIsOpen(!isOpen); }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all z-50 animate-pulse"
        aria-label="Assistant vocal REUSSITESS"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        {isSpeaking && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-6 w-[500px] h-[750px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 border-4 border-purple-600">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-5 rounded-t-3xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-3xl animate-bounce">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-lg">Assistant REUSSITESS</h3>
                <p className="text-sm opacity-90">61 pages • 26 boutiques • 6 langues 🔊</p>
              </div>
            </div>
            <div className="flex gap-2">
              {isSpeaking && (
                <button onClick={stopSpeaking} className="hover:bg-white/20 p-2 rounded-lg transition">
                  <span className="text-2xl">🔇</span>
                </button>
              )}
              <button onClick={function() { setIsOpen(false); }} className="hover:bg-white/20 p-2 rounded-lg transition text-xl font-bold">
                ✕
              </button>
            </div>
          </div>

          <div className="p-3 border-b-2 border-purple-200 flex gap-2 overflow-x-auto bg-gradient-to-r from-purple-50 to-pink-50">
            {languages.map(function(lang) {
              const isActive = currentLang === lang.code;
              const btnClass = isActive 
                ? 'px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110'
                : 'px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all bg-white hover:bg-purple-100 text-gray-700 border-2 border-purple-200';
              
              return (
                <button
                  key={lang.code}
                  onClick={function() { setCurrentLang(lang.code); }}
                  className={btnClass}
                >
                  {lang.flag} {lang.name}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-purple-50/30 to-white">
            {messages.map(function(msg, idx) {
              const isUser = msg.role === 'user';
              const alignClass = isUser ? 'flex justify-end' : 'flex justify-start';
              const bubbleClass = isUser
                ? 'max-w-[85%] p-4 rounded-2xl shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'max-w-[85%] p-4 rounded-2xl shadow-lg bg-white text-gray-800 border-2 border-purple-200';
              
              const htmlContent = msg.content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br/>')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline font-bold hover:text-purple-600">$1</a>');
              
              return (
                <div key={idx} className={alignClass}>
                  <div className={bubbleClass} dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-purple-200 p-4 rounded-2xl shadow-lg">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" />
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={function(e) { setInput(e.target.value); }}
                placeholder="Posez votre question... 🌍"
                className="flex-1 border-2 border-purple-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-600 text-lg"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🚀
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
