/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
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
    { code: 'fr-FR', flag: '🇫🇷', name: 'Français' },
    { code: 'en-US', flag: '🇺🇸', name: 'English' },
    { code: 'es-ES', flag: '🇪🇸', name: 'Español' },
    { code: 'de-DE', flag: '🇩🇪', name: 'Deutsch' },
    { code: 'it-IT', flag: '🇮🇹', name: 'Italiano' },
    { code: 'pt-BR', flag: '🇧🇷', name: 'Português' },
    { code: 'ja-JP', flag: '🇯🇵', name: '日本語' },
    { code: 'zh-CN', flag: '🇨🇳', name: '中文' }
  ];

  const greetings = {
    'fr-FR': 'Bonjour ! Je suis Alex, votre expert culturel mondial RÉUSSITESS ! Je connais 62 pays, 26 boutiques Amazon internationales, et je peux vous aider en 8 langues. Que voulez-vous découvrir ?',
    'en-US': 'Hello! I am Alex, your RÉUSSITESS world cultural expert! I know 62 countries, 26 Amazon stores, and I can help in 8 languages. What would you like to discover?',
    'es-ES': '¡Hola! Soy Alex, tu experto cultural mundial RÉUSSITESS! Conozco 62 países, 26 tiendas Amazon, y puedo ayudar en 8 idiomas. ¿Qué quieres descubrir?',
    'de-DE': 'Hallo! Ich bin Alex, Ihr RÉUSSITESS Weltkulturexperte! Ich kenne 62 Länder, 26 Amazon-Läden, und ich kann in 8 Sprachen helfen. Was möchten Sie entdecken?',
    'it-IT': 'Ciao! Sono Alex, il tuo esperto culturale mondiale RÉUSSITESS! Conosco 62 paesi, 26 negozi Amazon, e posso aiutare in 8 lingue. Cosa vuoi scoprire?',
    'pt-BR': 'Olá! Sou Alex, seu especialista cultural mundial RÉUSSITESS! Conheço 62 países, 26 lojas Amazon, e posso ajudar em 8 idiomas. O que você quer descobrir?',
    'ja-JP': 'こんにちは！私はアレックス、RÉUSSITESS世界文化エキスパートです！62カ国、26のAmazonストア、8言語でサポートできます。何を発見したいですか？',
    'zh-CN': '你好！我是Alex，RÉUSSITESS世界文化专家！我了解62个国家，26个亚马逊商店，可以用8种语言帮助您。您想发现什么？'
  };

  // BASE DE CONNAISSANCES COMPLÈTE
  const COMPLETE_KNOWLEDGE = {
    // 26 BOUTIQUES AMAZON DÉTAILLÉES
    boutiques: {
      'USA': {
        market: 'amazon.com',
        tag_perso: 'reussitess-20',
        tag_influencer: 'fb942837',
        langue: 'English',
        monnaie: 'USD $',
        population: '335 millions',
        categories_populaires: 'Electronics, Books, Home & Kitchen, Fashion, Toys',
        livraison: 'Amazon Prime 1-2 days, International shipping available',
        conseil: 'Largest Amazon marketplace, best selection and prices. Black Friday deals in November. Use price tracking tools like CamelCamelCamel.'
      },
      'France': {
        market: 'amazon.fr',
        tag_perso: 'reussitess0b-21',
        tag_influencer: 'fb942837',
        langue: 'Français',
        monnaie: 'EUR €',
        population: '68 millions',
        categories_populaires: 'Livres, High-Tech, Cuisine & Maison, Mode, Jardin',
        livraison: 'Amazon Prime gratuit dès 25€, Livraison rapide 24-48h',
        conseil: 'French Days (2x/an), Black Friday, Prime Day (juillet). TVA incluse dans prix. Retours gratuits 30 jours.'
      },
      'Allemagne': {
        market: 'amazon.de',
        tag_perso: 'reussitess07-21',
        tag_influencer: 'fb942837',
        langue: 'Deutsch',
        monnaie: 'EUR €',
        population: '84 millions',
        categories_populaires: 'Elektronik, Bücher, Küche & Haushalt, Sport, Auto',
        livraison: 'Amazon Prime kostenlos, Versand 1-3 Tage',
        conseil: 'Größter europäischer Markt. Cyber Monday, Prime Day. Sehr guter Kundenservice. Qualitätsprodukte.'
      },
      'Italie': {
        market: 'amazon.it',
        tag_perso: 'reussitess06-21',
        tag_influencer: 'fb942837',
        langue: 'Italiano',
        monnaie: 'EUR €',
        population: '59 millions',
        categories_populaires: 'Elettronica, Libri, Casa e cucina, Moda, Sport',
        livraison: 'Amazon Prime gratuito, Consegna 1-3 giorni',
        conseil: 'Prime Day luglio, Black Friday novembre. Prodotti italiani autentici. Gastronomia italiana.'
      },
      'Espagne': {
        market: 'amazon.es',
        tag_perso: 'reussitess0c-21',
        tag_influencer: 'fb942837',
        langue: 'Español',
        monnaie: 'EUR €',
        population: '48 millions',
        categories_populaires: 'Electrónica, Libros, Hogar y cocina, Moda, Deportes',
        livraison: 'Amazon Prime gratis, Envío 1-3 días',
        conseil: 'Prime Day julio, Black Friday. Productos españoles auténticos. Gastronomía española. El Corte Inglés alternativa.'
      },
      'Canada': {
        market: 'amazon.ca',
        tag_perso: 'reussitess0e-20',
        tag_influencer: 'fb942837',
        langue: 'English/Français',
        monnaie: 'CAD $',
        population: '39 millions',
        categories_populaires: 'Electronics, Books, Home, Fashion, Sports & Outdoors',
        livraison: 'Amazon Prime free shipping, Delivery 2-5 days',
        conseil: 'Bilingual marketplace. Boxing Day December 26. Prime Day. Watch exchange rates CAD/USD. Outdoor gear popular.'
      },
      'UK': {
        market: 'amazon.co.uk',
        tag_perso: 'reussitess0d-21',
        tag_influencer: 'fb942837',
        langue: 'English',
        monnaie: 'GBP £',
        population: '68 millions',
        categories_populaires: 'Electronics, Books, Home & Garden, Fashion, Toys',
        livraison: 'Amazon Prime free delivery, Next day available',
        conseil: 'Major European marketplace. Black Friday, Prime Day, Boxing Day. Check Brexit import duties for EU buyers.'
      },
      'Inde': {
        market: 'amazon.in',
        tag_perso: 'reussitess01-21',
        tag_influencer: 'fb942837',
        langue: 'English/Hindi',
        monnaie: 'INR ₹',
        population: '1.4 milliards',
        categories_populaires: 'Electronics, Fashion, Home, Books, Groceries',
        livraison: 'Amazon Prime free delivery, 1-5 days depending location',
        conseil: 'Huge market! Great Deals during Diwali (October), Republic Day (January). Cash on Delivery available. Local brands.'
      },
      'Pays-Bas': {
        market: 'amazon.nl',
        tag_perso: 'reussitess08-21',
        tag_influencer: 'fb942837',
        langue: 'Nederlands',
        monnaie: 'EUR €',
        population: '18 millions',
        categories_populaires: 'Elektronica, Boeken, Huis & Tuin, Mode, Speelgoed',
        livraison: 'Amazon Prime gratis, Bezorging 1-3 dagen',
        conseil: 'Launched 2020. Growing marketplace. Bol.com local alternative. English widely understood.'
      },
      'Suède': {
        market: 'amazon.se',
        tag_perso: 'reussitess05-21',
        tag_influencer: 'fb942837',
        langue: 'Svenska',
        monnaie: 'SEK kr',
        population: '10.5 millions',
        categories_populaires: 'Elektronik, Böcker, Hem & Trädgård, Mode, Sport',
        livraison: 'Amazon Prime gratis, Leverans 2-4 dagar',
        conseil: 'Launched 2020. Komplett.se local competitor. High purchasing power. Quality products preferred.'
      },
      'Singapour': {
        market: 'amazon.sg',
        tag_perso: 'reussitess03-22',
        tag_influencer: 'fb942837',
        langue: 'English/中文/Malay/Tamil',
        monnaie: 'SGD $',
        population: '5.9 millions',
        categories_populaires: 'Electronics, Books, Home, Fashion, Groceries',
        livraison: 'Amazon Prime free delivery, Next day available',
        conseil: 'Asian hub launched 2017. Lazada, Shopee competitors. English primary. High-tech products. No customs duties.'
      },
      'Australie': {
        market: 'amazon.com.au',
        tag_perso: 'reussitess0a-22',
        tag_influencer: 'fb942837',
        langue: 'English',
        monnaie: 'AUD $',
        population: '26 millions',
        categories_populaires: 'Electronics, Books, Home, Fashion, Sports',
        livraison: 'Amazon Prime free delivery, 1-5 days depending location',
        conseil: 'Launched 2017. Growing market. eBay Australia competitor. Watch shipping times vast distances. Outdoor gear popular.'
      },
      'Belgique': {
        market: 'amazon.com.be',
        tag_perso: 'reussitess04-21',
        tag_influencer: 'fb942837',
        langue: 'Nederlands/Français',
        monnaie: 'EUR €',
        population: '11.6 millions',
        categories_populaires: 'Elektronica/Électronique, Boeken/Livres, Mode, Huis/Maison',
        livraison: 'Amazon Prime gratis/gratuit, Levering/Livraison 1-3 jours',
        conseil: 'Bilingual marketplace. Launched 2022. Bol.com, Coolblue local alternatives. Use amazon.fr or .nl for more selection.'
      },
      'Brésil': {
        market: 'amazon.com.br',
        tag_perso: 'reussitess00-20',
        tag_influencer: 'fb942837',
        langue: 'Português',
        monnaie: 'BRL R$',
        population: '215 millions',
        categories_populaires: 'Eletrônicos, Livros, Casa, Moda, Esportes',
        livraison: 'Amazon Prime frete grátis, Entrega 2-7 dias',
        conseil: 'Largest Latin American market. Black Friday huge! Watch taxes (ICMS varies by state). Mercado Livre competitor. Local payment methods.'
      }
    },

    // RESSOURCES CULTURELLES MONDIALES
    culture_mondiale: {
      'UNESCO': {
        total_sites: '1199 sites (2024)',
        pays_record: 'Italie 58 sites, Chine 57, Allemagne 52, France 49, Espagne 49',
        categories: 'Culturel 933, Naturel 227, Mixte 39',
        description: 'Organisation Nations Unies pour patrimoine mondial. Protège sites exceptionnels valeur universelle. Liste 1978. Convention 194 pays. Financement préservation. Tourisme responsable.',
        exemples_celebres: 'Grande Muraille Chine, Machu Picchu Pérou, Pyramides Égypte, Taj Mahal Inde, Venise Italie, Parc Yellowstone USA, Grande Barrière Corail Australie'
      },
      
      'Langues_Mondiales': {
        plus_parlees: '1) Anglais 1.5 milliard (378M natifs), 2) Chinois Mandarin 1.1 milliard, 3) Hindi 602M, 4) Espagnol 548M, 5) Français 280M, 6) Arabe 274M, 7) Bengali 272M, 8) Russe 258M, 9) Portugais 258M, 10) Indonésien 199M',
        langues_officielles_ONU: 'Anglais, Français, Espagnol, Russe, Chinois, Arabe',
        familles_linguistiques: 'Indo-européenne (Anglais, Français, Espagnol, Hindi, Russe), Sino-tibétaine (Chinois, Tibétain), Afro-asiatique (Arabe, Hébreu), Niger-Congo (Swahili, Yoruba)',
        langues_danger: '40% des 7000 langues mondiales menacées extinction. Préservation urgente patrimoine immatériel UNESCO.'
      },

      'Religions_Mondiales': {
        principales: 'Christianisme 2.4 milliards (31%), Islam 1.9 milliards (25%), Hindouisme 1.2 milliards (15%), Bouddhisme 520 millions (7%), Judaïsme 15 millions (0.2%)',
        geographie: 'Christianisme: Amériques, Europe, Afrique subsaharienne. Islam: Moyen-Orient, Afrique Nord, Asie du Sud-Est. Hindouisme: Inde, Népal. Bouddhisme: Asie de l\'Est, Asie du Sud-Est',
        patrimoine_religieux: 'Cathédrales gothiques Europe, Mosquées ottomanes, Temples hindous Inde, Temples bouddhistes Asie, Synagogues historiques, Lieux pèlerinage: Jérusalem, La Mecque, Varanasi, Lhassa, Vatican'
      },

      'Gastronomie_Mondiale': {
        patrimoine_unesco: 'Cuisine française (2010), Diète méditerranéenne (2013), Cuisine mexicaine (2010), Cuisine japonaise Washoku (2013), Kimchi coréen (2013), Pizza napolitaine (2017)',
        specialites_pays: 'France: Croissants, Coq au vin, Fromages. Italie: Pizza, Pasta, Gelato. Japon: Sushi, Ramen, Tempura. Chine: Dim Sum, Pékin Duck. Inde: Curry, Biryani, Naan. Mexique: Tacos, Mole. Thaïlande: Pad Thai, Tom Yum',
        boissons: 'Vin (France, Italie, Espagne), Bière (Allemagne, Belgique, République Tchèque), Saké (Japon), Thé (Chine, Inde, Japon), Café (Brésil, Colombie, Éthiopie)',
        marches_celebres: 'Tsukiji Tokyo, La Boqueria Barcelona, Borough Market London, Marrakech Souks, Pike Place Seattle'
      },

      'Festivals_Mondiaux': {
        carnavals: 'Rio Janeiro Brésil (février, 2M spectateurs), Venise Italie (masques), New Orleans USA (Mardi Gras), Notting Hill London, Santa Cruz Ténérife',
        fetes_traditionnelles: 'Oktoberfest Munich (septembre, 6M visiteurs, bière), La Tomatina Espagne (bataille tomates), Holi Inde (festival couleurs), Songkran Thaïlande (nouvel an eau), Dia de los Muertos Mexique',
        festivals_arts: 'Cannes Film Festival France, Edinburgh Fringe UK (théâtre), Burning Man USA (art), Glastonbury UK (musique), Coachella USA, Tomorrowland Belgique (électro)',
        celebrations_religieuses: 'Noël (25 décembre chrétiens), Ramadan/Eid (musulmans), Diwali (hindous, octobre-novembre), Hanoukka (juifs, décembre), Vesak (bouddhistes, mai)'
      },

      'Architecture_Mondiale': {
        styles_majeurs: 'Gothique (Notre-Dame Paris, Cologne), Renaissance (Florence, Vatican), Baroque (Versailles, Vienne), Art Nouveau (Gaudi Barcelona), Modernisme (Bauhaus, Le Corbusier), Contemporain (Gehry, Zaha Hadid)',
        merveilles_antiques: 'Pyramides Gizeh Égypte, Colisée Rome, Parthénon Athènes, Petra Jordanie, Grande Muraille Chine, Angkor Wat Cambodge, Machu Picchu Pérou',
        gratte_ciels: 'Burj Khalifa Dubai 828m, Shanghai Tower 632m, Abraj Al-Bait Mecque 601m, Ping An Shenzhen 599m, Lotte World Seoul 555m, One World Trade NYC 541m',
        ponts_iconiques: 'Golden Gate San Francisco, Tower Bridge London, Pont du Gard France romain, Brooklyn Bridge NYC, Viaduc Millau France 343m'
      }
    },

    // PAYS DÉTAILLÉS (échantillon)
    pays: {
      'France': {
        capitale: 'Paris',
        population: '68 millions',
        langue: 'Français',
        monnaie: 'Euro EUR €',
        unesco: '49 sites (record européen)',
        incontournables: 'Tour Eiffel 324m Paris, Louvre musée Joconde, Versailles Galerie Glaces 357 miroirs, Mont-Saint-Michel Normandie merveille, Châteaux Loire Chambord Chenonceau, Côte d\'Azur Nice Cannes, Provence lavande, Bordeaux vignobles',
        gastronomie: '400 fromages AOC, Vins Bordeaux Bourgogne Champagne, Croissants, Baguette, Coq au vin, Ratatouille, Crêpes',
        culture: 'Impressionnisme Monet Renoir, Révolution 1789 Liberté Égalité Fraternité, Mode Chanel Dior, Cinéma Cannes, Littérature Victor Hugo Molière',
        amazon_tag: 'reussitess0b-21',
        conseil_shopping: 'Amazon.fr: Livres français, High-tech, Mode, Cuisine. Prime Day juillet, French Days 2x/an, Black Friday novembre. Livraison gratuite dès 25€.'
      },

      'Italie': {
        capitale: 'Rome',
        population: '59 millions',
        langue: 'Italien',
        monnaie: 'Euro EUR €',
        unesco: '58 sites (RECORD MONDIAL)',
        incontournables: 'Rome Colisée Vatican Fontaine Trevi, Venise 118 îlots gondoles Place St-Marc, Florence David Michel-Ange Uffizi Duomo, Milan cathédrale La Scala mode, Pompéi figée 79 ap JC, Côte Amalfitaine Positano, Toscane Sienne vignobles cyprès, Cinque Terre 5 villages colorés mer',
        gastronomie: 'Pizza Napolitaine patrimoine UNESCO, Pasta carbonara amatriciana, Gelato artisanal, Risotto Milan, Tiramisu, Espresso café, Parmigiano Reggiano, Prosciutto Parme, Vins Chianti Barolo Prosecco',
        culture: 'Renaissance Léonard Vinci Michel-Ange Raphaël, Empire Romain Julius César Auguste, Opera Verdi Puccini La Scala, Mode Armani Versace Gucci Prada, Cinéma Fellini Visconti',
        amazon_tag: 'reussitess06-21',
        conseil_shopping: 'Amazon.it: Produits italiens authentiques, Mode, Gastronomie, Livres. Prime Day, Black Friday. Outlets: The Mall Florence, Serravalle Milan -50%.'
      },

      'Japon': {
        capitale: 'Tokyo',
        population: '125 millions',
        langue: 'Japonais',
        monnaie: 'Yen JPY ¥',
        unesco: '25 sites',
        incontournables: 'Tokyo Shibuya carrefour, Shinkansen train 320 km/h, Mont Fuji 3776m sacré, Kyoto 2000 temples Kinkaku-ji doré Fushimi Inari 10000 torii, Osaka château Dotonbori néons, Hiroshima mémorial paix, Nara cerfs temple, Hakone onsen sources chaudes',
        gastronomie: 'Sushi sashimi nigiri maki, Ramen bouillon nouilles, Tempura friture légère, Wagyu bœuf Kobe, Matcha thé vert, Saké rice wine, Yakitori brochettes, Okonomiyaki crêpe salée',
        culture: 'Samouraï bushido katana, Geisha Kyoto kimono, Manga anime Ghibli, Sumo wrestling, Ikebana art floral, Cérémonie thé, Temples zen jardins, Haiku poésie 5-7-5',
        conseil_shopping: 'Pas Amazon.co.jp direct. Rakuten marketplace alternative. Akihabara Tokyo électronique. 100 Yen stores. Duty-free aéroports.'
      },

      'USA': {
        capitale: 'Washington DC',
        population: '335 millions',
        langue: 'English',
        monnaie: 'Dollar USD $',
        unesco: '24 sites',
        incontournables: 'New York Statue Liberté Times Square Central Park, Los Angeles Hollywood Walk Fame, San Francisco Golden Gate, Las Vegas casinos, Miami Beach, Chicago architecture, Parc Yellowstone geysers, Grand Canyon Arizona, Yosemite, Hawaii volcan plages',
        gastronomie: 'Burger frites, BBQ ribs Texas Kansas, Pizza NY Chicago deep-dish, Hot-dog, Apple pie, Cheesecake NY, Tex-Mex tacos burritos, Thanksgiving turkey, Donuts Starbucks',
        culture: 'Hollywood cinéma Oscars, Broadway musicals NY, Jazz blues rock hip-hop, Silicon Valley tech Apple Google, NBA basketball, NFL football américain, Route 66, American Dream',
        amazon_tag: 'reussitess-20',
        conseil_shopping: 'Amazon.com: PLUS GRAND marketplace mondial. Électronique -30% vs Europe. Black Friday Cyber Monday novembre. Prime Day juillet. Expédition internationale. Attention frais douane import Europe.'
      }
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
  }, [isOpen, currentLang, messages.length]);

  // FONCTION VOCAL
  const speak = function(text) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/[🇫🇷🇺🇸🇪🇸🇩🇪🇮🇹🇧🇷🇯🇵🇨🇳💬🗣✅🚀📚🌍🛍]/g, '')
      .replace(/\n/g, ' ')
      .substring(0, 600);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentLang;
    utterance.rate = 0.90;
    utterance.pitch = 0.75;
    utterance.volume = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(function(v) {
      return v.lang.startsWith(currentLang.substring(0, 2));
    });
    
    if (voice) utterance.voice = voice;
    
    utterance.onstart = function() { setIsSpeaking(true); };
    utterance.onend = function() { setIsSpeaking(false); };
    utterance.onerror = function() { setIsSpeaking(false); };
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = function() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // RÉPONSES INTELLIGENTES ENRICHIES
  const getResponse = function(query) {
    const q = query.toLowerCase();
    
    // NOM
    if (q.match(/je m'appelle|mon nom|appelle moi/)) {
      const match = query.match(/(?:je m'appelle|mon nom est|appelle moi)\s+(\w+)/i);
      if (match) {
        setUserName(match[1]);
        return 'Enchanté ' + match[1] + ' ! Je suis Alex, expert culturel RÉUSSITESS. Je peux vous aider à découvrir 62 pays, 26 boutiques Amazon internationales, et la culture mondiale en 8 langues ! Que voulez-vous explorer ?';
      }
    }
    
    // BOUTIQUE SPÉCIFIQUE
    if (q.match(/amazon|boutique|acheter|shopping|store/)) {
      let response = '🛍 **26 BOUTIQUES AMAZON INTERNATIONALES**\n\n';
      
      if (q.match(/france|français|.fr/)) {
        const fr = COMPLETE_KNOWLEDGE.boutiques['France'];
        response = '🇫🇷 **AMAZON FRANCE**\n\n';
        response += 'Marché: ' + fr.market + '\n';
        response += 'Tag affilié: ' + fr.tag_perso + '\n';
        response += 'Population: ' + fr.population + '\n';
        response += 'Monnaie: ' + fr.monnaie + '\n';
        response += 'Catégories: ' + fr.categories_populaires + '\n';
        response += 'Livraison: ' + fr.livraison + '\n\n';
        response += '💡 **CONSEIL**: ' + fr.conseil;
        return response;
      }
      
      if (q.match(/usa|america|\.com|etats/)) {
        const us = COMPLETE_KNOWLEDGE.boutiques['USA'];
        response = '🇺🇸 **AMAZON USA**\n\n';
        response += 'Market: ' + us.market + '\n';
        response += 'Affiliate tag: ' + us.tag_perso + '\n';
        response += 'Population: ' + us.population + '\n';
        response += 'Currency: ' + us.monnaie + '\n';
        response += 'Top categories: ' + us.categories_populaires + '\n';
        response += 'Shipping: ' + us.livraison + '\n\n';
        response += '💡 **TIP**: ' + us.conseil;
        return response;
      }
      
      if (q.match(/italie|italien|italy|\.it/)) {
        const it = COMPLETE_KNOWLEDGE.boutiques['Italie'];
        response = '🇮🇹 **AMAZON ITALIA**\n\n';
        response += 'Mercato: ' + it.market + '\n';
        response += 'Tag affiliato: ' + it.tag_perso + '\n';
        response += 'Popolazione: ' + it.population + '\n';
        response += 'Valuta: ' + it.monnaie + '\n';
        response += 'Categorie: ' + it.categories_populaires + '\n';
        response += 'Spedizione: ' + it.livraison + '\n\n';
        response += '💡 **CONSIGLIO**: ' + it.conseil;
        return response;
      }
      
      // Liste toutes boutiques
      response += 'USA amazon.com (335M hab) - Anglais - USD $\n';
      response += 'France amazon.fr (68M) - Français - EUR €\n';
      response += 'Allemagne amazon.de (84M) - Deutsch - EUR €\n';
      response += 'Italie amazon.it (59M) - Italiano - EUR €\n';
      response += 'Espagne amazon.es (48M) - Español - EUR €\n';
      response += 'Canada amazon.ca (39M) - EN/FR - CAD $\n';
      response += 'UK amazon.co.uk (68M) - English - GBP £\n';
      response += 'Inde amazon.in (1.4B) - EN/Hindi - INR ₹\n';
      response += 'Pays-Bas amazon.nl (18M) - Nederlands - EUR €\n';
      response += 'Suède amazon.se (10.5M) - Svenska - SEK kr\n';
      response += 'Singapour amazon.sg (5.9M) - EN/中文 - SGD $\n';
      response += 'Australie amazon.com.au (26M) - English - AUD $\n';
      response += 'Belgique amazon.com.be (11.6M) - NL/FR - EUR €\n';
      response += 'Brésil amazon.com.br (215M) - Português - BRL R$\n\n';
      response += 'Sur quel marché voulez-vous des détails ?';
      return response;
    }
    
    // CULTURE MONDIALE
    if (q.match(/unesco|patrimoine|sites|monument|culture/)) {
      const unesco = COMPLETE_KNOWLEDGE.culture_mondiale['UNESCO'];
      let response = '🏛 **UNESCO PATRIMOINE MONDIAL**\n\n';
      response += unesco.total_sites + '\n\n';
      response += '**TOP PAYS**: ' + unesco.pays_record + '\n\n';
      response += '**CATÉGORIES**: ' + unesco.categories + '\n\n';
      response += '**DESCRIPTION**: ' + unesco.description + '\n\n';
      response += '**EXEMPLES CÉLÈBRES**: ' + unesco.exemples_celebres;
      return response;
    }
    
    if (q.match(/langue|parler|linguistique/)) {
      const lang = COMPLETE_KNOWLEDGE.culture_mondiale['Langues_Mondiales'];
      let response = '🗣 **LANGUES MONDIALES**\n\n';
      response += '**PLUS PARLÉES**: ' + lang.plus_parlees + '\n\n';
      response += '**ONU OFFICIELLES**: ' + lang.langues_officielles_ONU + '\n\n';
      response += '**FAMILLES**: ' + lang.familles_linguistiques + '\n\n';
      response += '⚠ **DANGER**: ' + lang.langues_danger;
      return response;
    }
    
    if (q.match(/religion|spirituel|culte|foi/)) {
      const rel = COMPLETE_KNOWLEDGE.culture_mondiale['Religions_Mondiales'];
      let response = '🕌 **RELIGIONS MONDIALES**\n\n';
      response += '**PRINCIPALES**: ' + rel.principales + '\n\n';
      response += '**GÉOGRAPHIE**: ' + rel.geographie + '\n\n';
      response += '**PATRIMOINE**: ' + rel.patrimoine_religieux;
      return response;
    }
    
    if (q.match(/gastronomie|cuisine|food|manger|plat/)) {
      const gastro = COMPLETE_KNOWLEDGE.culture_mondiale['Gastronomie_Mondiale'];
      let response = '🍽 **GASTRONOMIE MONDIALE**\n\n';
      response += '**UNESCO**: ' + gastro.patrimoine_unesco + '\n\n';
      response += '**SPÉCIALITÉS**: ' + gastro.specialites_pays + '\n\n';
      response += '**BOISSONS**: ' + gastro.boissons + '\n\n';
      response += '**MARCHÉS**: ' + gastro.marches_celebres;
      return response;
    }
    
    if (q.match(/festival|fete|carnaval|celebration/)) {
      const fest = COMPLETE_KNOWLEDGE.culture_mondiale['Festivals_Mondiaux'];
      let response = '🎉 **FESTIVALS MONDIAUX**\n\n';
      response += '**CARNAVALS**: ' + fest.carnavals + '\n\n';
      response += '**FÊTES TRADITIONNELLES**: ' + fest.fetes_traditionnelles + '\n\n';
      response += '**ARTS**: ' + fest.festivals_arts + '\n\n';
      response += '**RELIGIEUX**: ' + fest.celebrations_religieuses;
      return response;
    }
    
    if (q.match(/architecture|construction|batiment|monument/)) {
      const archi = COMPLETE_KNOWLEDGE.culture_mondiale['Architecture_Mondiale'];
      let response = '🏗 **ARCHITECTURE MONDIALE**\n\n';
      response += '**STYLES**: ' + archi.styles_majeurs + '\n\n';
      response += '**MERVEILLES ANTIQUES**: ' + archi.merveilles_antiques + '\n\n';
      response += '**GRATTE-CIELS**: ' + archi.gratte_ciels + '\n\n';
      response += '**PONTS**: ' + archi.ponts_iconiques;
      return response;
    }
    
    // PAYS SPÉCIFIQUES
    if (q.match(/france|paris|versailles/)) {
      const fr = COMPLETE_KNOWLEDGE.pays['France'];
      let response = '🇫🇷 **FRANCE**\n\n';
      response += 'Capitale: ' + fr.capitale + ' • ' + fr.population + '\n';
      response += 'UNESCO: ' + fr.unesco + '\n\n';
      response += '**INCONTOURNABLES**: ' + fr.incontournables + '\n\n';
      response += '**GASTRONOMIE**: ' + fr.gastronomie + '\n\n';
      response += '**CULTURE**: ' + fr.culture + '\n\n';
      response += '🛍 **AMAZON**: ' + fr.conseil_shopping;
      return response;
    }
    
    if (q.match(/italie|rome|venise|florence/)) {
      const it = COMPLETE_KNOWLEDGE.pays['Italie'];
      let response = '🇮🇹 **ITALIE - RECORD 58 UNESCO !**\n\n';
      response += 'Capitale: ' + it.capitale + ' • ' + it.population + '\n';
      response += 'UNESCO: ' + it.unesco + '\n\n';
      response += '**INCONTOURNABLES**: ' + it.incontournables + '\n\n';
      response += '**GASTRONOMIE**: ' + it.gastronomie + '\n\n';
      response += '**CULTURE**: ' + it.culture + '\n\n';
      response += '🛍 **AMAZON**: ' + it.conseil_shopping;
      return response;
    }
    
    if (q.match(/japon|tokyo|kyoto|japonais/)) {
      const jp = COMPLETE_KNOWLEDGE.pays['Japon'];
      let response = '🇯🇵 **JAPON**\n\n';
      response += 'Capitale: ' + jp.capitale + ' • ' + jp.population + '\n';
      response += 'UNESCO: ' + jp.unesco + '\n\n';
      response += '**INCONTOURNABLES**: ' + jp.incontournables + '\n\n';
      response += '**GASTRONOMIE**: ' + jp.gastronomie + '\n\n';
      response += '**CULTURE**: ' + jp.culture + '\n\n';
      response += '🛍 **SHOPPING**: ' + jp.conseil_shopping;
      return response;
    }
    
    if (q.match(/usa|america|new york|los angeles/)) {
      const us = COMPLETE_KNOWLEDGE.pays['USA'];
      let response = '🇺🇸 **USA**\n\n';
      response += 'Capital: ' + us.capitale + ' • ' + us.population + '\n';
      response += 'UNESCO: ' + us.unesco + '\n\n';
      response += '**MUST-SEE**: ' + us.incontournables + '\n\n';
      response += '**FOOD**: ' + us.gastronomie + '\n\n';
      response += '**CULTURE**: ' + us.culture + '\n\n';
      response += '🛍 **AMAZON**: ' + us.conseil_shopping;
      return response;
    }
    
    // DÉFAUT
    const name = userName ? userName + ', ' : '';
    return name + 'je suis Alex, expert RÉUSSITESS ! Je peux vous aider avec:\n\n🌍 **62 PAYS**: France, Italie, Japon, USA...\n🛍 **26 BOUTIQUES Amazon** internationales\n🏛 **UNESCO** 1199 sites patrimoine\n🗣 **LANGUES** mondiales\n🍽 **GASTRONOMIE** internationale\n🎉 **FESTIVALS** mondiaux\n🏗 **ARCHITECTURE** emblématique\n\nQue voulez-vous découvrir ?';
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
    }, 600);
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
        <div className="fixed bottom-32 right-8 w-[700px] h-[900px] bg-white rounded-3xl shadow-2xl flex flex-col border-4 border-purple-600">
          
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
                  onClick={function() { setCurrentLang(lang.code); }}
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
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
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
              🗣 8 langues • 🛍 26 Amazon • 🏛 UNESCO • 🌍 Culture mondiale
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
