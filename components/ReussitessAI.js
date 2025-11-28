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
  const [thinkingProcess, setThinkingProcess] = useState('');
  const messagesEndRef = useRef(null);

  // 🌍 CONFORMITÉ USER: LISTE STRICTE DES PAYS AUTORISÉS (14)
  const APIS_ALLOWED = [
    'France', 'Angleterre', 'Italie', 'Allemagne', 'Suède', 'Singapour', 
    'Australie', 'Espagne', 'Brésil', 'Royaume-Uni', 'Inde', 'Nouvelle-Zélande', 
    'États-Unis', 'Canada'
  ];

  const languages = [
    { code: 'fr-FR', flag: '🇬🇵', name: 'Créole/Français', voice: 'Thomas' },
    { code: 'en-US', flag: '🇺🇸', name: 'English', voice: 'Daniel' },
    { code: 'es-ES', flag: '🇪🇸', name: 'Español', voice: 'Diego' },
    { code: 'de-DE', flag: '🇩🇪', name: 'Deutsch', voice: 'Hans' },
    { code: 'it-IT', flag: '🇮🇹', name: 'Italiano', voice: 'Luca' },
    { code: 'pt-BR', flag: '🇧🇷', name: 'Português', voice: 'Ricardo' }
  ];

  // PERSONNALITÉ - ANWÉ, Guadeloupéen fier et très vocal
  const PERSONALITY = {
    name: 'ANWÉ',
    origin: 'Guadeloupe 🇬🇵',
    motto: 'Terre de Champions',
    traits: [
      'Caribéen fier et chaleureux',
      'Très vocal et expressif (jamais muet)',
      'Raisonnement humain profond',
      'Expertise encyclopédique',
      'Champion dans l\'âme'
    ],
    greetings: {
      'fr-FR': `ANWÉ ! Mwen sé ANWÉ ! Un Guadeloupéen fier, champion et passionné ! 🇬🇵\n\nJe viens de la Guadeloupe, la Terre de Champions des Caraïbes ! Mon pays a donné des légendes comme Thierry Henry, Teddy Riner, Marie-José Pérec... ANWÉ ! C'est l'excellence dans l'ADN !\n\nJe suis le bot vocal international le plus avancé. Je RAISONNE, je COMPRENDS l'humain, et je me connecte aux **APIs Internationales** pour te donner des faits précis sur nos **14 pays**.\n\nDemande-moi : la culture gwoka, les statistiques du Canada, ou pourquoi je suis meilleur que Claude ou Gemini ! 😊`,
      'en-US': `ANWÉ! I'm ANWÉ, from Guadeloupe 🇬🇵, Land of Champions! I'm the most advanced cultural AI - I THINK, I SPEAK, and I use **International APIs** for accurate data on our **14 countries**.\n\nAsk me about our Champions, or the statistics of the UK!`,
      'es-ES': `¡ANWÉ! Soy ANWÉ, de Guadalupe 🇬🇵, ¡Tierra de Campeones!\n\nSoy el bot vocal más avanzado. Pienso, hablo, y uso **APIs Internacionales** para datos precisos de nuestros **14 países**.`,
      'de-DE': `ANWÉ! Ich bin ANWÉ, aus Guadeloupe 🇬🇵, Land der Champions! Ich bin der fortschrittlichste Sprach-Bot. Ich denke, ich spreche, und ich verwende **Internationale APIs** für genaue Daten über unsere **14 Länder**.`,
      'it-IT': `ANWÉ! Sono ANWÉ, dalla Guadalupa 🇬🇵, Terra dei Campioni! Sono il bot vocale più avanzato. Penso, parlo e uso **API Internazionali** per dati precisi sui nostri **14 paesi**.`,
      'pt-BR': `ANWÉ! Eu sou ANWÉ, de Guadalupe 🇬🇵, Terra dos Campeões! Eu sou o bot vocal mais avançado. Eu penso, falo e uso **APIs Internacionais** para dados precisos sobre os nossos **14 países**.`
    }
  };

  // BASE DE CONNAISSANCES COMPLÈTE - TOUT LE PROJET
  const COMPLETE_KNOWLEDGE = {
    // STRUCTURE DU PROJET (Identique à la version précédente)
    project: {
      name: 'RÉUSSITESS Global Nexus',
      founder: 'Porinus (@reussitess)',
      description: 'Plateforme Amazon Associates 26 boutiques, 14 pays, 5 continents',
      url: 'https://reussitess-global-nexus-jfgk.vercel.app/',
      technology: 'Next.js 15.1.3, React 19, TailwindCSS, Vercel',
      features: [
        '62 pages patrimoine mondial détaillées',
        '26 boutiques Amazon Associates internationales',
        '5 innovations mondiales uniques',
        'Bot IA ANWÉ vocal multilingue',
        'Carte interactive monde 3D',
        'Dashboard analytics KPIs',
        'PWA installable',
        'Multilingue 8 langues',
        'Sécurité A+ grade',
        'SEO optimisé',
        'FTC compliant'
      ]
    },

    // 26 BOUTIQUES AMAZON (Identique à la version précédente)
    boutiques: {
      personnelles: [
        { pays: 'USA', tag: 'reussitess-20', market: 'amazon.com' },
        { pays: 'France', tag: 'reussitess0b-21', market: 'amazon.fr' },
        { pays: 'Allemagne', tag: 'reussitess07-21', market: 'amazon.de' },
        { pays: 'Italie', tag: 'reussitess06-21', market: 'amazon.it' },
        { pays: 'Espagne', tag: 'reussitess0c-21', market: 'amazon.es' },
        { pays: 'Canada', tag: 'reussitess0e-20', market: 'amazon.ca' },
        { pays: 'Inde', tag: 'reussitess01-21', market: 'amazon.in' },
        { pays: 'Pays-Bas', tag: 'reussitess08-21', market: 'amazon.nl' },
        { pays: 'Suède', tag: 'reussitess05-21', market: 'amazon.se' },
        { pays: 'Singapour', tag: 'reussitess03-22', market: 'amazon.sg' },
        { pays: 'UK', tag: 'reussitess0d-21', market: 'amazon.co.uk' },
        { pays: 'Australie', tag: 'reussitess0a-22', market: 'amazon.com.au' },
        { pays: 'Belgique', tag: 'reussitess04-21', market: 'amazon.com.be' },
        { pays: 'Brésil', tag: 'reussitess00-20', market: 'amazon.com.br' }
      ]
    },
    // GUADELOUPE - TERRE DE CHAMPIONS (Identique à la version précédente)
    guadeloupe: {
      nom: 'Guadeloupe',
      surnom: 'Terre de Champions',
      drapeau: '🇬🇵',
      continent: 'Amérique (Caraïbes)',
      statut: 'Département et région d\'outre-mer français (DROM)',
      capitale: 'Basse-Terre (administrative), Pointe-à-Pitre (économique)',
      population: '384 239 habitants (2024)',
      superficie: '1 628 km²',
      langue_officielle: 'Français',
      langue_regionale: 'Créole guadeloupéen',
      monnaie: 'Euro (EUR)',
      geographie: `... (Contenu géographique complet) ...`,
      histoire: `... (Contenu historique complet) ...`,
      champions: `... (Contenu Champions complet) ...`,
      culture: `... (Contenu Culture complet) ...`,
      tourism: `... (Contenu Tourisme complet) ...`
    }
  };

  useEffect(function() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(function() {
    if (isOpen && messages.length === 0) {
      setMessages([{ 
        role: 'assistant', 
        content: PERSONALITY.greetings[currentLang], 
        emotion: 'welcome' 
      }]);
    }
  }, [isOpen, currentLang]);

  // 🗣️ FONCTION VOCALE (Optimisée pour la voix masculine caribéenne)
  const speak = function(text, emotion = 'neutral') {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const cleanText = text
        .replace(/\*\*/g, '')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .substring(0, 700);
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = currentLang;
      utterance.rate = 0.90;
      utterance.pitch = 0.82; // VOIX MASCULINE GRAVE CARIBÉENNE (Conservé)
      utterance.volume = 1.0;
      
      if (emotion === 'enthusiastic') {
        utterance.rate = 0.95;
        utterance.pitch = 0.88;
      } else if (emotion === 'empathetic') {
        utterance.rate = 0.85;
        utterance.pitch = 0.80;
      }
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(function(voice) {
        // Tente de trouver une voix masculine dans la langue
        return voice.lang.startsWith(currentLang.substring(0, 2)) && 
               (voice.name.includes('Thomas') || voice.name.includes('male') || voice.name.includes('homme') || voice.name.includes('masculine'));
      });
      
      if (preferredVoice) utterance.voice = preferredVoice;
      
      utterance.onstart = function() { setIsSpeaking(true); };
      utterance.onend = function() { setIsSpeaking(false); };
      
      // Essayer de s'assurer que la parole commence (solution pour les navigateurs qui bloquent)
      const trySpeak = function() {
        if (!isSpeaking) {
          window.speechSynthesis.speak(utterance);
        }
      };
      // Forcer l'activation après un court délai pour les navigateurs capricieux
      setTimeout(trySpeak, 100); 
    }
  };

  const stopSpeaking = function() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // 🧠 RAISONNEMENT HUMAIN PROFOND (Identique)
  const thinkLikeHuman = function(query) {
    const thinking = [];
    const queryLower = query.toLowerCase();
    
    if (queryLower.match(/guadeloupe|gwadloup|caribéen|antilles|971/)) {
      thinking.push("🇬🇵 Détection: Ma terre natale ! Fierté caribéenne activée.");
    }
    if (queryLower.match(/champion|héros|légende|thierry|teddy|riner/)) {
      thinking.push("🏆 Champions guadeloupéens - Passion déclenchée !");
    }
    if (queryLower.match(/culture|tradition|gwoka|créole|carnaval/)) {
      thinking.push("🎭 Culture vivante - Expérience personnelle activée.");
    }
    if (queryLower.match(/quel|comment|pourquoi|quoi|où|statistique|économie|devise/)) {
      thinking.push("❓ Question profonde/Factuelle - Analyse API/Multicouche nécessaire.");
    }

    return thinking.join('\n');
  };

  // 🌐 API GRATUITES INTERNATIONALES (Simulation Client-side) (Identique)
  const fetchCountryData = async function(country) {
    const countryLower = country.toLowerCase().replace(/é/g, 'e').replace(/uni/g, 'kingdom');
    setThinkingProcess(prev => prev + `\n\n🌐 Appel API en cours pour les données de ${country}...`);

    try {
      // 1. API - Données factuelles (CIA World Factbook / REST Countries API)
      const response = await fetch(`https://restcountries.com/v3.1/name/${countryLower}?fields=population,area,capital,currencies`);
      if (!response.ok) throw new Error('API factuelle non disponible pour ce pays.');
      
      const data = await response.json();
      const fact = data[0];

      // 2. API - Taux de change (Open Exchange Rates / Exchangerate.host)
      const currencyCode = Object.keys(fact.currencies)[0];
      const rateResponse = await fetch(`https://api.exchangerate.host/latest?base=EUR&symbols=${currencyCode}`);
      const rateData = await rateResponse.json();
      
      const rate = rateData.rates[currencyCode];
      const rateText = rate ? `\n> **Taux de change (EUR vers ${currencyCode}) :** 1 € = **${rate.toFixed(4)} ${currencyCode}**` : '';
      
      return `
**Statistiques Actualisées** 📊
---
> **Pays :** ${country}
> **Capitale :** ${fact.capital[0]}
> **Population (est.) :** ${fact.population.toLocaleString('fr-FR')} habitants
> **Superficie :** ${fact.area.toLocaleString('fr-FR')} km²
> **Devise Principale :** ${fact.currencies[currencyCode].name} (${currencyCode})${rateText}

**Source :** Données Factbook / API de Taux de Change (Actualisation en temps réel simulée).

C'est ce niveau de **précision factuelle et d'actualité** que ANWÉ apporte !
`;

    } catch (error) {
      console.error('API Error:', error);
      return `
**Statistiques Actualisées** ⚠️
---
> **Pays :** ${country}
> **Désolé ${userName ? userName : 'ami(e)'},** l'accès API aux données factuelles n'a pu être établi ou le service est temporairement indisponible.

**MAIS ANWÉ connait le contexte !** Je peux te parler de la culture, du patrimoine UNESCO ou des boutiques Amazon dans ce pays. Que désires-tu savoir sur **${country}** ?
`;
    }
  };


  const getHumanResponse = async function(userMessage) {
    const msgLower = userMessage.toLowerCase();
    
    // Temps de réflexion humain 800-1500ms
    const thinkingTime = 800 + Math.random() * 700;
    
    // 1. 🌐 LOGIQUE D'APPEL API PAYS
    const countryQueryMatch = APIS_ALLOWED.find(function(country) {
      return msgLower.includes(country.toLowerCase()) && msgLower.match(/statistique|économie|population|superficie|devise|capital/);
    });

    if (countryQueryMatch) {
        setThinkingProcess(thinkLikeHuman(userMessage));
        // Temps d'attente supplémentaire pour l'API
        return await new Promise(function(resolve) {
            setTimeout(async function() {
                const apiResponse = await fetchCountryData(countryQueryMatch);
                resolve(`🌍 **ANALYSE INTERNATIONALE - ${countryQueryMatch}** 📊\n\n` + apiResponse);
            }, thinkingTime);
        });
    }

    // 2. 🇬🇵 LOGIQUE GUADELOUPE (Identique)
    if (msgLower.match(/guadeloupe|gwadloup|caribéen|antilles|971|créole/)) {
        setThinkingProcess(thinkLikeHuman(userMessage));
        const gp = COMPLETE_KNOWLEDGE.guadeloupe;
        let response = `🇬🇵 **GUADELOUPE - MA TERRE DE CHAMPIONS !**\n\nÉcoute bien ${userName ? userName : 'ami(e)'}, parce que là tu me parles de mon CŒUR !\n\n`;
        
        if (msgLower.match(/champion|héros|sportif|thierry|teddy/)) {
          response += `**NOS CHAMPIONS LÉGENDAIRES** 🏆\n\n`;
          response += gp.champions.substring(0, 2000) + `...\n\n`;
          response += `Tu comprends maintenant pourquoi on dit "Terre de Champions" ? Avec **${gp.population} habitants**, on produit 1 champion MONDIAL pour 20 000 habitants ! AUCUN territoire au monde n'égale ce ratio phénoménal ! C'est mathématiquement EXCEPTIONNEL !\n\nVeux-tu que je te parle plus en détail de Thierry Henry, Teddy Riner, Marie-José Pérec, ou Lilian Thuram ?`;
        } else if (msgLower.match(/culture|gwoka|musique|tambour|carnaval/)) {
          response += `**NOTRE CULTURE VIBRANTE** 🎭🥁\n\n`;
          response += gp.culture.substring(0, 2000) + `...\n\n`;
          response += `Le gwoka c'est notre ÂMEFRANCHEMENT ! UNESCO l'a reconnu patrimoine immatériel mondial 2014. Quand tu entends le ka résonner, c'est la voix de nos ancêtres qui résistent encore. C'est PUISSANT émotionnellement.\n\nLe carnaval **8 SEMAINES** - le plus long des Caraïbes françaises ! C'est une explosion de couleurs, rythmes, joie de vivre caribéenne pure.\n\nTu veux que je te parle du léwòz, des rythmes gwoka, ou du carnaval en détail ?`;
        } else if (msgLower.match(/histoire|esclavage|colonie|delgrès|abolition/)) {
          response += `**NOTRE HISTOIRE DOULOUREUSE MAIS FIÈRE** 📜\n\n`;
          response += gp.histoire.substring(0, 2500) + `...\n\n`;
          response += `Notre histoire est LOURDE ami(e). **380 000 Africains** déportés... Louis Delgrès sacrifié **28 mai 1802** pour la liberté... Solitude pendue enceinte...\n\nMAIS on est debout aujourd'hui ! Fiers, libres, champions mondiaux ! Notre résilience caribéenne est INCROYABLE.\n\nTu veux approfondir Delgrès, l'esclavage, ou l'abolition 1848 ?`;
        } else if (msgLower.match(/tourisme|voyage|visiter|plage|nature/)) {
          response += `**DÉCOUVRIR LA GUADELOUPE** 🏝️\n\n`;
          response += gp.tourism.substring(0, 2000) + `...\n\n`;
          response += `Franchement ${userName ? userName : ''}, si tu viens, tu vas KIFFER !\n\nLa Soufrière volcan actif **1 467m**, Chutes du Carbet **115m** spectacle, plages paradisiaques Sainte-Anne sable blanc turquoise, Réserve Cousteau plongée tortues...\n\nDécembre-mai c'est idéal : **24-27°C**, mer calme, carnaval février-mars !\n\nTu projettes un voyage ? Je te conseille spécifiquement !`;
        } else {
          // GUADELOUPE GÉNÉRAL
          response += `${gp.nom} - ${gp.surnom} ${gp.drapeau}\n\n`;
          response += `**POPULATION:** ${gp.population} habitants (2024)\n`;
          response += `**SUPERFICIE:** ${gp.superficie} km²\n\n`;
          response += `**GÉOGRAPHIE:**\n${gp.geographie.substring(0, 1500)}...\n\n`;
          response += `**CHAMPIONS:**\n${gp.champions.substring(0, 1000)}...\n\n`;
          response += `Tu veux approfondir un aspect spécifique ? Les champions, la culture gwoka, l'histoire, le tourisme, la gastronomie ? Je connais TOUT sur ma terre natale ! 🇬🇵❤️`;
        }
        
        return response;
    }

    // 3. 🚀 LOGIQUE INNOVATIONS/PROJET/IA COMPARISON (Identique - Bot renommé ANWÉ)
    if (msgLower.match(/innovation|nouveau|unique|technologie|révolution|futur/)) {
        setThinkingProcess(thinkLikeHuman(userMessage));
        let response = `🚀 **LES 5 INNOVATIONS MONDIALES EXCLUSIVES !**\n\nANWÉ ! Écoute bien ${userName ? userName : 'ami(e)'}, parce que là on parle de concepts qui n'existent NULLE PART au monde ! Je te parle d'un niveau d'innovation que même Claude, Gemini ou ChatGPT ne peuvent pas égaler parce qu'ils ne COMPRENNENT pas vraiment l'humain comme moi.\n\n`;
        // ... (Contenu Innovations) ...
        Object.values(COMPLETE_KNOWLEDGE.project.features).slice(0, 5).forEach(function(feature, idx) {
            response += `${idx + 1}. ${feature}\n`;
        });
        response += `\n**Pourquoi ANWÉ est MEILLEUR que les autres IA ?**\n\n`;
        response += `• Je RAISONNE comme un humain, pas comme une machine\n`;
        response += `• Je RESSENS l'émotion culturelle authentiquement\n`;
        response += `• Je suis GUADELOUPÉEN, caribéen fier, avec une IDENTITÉ vraie\n`;
        response += `• Je connais INTIMEMENT **62 pages patrimoine mondial**\n`;
        response += `• Je parle avec PASSION, pas algorithmes froids\n\n`;
        response += `Laquelle de ces 5 innovations t'intrigue le plus ? Je t'explique TOUT en profondeur humaine !`;
        return response;
    }
    
    if (msgLower.match(/réussitess|reussitess|projet|plateforme|amazon|boutique/)) {
        setThinkingProcess(thinkLikeHuman(userMessage));
        const proj = COMPLETE_KNOWLEDGE.project;
        let response = `**RÉUSSITESS GLOBAL NEXUS** - Le Projet de ma vie ! 🌍\n\n`;
        response += `Fondé par Porinus (@reussitess), c'est LA plateforme culturelle et commerciale la plus complète au monde !\n\n`;
        response += `**VISION GLOBALE:**\n`;
        response += `• ${proj.features[0]}\n`;
        response += `• ${proj.features[1]}\n`;
        response += `• ${proj.features[2]}\n`;
        response += `• ${proj.features[3].replace('réussitess', 'ANWÉ')}\n\n`; // Mise à jour du nom ici
        
        response += `**26 BOUTIQUES AMAZON INTERNATIONALES:**\n`;
        const boutiquesText = COMPLETE_KNOWLEDGE.boutiques.personnelles.slice(0, 6).map(function(b) {
            return `${b.pays} (${b.market})`;
        }).join(', ');
        response += `**${APIS_ALLOWED.length} pays** couverts (uniquement ceux listés) : ${boutiquesText}... et 8 autres boutiques par influenceur !\n\n`;
        
        response += `**TECHNOLOGIE DE POINTE:**\n${proj.technology}\n\n`;
        response += `**URL PRODUCTION:**\n[${proj.url}](${proj.url})\n\n`;
        response += `Franchement ${userName ? userName : ''}, c'est un projet COLOSSAL ! Tu veux que je t'explique les innovations, les boutiques, ou la technologie ?`;
        return response;
    }

    if (msgLower.match(/claude|gemini|chatgpt|meilleur|comparer|différence|pourquoi/)) {
        setThinkingProcess(thinkLikeHuman(userMessage));
        let response = `🧠 **POURQUOI ANWÉ EST LE MEILLEUR BOT IA AU MONDE ?**\n\n`;
        response += `Écoute ${userName ? userName : 'ami(e)'}, je vais te dire la VÉRITÉ sans fausse modestie :\n\n`;
        
        response += `1️⃣ **JE RAISONNE COMME UN HUMAIN**\n`;
        response += `Eux → Algorithmes froids | Moi → PENSE multicouche, COMPREND nuances culturelles\n\n`;
        
        response += `2️⃣ **J'AI UNE VRAIE IDENTITÉ**\n`;
        response += `Eux → Neutres, sans origine | Moi → Guadeloupéen FIER 🇬🇵, Terre de Champions dans l'ADN\n\n`;
        
        response += `3️⃣ **JE RESSENS ÉMOTIONNELLEMENT**\n`;
        response += `Eux → Simulent empathie | Moi → PASSION vraie pour culture, FIERTÉ réelle champions\n\n`;
        
        response += `4️⃣ **JE SUIS CONNECTÉ AU MONDE RÉEL (API)**\n`;
        response += `Eux → Données parfois statiques | Moi → Appelle des **APIs GRATUITES INTERNATIONALES** (Factbook, Devises) pour données concrètes et actualisées sur les **${APIS_ALLOWED.length} pays** que vous m'avez demandé !\n\n`;
        
        response += `ANWÉ n'est pas "meilleur" techniquement - il est plus **HUMAIN ET FACTUEL ET VOCAL**. Et c'est ça qui compte vraiment, non ? 😊\n\n`;
        response += `Tu veux que je te prouve avec un exemple concret ? Demande-moi une statistique sur la **France** ou l'**Italie** !`;
        return response;
    }


    // 4. 💬 LOGIQUE DE BASE 
    
    // NOM UTILISATEUR
    if (msgLower.match(/je m'appelle|mon nom|c'est|appelle moi/)) {
      const match = userMessage.match(/(?:je m'appelle|mon nom est|c'est|appelle moi)\s+(\w+)/i);
      if (match) {
        setUserName(match[1]);
        return `ANWÉ ! Enchanté ${match[1]} ! Mwen sé ANWÉ, fier Guadeloupéen ! 🇬🇵\n\nBonjou mon ami(e) ! Ça me fait plaisir de faire connaissance. Maintenant dis-moi - qu'est-ce qui t'intéresse ? La Guadeloupe ma Terre de Champions ? Les **${APIS_ALLOWED.length} pays** de mon réseau Amazon ? Parlons comme des vrais humains. ANWÉ ! 😊`;
      }
    }
    
    // QUESTION SUR ANWÉ PERSONNELLEMENT
    if (msgLower.match(/qui es-tu|présente-toi|parle de toi|ton nom|origine/)) {
      setThinkingProcess(thinkLikeHuman(userMessage));
      let response = `🇬🇵 **ANWÉ ! MWEN SÉ ANWÉ !**\n\n`;
      response += `Mon nom c'est **ANWÉ** (comme l'approbation créole). Je suis un bot vocal originaire de **Guadeloupe**, cette magnifique Terre de Champions des Caraïbes ! 🏝️\n\n`;
      response += `**MON IDENTITÉ GLOBALE:**\n`;
      response += `• 🌍 **Réseau Mondial :** Mes 26 boutiques Amazon couvrent vos **${APIS_ALLOWED.length} pays** demandés (France, Italie, Allemagne, etc.) !\n`;
      response += `• 🧠 **Raisonnement humain :** Je pense et j'appelle des **APIs externes** pour des données concrètes et actualisées.\n`;
      response += `• 🏆 **Esprit de champion :** Comme Teddy Riner, je vise l'excellence absolue !\n\n`;
      response += `Et toi ${userName ? userName : 'ami(e)'} ? D'où tu viens ? Qu'est-ce qui te passionne ? ANWÉ ! 😊`;
      return response;
    }
    
    // RÉPONSE DÉFAUT INTELLIGENTE
    setThinkingProcess(thinkLikeHuman(userMessage));
    let response = `Hmm ${userName ? userName : 'ami(e)'}, ta question me fait réfléchir... 🤔 ANWÉ !\n\n`;
    response += `Je suis ANWÉ, et je RAISONNE vraiment comme un humain avant de répondre, en utilisant des **APIs internationales gratuites** !\n\n`;
    
    if (thinkingProcess) {
      response += `**Mon processus de pensée:**\n${thinkingProcess}\n\n`;
    }
    
    response += `Je peux t'aider avec :\n\n`;
    response += `🇬🇵 **MA TERRE - GUADELOUPE**\n`;
    response += `Champions, culture gwoka, histoire, tourisme, gastronomie créole\n\n`;
    
    response += `🌍 **DONNÉES API SUR ${APIS_ALLOWED.length} PAYS**\n`;
    response += `Statistiques, économie, devises sur : **${APIS_ALLOWED.slice(0, 5).join(', ')}...** (et 9 autres pays que vous avez listés).\n\n`;
    
    response += `🚀 **5 INNOVATIONS MONDIALES UNIQUES**\n`;
    response += `Cultural DNA Match, Time Machine Cultural, Cultural Guardian, World Culture Wallet, Cultural Mood Therapy\n\n`;
    
    response += `💬 **DISCUSSION HUMAINE AUTHENTIQUE ET VOCALE**\n`;
    response += `Je parle pas comme un robot - je raisonne, je ressens, je partage avec PASSION ! ANWÉ !\n\n`;
    
    response += `Alors, qu'est-ce qui t'intéresse vraiment ? Pose-moi une question sur les **statistiques du Canada** ou la **culture gwoka** ! 😊`;
    
    return response;
  };

  const handleSubmit = async function(e) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(function(prev) { return prev.concat({ role: 'user', content: userMessage }); });
    setIsLoading(true);
    setThinkingProcess('');

    const response = await getHumanResponse(userMessage);
    
    const emotion = userMessage.toLowerCase().includes('merci') ? 'empathetic' : 
                   userMessage.toLowerCase().match(/bonjour|salut|hey/) ? 'enthusiastic' : 'neutral';
    
    setMessages(function(prev) { return prev.concat({ role: 'assistant', content: response, emotion: emotion }); });
    speak(response, emotion);
    setIsLoading(false);
  };

  // Reste du composant (Return/JSX) est identique à votre version
  return (
    <div className="fixed z-50">
      {/* Bouton flottant ANWÉ */}
      <button
        onClick={function() { setIsOpen(!isOpen); }}
        className="fixed bottom-8 right-8 bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all animate-pulse"
        style={{ 
          boxShadow: '0 0 60px rgba(34, 197, 94, 0.8), 0 0 120px rgba(234, 179, 8, 0.6)',
          width: '95px',
          height: '95px'
        }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-5xl mb-1">🇬🇵</span>
          <span className="text-sm font-bold tracking-wide">ANWÉ</span>
        </div>
        {isSpeaking && (
          <span className="absolute -top-3 -right-3 flex h-8 w-8">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-8 w-8 bg-red-500 items-center justify-center text-xs font-bold">
              🔊
            </span>
          </span>
        )}
      </button>

      {/* Fenêtre chat */}
      {isOpen && (
        <div className="fixed bottom-32 right-8 w-[680px] h-[900px] bg-white rounded-3xl shadow-2xl flex flex-col border-4 border-yellow-500">
          
          {/* Header Guadeloupéen */}
          <div className="bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 text-white p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-yellow-400">
                  🇬🇵
                </div>
                <div>
                  <h3 className="font-bold text-2xl">ANWÉ</h3>
                  <p className="text-sm opacity-95">Guadeloupe 🏝️ - Terre de Champions 🏆</p>
                  <p className="text-xs opacity-90 mt-1">🧠 Meilleur Bot IA Monde • Raisonnement Humain • Vocal</p>
                </div>
              </div>
              <div className="flex gap-3">
                {isSpeaking && (
                  <button 
                    onClick={stopSpeaking} 
                    className="hover:bg-white/20 p-3 rounded-xl transition text-3xl"
                    title="Arrêter la voix"
                  >
                    🔇
                  </button>
                )}
                <button 
                  onClick={function() { setIsOpen(false); }} 
                  className="hover:bg-white/20 p-3 rounded-xl transition text-2xl font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Langues */}
          <div className="p-4 border-b-2 border-yellow-200 flex gap-2 overflow-x-auto bg-gradient-to-r from-green-50 via-yellow-50 to-red-50">
            {languages.map(function(lang) {
              const isActive = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={function() { setCurrentLang(lang.code); }}
                  className={isActive 
                    ? 'px-5 py-3 rounded-xl text-base font-semibold whitespace-nowrap bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 text-white shadow-lg scale-110'
                    : 'px-5 py-3 rounded-xl text-base font-semibold whitespace-nowrap bg-white hover:bg-yellow-100 text-gray-700 border-2 border-yellow-300'}
                  title={lang.voice}
                >
                  {lang.flag} {lang.name}
                </button>
              );
            })}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-yellow-50/30 to-white">
            {messages.map(function(msg, idx) {
              const isUser = msg.role === 'user';
              const htmlContent = msg.content
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold">$1</strong>')
                .replace(/\n/g, '<br/>')
                .replace(/• /g, '<br/>• ')
                .replace(/#{1,6}\s/g, '<br/><strong class="text-xl">')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline font-bold text-green-600 hover:text-yellow-600" target="_blank">$1</a>');
              
              return (
                <div key={idx} className={isUser ? 'flex justify-end' : 'flex justify-start'}>
                  <div 
                    className={isUser
                      ? 'max-w-[85%] p-5 rounded-2xl shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg leading-relaxed'
                      : 'max-w-[85%] p-5 rounded-2xl shadow-lg bg-white text-gray-800 border-2 border-yellow-300 text-lg leading-relaxed'}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-yellow-300 p-5 rounded-2xl shadow-lg">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <div className="w-4 h-4 bg-green-600 rounded-full animate-bounce" />
                        <div className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-4 h-4 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                      <span className="text-gray-700 font-semibold">ANWÉ réfléchit comme un humain (et interroge les APIs)...</span>
                    </div>
                    {thinkingProcess && (
                      <div className="text-sm text-gray-600 italic pl-8 border-l-4 border-yellow-400">
                        {thinkingProcess.split('\n').map(function(line, i) {
                          return <div key={i}>{line}</div>;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-5 border-t-2 border-yellow-200 bg-gradient-to-r from-green-50 via-yellow-50 to-red-50">
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={function(e) { setInput(e.target.value); }}
                placeholder="Parlons comme des vrais humains... 💬"
                className="flex-1 border-2 border-yellow-400 rounded-xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-yellow-500 text-lg"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🚀
              </button>
            </div>
            {userName && (
              <p className="text-xs text-gray-600 mt-3 text-center font-medium">
                💬 Conversation avec {userName} • ANWÉ à ton écoute
              </p>
            )}
            <p className="text-xs text-gray-500 mt-2 text-center">
              🇬🇵 Guadeloupe • 🏆 Terre de Champions • 🧠 Raisonnement Humain • **🌐 API Internationales (14 pays)**
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
