import React, { useState, useEffect, useRef } from 'react';

const BotAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Détection langue navigateur
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['en', 'fr', 'de', 'es', 'it', 'pt', 'nl', 'sv'];
    setLanguage(supportedLangs.includes(browserLang) ? browserLang : 'fr');

    const welcomeMessage = getTranslation('welcome');
    setMessages([{
      id: 1,
      text: welcomeMessage,
      sender: 'bot',
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Base de données complète REUSSITESS Global Nexus
  const amazonStores = {
    americas: [
      { country: 'USA', domain: 'amazon.com', flag: '🇺🇸', tag: 'reussitess30-20' },
      { country: 'Canada', domain: 'amazon.ca', flag: '🇨🇦', tag: 'reussitess30c-20' },
      { country: 'Brazil', domain: 'amazon.com.br', flag: '🇧🇷', tag: 'reussitess30b-20' }
    ],
    europe: [
      { country: 'France', domain: 'amazon.fr', flag: '🇫🇷', tag: 'reussitess30f-21' },
      { country: 'Germany', domain: 'amazon.de', flag: '🇩🇪', tag: 'reussitess30d-21' },
      { country: 'UK', domain: 'amazon.co.uk', flag: '🇬🇧', tag: 'reussitess30-21' },
      { country: 'Italy', domain: 'amazon.it', flag: '🇮🇹', tag: 'reussitess30i-21' },
      { country: 'Spain', domain: 'amazon.es', flag: '🇪🇸', tag: 'reussitess30e-21' },
      { country: 'Netherlands', domain: 'amazon.nl', flag: '🇳🇱', tag: 'reussitess30n-21' },
      { country: 'Sweden', domain: 'amazon.se', flag: '🇸🇪', tag: 'reussitess30s-21' },
      { country: 'Belgium', domain: 'amazon.com.be', flag: '🇧🇪', tag: 'reussitess30b-21' }
    ],
    asiaPacific: [
      { country: 'India', domain: 'amazon.in', flag: '🇮🇳', tag: 'reussitess30i-21' },
      { country: 'Singapore', domain: 'amazon.sg', flag: '🇸🇬', tag: 'reussitess30s-22' },
      { country: 'Australia', domain: 'amazon.com.au', flag: '🇦🇺', tag: 'reussitess30a-22' }
    ]
  };

  // Traductions complètes
  const translations = {
    fr: {
      welcome: "👋 Bonjour ! Je suis votre assistant REUSSITESS® Global Nexus. Je parle 8 langues et je connais nos 26 boutiques Amazon dans 14 pays. Comment puis-je vous aider ?",
      placeholder: "Tapez votre message...",
      typing: "Je tape...",
      speaking: "Je parle...",
      quickReplies: ["🌍 Voir tous les pays", "⭐ Meilleures ventes", "🏪 Nos boutiques", "❓ Aide"],
      allStores: "🌍 **REUSSITESS® Global Nexus - 26 Boutiques Amazon**\n\n**🌎 Amériques (3 pays)**\n🇺🇸 USA - amazon.com\n🇨🇦 Canada - amazon.ca\n🇧🇷 Brésil - amazon.com.br\n\n**🇪🇺 Europe (8 pays)**\n🇫🇷 France - amazon.fr\n🇩🇪 Allemagne - amazon.de\n🇬🇧 Royaume-Uni - amazon.co.uk\n🇮🇹 Italie - amazon.it\n🇪🇸 Espagne - amazon.es\n🇳🇱 Pays-Bas - amazon.nl\n🇸🇪 Suède - amazon.se\n🇧🇪 Belgique - amazon.com.be\n\n**🌏 Asie-Pacifique (3 pays)**\n🇮🇳 Inde - amazon.in\n🇸🇬 Singapour - amazon.sg\n🇦🇺 Australie - amazon.com.au\n\n✨ Total : 14 pays, 26 boutiques (14 personnelles + 12 influenceurs)",
      help: "🤖 **Je peux vous aider à :**\n\n✅ Trouver des produits dans 26 boutiques Amazon\n✅ Comparer les prix entre pays\n✅ Recommander les meilleures ventes\n✅ Vous guider vers nos boutiques thématiques\n✅ Répondre en 8 langues : FR, EN, DE, ES, IT, PT, NL, SV\n✅ Parler vocalement dans votre langue\n\n💡 Essayez : 'Montre-moi les boutiques européennes' ou 'Je cherche un laptop'",
      boutiques: "🏪 **Nos Boutiques REUSSITESS®**\n\n**14 Boutiques Personnelles**\nCollections soigneusement sélectionnées par nos experts\n\n**12 Boutiques Influenceurs**\nSélections tendance de nos partenaires\n\nQuelle boutique vous intéresse ?",
      products: "🛍️ Quel type de produit recherchez-vous ?\n\n📱 Électronique\n👔 Mode & Accessoires\n🏠 Maison & Jardin\n📚 Livres & Médias\n🎮 Jeux & Jouets\n⚽ Sports & Loisirs\n🍴 Cuisine & Alimentation\n💄 Beauté & Santé",
      bestSellers: "⭐ **Nos Catégories Best-Sellers**\n\n📱 High-Tech & Électronique\n👗 Mode Homme & Femme\n🏡 Décoration & Meubles\n📖 Livres & E-books\n🎮 Gaming & Consoles\n💻 Informatique\n\nDans quel pays souhaitez-vous voir les meilleures ventes ?",
      error: "😊 Désolé, je n'ai pas bien compris. Essayez :\n• 'pays' ou 'boutiques'\n• 'aide' ou 'help'\n• Nommez un produit"
    },
    en: {
      welcome: "👋 Hello! I'm your REUSSITESS® Global Nexus assistant. I speak 8 languages and know our 26 Amazon stores in 14 countries. How can I help you?",
      placeholder: "Type your message...",
      typing: "I'm typing...",
      speaking: "I'm speaking...",
      quickReplies: ["🌍 All countries", "⭐ Best sellers", "🏪 Our stores", "❓ Help"],
      allStores: "🌍 **REUSSITESS® Global Nexus - 26 Amazon Stores**\n\n**🌎 Americas (3 countries)**\n🇺🇸 USA - amazon.com\n🇨🇦 Canada - amazon.ca\n🇧🇷 Brazil - amazon.com.br\n\n**🇪🇺 Europe (8 countries)**\n🇫🇷 France - amazon.fr\n🇩🇪 Germany - amazon.de\n🇬🇧 United Kingdom - amazon.co.uk\n🇮🇹 Italy - amazon.it\n🇪🇸 Spain - amazon.es\n🇳🇱 Netherlands - amazon.nl\n🇸🇪 Sweden - amazon.se\n🇧🇪 Belgium - amazon.com.be\n\n**🌏 Asia-Pacific (3 countries)**\n🇮🇳 India - amazon.in\n🇸🇬 Singapore - amazon.sg\n🇦🇺 Australia - amazon.com.au\n\n✨ Total: 14 countries, 26 stores (14 personal + 12 influencers)",
      help: "🤖 **I can help you:**\n\n✅ Find products in 26 Amazon stores\n✅ Compare prices between countries\n✅ Recommend best sellers\n✅ Guide you to themed stores\n✅ Respond in 8 languages: EN, FR, DE, ES, IT, PT, NL, SV\n✅ Speak vocally in your language\n\n💡 Try: 'Show European stores' or 'I need a laptop'",
      boutiques: "🏪 **Our REUSSITESS® Stores**\n\n**14 Personal Boutiques**\nCarefully curated collections by our experts\n\n**12 Influencer Boutiques**\nTrending selections from our partners\n\nWhich store interests you?",
      products: "🛍️ What type of product are you looking for?\n\n📱 Electronics\n👔 Fashion & Accessories\n🏠 Home & Garden\n📚 Books & Media\n🎮 Games & Toys\n⚽ Sports & Leisure\n🍴 Kitchen & Food\n💄 Beauty & Health",
      bestSellers: "⭐ **Our Best-Seller Categories**\n\n📱 High-Tech & Electronics\n👗 Men's & Women's Fashion\n🏡 Decor & Furniture\n📖 Books & E-books\n🎮 Gaming & Consoles\n💻 Computing\n\nWhich country's best sellers would you like to see?",
      error: "😊 Sorry, I didn't understand. Try:\n• 'countries' or 'stores'\n• 'help'\n• Name a product"
    },
    de: {
      welcome: "👋 Hallo! Ich bin Ihr REUSSITESS® Global Nexus Assistent. Ich spreche 8 Sprachen und kenne unsere 26 Amazon-Shops in 14 Ländern. Wie kann ich helfen?",
      placeholder: "Nachricht eingeben...",
      typing: "Ich tippe...",
      speaking: "Ich spreche...",
      quickReplies: ["🌍 Alle Länder", "⭐ Bestseller", "🏪 Unsere Shops", "❓ Hilfe"],
      allStores: "🌍 **REUSSITESS® Global Nexus - 26 Amazon-Shops**\n\n**🌎 Amerika (3 Länder)**\n🇺🇸 USA - amazon.com\n🇨🇦 Kanada - amazon.ca\n🇧🇷 Brasilien - amazon.com.br\n\n**🇪🇺 Europa (8 Länder)**\n🇫🇷 Frankreich - amazon.fr\n🇩🇪 Deutschland - amazon.de\n🇬🇧 UK - amazon.co.uk\n🇮🇹 Italien - amazon.it\n🇪🇸 Spanien - amazon.es\n🇳🇱 Niederlande - amazon.nl\n🇸🇪 Schweden - amazon.se\n🇧🇪 Belgien - amazon.com.be\n\n**🌏 Asien-Pazifik (3 Länder)**\n🇮🇳 Indien - amazon.in\n🇸🇬 Singapur - amazon.sg\n🇦🇺 Australien - amazon.com.au\n\n✨ Gesamt: 14 Länder, 26 Shops",
      help: "🤖 **Ich kann helfen:**\n\n✅ Produkte in 26 Amazon-Shops finden\n✅ Preise vergleichen\n✅ Bestseller empfehlen\n✅ 8 Sprachen sprechen\n✅ Sprachausgabe",
      boutiques: "🏪 **Unsere Boutiquen**\n\n14 Persönliche Boutiquen\n12 Influencer-Boutiquen",
      products: "🛍️ Welche Produkte suchen Sie?\n\n📱 Elektronik\n👔 Mode\n🏠 Haus & Garten\n📚 Bücher",
      bestSellers: "⭐ **Bestseller-Kategorien**\n\n📱 Elektronik\n👗 Mode\n🏡 Möbel\n📖 Bücher",
      error: "😊 Nicht verstanden. Versuchen Sie:\n• 'Länder' oder 'Hilfe'\n• Produktname"
    },
    es: {
      welcome: "👋 ¡Hola! Soy tu asistente REUSSITESS® Global Nexus. Hablo 8 idiomas y conozco nuestras 26 tiendas Amazon en 14 países. ¿Cómo puedo ayudarte?",
      placeholder: "Escribe tu mensaje...",
      typing: "Estoy escribiendo...",
      speaking: "Estoy hablando...",
      quickReplies: ["🌍 Todos países", "⭐ Más vendidos", "🏪 Nuestras tiendas", "❓ Ayuda"],
      allStores: "🌍 **REUSSITESS® Global Nexus - 26 Tiendas Amazon**\n\n**🌎 Américas (3 países)**\n🇺🇸 USA - amazon.com\n🇨🇦 Canadá - amazon.ca\n🇧🇷 Brasil - amazon.com.br\n\n**🇪🇺 Europa (8 países)**\n🇫🇷 Francia - amazon.fr\n🇩🇪 Alemania - amazon.de\n🇬🇧 UK - amazon.co.uk\n🇮🇹 Italia - amazon.it\n🇪🇸 España - amazon.es\n🇳🇱 Países Bajos - amazon.nl\n🇸🇪 Suecia - amazon.se\n🇧🇪 Bélgica - amazon.com.be\n\n**🌏 Asia-Pacífico (3 países)**\n🇮🇳 India - amazon.in\n🇸🇬 Singapur - amazon.sg\n🇦🇺 Australia - amazon.com.au\n\n✨ Total: 14 países, 26 tiendas",
      help: "🤖 **Puedo ayudarte:**\n\n✅ Encontrar productos en 26 tiendas\n✅ Comparar precios\n✅ Recomendar más vendidos\n✅ 8 idiomas\n✅ Voz",
      boutiques: "🏪 **Nuestras Boutiques**\n\n14 Boutiques Personales\n12 Boutiques Influencers",
      products: "🛍️ ¿Qué producto buscas?\n\n📱 Electrónica\n👔 Moda\n🏠 Hogar\n📚 Libros",
      bestSellers: "⭐ **Categorías Populares**\n\n📱 Electrónica\n👗 Moda\n🏡 Muebles\n📖 Libros",
      error: "😊 No entendí. Prueba:\n• 'países' o 'ayuda'\n• Nombre de producto"
    },
    it: {
      welcome: "👋 Ciao! Sono il tuo assistente REUSSITESS® Global Nexus. Parlo 8 lingue e conosco i nostri 26 negozi Amazon in 14 paesi. Come posso aiutarti?",
      placeholder: "Scrivi il tuo messaggio...",
      typing: "Sto scrivendo...",
      speaking: "Sto parlando...",
      quickReplies: ["🌍 Tutti i paesi", "⭐ Più venduti", "🏪 I nostri negozi", "❓ Aiuto"],
      allStores: "🌍 **REUSSITESS® Global Nexus - 26 Negozi Amazon**\n\n**🌎 Americhe (3 paesi)**\n🇺🇸 USA - amazon.com\n🇨🇦 Canada - amazon.ca\n🇧🇷 Brasile - amazon.com.br\n\n**🇪🇺 Europa (8 paesi)**\n🇫🇷 Francia - amazon.fr\n🇩🇪 Germania - amazon.de\n🇬🇧 UK - amazon.co.uk\n🇮🇹 Italia - amazon.it\n🇪🇸 Spagna - amazon.es\n🇳🇱 Paesi Bassi - amazon.nl\n🇸🇪 Svezia - amazon.se\n🇧🇪 Belgio - amazon.com.be\n\n**🌏 Asia-Pacifico (3 paesi)**\n🇮🇳 India - amazon.in\n🇸🇬 Singapore - amazon.sg\n🇦🇺 Australia - amazon.com.au\n\n✨ Totale: 14 paesi, 26 negozi",
      help: "🤖 **Posso aiutarti:**\n\n✅ Trovare prodotti in 26 negozi\n✅ Confrontare prezzi\n✅ Raccomandare più venduti\n✅ 8 lingue\n✅ Voce",
      boutiques: "🏪 **Le Nostre Boutique**\n\n14 Boutique Personali\n12 Boutique Influencer",
      products: "🛍️ Che prodotto cerchi?\n\n📱 Elettronica\n👔 Moda\n🏠 Casa\n📚 Libri",
      bestSellers: "⭐ **Categorie Popolari**\n\n📱 Elettronica\n👗 Moda\n🏡 Mobili\n📖 Libri",
      error: "😊 Non ho capito. Prova:\n• 'paesi' o 'aiuto'\n• Nome prodotto"
    },
    pt: {
      welcome: "👋 Olá! Sou seu assistente REUSSITESS® Global Nexus. Falo 8 idiomas e conheço nossas 26 lojas Amazon em 14 países. Como posso ajudar?",
      placeholder: "Digite sua mensagem...",
      typing: "Estou digitando...",
      speaking: "Estou falando...",
      quickReplies: ["🌍 Todos países", "⭐ Mais vendidos", "🏪 Nossas lojas", "❓ Ajuda"],
      allStores: "🌍 **REUSSITESS® Global Nexus - 26 Lojas Amazon**\n\n**🌎 Américas (3 países)**\n🇺🇸 EUA - amazon.com\n🇨🇦 Canadá - amazon.ca\n🇧🇷 Brasil - amazon.com.br\n\n**🇪🇺 Europa (8 países)**\n🇫🇷 França - amazon.fr\n🇩🇪 Alemanha - amazon.de\n🇬🇧 UK - amazon.co.uk\n🇮🇹 Itália - amazon.it\n🇪🇸 Espanha - amazon.es\n🇳🇱 Holanda - amazon.nl\n🇸🇪 Suécia - amazon.se\n🇧🇪 Bélgica - amazon.com.be\n\n**🌏 Ásia-Pacífico (3 países)**\n🇮🇳 Índia - amazon.in\n🇸🇬 Singapura - amazon.sg\n🇦🇺 Austrália - amazon.com.au\n\n✨ Total: 14 países, 26 lojas",
      help: "🤖 **Posso ajudar:**\n\n✅ Encontrar produtos em 26 lojas\n✅ Comparar preços\n✅ Recomendar mais vendidos\n✅ 8 idiomas\n✅ Voz",
      boutiques: "🏪 **Nossas Boutiques**\n\n14 Boutiques Pessoais\n12 Boutiques Influenciadores",
      products: "🛍️ Que produto procura?\n\n📱 Eletrônicos\n👔 Moda\n🏠 Casa\n📚 Livros",
      bestSellers: "⭐ **Categorias Populares**\n\n📱 Eletrônicos\n👗 Moda\n🏡 Móveis\n📖 Livros",
      error: "😊 Não entendi. Tente:\n• 'países' ou 'ajuda'\n• Nome do produto"
    },
    nl: {
      welcome: "👋 Hallo! Ik ben je REUSSITESS® Global Nexus assistent. Ik spreek 8 talen en ken onze 26 Amazon-winkels in 14 landen. Hoe kan ik helpen?",
      placeholder: "Typ je bericht...",
      typing: "Ik typ...",
      speaking: "Ik spreek...",
      quickReplies: ["🌍 Alle landen", "⭐ Bestsellers", "🏪 Onze winkels", "❓ Help"],
      allStores: "🌍 **REUSSITESS® Global Nexus - 26 Amazon-winkels**\n\n14 landen, 26 winkels",
      help: "🤖 **Ik kan helpen:**\n\n✅ Producten vinden\n✅ Prijzen vergelijken\n✅ 8 talen spreken",
      boutiques: "🏪 **Onze Boutiques**\n\n14 Persoonlijke\n12 Influencer",
      products: "🛍️ Welk product zoek je?\n\n📱 Elektronica\n👔 Mode\n🏠 Huis\n📚 Boeken",
      bestSellers: "⭐ **Populaire Categorieën**\n\n📱 Elektronica\n👗 Mode\n🏡 Meubels\n📖 Boeken",
      error: "😊 Niet begrepen. Probeer:\n• 'landen' of 'help'\n• Productnaam"
    },
    sv: {
      welcome: "👋 Hej! Jag är din REUSSITESS® Global Nexus assistent. Jag talar 8 språk och känner till våra 26 Amazon-butiker i 14 länder. Hur kan jag hjälpa?",
      placeholder: "Skriv ditt meddelande...",
      typing: "Jag skriver...",
      speaking: "Jag talar...",
      quickReplies: ["🌍 Alla länder", "⭐ Bästsäljare", "🏪 Våra butiker", "❓ Hjälp"],
      allStores: "🌍 **REUSSITESS® Global Nexus - 26 Amazon-butiker**\n\n14 länder, 26 butiker",
      help: "🤖 **Jag kan hjälpa:**\n\n✅ Hitta produkter\n✅ Jämföra priser\n✅ 8 språk",
      boutiques: "🏪 **Våra Boutiques**\n\n14 Personliga\n12 Influencer",
      products: "🛍️ Vilken produkt söker du?\n\n📱 Elektronik\n👔 Mode\n🏠 Hem\n📚 Böcker",
      bestSellers: "⭐ **Populära Kategorier**\n\n📱 Elektronik\n👗 Mode\n🏡 Möbler\n📖 Böcker",
      error: "😊 Förstod inte. Försök:\n• 'länder' eller 'hjälp'\n• Produktnamn"
    }
  };

  const getTranslation = (key) => {
    return translations[language]?.[key] || translations['fr'][key] || '';
  };

  // Fonction Text-to-Speech
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voiceMap = {
        'fr': 'fr-FR',
        'en': 'en-US',
        'de': 'de-DE',
        'es': 'es-ES',
        'it': 'it-IT',
        'pt': 'pt-PT',
        'nl': 'nl-NL',
        'sv': 'sv-SE'
      };
      
      utterance.lang = voiceMap[language] || 'fr-FR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Analyse intelligente
  const analyzeMessage = (message) => {
    const lowerMsg = message.toLowerCase();
    
    const greetings = ['hello', 'hi', 'bonjour', 'salut', 'hola', 'ciao', 'hallo', 'hej'];
    if (greetings.some(g => lowerMsg.includes(g))) {
      return { intent: 'greeting', confidence: 0.9 };
    }

    const countryKeywords = ['pays', 'country', 'countries', 'boutique', 'store', 'shop', 'land', 'país'];
    if (countryKeywords.some(k => lowerMsg.includes(k))) {
      return { intent: 'allStores', confidence: 0.9 };
    }

    const helpKeywords = ['help', 'aide', 'ayuda', 'aiuto', 'hilfe', 'ajuda', 'hjälp'];
    if (helpKeywords.some(k => lowerMsg.includes(k))) {
      return { intent: 'help', confidence: 0.9 };
    }

    const productKeywords = ['produit', 'product', 'cherche', 'find', 'search', 'buscar', 'cerca'];
    if (productKeywords.some(k => lowerMsg.includes(k))) {
      return { intent: 'products', confidence: 0.8 };
    }

    const bestSellerKeywords = ['best', 'meilleur', 'popular', 'top', 'mejor', 'migliore'];
    if (bestSellerKeywords.some(k => lowerMsg.includes(k))) {
      return { intent: 'bestSellers', confidence: 0.8 };
    }

    return { intent: 'error', confidence: 0.5 };
  };

  const generateResponse = (userMessage) => {
    const analysis = analyzeMessage(userMessage);
    return getTranslation(analysis.intent);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateResponse(inputMessage);
      const botMsg = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      
      // Parler la réponse
      speak(botResponse);
    }, 800 + Math.random() * 1200);
  };

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Drapeaux des langues
  const languageFlags = {
    fr: '🇫🇷',
    en: '🇬🇧',
    de: '🇩🇪',
    es: '🇪🇸',
    it: '🇮🇹',
    pt: '🇵🇹',
    nl: '🇳🇱',
    sv: '🇸🇪'
  };

  return (
    <>
      {/* Bouton robot flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 z-50 group"
        style={{ 
          animation: 'pulse-glow 2s infinite',
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)'
        }}
        aria-label="Assistant REUSSITESS"
      >
        <div className="text-4xl transform group-hover:rotate-12 transition-transform">
          🤖
        </div>
        {!isOpen && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
            !
          </div>
        )}
      </button>

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 w-[420px] h-[650px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 border-2 border-purple-200" style={{ animation: 'slide-up 0.4s ease-out' }}>
          
          {/* En-tête avec drapeaux */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-3xl">
                  🤖
                </div>
                <div>
                  <h3 className="font-bold text-xl">REUSSITESS® Bot</h3>
                  <p className="text-sm opacity-90">
                    {isSpeaking ? '🔊 ' + getTranslation('speaking') : isTyping ? '⌨️ ' + getTranslation('typing') : '🟢 En ligne 24/7'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Sélecteur de langue avec drapeaux */}
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.entries(languageFlags).map(([lang, flag]) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-2 rounded-xl text-2xl transition-all ${
                    language === lang 
                      ? 'bg-white bg-opacity-30 scale-110 shadow-lg' 
                      : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                  }`}
                  title={lang.toUpperCase()}
                >
                  {flag}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ animation: 'fade-in 0.3s ease-out' }}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white text-gray-800 border-2 border-purple-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.sender === 'bot' && (
                      <button
                        onClick={() => speak(message.text)}
                        className="text-purple-600 hover:text-purple-800 ml-2"
                        title="Écouter"
                      >
                        🔊
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start" style={{ animation: 'fade-in 0.3s ease-out' }}>
                <div className="bg-white rounded-2xl px-6 py-4 shadow-md border-2 border-purple-100">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-t-2 border-purple-100">
            <div className="flex flex-wrap gap-2 justify-center">
              {getTranslation('quickReplies').map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t-2 border-purple-100">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={getTranslation('placeholder')}
                className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(139, 92, 246, 0.4);
          }
          50% {
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.6);
          }
        }
      `}</style>
    </>
  );
};

export default BotAssistant;
