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
    { code: 'pt-BR', flag: '🇧🇷', name: 'Português' },
    { code: 'zh-CN', flag: '🇨🇳', name: '中文' },
    { code: 'ar-SA', flag: '🇸🇦', name: 'العربية' }
  ];

  const greetings = {
    'fr-FR': 'Bonjour ! Je suis votre assistant REUSSITESS® Global Nexus. Je connais 61 pages de patrimoine mondial et 26 boutiques Amazon dans 14 pays. Posez-moi vos questions !',
    'en-US': 'Hello! I am your REUSSITESS® Global Nexus assistant. I know 61 pages of world heritage and 26 Amazon stores in 14 countries. Ask me anything!',
    'es-ES': '¡Hola! Soy tu asistente REUSSITESS® Global Nexus. Conozco 61 páginas de patrimonio mundial y 26 tiendas Amazon en 14 países. ¡Pregúntame!',
    'de-DE': 'Hallo! Ich bin Ihr REUSSITESS® Global Nexus Assistent. Ich kenne 61 Seiten des Weltkulturerbes und 26 Amazon-Shops in 14 Ländern. Fragen Sie mich!',
    'it-IT': 'Ciao! Sono il tuo assistente REUSSITESS® Global Nexus. Conosco 61 pagine di patrimonio mondiale e 26 negozi Amazon in 14 paesi. Chiedimi!',
    'pt-BR': 'Olá! Sou seu assistente REUSSITESS® Global Nexus. Conheço 61 páginas de patrimônio mundial e 26 lojas Amazon em 14 países. Pergunte-me!',
    'zh-CN': '你好！我是您的 REUSSITESS® Global Nexus 助手。我了解61个世界遗产页面和14个国家的26家亚马逊商店。问我吧！',
    'ar-SA': 'مرحبا! أنا مساعد REUSSITESS® Global Nexus. أعرف 61 صفحة من التراث العالمي و 26 متجر أمازون في 14 دولة. اسألني!'
  };

  // BASE DE CONNAISSANCES EXHAUSTIVE - 61 PAGES
  const knowledgeBase = {
    
    // ACTUALITÉS 2024-2025
    'actualites': {
      info: 'Événements mondiaux récents',
      data: {
        'jo-2024': 'Jeux Olympiques Paris 2024 été succès mondial France, stades emblématiques Tour Eiffel, records athlétiques',
        'elections-2024': 'Élections présidentielles USA novembre 2024, nombreux pays monde renouvellement gouvernements',
        'climat': 'COP28-29 discussions urgentes climat, records températures 2024, transitions énergétiques accélérées',
        'ia': 'Intelligence Artificielle révolution 2024-2025 ChatGPT Claude Gemini généralisés, réglementations européennes',
        'spatial': 'Artemis NASA retour Lune prévu, missions Mars, satellites Starlink expansion mondiale',
        'économie': 'Inflation mondiale ralentissement 2024, taux intérêt ajustements, croissance Asie forte Inde Chine'
      }
    },

    // EUROPE (15 pays)
    'france': {
      pays: 'France',
      capitale: 'Paris',
      population: '68 millions',
      unesco: '49 sites UNESCO Record Europe',
      patrimoine: 'Tour Eiffel symbole mondial 1889, Versailles Louis XIV grandeur absolue, Mont-Saint-Michel abbaye marées Normandie, Châteaux Loire Renaissance Chambord Chenonceau, Vignobles Bordeaux vins premiers, Lascaux art pariétal 17,000 ans préhistoire',
      culture: 'Gastronomie Patrimoine UNESCO repas français, Louvre musée plus visité Joconde, Mode Paris capitale Chanel Dior Louis Vuitton, Cinéma Festival Cannes Palme Or',
      economie: '7e économie mondiale, TGV record 574 km/h leader ferroviaire, Airbus co-leader avions civils, Nucléaire 70% électricité indépendance, Tourisme N°1 mondial 90M visiteurs',
      url: '/bibliotheque/europe/france'
    },
    'italie': {
      pays: 'Italie',
      capitale: 'Rome',
      population: '59 millions',
      unesco: '58 sites UNESCO RECORD MONDIAL ABSOLU',
      patrimoine: 'Colisée Rome amphithéâtre 50,000 places Empire, Tour Pise campanile incliné 3.97° défaut, Pompéi ville fossilisée Vésuve 79 AD capsule temps, Florence berceau Renaissance Médicis Michel-Ange, Venise lagune 118 îles république millénaire, Vatican Chapelle Sixtine plus petit État',
      culture: 'Renaissance Léonard Vinci Michel-Ange Raphaël révolution 15e-16e, Gastronomie pizza pasta cuisine plus influente, Opéra Verdi Puccini Pavarotti bel canto',
      economie: '8e économie mondiale, Ferrari Lamborghini supercars luxe, Mode Milan Armani Versace Prada, Tourisme 65M 5e destination',
      url: '/bibliotheque/europe/italie'
    },
    'allemagne': {
      pays: 'Allemagne',
      capitale: 'Berlin',
      population: '84 millions',
      unesco: '51 sites UNESCO',
      patrimoine: 'Neuschwanstein château conte fées Louis II inspiration Disney, Mur Berlin symbole Guerre froide chute 1989, Cathédrale Cologne gothique 157m 632 ans construction, Bach Beethoven titans musique Berlin Philharmonique, Bauhaus design moderne Weimar révolution',
      culture: 'Philosophie Kant Hegel Nietzsche Marx Freud influence mondiale, Littérature Goethe Faust Schiller Grimm contes, Oktoberfest Munich plus grande fête bière 6M visiteurs',
      economie: '4e économie mondiale puissance, Mercedes BMW VW Audi Porsche automobile excellence, Siemens Bosch ingénierie leaders, Énergies renouvelables transition pionnière',
      url: '/bibliotheque/europe/allemagne'
    },
    'royaume-uni': {
      pays: 'Royaume-Uni',
      capitale: 'Londres',
      population: '67 millions',
      unesco: '33 sites UNESCO',
      patrimoine: 'Tour Londres forteresse 1066 Joyaux Couronne, Stonehenge mégalithique 3000 BC mystère, Big Ben Westminster Parlement démocratie, Shakespeare plus grand écrivain Hamlet Romeo, Édimbourg château Écosse Festival Fringe, Oxford Cambridge universités prestige',
      culture: 'Beatles Rolling Stones Queen révolution rock, Anglais 1.5 milliard locuteurs lingua franca, Cinéma James Bond Harry Potter franchises, BBC excellence journalisme',
      economie: '6e économie mondiale, City Londres 2e finance mondiale, Premier League football plus regardé, Recherche 132 Prix Nobel Newton Darwin Hawking',
      url: '/bibliotheque/europe/royaume-uni'
    },
    'espagne': {
      pays: 'Espagne',
      capitale: 'Madrid',
      population: '47 millions',
      unesco: '50 sites UNESCO',
      patrimoine: 'Alhambra Grenade palais nasride architecture islamique, Sagrada Família Gaudí construction 1882 Art nouveau, Flamenco UNESCO danse passion gitane, Picasso Dalí Goya maîtres peinture, Saint-Jacques Compostelle pèlerinage millénaire, Cordoue Mezquita arcs bicolores',
      culture: 'Tapas paella gastronomie méditerranéenne, Corrida tauromachie tradition controversée, Don Quichotte Cervantes chef-d'œuvre universel, Musique latine 490M hispanophones',
      economie: '14e économie mondiale, Tourisme 83M 2e mondial soleil plages, Zara Inditex fast fashion Ortega, AVE trains haute vitesse, Renouvelables éolien solaire leader',
      url: '/bibliotheque/europe/espagne'
    },
    'suede': {
      pays: 'Suède',
      capitale: 'Stockholm',
      population: '10.5 millions',
      unesco: '15 sites UNESCO',
      patrimoine: 'Stockholm Venise Nord 14 îles archipel, Palais Royal Drottningholm 1430 pièces plus grand habité, Laponie Sámi aurores boréales rennes, Vasa 1628 vaisseau préservé musée, Falun mine cuivre 1000 ans empire',
      culture: 'Prix Nobel Alfred Stockholm depuis 1901 excellence, IKEA Kamprad design démocratique meubles kit, ABBA Dancing Queen Spotify streaming révolution, Tech Ericsson Volvo Klarna licornes',
      economie: 'Modèle social scandinave, Qualité vie top égalité genre, Éducation Uppsala gratuite performante, Écologie zéro émission 2045',
      url: '/bibliotheque/europe/suede'
    },
    'belgique': {
      pays: 'Belgique',
      capitale: 'Bruxelles',
      population: '11.5 millions',
      unesco: '15 sites',
      patrimoine: 'Grand-Place Bruxelles, Beffrois, Bruges médiévale',
      culture: 'Capitale UE OTAN, Chocolat gaufres bière trappiste, BD Tintin Spirou',
      url: '/bibliotheque/europe/belgique'
    },
    'suisse': {
      pays: 'Suisse',
      capitale: 'Berne',
      population: '8.7 millions',
      unesco: '13 sites',
      patrimoine: 'Alpes Cervin, Genève ONU, Bâle musées',
      culture: 'Neutralité bancaire, Horlogerie Rolex Patek, 4 langues allemand français italien romanche',
      url: '/bibliotheque/europe/suisse'
    },

    // AMÉRIQUES (4)
    'bresil': {
      pays: 'Brésil',
      capitale: 'Brasília',
      population: '215 millions',
      unesco: '23 sites UNESCO',
      patrimoine: 'Christ Rédempteur Rio 38m Corcovado 7 merveilles, Amazonie 5.5M km² poumon planète biodiversité, Chutes Iguaçu 275 cascades Garganta Diabo, Brasília Niemeyer architecture moderniste, Salvador Bahia Pelourinho afro-brésilien, Pantanal zone humide plus grande jaguars',
      culture: 'Carnaval Rio 2M participants Sambodrome plus grande fête, Football 5 Coupes Monde Pelé Ronaldo Neymar religion, Samba Bossa Nova Tom Jobim UNESCO, Paulo Coelho Alchimiste 150M',
      economie: '9e économie mondiale, Agriculture 1er café sucre orange 2e soja bœuf, Embraer 3e avions jets, Énergie 85% hydroélectrique bioéthanol, Mines Vale fer',
      url: '/bibliotheque/amerique-sud/bresil'
    },
    'quebec': {
      pays: 'Québec',
      capitale: 'Québec City',
      population: '8.6 millions',
      unesco: '2 sites',
      patrimoine: 'Vieux-Québec fortifié francophonie Amérique',
      culture: 'Je me souviens devise, Sirop érable cabane, Céline Dion Cirque Soleil',
      url: '/bibliotheque/ameriques/quebec'
    },
    'haiti': {
      pays: 'Haïti',
      capitale: 'Port-au-Prince',
      population: '11.4 millions',
      unesco: '1 site',
      patrimoine: 'Citadelle Laferrière 1804 1ère république noire',
      culture: 'Créole vodou, Art naïf coloré, Indépendance Toussaint',
      url: '/bibliotheque/ameriques/haiti'
    },
    'louisiane': {
      pays: 'Louisiane',
      capitale: 'Baton Rouge',
      population: '4.6 millions',
      patrimoine: 'Nouvelle-Orléans jazz berceau, Mardi Gras carnaval, Bayous cajun',
      culture: 'Jazz Louis Armstrong, Cajun créole français, Vaudou Marie Laveau',
      url: '/bibliotheque/ameriques/louisiane'
    },

    // DOM-TOM (10)
    'reunion': {
      pays: 'La Réunion',
      capitale: 'Saint-Denis',
      population: '860,000',
      unesco: '2 sites',
      patrimoine: 'Piton Neiges 3,070m, Cirques Mafate, Volcan Fournaise actif',
      culture: 'Maloya créole, Vanille bourbon, Métissage',
      url: '/bibliotheque/dom-tom/reunion'
    },
    'guadeloupe': {
      pays: 'Guadeloupe',
      population: '390,000',
      patrimoine: 'Soufrière volcan, Chutes Carbet',
      culture: 'Gwoka tambour UNESCO, Zouk créole',
      url: '/bibliotheque/dom-tom/guadeloupe'
    },
    'martinique': {
      pays: 'Martinique',
      population: '370,000',
      patrimoine: 'Pelée 1902 éruption, Aimé Césaire',
      culture: 'Béguine créole, Rhum agricole',
      url: '/bibliotheque/dom-tom/martinique'
    },
    'guyane': {
      pays: 'Guyane',
      population: '290,000',
      patrimoine: 'Amazonie 96%, Kourou spatial Ariane',
      culture: 'Carnaval mois, Biodiversité',
      url: '/bibliotheque/dom-tom/guyane'
    },
    'mayotte': {
      pays: 'Mayotte',
      population: '280,000',
      patrimoine: 'Lagon double barrière, Tortues',
      culture: 'Islam mahorais, Shimaoré',
      url: '/bibliotheque/dom-tom/mayotte'
    },
    'polynesie': {
      pays: 'Polynésie française',
      population: '280,000',
      patrimoine: 'Tahiti Bora-Bora, 118 îles, Perles noires',
      culture: 'Ori tahiti danse, Tatouage, Monoï',
      url: '/bibliotheque/dom-tom/polynesie'
    },
    'nouvelle-caledonie': {
      pays: 'Nouvelle-Calédonie',
      population: '270,000',
      unesco: '6 lagons',
      patrimoine: 'Lagon plus grand monde, Nickel',
      culture: 'Kanak mélanésien, Pilou, Case ronde',
      url: '/bibliotheque/dom-tom/nouvelle-caledonie'
    },

    // AFRIQUE (7)
    'senegal': {
      pays: 'Sénégal',
      population: '17 millions',
      unesco: '7 sites',
      patrimoine: 'Île Gorée traite, Lac Rose, Saint-Louis',
      culture: 'Teranga hospitalité, Mbalax Youssou, Thiéboudienne',
      url: '/bibliotheque/afrique/senegal'
    },

    // MAGHREB (4)
    'maroc': {
      pays: 'Maroc',
      population: '37 millions',
      unesco: '9 sites',
      patrimoine: 'Médinas Fès Marrakech, Sahara, Hassan II',
      culture: 'Arabe berbère, Tagine couscous, Zellige',
      url: '/bibliotheque/maghreb/maroc'
    },

    // ASIE-PACIFIQUE (11)
    'singapour': {
      pays: 'Singapour',
      capitale: 'Singapour',
      population: '5.9 millions',
      patrimoine: 'Gardens Bay Supertrees 50m futuriste, Marina Bay Sands piscine toit plus haute, Singapore Flyer 165m, Changi meilleur aéroport cascade 40m, Merlion lion poisson emblème, Sentosa Universal Studios',
      culture: 'Food Paradise hawker cuisines chinoise malaise indienne, GP F1 nuit Marina Bay, Crazy Rich Asians film, Shopping Orchard Road luxe',
      economie: '3e hub financier mondial après Londres NYC, Port 1er maritime 37M EVP transhipment, Éducation PISA N°1 mondiale NUS Top 15, Smart City propre amende chewing-gum',
      url: '/bibliotheque/asie-pacifique/singapour'
    },
    'australie': {
      pays: 'Australie',
      capitale: 'Canberra',
      population: '26 millions',
      unesco: '20 sites UNESCO',
      patrimoine: 'Grande Barrière Corail 2,300 km plus grande récif 400 coraux, Uluru Ayers Rock 348m sacré aborigène 30,000 ans, Opéra Sydney voiles Utzon Harbour Bridge, Faune kangourous koalas 80% endémiques, Forêts Tasmanie eucalyptus diable, Great Ocean Road Twelve Apostles',
      culture: 'Surf Bondi Beach lifestyle BBQ outdoor, Aborigènes 65,000 ans culture plus ancienne Dreamtime, Vegemite meat pies Tim Tam cuisine, Mad Max Crocodile Dundee Hemsworth acteurs',
      economie: '13e économie mondiale, Mines 1er fer charbon or uranium BHP Rio, Éducation 8 universités Top 100 3e destination, Qualité vie Melbourne Sydney top, Vins Barossa agriculture, Rugby cricket natation',
      url: '/bibliotheque/asie-pacifique/australie'
    },
    'nouvelle-zelande': {
      pays: 'Nouvelle-Zélande',
      capitale: 'Wellington',
      population: '5.1 millions',
      unesco: '3 sites UNESCO',
      patrimoine: 'Milford Sound fjords glaciaires cascades 160m Mitre Peak, Tongariro volcans Sauron Seigneur Anneaux lacs émeraude, Culture Maori haka Te Reo langue officielle, Kiwi oiseau sans ailes endémique, Hobbiton Matamata décors préservés, Aoraki Mount Cook 3,724m glaciers',
      culture: '1er vote femmes 1893 Kate Sheppard pionnière, Peter Jackson Weta Workshop 17 Oscars effets, All Blacks rugby 77% victoires 3 Coupes haka Ka Mate, Sports extrêmes bungy Queenstown jetboat',
      economie: 'Agriculture kiwi agneau laitiers export, Innovation tech créative, Qualité vie nature préservée, Tourisme aventure outdoor',
      url: '/bibliotheque/asie-pacifique/nouvelle-zelande'
    },
    'inde': {
      pays: 'Inde',
      population: '1.4 milliard',
      unesco: '40 sites',
      patrimoine: 'Taj Mahal merveille, Varanasi sacré, Khajuraho',
      culture: 'Bollywood, Yoga ayurveda, Cricket',
      url: '/bibliotheque/asie-pacifique/inde'
    },
    'vietnam': {
      pays: 'Vietnam',
      population: '98 millions',
      unesco: '8 sites',
      patrimoine: 'Baie Halong 2000 îles, Hôi An, Hué',
      culture: 'Pho soupe, Áo dài, Cinéma',
      url: '/bibliotheque/asie-pacifique/vietnam'
    },

    // OCÉANIE (3)
    'fidji': {
      pays: 'Fidji',
      population: '900,000',
      patrimoine: '333 îles paradis, Grande barrière 4e, Plongée',
      culture: 'Rugby Sevens, Kava, Meke tapa',
      url: '/bibliotheque/oceanie/fidji'
    },

    // BOUTIQUES AMAZON (26 dans 14 pays)
    'amazon': {
      info: 'REUSSITESS® Global Nexus - Réseau affilié Amazon 26 boutiques 14 pays 5 continents',
      boutiques: {
        'usa': { pays: 'États-Unis', url: 'amazon.com', tag: 'reussitess-20' },
        'canada': { pays: 'Canada', url: 'amazon.ca', tag: 'reussitess0c-20' },
        'france': { pays: 'France', url: 'amazon.fr', tag: 'reussitess07-21' },
        'allemagne': { pays: 'Allemagne', url: 'amazon.de', tag: 'reussitess0a-21' },
        'uk': { pays: 'Royaume-Uni', url: 'amazon.co.uk', tag: 'reussitess0e-21' },
        'italie': { pays: 'Italie', url: 'amazon.it', tag: 'reussitess01-21' },
        'espagne': { pays: 'Espagne', url: 'amazon.es', tag: 'reussitess-21' },
        'pays-bas': { pays: 'Pays-Bas', url: 'amazon.nl', tag: 'reussitess0d-21' },
        'belgique': { pays: 'Belgique', url: 'amazon.com.be', tag: 'reussitess-21' },
        'suede': { pays: 'Suède', url: 'amazon.se', tag: 'reussitess-21' },
        'australie': { pays: 'Australie', url: 'amazon.com.au', tag: 'reussitess-22' },
        'singapour': { pays: 'Singapour', url: 'amazon.sg', tag: 'reussitess-20' },
        'inde': { pays: 'Inde', url: 'amazon.in', tag: 'reussitess-21' },
        'bresil': { pays: 'Brésil', url: 'amazon.com.br', tag: 'reussitess-20' }
      },
      programme: 'Partenaire Amazon - bénéfice sur achats remplissant conditions. Prix identiques, livraison standard, service client Amazon garanti',
      url: '/hub-central'
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = greetings[currentLang];
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [isOpen, currentLang]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLang;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getResponse = async (userMessage) => {
    const msgLower = userMessage.toLowerCase();
    
    // Recherche intelligente dans base connaissances
    for (const [key, data] of Object.entries(knowledgeBase)) {
      if (msgLower.includes(key) || msgLower.includes(data.pays?.toLowerCase())) {
        if (data.pays) {
          // Page pays
          let response = `📍 **${data.pays}**\n\n`;
          if (data.capitale) response += `🏛️ Capitale: ${data.capitale}\n`;
          if (data.population) response += `👥 Population: ${data.population}\n`;
          if (data.unesco) response += `🏛️ ${data.unesco}\n`;
          if (data.patrimoine) response += `\n🎭 Patrimoine:\n${data.patrimoine}\n`;
          if (data.culture) response += `\n🎨 Culture:\n${data.culture}\n`;
          if (data.economie) response += `\n💼 Économie:\n${data.economie}\n`;
          if (data.url) response += `\n➡️ [Voir page complète](${data.url})`;
          return response;
        } else if (data.boutiques) {
          // Amazon
          let response = `🛍️ ${data.info}\n\n`;
          response += `**Nos 14 pays Amazon:**\n\n`;
          Object.values(data.boutiques).forEach(b => {
            response += `• ${b.pays}: ${b.url}\n`;
          });
          response += `\n${data.programme}\n`;
          response += `\n➡️ [Voir toutes les boutiques](${data.url})`;
          return response;
        } else if (data.info === 'Événements mondiaux récents') {
          // Actualités
          let response = `📰 **Actualités Mondiales 2024-2025**\n\n`;
          Object.entries(data.data).forEach(([k, v]) => {
            response += `• ${v}\n\n`;
          });
          return response;
        }
      }
    }

    // Réponses contextuelles
    if (msgLower.includes('bonjour') || msgLower.includes('salut') || msgLower.includes('hello') || msgLower.includes('hi')) {
      return greetings[currentLang];
    }

    if (msgLower.includes('bibliothèque') || msgLower.includes('library') || msgLower.includes('pages')) {
      return `📚 Notre bibliothèque mondiale contient **61 pages** couvrant:\n\n🇪🇺 Europe (15 pays)\n🌍 Afrique (7 pays)\n🌏 Asie-Pacifique (11 pays)\n🏝️ DOM-TOM (10 territoires)\n🌎 Amériques (4 régions)\n🌊 Océanie (3 îles)\n\n[Voir la bibliothèque](/bibliotheque)`;
    }

    if (msgLower.includes('amazon') || msgLower.includes('boutique') || msgLower.includes('shop')) {
      return `🛍️ Nous avons **26 boutiques Amazon** dans **14 pays** sur **5 continents**:\n\n🌎 Amérique: USA, Canada, Brésil\n🇪🇺 Europe: France, Allemagne, UK, Italie, Espagne, Pays-Bas, Belgique, Suède\n🌏 Asie-Pacifique: Singapour, Inde, Australie\n\nPrix identiques Amazon, livraison standard, service client garanti.\n\n[Voir toutes les boutiques](/hub-central)`;
    }

    if (msgLower.includes('actualités') || msgLower.includes('news') || msgLower.includes('2024') || msgLower.includes('2025')) {
      return `📰 **Actualités 2024-2025:**\n\n🏅 JO Paris 2024 succès mondial\n🗳️ Élections présidentielles mondiales\n🌍 COP climat urgence transitions\n🤖 IA révolution ChatGPT Claude généralisés\n🚀 Artemis NASA retour Lune missions Mars\n📈 Économie inflation ralentissement croissance Asie\n\nJe suis à jour avec les événements mondiaux récents !`;
    }

    if (msgLower.includes('aide') || msgLower.includes('help') || msgLower.includes('comment')) {
      return `💡 **Je peux vous aider avec:**\n\n📚 61 pages patrimoine mondial (France, Italie, Brésil, Singapour...)\n🛍️ 26 boutiques Amazon dans 14 pays\n📰 Actualités mondiales 2024-2025\n🌍 Informations UNESCO, culture, économie\n🗣️ 8 langues avec synthèse vocale\n\n**Exemples de questions:**\n• "Parle-moi de la France"\n• "Italie patrimoine UNESCO"\n• "Boutiques Amazon disponibles"\n• "Actualités 2024"\n• "Brésil économie"`;
    }

    return `Je connais **61 pages** de patrimoine mondial et **26 boutiques Amazon**. Posez-moi une question sur un pays, les boutiques Amazon, ou les actualités mondiales ! 🌍`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getResponse(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      speak(response);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Désolé, une erreur est survenue. Réessayez !' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Bouton flottant VOYANT */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-50 animate-pulse"
        style={{
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(168, 85, 247, 0.3)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
        aria-label="Assistant vocal REUSSITESS"
      >
        <div className="relative">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {isSpeaking && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
          )}
        </div>
      </button>

      {/* Fenêtre chat LARGE */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 w-[500px] h-[750px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 border-4 border-purple-600">
          {/* Header coloré */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-5 rounded-t-3xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-3xl animate-bounce">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-lg">Assistant REUSSITESS®</h3>
                <p className="text-sm opacity-90">61 pages • 26 boutiques • 8 langues 🔊</p>
              </div>
            </div>
            <div className="flex gap-2">
              {isSpeaking && (
                <button onClick={stopSpeaking} className="hover:bg-white/20 p-2 rounded-lg transition">
                  <span className="text-2xl">🔇</span>
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-lg transition text-xl font-bold">
                ✕
              </button>
            </div>
          </div>

          {/* Sélecteur langues VISIBLE */}
          <div className="p-3 border-b-2 border-purple-200 flex gap-2 overflow-x-auto bg-gradient-to-r from-purple-50 to-pink-50">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setCurrentLang(lang.code)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  currentLang === lang.code 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110' 
                    : 'bg-white hover:bg-purple-100 text-gray-700 border-2 border-purple-200'
                }`}
              >
                {lang.flag} {lang.name}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-purple-50/30 to-white">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl shadow-lg ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white text-gray-800 border-2 border-purple-200'
                  }`}
                  dangerouslySetInnerHTML={{ 
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br/>')
                      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline font-bold hover:text-purple-600">$1</a>')
                  }}
                />
              </div>
            ))}
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

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
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
    </>
  );
}
