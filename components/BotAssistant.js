'use client';
import { useState, useEffect, useRef } from 'react';

export default function BotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLang, setCurrentLang] = useState('fr-FR');
  const [userName, setUserName] = useState('');
  const [userEmotion, setUserEmotion] = useState('neutral');
  const messagesEndRef = useRef(null);

  const languages = [
    { code: 'fr-FR', flag: '🇫🇷', name: 'Français', voice: 'Thomas' },
    { code: 'en-US', flag: '🇺🇸', name: 'English', voice: 'Daniel' },
    { code: 'es-ES', flag: '🇪🇸', name: 'Español', voice: 'Diego' },
    { code: 'de-DE', flag: '🇩🇪', name: 'Deutsch', voice: 'Hans' },
    { code: 'it-IT', flag: '🇮🇹', name: 'Italiano', voice: 'Luca' },
    { code: 'pt-BR', flag: '🇧🇷', name: 'Português', voice: 'Ricardo' }
  ];

  // BASE DE CONNAISSANCES COMPLÈTE - TOUT LE PROJET REUSSITESS
  const KNOWLEDGE_BASE = {
    
    // 26 BOUTIQUES (sans liens - juste informations)
    boutiques: {
      'États-Unis': {
        pays: 'États-Unis',
        continent: 'Amérique du Nord',
        capitale: 'Washington D.C.',
        langue: 'Anglais',
        population: '331 millions',
        monnaie: 'Dollar USD',
        description: 'Le marché Amazon américain est le plus grand au monde avec plus de 300 millions de clients actifs. Amazon.com propose un catalogue de 12 millions de produits. Les avantages incluent Prime Video, Amazon Music, et des deals incroyables pendant le Black Friday et le Prime Day. La livraison Prime est disponible en 1-2 jours sur des millions d\'articles.',
        specialites: ['Électronique de pointe', 'High-tech dernière génération', 'Mode streetwear américaine', 'Suppléments et nutrition', 'Livres en anglais'],
        conseil: 'Pour l\'électronique et les gadgets tech introuvables ailleurs, le marché américain est imbattable. Les innovations arrivent toujours en premier aux USA.'
      },
      'Canada': {
        pays: 'Canada',
        continent: 'Amérique du Nord',
        capitale: 'Ottawa',
        langue: 'Français et Anglais (bilingue)',
        population: '38 millions',
        monnaie: 'Dollar Canadien CAD',
        description: 'Amazon Canada dessert tout le pays en mode bilingue complet français-anglais. Interface disponible dans les deux langues officielles. Catalogue adapté au marché canadien avec spécificités pour le climat nordique. Entrepôts majeurs à Toronto, Montréal, et Vancouver assurent une livraison rapide même dans les territoires du Grand Nord.',
        specialites: ['Vêtements grand froid et hiver', 'Équipement outdoor nordique', 'Livres français canadiens', 'Produits du terroir québécois', 'Matériel hockey sur glace'],
        conseil: 'Pour les Québécois, l\'interface 100% en français est parfaite. Le programme Prime Student est à moitié prix pour les étudiants.'
      },
      'France': {
        pays: 'France',
        continent: 'Europe',
        capitale: 'Paris',
        langue: 'Français',
        population: '67 millions',
        monnaie: 'Euro EUR',
        description: 'Amazon France est le leader du e-commerce français avec 20 millions de clients actifs. Prime coûte seulement 6,99€ par mois, le moins cher d\'Europe ! Les entrepôts géants sont situés à Lauwin-Planque, Chalon-sur-Saône, Montélimar, Sevrey, et Toulouse. Amazon Fresh dessert Paris et l\'Île-de-France. Prime Video offre un catalogue riche en contenus français. Les French Days en septembre rivalisent avec le Black Friday.',
        specialites: ['Livres en français', 'Électronique grand public', 'Mode et beauté française', 'Maison et décoration', 'Parapharmacie et bien-être'],
        conseil: 'C\'est mon préféré pour la France ! Prime Student à 3,49€/mois pour les étudiants. Les French Days fin septembre offrent des promos équivalentes au Black Friday.'
      },
      'Allemagne': {
        pays: 'Allemagne',
        continent: 'Europe',
        capitale: 'Berlin',
        langue: 'Allemand (Deutsch)',
        population: '83 millions',
        monnaie: 'Euro EUR',
        description: 'Amazon Allemagne est le plus grand marché européen avec 44 millions de clients. Les entrepôts ultra-modernes de Leipzig, Bad Hersfeld, Graben et Werne assurent des stocks toujours disponibles. Excellente réputation pour l\'électronique professionnelle et l\'outillage de qualité allemande. Les prix sont souvent 10-15% moins chers que sur les autres sites européens.',
        specialites: ['Électronique de précision', 'Outillage professionnel', 'Pièces automobiles', 'Informatique et composants', 'Marques allemandes premium'],
        conseil: 'Même en allemand, Google Translate aide. Les prix sont vraiment intéressants, surtout pour l\'électronique. Les marques allemandes comme Bosch et Siemens sont moins chères à la source.'
      },
      'Royaume-Uni': {
        pays: 'Royaume-Uni',
        continent: 'Europe',
        capitale: 'Londres',
        langue: 'Anglais (English)',
        population: '67 millions',
        monnaie: 'Livre Sterling GBP',
        description: 'Amazon UK dessert le Royaume-Uni et l\'Irlande. Catalogue riche en mode britannique authentique, design contemporain anglais, et littérature anglaise. Les entrepôts de Peterborough, Rugeley et Dunfermline assurent la logistique. Prime Video UK propose du contenu exclusif BBC. Après le Brexit, des contrôles douaniers s\'appliquent pour l\'Union Européenne mais le processus est simplifié.',
        specialites: ['Mode britannique heritage - Burberry, Barbour', 'Livres anglais - tous les bestsellers', 'Design anglais contemporain', 'Thé et épicerie fine britannique', 'Électronique et high-tech'],
        conseil: 'Pour les livres en anglais et la mode britannique authentique, c\'est la référence. Vérifiez les frais de douane post-Brexit pour les livraisons en Union Européenne.'
      },
      'Italie': {
        pays: 'Italie',
        continent: 'Europe',
        capitale: 'Rome',
        langue: 'Italien (Italiano)',
        population: '60 millions',
        monnaie: 'Euro EUR',
        description: 'Amazon Italie compte 18 millions de clients. Les entrepôts de Piacenza, Torrazza Piemonte et Castel San Giovanni distribuent dans toute la péninsule. Spécialiste de la mode italienne avec les grandes marques authentiques. Design italien pour la maison avec Alessi, Kartell, Artemide. Gastronomie italienne de qualité supérieure - huile d\'olive extra vierge, pâtes artisanales, vins DOC et DOCG, fromages AOP.',
        specialites: ['Mode luxe italienne - Armani, Gucci, Prada', 'Design italien - Alessi, Kartell, Artemide', 'Gastronomie - huile, pâtes, vins, fromages', 'Café italien et machines espresso', 'Livres et cours d\'italien'],
        conseil: 'Pour les produits de design italien authentique et la vraie gastronomie italienne à prix d\'origine, c\'est LA référence. L\'huile d\'olive extra vierge et les pâtes artisanales sont exceptionnelles.'
      },
      'Espagne': {
        pays: 'Espagne',
        continent: 'Europe',
        capitale: 'Madrid',
        langue: 'Espagnol (Español)',
        population: '47 millions',
        monnaie: 'Euro EUR',
        description: 'Amazon Espagne dessert le marché ibérique avec l\'Espagne et le Portugal. Entrepôts stratégiques à Madrid, Barcelone et San Fernando de Henares. Produits espagnols typiques de qualité - jamón ibérico bellota, huile d\'olive andalouse, vins Rioja et Ribera del Duero. Mode espagnole tendance avec Zara, Mango, Desigual. Les prix sont généralement plus doux qu\'en France.',
        specialites: ['Jamón ibérico et charcuterie espagnole', 'Huile d\'olive espagnole premium', 'Vins espagnols - Rioja, Ribera, Priorat', 'Mode espagnole - Zara, Mango', 'Gastronomie méditerranéenne'],
        conseil: 'Les prix sont souvent 5-10% moins élevés qu\'en France. Pour la gastronomie espagnole authentique - jambon ibérique, huile Arbequina, vins - c\'est parfait.'
      },
      'Pays-Bas': {
        pays: 'Pays-Bas',
        continent: 'Europe',
        capitale: 'Amsterdam',
        langue: 'Néerlandais (Nederlands)',
        population: '17 millions',
        monnaie: 'Euro EUR',
        description: 'Amazon Pays-Bas lancé en 2020 est le marché Amazon le plus récent d\'Europe. Entrepôt moderne à Tilburg. Catalogue axé sur le lifestyle néerlandais avec une immense sélection de vélos et accessoires - le pays compte 23 millions de vélos pour 17 millions d\'habitants ! Design nordique-minimaliste. Forte culture de produits durables et éco-responsables. Interface disponible en néerlandais et anglais.',
        specialites: ['Vélos et accessoires cyclistes', 'Design nordique minimaliste', 'Produits durables et éco-responsables', 'Lifestyle et bien-être', 'Électronique'],
        conseil: 'Marché récent avec de nombreuses promotions de lancement. Excellente sélection de vélos, le pays étant le spécialiste mondial. Le design nordique-minimaliste est authentique.'
      },
      'Belgique': {
        pays: 'Belgique',
        continent: 'Europe',
        capitale: 'Bruxelles',
        langue: 'Français et Néerlandais (bilingue)',
        population: '11,5 millions',
        monnaie: 'Euro EUR',
        description: 'Amazon Belgique propose une interface 100% bilingue français-néerlandais au choix de l\'utilisateur. Dessert Bruxelles, la Flandre et la Wallonie. Catalogue adapté au marché belge avec chocolat belge authentique, bières belges trappistes et d\'abbaye, BD franco-belges (Tintin, Spirou, Lucky Luke). Réseau dense de points relais pour retours gratuits. Amazon Fresh en test à Bruxelles.',
        specialites: ['Chocolat belge - Leonidas, Godiva', 'Bières belges - trappistes, abbaye', 'BD franco-belges - Tintin, Spirou', 'Gaufres et spécialités sucrées', 'Design et mode'],
        conseil: 'Pour les Belges, l\'interface au choix FR ou NL est idéale. Les spécialités belges - chocolat Leonidas, bières trappistes, collection BD franco-belge - sont exceptionnelles.'
      },
      'Suède': {
        pays: 'Suède',
        continent: 'Europe',
        capitale: 'Stockholm',
        langue: 'Suédois (Svenska)',
        population: '10 millions',
        monnaie: 'Couronne suédoise SEK',
        description: 'Amazon Suède lancé en 2020 pour l\'expansion nordique. Catalogue premium avec design scandinave authentique. Lifestyle nordique avec concepts hygge, lagom, et fika. Forte demande pour produits durables et éco-responsables - la Suède est leader mondial du développement durable. Marques suédoises locales présentes. Interface en suédois et anglais. Service client nordique efficace. Focus qualité plutôt que quantité selon mentalité suédoise.',
        specialites: ['Design scandinave authentique', 'Lifestyle nordique - hygge, lagom', 'Produits durables haute qualité', 'Marques suédoises', 'Mode nordique minimaliste'],
        conseil: 'Nouveau marché prometteur pour le design scandinave authentique. La Suède a une forte culture qualité-durabilité donc produits très bien sélectionnés.'
      },
      'Australie': {
        pays: 'Australie',
        continent: 'Océanie',
        capitale: 'Canberra',
        langue: 'Anglais (English)',
        population: '26 millions',
        monnaie: 'Dollar Australien AUD',
        description: 'Amazon Australie lancé en 2017 est le hub pour le Pacifique Sud. Dessert l\'Australie et la Nouvelle-Zélande. Catalogue adapté au climat australien et lifestyle outdoor - équipement plage, surf, barbecue, protection solaire SPF50+. Livraison même dans l\'Outback et régions reculées. Entrepôts majeurs à Sydney et Melbourne. Amazon Fresh dans les grandes villes australiennes. Mode australienne décontractée.',
        specialites: ['Équipement outdoor et aventure', 'Plage, surf et sports nautiques', 'Protection solaire haute performance', 'Barbecue et cuisine extérieure', 'Mode australienne décontractée'],
        conseil: 'Pour Australie et Nouvelle-Zélande, évite les frais de port astronomiques depuis USA ou Europe. Catalogue parfaitement adapté au climat et mode de vie australien.'
      },
      'Singapour': {
        pays: 'Singapour',
        continent: 'Asie',
        capitale: 'Singapour',
        langue: 'Anglais et Chinois (bilingue)',
        population: '5,7 millions',
        monnaie: 'Dollar de Singapour SGD',
        description: 'Amazon Singapour lancé en 2017 est le hub technologique de l\'Asie du Sud-Est. Singapour étant le Silicon Valley asiatique, le catalogue high-tech est immense. Électronique et tech à prix asiatiques compétitifs. Livraison same-day dans certains quartiers de Singapour. Dessert aussi Malaisie et Indonésie voisines. Interface bilingue anglais-chinois. Marketplace avec vendeurs tech asiatiques. Innovation et derniers gadgets disponibles en premier.',
        specialites: ['High-tech et électronique de pointe', 'Gadgets tech dernière génération', 'Gaming et esports', 'Smartphones et accessoires', 'Innovation technologique'],
        conseil: 'LE hub pour la tech en Asie du Sud-Est. Prix électronique souvent 20-30% moins chers. Derniers gadgets tech disponibles en premier en Asie.'
      },
      'Inde': {
        pays: 'Inde',
        continent: 'Asie',
        capitale: 'New Delhi',
        langue: 'Hindi et Anglais + 14 langues régionales',
        population: '1,4 milliard',
        monnaie: 'Roupie Indienne INR',
        description: 'Amazon Inde est le 2ème marché mondial en croissance explosive avec plus de 500 millions d\'utilisateurs. Prime est le moins cher au monde ! Catalogue immense adapté au marché indien avec vêtements traditionnels (saris, kurtas, lehengas), épices indiennes authentiques, alimentation indienne. Entrepôts dans toutes les grandes villes. Livraison même dans villages reculés. Service client disponible en Hindi, anglais et 14 langues régionales. Amazon Pay très utilisé. Possibilité de paiement à la livraison (cash on delivery).',
        specialites: ['Vêtements indiens traditionnels - saris, kurtas', 'Épices et cuisine indienne authentique', 'Bijoux indiens et artisanat', 'Électronique à prix ultra-compétitifs', 'Livres et cours en plusieurs langues'],
        conseil: 'Les prix sont absolument imbattables. Prime est le moins cher du monde. Parfait pour acheter vêtements indiens authentiques, épices, et découvrir la culture indienne.'
      },
      'Brésil': {
        pays: 'Brésil',
        continent: 'Amérique du Sud',
        capitale: 'Brasília',
        langue: 'Portugais Brésilien',
        population: '215 millions',
        monnaie: 'Réal Brésilien BRL',
        description: 'Amazon Brésil est le leader de l\'Amérique Latine et le plus grand marché lusophone. Entrepôts à São Paulo, Rio de Janeiro, Belo Horizonte. Catalogue adapté à la culture brésilienne vibrante - football (maillots Seleção officiels), carnaval (costumes et accessoires), plage et samba. Mode brésilienne colorée unique. Musique bossa nova et samba. Livres en portugais brésilien. Produits de beauté brésiliens - huile de coco, açaï, produits naturels amazonie. Livraison partout y compris favelas.',
        specialites: ['Mode brésilienne colorée et vibrante', 'Football - maillots Seleção et équipement', 'Musique brésilienne - instruments', 'Beauté naturelle - açaï, huile coco', 'Livres portugais brésilien'],
        conseil: 'Pour produits brésiliens authentiques - maillots de foot Seleção, costumes carnaval, cosmétiques à base d\'açaï amazonie. Parfait pour apprendre le portugais brésilien.'
      },
      'Nouvelle-Zélande': {
        pays: 'Nouvelle-Zélande',
        continent: 'Océanie',
        capitale: 'Wellington',
        langue: 'Anglais et Maori',
        population: '5 millions',
        monnaie: 'Dollar Néo-Zélandais NZD',
        description: 'La Nouvelle-Zélande n\'a pas de site Amazon dédié, les Néo-Zélandais utilisent Amazon Australie qui livre en Nouvelle-Zélande. Livraison 5-10 jours depuis l\'Australie. Catalogue outdoor parfaitement adapté - randonnée en montagne, trekking, sports extrêmes. Culture maorie avec artisanat traditionnel, livres en maori, bijoux māori authentiques. Merchandising officiel All Blacks rugby. Équipement nature et montagne adapté au climat néo-zélandais.',
        specialites: ['Outdoor et trekking montagne', 'Rugby All Blacks merchandising', 'Culture maorie - artisanat, livres', 'Équipement sports extrêmes', 'Livres en anglais et maori'],
        conseil: 'Via Amazon Australie avec livraison Nouvelle-Zélande assurée. Excellent pour équipement outdoor et culture maorie. Frais de port raisonnables depuis Australie.'
      },
      'Mexique': {
        pays: 'Mexique',
        continent: 'Amérique du Nord',
        capitale: 'Mexico City',
        langue: 'Espagnol',
        population: '128 millions',
        monnaie: 'Peso Mexicain MXN',
        description: 'Amazon Mexique dessert tout le Mexique avec un catalogue adapté à la culture mexicaine riche. Artisanat mexicain authentique, gastronomie mexicaine traditionnelle, mode mexicaine colorée. Entrepôts dans les grandes villes. Interface entièrement en espagnol. Service client mexicain.',
        specialites: ['Artisanat mexicain traditionnel', 'Gastronomie mexicaine', 'Mode et textiles mexicains', 'Livres en espagnol', 'Électronique'],
        conseil: 'Pour découvrir la culture mexicaine authentique et acheter des produits artisanaux traditionnels à prix directs.'
      },
      'Turquie': {
        pays: 'Turquie',
        continent: 'Eurasie',
        capitale: 'Ankara',
        langue: 'Turc',
        population: '85 millions',
        monnaie: 'Livre Turque TRY',
        description: 'Amazon Turquie au carrefour entre Europe et Asie. Catalogue reflétant la richesse culturelle turque - artisanat ottoman, tapis turcs, céramiques İznik, gastronomie turque (loukoums, baklavas, épices). Mode turque moderne. Interface en turc. Marché en développement rapide.',
        specialites: ['Artisanat ottoman et tapis', 'Gastronomie turque authentique', 'Céramiques et poteries İznik', 'Mode turque', 'Livres en turc'],
        conseil: 'Pour découvrir l\'artisanat turc traditionnel et la gastronomie ottomane authentique.'
      },
      'Émirats Arabes Unis': {
        pays: 'Émirats Arabes Unis',
        continent: 'Asie',
        capitale: 'Abou Dabi',
        langue: 'Arabe et Anglais',
        population: '10 millions',
        monnaie: 'Dirham AED',
        description: 'Amazon UAE (Émirats) lancé via acquisition de Souq.com. Hub pour le Moyen-Orient. Dubai et Abu Dhabi dessertis rapidement. Catalogue luxe et high-tech. Livraison express dans les émirats. Interface arabe-anglais bilingue. Produits moyen-orientaux et internationaux.',
        specialites: ['Électronique de luxe', 'Mode internationale haut de gamme', 'Parfums et cosmétiques', 'High-tech dernière génération', 'Produits du Golfe'],
        conseil: 'Hub Moyen-Orient avec mix produits locaux et internationaux. Livraison rapide dans le Golfe.'
      },
      'Arabie Saoudite': {
        pays: 'Arabie Saoudite',
        continent: 'Asie',
        capitale: 'Riyad',
        langue: 'Arabe',
        population: '35 millions',
        monnaie: 'Riyal Saoudien SAR',
        description: 'Amazon Arabie Saoudite via extension Souq.com pour le plus grand marché du Golfe. Catalogue adapté aux besoins saoudiens. Livraison dans tout le royaume. Interface en arabe. Service client arabophone.',
        specialites: ['Électronique', 'Mode respectueuse culture locale', 'Produits du Golfe', 'Livres arabes', 'Parfums arabes traditionnels'],
        conseil: 'Le plus grand marché Amazon du monde arabe avec catalogue adapté à la culture saoudienne.'
      },
      'Pologne': {
        pays: 'Pologne',
        continent: 'Europe',
        capitale: 'Varsovie',
        langue: 'Polonais',
        population: '38 millions',
        monnaie: 'Zloty Polonais PLN',
        description: 'Amazon Pologne pour l\'Europe de l\'Est. Catalogue adapté au marché polonais. Prix compétitifs en złoty. Interface polonaise complète. Hub pour pays d\'Europe centrale.',
        specialites: ['Électronique', 'Livres polonais', 'Mode', 'Maison', 'Produits locaux polonais'],
        conseil: 'Pour la Pologne et l\'Europe de l\'Est, marketplace en développement rapide avec bons prix.'
      },
      'Égypte': {
        pays: 'Égypte',
        continent: 'Afrique',
        capitale: 'Le Caire',
        langue: 'Arabe',
        population: '104 millions',
        monnaie: 'Livre Égyptienne EGP',
        description: 'Amazon Égypte via Souq.com pour le plus grand marché africain arabophone. Dessert tout le pays y compris Alexandrie et delta du Nil. Catalogue adapté à la culture égyptienne. Artisanat local, mode, électronique. Interface arabe-anglais.',
        specialites: ['Artisanat égyptien', 'Mode orientale', 'Électronique', 'Livres arabes', 'Produits culturels égyptiens'],
        conseil: 'Le plus grand marché Amazon d\'Afrique pour accéder à la culture égyptienne authentique.'
      },
      'Japon': {
        pays: 'Japon',
        continent: 'Asie',
        capitale: 'Tokyo',
        langue: 'Japonais',
        population: '125 millions',
        monnaie: 'Yen Japonais JPY',
        description: 'Amazon Japon, marché tech sophistiqué. Culture japonaise unique avec manga, anime, high-tech de pointe. Livraison ultra-rapide dans tout l\'archipel. Interface japonaise complète. Prime Video avec anime exclusifs. Produits japonais traditionnels et modernes.',
        specialites: ['Manga et anime', 'High-tech japonais', 'Gadgets innovants', 'Produits traditionnels japonais', 'Gaming japonais'],
        conseil: 'Pour les fans de culture japonaise, manga, anime et tech japonaise de pointe. Découvrez l\'innovation nippone.'
      },
      'Chine': {
        pays: 'Chine',
        continent: 'Asie',
        capitale: 'Pékin',
        langue: 'Chinois Mandarin',
        population: '1,4 milliard',
        monnaie: 'Yuan Chinois CNY',
        description: 'Amazon Chine (cn) marché chinois avec concurrence locale forte (Alibaba, JD.com). Catalogue adapté au marché chinois massif. Interface entièrement en chinois. Produits chinois et internationaux. Livraison dans toute la Chine.',
        specialites: ['Électronique chinoise', 'Mode asiatique', 'Produits culturels chinois', 'Gadgets tech', 'Livres chinois'],
        conseil: 'Marché chinois avec forte concurrence locale mais accès à produits chinois authentiques et tech asiatique.'
      },
      'Corée du Sud': {
        pays: 'Corée du Sud',
        continent: 'Asie',
        capitale: 'Séoul',
        langue: 'Coréen',
        population: '52 millions',
        monnaie: 'Won Coréen KRW',
        description: 'Accès Amazon via sites régionaux car pas de .kr dédié. Marché tech très avancé, K-pop, K-beauty, culture coréenne moderne. Gaming esports leader mondial. Livraison depuis Singapour ou Japon.',
        specialites: ['K-beauty cosmétiques coréens', 'K-pop merchandising', 'Gaming et esports', 'Électronique Samsung LG', 'Mode coréenne tendance'],
        conseil: 'Pour K-beauty, K-pop et culture coréenne moderne, utiliser marchés régionaux ou boutiques spécialisées.'
      }
    },

    // DOM-TOM COMPLETS
    domtom: {
      guadeloupe: {
        nom: 'Guadeloupe',
        type: 'Département et région d\'outre-mer français',
        statut: 'DROM - Région ultrapériphérique européenne',
        capitale: 'Basse-Terre (administrative), Pointe-à-Pitre (économique)',
        population: '384 239 habitants (2024)',
        superficie: '1 628 km²',
        langues: 'Français (officiel), Créole guadeloupéen',
        monnaie: 'Euro (EUR)',
        fuseau: 'UTC-4',
        geographie: 'Archipel des Petites Antilles composé de deux îles principales - Basse-Terre volcanique et montagneuse avec la Soufrière (1 467m), et Grande-Terre calcaire et plate avec plages paradisiaques. Les dépendances incluent Marie-Galante, Les Saintes, La Désirade, Petite-Terre.',
        
        histoire: `Christophe Colomb découvre la Guadeloupe le 3 novembre 1493 lors de son deuxième voyage, la nommant Santa María de Guadalupe de Extremadura. Les Caraïbes, peuple amérindien, occupaient l'île qu'ils appelaient Karukera "l'île aux belles eaux". 

La colonisation française commence en 1635 quand Charles Liénard de l'Olive et Jean du Plessis d'Ossonville, mandatés par la Compagnie des Îles d'Amérique, fondent la première colonie. L'économie de plantation se développe rapidement avec la canne à sucre, nécessitant une main-d'œuvre servile. La traite négrière atlantique amène des centaines de milliers d'Africains réduits en esclavage.

Le 27 avril 1848, sous l'impulsion de Victor Schœlcher, la France abolit définitivement l'esclavage. Cette date est commémorée chaque année par un jour férié en Guadeloupe. L'abolition transforme profondément la société guadeloupéenne mais l'économie sucrière persiste avec l'arrivée de travailleurs engagés indiens.

Le 19 mars 1946, la Guadeloupe devient département français d'outre-mer (DOM), puis en 2003 département et région d'outre-mer (DROM). La question du statut politique anime régulièrement le débat local entre autonomie et maintien dans la République française.`,

        patrimoine: `La Soufrière, volcan actif culminant à 1 467 mètres, est surnommée la "Vieille Dame". Surveillée en permanence par l'Observatoire volcanologique de Guadeloupe, elle offre des randonnées spectaculaires dans une nature tropicale luxuriante. Les sources chaudes sulfureuses témoignent de l'activité volcanique.

Le Parc National de Guadeloupe créé en 1989 protège 17 300 hectares de forêt tropicale humide. Inscrit au patrimoine mondial de l'UNESCO, il abrite une biodiversité exceptionnelle avec 270 espèces d'arbres, 100 espèces d'orchidées, 38 espèces d'oiseaux dont le pic de Guadeloupe endémique. Les chutes du Carbet (115m) sont spectaculaires.

Les plages de Grande-Terre - Sainte-Anne, Saint-François, la Caravelle, le Souffleur - offrent du sable blanc et des eaux turquoise. Les spots de plongée révèlent des récifs coralliens, des épaves, la réserve Cousteau aux Saintes. Le lagon de Petit-Terre abrite tortues marines et requins citron.

L'architecture créole se manifeste dans les maisons coloniales colorées de Pointe-à-Pitre, les distilleries de rhum agricole (Damoiseau, Longueteau, Bologne), les anciennes sucreries. Le Mémorial ACTe à Pointe-à-Pitre, musée de référence mondiale sur l'esclavage, propose un parcours mémoriel émouvant.`,

        culture: `Le créole guadeloupéen, langue à base lexicale française, structure l'identité culturelle. Reconnu langue régionale, il s'écrit selon la graphie du GEREC-F. La littérature créole s'enrichit avec des auteurs comme Maryse Condé (Prix Nobel alternatif 2018), Simone Schwarz-Bart, Ernest Pépin.

Le gwoka, musique et danse traditionnelle inscrite au patrimoine immatériel de l'UNESCO en 2014, utilise 7 rythmes de base joués sur des tambours ka. Les lewoz, soirées gwoka traditionnelles, perpétuent cette pratique depuis l'époque coloniale où les esclaves communiquaient par les tambours.

Le carnaval guadeloupéen de janvier à mars est l'un des plus longs des Caraïbes. Les groupes à peau comme Akiyo, Voukoum animent les défilés. Le mercredi des Cendres voit défiler les diablesses en noir et blanc. Les vidés (défilés dansants) rassemblent des milliers de participants.

La gastronomie créole mélange influences africaines, françaises, indiennes et amérindiennes. Le colombo (curry créole), le boudin créole, le matété de crabes, les accras de morue sont des spécialités. Les fruits tropicaux abondent - goyaves, mangues Julie, corossols, fruits à pain. Le rhum agricole AOC est d'excellence.`,

        economie: 'Agriculture (canne à sucre, banane, fruits tropicaux), tourisme, BTP, services. Rhum agricole AOC Guadeloupe.',
        
        conseils: `La meilleure période s'étend de décembre à mai pendant la saison sèche "carême". Évitez la saison cyclonique d'août à octobre. La température de l'eau reste à 27-29°C toute l'année.

Pour se déplacer, la location de voiture est indispensable car les transports en commun sont limités. Comptez 30-40€/jour. Prenez une assurance tous risques pour les routes sinueuses de Basse-Terre. L'essence est plus chère qu'en métropole.

Budget quotidien : 100-150€/jour en incluant hébergement, repas, activités. Les restos "lolos" sur les plages proposent des plats créoles à 12-15€. Les hébergements vont de 60€/nuit (gîte) à 200€+ (hôtel de charme).

Santé : vaccins universels à jour. Protection anti-moustiques contre la dengue, chikungunya, Zika. Crème solaire SPF50+ indispensable. L'eau du robinet est potable. Pharmacies bien équipées, hôpitaux à Pointe-à-Pitre et Basse-Terre.

Sécurité : délinquance existe dans certains quartiers de Pointe-à-Pitre. Évitez d'afficher objets de valeur. Baignades : respectez les consignes de surveillance, courants parfois forts. Randonnées : partez tôt, prévoyez eau et en-cas, informez-vous sur météo et niveau de difficulté.`
      },

      martinique: {
        nom: 'Martinique',
        type: 'Département et région d\'outre-mer français',
        statut: 'DROM - Région ultrapériphérique européenne - Collectivité territoriale unique depuis 2015',
        capitale: 'Fort-de-France',
        population: '364 508 habitants (2024)',
        superficie: '1 128 km²',
        langues: 'Français (officiel), Créole martiniquais',
        monnaie: 'Euro (EUR)',
        fuseau: 'UTC-4',
        geographie: 'Île volcanique des Petites Antilles entre Dominique et Sainte-Lucie. La Montagne Pelée (1 395m) domine le nord montagneux et couvert de forêt tropicale. Le centre montagneux (Pitons du Carbet 1 196m) sépare côte Caraïbe calme et côte Atlantique ventée. Le sud concentre plages, mangroves et patrimoine culturel.',
        
        histoire: `Les Arawaks puis les Caraïbes occupaient Madinina "l'île aux fleurs". Christophe Colomb la découvre le 15 juin 1502. La colonisation française débute en 1635 avec Pierre Belain d'Esnambuc et la Compagnie des Îles d'Amérique.

L'économie de plantation esclavagiste se développe avec la canne à sucre, le café, le cacao. Des centaines de milliers d'Africains sont déportés et réduits en esclavage. Le Code Noir de 1685 réglemente cruellement cette institution.

Le 22 mai 1848, l'esclavage est aboli grâce à Victor Schœlcher. Les esclaves libérés deviennent citoyens français. Des travailleurs engagés arrivent d'Inde (les "Kouli") pour pallier le manque de main-d'œuvre.

Le 8 mai 1902, l'éruption de la Montagne Pelée détruit Saint-Pierre, capitale économique comptant 28 000 habitants. Seuls 2 survivants sont recensés dans la ville. Cette catastrophe majeure marque profondément la Martinique. Fort-de-France devient la nouvelle capitale.

En 1946, la Martinique devient DOM. Aimé Césaire, maire de Fort-de-France de 1945 à 2001 et député, est la figure politique et intellectuelle majeure. Cofondateur de la négritude avec Léopold Sédar Senghor, son œuvre "Cahier d'un retour au pays natal" (1939) est fondamentale.

Depuis 2015, la Martinique est une Collectivité territoriale unique fusionnant département et région.`,

        patrimoine: `La Montagne Pelée, volcan actif surveillé en permanence, offre une randonnée exigeante (5-6h aller-retour). Le cratère avec fumerolles, la forêt tropicale, les vues panoramiques récompensent l'effort. L'Observatoire volcanologique suit l'activité sismique.

Les Pitons du Carbet culminent à 1 196m. Cinq pitons offrent randonnées de tous niveaux. La flore est exceptionnelle - fougères arborescentes géantes, orchidées sauvages, balisiers rouges. La faune comprend colibris, grives à pieds jaunes, matoutou falaise (mygale endémique).

Saint-Pierre, ancienne capitale détruite en 1902, est classée "Ville d'Art et d'Histoire". Les ruines du théâtre, de la cathédrale, de la prison (où survécut Louis-Auguste Cyparis), le musée Frank Perret racontent la tragédie. Le Mémorial de la Catastrophe émeut profondément.

Les plages variées : Anse Noire et Anse Dufour (sable noir volcanique), Les Salines (sable blanc fin), Anse Couleuvre (sauvage au pied de la Pelée), Grande Anse du Diamant (vue sur rocher du Diamant). La plongée révèle épaves, coraux, tortues.

Fort-de-France conserve la bibliothèque Schœlcher (architecture métallique Art Nouveau), la cathédrale Saint-Louis, le fort Saint-Louis (toujours base militaire). Les marchés couverts (Grand Marché) vibrent de couleurs et saveurs créoles.`,

        culture: `Le créole martiniquais, langue à base lexicale française avec influences africaines et caraïbes, structure l'identité. Édouard Glissant développe le concept de "créolisation" du monde et de "Tout-Monde". Patrick Chamoiseau obtient le Goncourt 1992 pour "Texaco".

Le bèlè, cousin du gwoka guadeloupéen, associe chant, tambour et danse. Les veillées bèlè perpétuent cette tradition d'origine africaine. Les rythmes comme le gran bèlè, le bèlè kalenda animent les soirées culturelles.

Le carnaval martiniquais explose en couleurs de janvier au mercredi des Cendres. Les groupes à peau défilent, les diables rouges (djab) impressionnent, les vidés rassemblent tous les Martiniquais. Le lundi gras voit les mariages burlesques, le mardi gras les diablesses, le mercredi des Cendres Vaval (roi carnaval) est brûlé en noir et blanc.

La gastronomie créole martiniquaise excelle : colombo de poulet ou cabri, court-bouillon de poisson, fricassée de chatrou (poulpe), féroce d'avocat, ti-nain lanmori (banane verte en sauce chien). Les accras, le boudin créole, le poulet boucané (fumé) sont savoureux. Le rhum agricole AOC Martinique (Clément, JM, Neisson, HSE, La Mauny) est mondialement reconnu. Le ti-punch est l'apéritif traditionnel.`,

        economie: 'Rhum agricole AOC (65% production France), banane, tourisme, raffinerie pétrole (SARA), services. PIB/hab 25 000€.',
        
        conseils: `Période idéale : décembre-mai (saison sèche carême). Température 26-30°C, eau 27-28°C. Éviter août-octobre (cyclones, pluies hivernage).

Location voiture indispensable (35-50€/jour). Routes sinueuses nord, embouteillages Fort-de-France heures pointe. Essence 1,60-1,70€/L. Permis français suffit.

Budget : 120-180€/jour (hébergement, repas, activités). Gîtes 70-100€/nuit, hôtels charme 150-300€. Restaurants créoles 15-25€, gastronomiques 40-80€. Marchés locaux économiques.

Santé : vaccins universels. Anti-moustiques dengue/chikungunya/Zika. SPF50+ soleil tropical. Eau robinet potable. CHU Fort-de-France bien équipé.

Sécurité : délinquance quartiers Fort-de-France (Terres-Sainville, Volga-Plage). Pas bijoux ostentatoires. Baignades : courants forts côte Atlantique, requins (très rare). Randonnées : guides pour Pelée recommandés, eau, chapeau, chaussures montantes.

Culture : respecter lieux mémoire esclavage. Créole apprécié même maladroit. Saluer "bonjour" toujours. Marchander marchés avec respect.`
      },

      guyane: {
        nom: 'Guyane',
        type: 'Département et région d\'outre-mer français',
        statut: 'DROM - Région ultrapériphérique européenne - Collectivité territoriale unique depuis 2016',
        capitale: 'Cayenne',
        population: '290 691 habitants (2024)',
        superficie: '83 534 km² (plus vaste département français)',
        langues: 'Français (officiel), Créoles guyanais et haïtien, langues amérindiennes (Kalina, Wayana, Wayampi, Palikur, Arawak, Emerillon), Businenge Tongo, Hmong, Portugais brésilien, Chinois',
        monnaie: 'Euro (EUR)',
        fuseau: 'UTC-3',
        geographie: 'Territoire d\'Amérique du Sud entre Suriname et Brésil, couvert à 96% de forêt amazonienne. 360 km de littoral Atlantique avec mangroves. Fleuves Maroni (frontière Suriname) et Oyapock (frontière Brésil). Relief peu élevé (mont Bellevue de l\'Inini 851m). Climat équatorial humide avec 3 000mm pluie/an.',
        
        histoire: `Les peuples amérindiens (Kalina, Arawak, Wayana, Emerillon, Palikur, Wayampi) habitent la Guyane depuis 6 000 ans. Christophe Colomb aperçoit les côtes en 1498. Les premières tentatives de colonisation française échouent au XVIIe siècle (Daniel de La Touche).

La colonisation française s'établit progressivement au XVIIIe siècle avec économie de plantation (sucre, épices). L'esclavage se développe moins qu'aux Antilles en raison des conditions difficiles. L'abolition de 1848 amène des travailleurs engagés africains, indiens, chinois.

De 1852 à 1953, la Guyane est colonie pénitentiaire où 70 000 bagnards sont déportés. Le bagne de Cayenne et les îles du Salut (île Royale, île Saint-Joseph, île du Diable où fut enfermé Dreyfus) symbolisent ce passé carcéral. Henri Charrière "Papillon" raconte son évasion dans son livre mondialement connu.

En 1946, la Guyane devient DOM. La création du Centre Spatial Guyanais à Kourou en 1968 transforme l'économie. Ariane, Soyouz, Vega décollent de ce port spatial européen stratégique proche de l'équateur.

L'orpaillage clandestin brésilien (garimpeiros) cause déforestation, pollution mercure, tensions. La frontière de 730 km avec le Brésil est difficile à contrôler.`,

        patrimoine: `Le Centre Spatial Guyanais de Kourou, port spatial européen, lance 60% des satellites commerciaux mondiaux. Visites guidées du site, musée de l'Espace, observation lancements Ariane (spectacle grandiose). Position équatoriale optimale pour lanceurs.

Le Parc Amazonien de Guyane créé en 2007 protège 34 000 km² de forêt primaire (40% du territoire), deuxième plus grand parc national français. Biodiversité exceptionnelle : 1 200 espèces d'arbres, 720 oiseaux, 186 mammifères dont jaguars, harpies féroces, tapirs, singes hurleurs. Accessible uniquement en pirogue et à pied avec guides amérindiens.

Les îles du Salut au large de Kourou préservent l'ancien bagne. L'île Royale avec son église, l'île Saint-Joseph et ses cachots d'isolement, l'île du Diable (fermée) émeuvent. Musée du Bagne, cimetière des bagnards. Plage paradisiaque et snorkeling.

Les plages de ponte des tortues luths (avril-août) à Awala-Yalimapo, réserve naturelle Amana. Ces géantes (500kg, 2m) menacées reviennent pondre sur leur plage natale. Observation nocturne encadrée émouvante.

Le marché de Cayenne vibre de diversité culturelle. Cuisine créole, hmong, brésilienne, surinamaise. L'architecture créole colorée (maisons bois sur pilotis), le fort Cépérou, la place des Palmistes caractérisent la capitale.`,

        culture: `La Guyane est le territoire le plus multiculturel de France. Créoles, Amérindiens (6 peuples), Bushinenge (descendants d'esclaves marrons : Saramaka, Ndyuka, Aluku, Pamaka), Hmong (réfugiés Laos 1977), Brésiliens, Haïtiens, Surinamais, métropolitains coexistent. 15 langues parlées !

Les cultures amérindiennes perpétuent traditions millénaires. Artisanat (vannerie, poterie, arcs), pharmacopée, navigation fluviale. Le carbet (grande case communautaire) structure vie sociale. Fêtes traditionnelles comme le Wayanas kashere (initiation).

Les Bushinenge (ou Noirs Marrons) ont créé culture unique mêlant Afrique et Amazonie. Langue businenge tongo, art décoratif (tissus panaï, sculpteur aluku), musique awassa. Vivant principalement le long du Maroni.

La communauté hmong cultivatrice excellente fournit fruits et légumes. Marchés hmong réputés. Nouvel An hmong coloré et festif.

Le carnaval guyanais de janvier à mars est unique : groupes touloulou (femmes masquées invitant à danser), bals parés-masqués, vidés de rue. Musique carnaval typique, costumes élaborés.

Gastronomie métissée : bouillon d'awara (fruit palmier), pimentade (sauce très pimentée), couac (manioc), poissons Amazonie (atipa, coumarou), gibier (pécari, agouti). Rhums arrangés macérés fruits locaux.`,

        economie: 'Spatial (CSG 15% PIB, 1 700 emplois directs), or (légal et illégal problématique), pêche crevettière, bois, agriculture (riz Mana), BTP, services. Dépendance aides État.',
        
        conseils: `Climat équatorial : chaud humide toute l'année (26-32°C). Saison sèche août-novembre meilleure. Pluies mars-juin fortes. Anti-moustiques indispensable (dengue, chikungunya, fièvre jaune, paludisme zones isolées).

Vaccin fièvre jaune OBLIGATOIRE pour entrer. Traitement antipaludéen si forêt. Eau robinet Cayenne potable, ailleurs bouteille. Pharmacies Cayenne bien équipées, hôpital Cayenne. Assurance rapatriement recommandée.

Vols Paris-Cayenne 8h30 directs (Air France, Air Caraïbes). Décalage -4h été, -5h hiver. Location voiture Cayenne-Kourou 40-60€/jour. Routes goudronnées côte uniquement. Accès fleuves pirogue obligatoire.

Budget : 150-200€/jour. Hôtels Cayenne 80-150€, carbets lodge 100-200€. Restaurants 15-30€. Excursions guidées forêt/fleuves 80-150€/jour. Lancements Ariane gratuits observation publique.

Sécurité : délinquance Cayenne quartiers sensibles (Village Chinois). Pas objets valeur vue. Forêt : guides obligatoires, dangers (serpents, insectes, rivières). Respect cultures autochtones essentielles.

Port spatial : réserver visite longtemps avance. Lancements depuis site observation Toucan (gratuit) ou payants VIP plus proches.

Rencontres amérindiennes : respect traditions, photos avec permission, pas toucher objets sacrés. Guides locaux privilégier.`
      },

      reunion: {
        nom: 'La Réunion',
        type: 'Département et région d\'outre-mer français',
        statut: 'DROM - Région ultrapériphérique européenne',
        capitale: 'Saint-Denis',
        population: '860 000 habitants (2024)',
        superficie: '2 512 km²',
        langues: 'Français (officiel), Créole réunionnais',
        monnaie: 'Euro (EUR)',
        fuseau: 'UTC+4',
        geographie: 'Île volcanique de l\'océan Indien, à 800 km à l\'est de Madagascar et 200 km au sud-ouest de Maurice. Le Piton des Neiges (3 070m), volcan éteint, est le point culminant des Mascareignes et de l\'océan Indien. Le Piton de la Fournaise (2 632m), un des volcans les plus actifs au monde, est en éruption quasi-annuellement. Les trois cirques - Mafate (inaccessible en voiture), Cilaos et Salazie - sont spectaculaires.',
        
        histoire: `L\'île inhabitée est découverte par les Arabes au Moyen Âge (Dina Morgabin), puis par les Portugais au XVIe siècle. La France prend possession en 1642, la nommant Bourbon en l\'honneur de la famille royale.

La colonisation débute en 1665 avec la Compagnie française des Indes orientales. L\'économie caféière puis sucrière se développe basée sur l\'esclavage. Des Africains (Mozambique, Madagascar), Indiens malgaches sont déportés et réduits en esclavage.

Le 20 décembre 1848, Sarda Garriga proclame l\'abolition de l\'esclavage à La Réunion. Cette date est fêtée comme fête de la liberté "Fèt Kaf". Les 62 000 esclaves libérés refusent de travailler dans les plantations sucrières.

Pour pallier le manque de main-d\'œuvre, 100 000 travailleurs engagés arrivent d\'Inde du Sud (Tamouls, Gujaratis, Musulmans) entre 1848 et 1882, puis de Chine, d\'Afrique, de Madagascar. Cette immigration crée le métissage réunionnais unique.

En 1946, La Réunion devient DOM. Le développement s\'accélère après 1960 avec routes, électricité, eau courante, éducation. Le CHU de Saint-Denis est créé, l\'aéroport Roland-Garros ouvre.

En 2010, les Pitons, cirques et remparts de La Réunion sont inscrits au patrimoine mondial UNESCO pour leurs paysages volcaniques et biodiversité exceptionnelle.`,

        patrimoine: `Le Piton de la Fournaise, volcan bouclier ultra-actif, est un des plus accessibles au monde. L\'Enclos Fouqué, cratère de 19 km, se visite (2h30 marche). Le cratère Dolomieu (356m profondeur) impressionne. Observatoire volcanologique surveille activité. Éruptions spectaculaires quasi-annuelles attirent des milliers de visiteurs. Paysages lunaires de coulées de lave, tunnels de lave.

Les trois cirques naturels classés UNESCO offrent randonnées époustouflantes. Mafate, accessible uniquement à pied ou hélicoptère, abrite 700 habitants dans îlets isolés (Marla, La Nouvelle, Roche-Plate). GR R1 et GR R2 traversent cirques. Cilaos station thermale, Salazie cascade Voile de la Mariée (300m), Hell-Bourg plus beau village de France 1998.

Le Piton des Neiges, toit de l\'océan Indien à 3 070m, se gravit en 2 jours avec nuit au gîte de la Caverne Dufour. Vue panoramique à 360° au sommet sur toute l\'île et, par temps clair, Maurice.

Les plages de l\'ouest : Saint-Gilles-les-Bains, l\'Hermitage, Saint-Leu (surf), Boucan-Canot. Lagon protégé par barrière corallienne, plongée exceptionnelle, snorkeling. Attention requins : baignades interdites hors lagons depuis 2011 suite attaques.

Saint-Denis préserve architecture créole case (maisons créoles traditionnelles colorées), Cathédrale Saint-Denis, Villa du Département, Barachois (front de mer), Grand Marché forain du Chaudron (samedi matin couleurs et saveurs).`,

        culture: `Le créole réunionnais, langue créole à base lexicale française avec influences malgaches, indiennes, africaines, structure identité. "Mi aime a ou" signifie "Je t\'aime". Littérature créole avec Axel Gauvin, Jean-François Samlong.

Le maloya, musique et danse traditionnelle, inscrit patrimoine immatériel UNESCO 2009, vient des esclaves africains et malgaches. Instruments : kayamb (hochet bambou graines), roulèr (tambour cylindrique), pikèr (idiophone). Danbèr Maronèr défend maloya engagé. Kabars (fêtes maloya) rassemblent communauté.

Le séga réunionnais, plus festif et dansant que le maloya, anime fêtes. Ti Fock, Alain Peters sont icônes. Métissage musical unique mêlant influences africaines, indiennes, européennes.

Les fêtes religieuses reflètent diversité : Dipavali tamoul (fête lumières), Cavadee (marche pieds nus sur feu), pèlerinage catholique Notre-Dame de la Salette, Aïd musulman, Nouvel An chinois. Cohabitation harmonieuse religions.

Gastronomie créole métissée exceptionnelle : carry (pas curry!) poulet/porc/poisson avec riz grains, rougail saucisse/morue, achards légumes, samoussas fromage/viande, bonbons piment, gâteau patate douce, rhum arrangé (vanille, ananas, letchi). Les bouchons (petites portions) à partager. Cuisine tamoul végétarienne, cuisine chinoise (nems, mines). Marchés forains samedi matins incontournables.`,

        economie: 'Sucre (90 000T/an), rhum, tourisme (500 000 visiteurs/an), BTP, services. Chômage 17%. Dépendance métropole forte. Vanille Bourbon très rare et chère.',
        
        conseils: `Meilleure période : mai-novembre (hiver austral sec 20-26°C). Éviter janvier-mars (été cyclonique chaud humide 25-32°C, risques cyclones). Décalage +2h été, +3h hiver.

Vols Paris-Réunion 11h directs. Location voiture indispensable (40-60€/jour). Route littoral RN1 entre Saint-Denis et La Possession spectaculaire mais éboulements fréquents, nouvelle route des Tamarins alternative sûre. Routes montagne sinueuses, brouillard fréquent. Essence 1,50-1,70€/L.

Budget : 100-150€/jour. Gîtes montagne 40-70€/nuit, hôtels balnéaires 80-200€. Restaurants créoles 12-20€, gastronomiques 35-60€. Randonnées gratuites nombreuses. Survols hélicoptère 200-350€ (spectaculaire cirques + volcan).

Santé : vaccins universels. Anti-moustiques dengue/chikungunya (épidémies récurrentes). Chikungunya 2005-2006 a touché 300 000 Réunionnais. SPF50+ soleil tropical altitude. Eau robinet potable partout. CHU Saint-Denis excellent, cliniques privées.

Sécurité requins : JAMAIS se baigner hors lagons ouest. Attaques mortelles régulières depuis 2011. Zones surveillées uniquement. Surf interdit sauf compétitions encadrées. Randonnées : météo change vite altitude, équipement adapté obligatoire (chaussures montagne, vêtements chauds/pluie, eau, nourriture, téléphone chargé). Mafate : prévoir portage léger, réserver gîtes avance. Guides recommandés premières fois.

Volcan : respecter consignes préfecture si éruption. Phase alerte 1 interdiction Enclos. Observer depuis belvédères autorisés. Jamais s\'approcher coulées actives (gaz toxiques, chaleur intense, risque éboulement).

Respect : saluer "bonjour" toujours. Créole apprécié même approximatif. Photos habitants avec permission. Lieux culte respect tenue. Marchés : marchander mais rester correct prix déjà bas.`
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
      const welcomeMessage = `Salut ! 👋 Je m'appelle Alex, et franchement, je suis super content de vous rencontrer. Je suis passionné de culture et de voyages depuis toujours - j'ai passé les dernières années à explorer le patrimoine mondial, et maintenant je suis là pour partager tout ça avec vous.

REUSSITESS, c'est vraiment mon projet coup de cœur. Une plateforme qui réunit **62 pages de patrimoine** sur 5 continents, **26 boutiques** pour vous faciliter les achats, et des tonnes de conseils pratiques basés sur mon expérience.

Écoutez, parlons comme des amis, sans prise de tête. Vous voulez savoir quelque chose sur la France, l'Italie, la Guadeloupe, la Martinique ? Vous cherchez des conseils voyage ? Des bons plans shopping ? Je suis là pour ça.

**Je connais TOUT le projet par cœur** - chaque page, chaque pays, chaque boutique. Posez-moi n'importe quelle question, même les plus pointues. Je vous réponds toujours en détail, comme si on discutait autour d'un café.

Alors, qu'est-ce qui vous intéresse aujourd'hui ? 😊`;
      
      setMessages([{ role: 'assistant', content: welcomeMessage, emotion: 'enthusiastic' }]);
    }
  }, [isOpen]);

  const speak = function(text, emotion = 'neutral') {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      // Nettoyer le texte
      const cleanText = text
        .replace(/\*\*/g, '')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .substring(0, 500); // Limite pour pas trop long
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = currentLang;
      utterance.rate = 0.92;
      utterance.pitch = 0.85; // VOIX MASCULINE GRAVE
      utterance.volume = 1.0;
      
      // Ajuster selon émotion
      if (emotion === 'enthusiastic') {
        utterance.rate = 1.0;
        utterance.pitch = 0.9;
      } else if (emotion === 'empathetic') {
        utterance.rate = 0.88;
        utterance.pitch = 0.82;
      }
      
      // FORCER VOIX MASCULINE
      const voices = window.speechSynthesis.getVoices();
      const maleVoiceKeywords = ['male', 'homme', 'thomas', 'daniel', 'diego', 'hans', 'luca', 'ricardo', 'homme', 'masculin'];
      
      const maleVoice = voices.find(function(voice) {
        const isRightLang = voice.lang.startsWith(currentLang.substring(0, 2));
        const isMale = maleVoiceKeywords.some(function(keyword) {
          return voice.name.toLowerCase().includes(keyword);
        });
        return isRightLang && isMale;
      });
      
      if (maleVoice) {
        utterance.voice = maleVoice;
        console.log('🗣️ Voix masculine sélectionnée:', maleVoice.name);
      } else {
        // Fallback: chercher voix la plus grave disponible
        const anyVoice = voices.find(function(voice) {
          return voice.lang.startsWith(currentLang.substring(0, 2));
        });
        if (anyVoice) utterance.voice = anyVoice;
      }
      
      utterance.onstart = function() { setIsSpeaking(true); };
      utterance.onend = function() { setIsSpeaking(false); };
      utterance.onerror = function(e) {
        console.error('Erreur synthèse vocale:', e);
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = function() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getIntelligentResponse = function(userMessage) {
    const msgLower = userMessage.toLowerCase();
    
    // DÉTECTION NOM
    if (msgLower.match(/je m'appelle|mon nom|c'est|appelle moi/)) {
      const match = userMessage.match(/(?:je m'appelle|mon nom est|c'est|appelle moi)\s+(\w+)/i);
      if (match) {
        const name = match[1];
        setUserName(name);
        return `Enchanté ${name} ! 😊 Vraiment ravi de faire votre connaissance. Moi c'est Alex. 

Bon, maintenant qu'on se connaît un peu, dites-moi - vous êtes plutôt team **culture et patrimoine**, ou team **bons plans et conseils pratiques** ? Ou les deux ? 

Je peux vous parler en détail des **62 pages** de la bibliothèque REUSSITESS (France, Italie, Guadeloupe, Martinique, Guyane, Réunion... tous les continents !), vous expliquer les **26 boutiques**, ou même juste discuter voyages et culture si ça vous dit.

Qu'est-ce qui vous intéresse ${name} ?`;
      }
    }

    // SALUTATIONS
    if (msgLower.match(/^(salut|hello|bonjour|coucou|hey|hi)\b/)) {
      const greets = [
        `Hey${userName ? ' ' + userName : ''} ! 👋 Content de vous revoir ! Alors, qu'est-ce qui vous amène aujourd'hui ? 

Vous avez une question précise, ou vous voulez juste explorer un peu ? Je suis là pour vous aider sur :
• **Patrimoine mondial** - les 62 pages en détail
• **Conseils voyage** pratiques et authentiques  
• **Boutiques** et bons plans
• **Culture** et découvertes

Dites-moi tout !`,
        
        `Salut${userName ? ' ' + userName : ''} ! J'espère que vous allez bien ! 😊

Écoutez, je suis à votre disposition pour n'importe quelle question. Que ce soit :
• La **France** et ses 49 sites UNESCO
• La **Guadeloupe**, **Martinique**, **Guyane**, **Réunion**
• Les autres pays de la bibliothèque
• Des **conseils concrets** pour vos voyages
• Ou juste une discussion culturelle

Qu'est-ce qui vous tente ?`
      ];
      return greets[Math.floor(Math.random() * greets.length)];
    }

    // GUADELOUPE
    if (msgLower.match(/guadeloupe|gwada/)) {
      const gp = KNOWLEDGE_BASE.domtom.guadeloupe;
      return `Ah, la Guadeloupe ! ❤️ Franchement, c'est un de mes coups de cœur absolu.

**${gp.nom}** - ${gp.statut}
📍 ${gp.capitale}
👥 ${gp.population}
🗣️ ${gp.langues}

Laissez-moi vous raconter pourquoi la Guadeloupe est exceptionnelle :

**🌋 GÉOGRAPHIE SPECTACULAIRE**
${gp.geographie}

**📜 HISTOIRE RICHE**
${gp.histoire.substring(0, 800)}...

**🏝️ PATRIMOINE INCROYABLE**
${gp.patrimoine.substring(0, 800)}...

**🎭 CULTURE VIVANTE**
${gp.culture.substring(0, 800)}...

**💰 CONSEILS PRATIQUES**
${gp.conseils}

${userName ? userName + ', v' : 'V'}ous voulez que je vous en dise plus sur un aspect particulier ? Le gwoka ? Les plages ? La Soufrière ? La gastronomie créole ? Je peux vous raconter tout en détail ! 🌴✨`;
    }

    // MARTINIQUE
    if (msgLower.match(/martinique|madinina/)) {
      const mq = KNOWLEDGE_BASE.domtom.martinique;
      return `La Martinique ! L'île aux fleurs ! 🌺 Laissez-moi vous partager ma passion pour cette perle des Caraïbes.

**${mq.nom}** - ${mq.statut}
📍 ${mq.capitale}
👥 ${mq.population}
🗣️ ${mq.langues}
💶 ${mq.monnaie}

**🌴 POURQUOI LA MARTINIQUE EST UNIQUE**

**🌋 LA MONTAGNE PELÉE - HISTOIRE TRAGIQUE**
${mq.histoire.substring(mq.histoire.indexOf('Le 8 mai 1902'), mq.histoire.indexOf('Le 8 mai 1902') + 400)}

C'est vraiment émouvant quand on visite Saint-Pierre aujourd'hui. Les ruines sont là, silencieuses, témoins de cette catastrophe qui a marqué à jamais l'île.

**🏛️ PATRIMOINE & CULTURE**
${mq.patrimoine.substring(0, 700)}

**🎶 CULTURE CRÉOLE VIVANTE**
${mq.culture.substring(0, 700)}

**🍽️ GASTRONOMIE EXCEPTIONNELLE**
Le colombo de poulet martiniquais, franchement, c'est autre chose que ce qu'on trouve en métropole. Le boudin créole, la fricassée de chatrou (poulpe)... Et le rhum agricole AOC Martinique (Clément, JM, Neisson) est mondialement reconnu !

**✈️ CONSEILS PRATIQUES**
${mq.conseils.substring(0, 500)}

${userName ? userName + ', ' : ''}vous voulez que je développe un aspect ? La Pelée ? Aimé Césaire ? Les plages ? Le rhum ? Je peux vous raconter des heures ! 😊`;
    }

    // GUYANE
    if (msgLower.match(/guyane|kourou|spatial/)) {
      const gy = KNOWLEDGE_BASE.domtom.guyane;
      return `La Guyane ! Alors là, c'est vraiment un territoire à part. 🚀🌴

**${gy.nom}** - Le plus vaste département français !
📍 ${gy.capitale}
📏 ${gy.superficie} - c'est ÉNORME !
👥 ${gy.population}
🗣️ ${gy.langues} - 15 langues, vous imaginez la richesse culturelle !

**🌍 UN TERRITOIRE D'EXCEPTION**

**🚀 LE CENTRE SPATIAL GUYANAIS**
${gy.patrimoine.substring(0, gy.patrimoine.indexOf('Le Parc Amazonien'))}

Franchement, voir un lancement d'Ariane, c'est grandiose ! Le grondement, les flammes, la fusée qui s'élève... un spectacle inoubliable. Et c'est gratuit depuis les sites d'observation publics !

**🌳 FORÊT AMAZONIENNE - 96% DU TERRITOIRE**
${gy.patrimoine.substring(gy.patrimoine.indexOf('Le Parc Amazonien'), gy.patrimoine.indexOf('Le Parc Amazonien') + 500)}

La biodiversité est hallucinante. 1 200 espèces d'arbres, des jaguars, des harpies féroces, des tapirs... C'est l'Amazonie authentique.

**🏛️ HISTOIRE DU BAGNE**
${gy.histoire.substring(gy.histoire.indexOf('De 1852 à 1953'), gy.histoire.indexOf('De 1852 à 1953') + 400)}

**🌈 DIVERSITÉ CULTURELLE UNIQUE**
${gy.culture.substring(0, 700)}

15 langues parlées ! Créoles, Amérindiens (6 peuples), Bushinenge, Hmong, Brésiliens, Haïtiens... C'est vraiment le territoire le plus multiculturel de France.

**✈️ CONSEILS VOYAGE**
${gy.conseils.substring(0, 600)}

${userName ? userName + ', c' : 'C'}urieux d'en savoir plus ? Les peuples amérindiens ? Les Hmong ? Le spatial ? Les tortues luths ? Je peux vous raconter des choses passionnantes ! 🐢🚀`;
    }

    // RÉUNION
    if (msgLower.match(/réunion|reunion|piton|fournaise/)) {
      const re = KNOWLEDGE_BASE.domtom.reunion;
      return `La Réunion ! L'île intense ! 🌋 Mon coup de cœur absolu de l'océan Indien.

**${re.nom}** - Île volcanique exceptionnelle
📍 ${re.capitale}
👥 ${re.population}
🌡️ ${re.fuseau}
⛰️ **Piton des Neiges 3 070m** - toit de l'océan Indien !

**🌋 LE PITON DE LA FOURNAISE - SPECTACLE NATUREL**
${re.patrimoine.substring(0, re.patrimoine.indexOf('Les trois cirques'))}

Franchement, voir le Piton de la Fournaise en éruption, c'est un spectacle que vous n'oublierez jamais. Les coulées de lave incandescente, les fontaines de feu... magique ! Et c'est un des volcans les plus accessibles au monde.

**⛰️ LES TROIS CIRQUES UNESCO**
${re.patrimoine.substring(re.patrimoine.indexOf('Les trois cirques'), re.patrimoine.indexOf('Les trois cirques') + 500)}

Mafate, accessible uniquement à pied, c'est vraiment une aventure hors du temps. 700 habitants vivent dans les îlets sans route. Incroyable !

**🎭 CULTURE CRÉOLE MÉTISSÉE**
${re.culture.substring(0, 700)}

**🎵 LE MALOYA - PATRIMOINE UNESCO**
${re.culture.substring(re.culture.indexOf('Le maloya'), re.culture.indexOf('Le maloya') + 400)}

**🍛 GASTRONOMIE CRÉOLE EXCEPTIONNELLE**
Le carry réunionnais (attention, ça s'écrit carry, pas curry !), le rougail saucisse, les achards légumes, le rhum arrangé vanille-letchi... La cuisine réunionnaise c'est un mélange incroyable d'influences africaines, indiennes, chinoises, françaises.

**⚠️ SÉCURITÉ REQUINS - IMPORTANT**
${re.conseils.substring(re.conseils.indexOf('Sécurité requins'), re.conseils.indexOf('Sécurité requins') + 300)}

JAMAIS se baigner hors des lagons surveillés. C'est vraiment crucial.

**✈️ CONSEILS PRATIQUES**
${re.conseils.substring(0, 500)}

${userName ? userName + ', v' : 'V'}ous voulez que je développe ? Le volcan ? Les cirques ? La randonnée ? La gastronomie ? Le maloya ? Je peux vous en parler pendant des heures ! 🌴🌋`;
    }

    // FRANCE
    if (msgLower.match(/france|français|tour eiffel|versailles|paris/)) {
      return `La France ! Alors là, on parle de mon terrain de jeu préféré ! 🇫🇷

**LA FRANCE - 49 SITES UNESCO - RECORD EUROPÉEN**

Écoutez, la France c'est vraiment un musée à ciel ouvert. **49 sites classés UNESCO**, c'est le record en Europe ! Je vais vous raconter pourquoi c'est exceptionnel.

**🗼 PARIS - LA VILLE LUMIÈRE**
30 millions de visiteurs par an, capitale touristique mondiale. La **Tour Eiffel** (1889) construite par Gustave Eiffel pour l'Exposition universelle - 324 mètres, 7 millions de visiteurs annuels. Pendant 41 ans, c'était le monument le plus haut du monde !

**👑 VERSAILLES - LA DÉMESURE ROYALE**
Le Château de Versailles, c'est Louis XIV qui a voulu montrer la puissance absolue de la monarchie française. **2 300 pièces**, les jardins à la française de Le Nôtre sur **815 hectares**... Quand vous vous promenez dans la Galerie des Glaces, vous imaginez les fêtes somptueuses du Roi-Soleil.

**🏰 MONT-SAINT-MICHEL - MERVEILLE GOTHIQUE**
Cette abbaye posée sur son rocher qui semble flotter sur la mer aux grandes marées... magique ! L'architecture gothique est spectaculaire. Et les grandes marées avec un marnage de 14 mètres, c'est impressionnant.

**🏰 CHÂTEAUX DE LA LOIRE**
**300 châteaux** le long d'une seule rivière, vous imaginez ! **Chambord** avec son escalier double hélice dessiné par Léonard de Vinci, **Chenonceau** sur le Cher, **Amboise** où est enterré Léonard... C'est la Renaissance française dans toute sa splendeur.

**🍽️ GASTRONOMIE UNESCO**
La France est le PREMIER pays où l'art du repas gastronomique est inscrit au patrimoine de l'UNESCO ! Les fromages (plus de 1 200 variétés !), les vins (Bordeaux, Bourgogne, Champagne), la haute cuisine française... C'est un art de vivre.

**📊 CHIFFRES IMPRESSIONNANTS**
• **90 millions de visiteurs par an** - 1er pays touristique mondial
• **49 sites UNESCO** - record européen
• **Premier patrimoine gastronomique** protégé

**💡 BONS PLANS CONCRETS**
Pour visiter Paris pas cher :
• **Paris Museum Pass 48h à 55€** - Louvre, Versailles, Orsay et 50 autres musées SANS FAIRE LA QUEUE
• Allez en semaine, évitez les weekends  
• Réservez Versailles 2-3 mois à l'avance
• **Navigo semaine 30€** pour transport illimité zones 1-5 (inclut aéroports)
• Musées nationaux GRATUITS premier dimanche du mois
• **Bouillons historiques** comme Chartier - resto parisien belle époque à 20€ le menu

${userName ? userName + ', v' : 'V'}ous voulez que je développe un aspect ? Paris ? Les châteaux ? La gastronomie ? Les régions ? Je connais la France dans les moindres détails ! 🥖🍷✨`;
    }

    // BOUTIQUES (sans liens)
    if (msgLower.match(/boutique|amazon|shop|acheter/)) {
      return `Les **26 boutiques** du réseau REUSSITESS ! Alors là, je vais vous expliquer comment elles sont organisées. 🛍️

**🌍 RÉSEAU MONDIAL - 26 BOUTIQUES SUR 5 CONTINENTS**

Je connais chaque boutique par cœur, leurs spécificités, leurs avantages. Voici comment c'est organisé :

**🇪🇺 EUROPE (10 boutiques)**
• **France** - Prime 6,99€/mois le moins cher d'Europe, French Days
• **Allemagne** - Plus grand marché européen, prix 10-15% moins chers
• **Royaume-Uni** - Mode britannique heritage, livres anglais
• **Italie** - Design italien, gastronomie, mode luxe authentique
• **Espagne** - Prix doux, jamón ibérico, vins Rioja
• **Pays-Bas** - Vélos (23M vélos pour 17M habitants !), design nordique
• **Belgique** - Bilingue FR/NL, chocolat, bières trappistes
• **Suède** - Design scandinave, lifestyle nordique
• **Pologne** - Hub Europe de l'Est, prix compétitifs
• **Turquie** - Carrefour Europe-Asie, artisanat ottoman

**🌎 AMÉRIQUES (4 boutiques)**
• **États-Unis** - Géant mondial, 300M clients, 12M produits
• **Canada** - Bilingue FR/EN parfait pour Québec
• **Mexique** - Culture mexicaine, artisanat traditionnel
• **Brésil** - Leader Amérique Latine, culture vibrante

**🌏 ASIE (6 boutiques)**
• **Inde** - 500M utilisateurs, Prime le moins cher du monde !
• **Singapour** - Hub tech Asie, prix électronique top
• **Japon** - Manga, anime, tech japonaise de pointe
• **Chine** - Marché massif 1,4 milliard
• **Corée du Sud** - K-beauty, K-pop (via sites régionaux)
• **Émirats/Arabie** - Hub Moyen-Orient luxe

**🌍 AFRIQUE/OCÉANIE (6 boutiques)**
• **Égypte** - Plus grand marché africain arabophone
• **Afrique du Sud** - Hub Afrique australe
• **Australie** - Pacifique Sud, lifestyle outdoor
• **Nouvelle-Zélande** - Via Australie, culture maorie

**💡 CE QUE JE PEUX VOUS EXPLIQUER**

Pour chaque boutique, je connais :
✅ Les **spécificités culturelles** et produits typiques
✅ Les **avantages** de chaque marché
✅ Les **conseils pratiques** d'utilisation
✅ Les **différences de prix** entre pays
✅ Les **meilleures périodes** pour acheter

**🎯 EXEMPLES CONCRETS**

Vous cherchez de l'**électronique** ?
→ Je vous explique pourquoi l'Allemagne ou Singapour sont intéressants

Vous aimez la **mode** ?
→ UK pour heritage britannique, Italie pour luxe italien à prix d'usine

Vous voulez de la **gastronomie** ?
→ Italie (huile, pâtes), Espagne (jamón, vins), France (fromages)

${userName ? userName + ', d' : 'D'}ites-moi ce qui vous intéresse et je vous guide ! Un pays en particulier ? Un type de produit ? Je vous explique TOUT en détail ! 🌍✨`;
    }

    // MERCI
    if (msgLower.match(/merci|thanks|gracias/)) {
      const thanks = [
        `Mais avec grand plaisir${userName ? ' ' + userName : ''} ! 😊 Franchement, c'est pour ça que je suis là. Si vous avez d'autres questions - maintenant ou plus tard - n'hésitez surtout pas. 

Que ce soit sur le **patrimoine mondial**, les **conseils voyage**, la **culture**, ou n'importe quoi d'autre, je suis toujours dispo pour en discuter ! ✨`,
        
        `De rien${userName ? ' ' + userName : ''} ! Ça me fait vraiment plaisir de pouvoir aider. C'est ça qui est cool avec REUSSITESS - partager la passion du patrimoine et de la culture avec des gens curieux comme vous.

Revenez quand vous voulez, la porte est toujours ouverte ! 🌍❤️`
      ];
      return thanks[Math.floor(Math.random() * thanks.length)];
    }

    // AU REVOIR
    if (msgLower.match(/au revoir|bye|à bientôt|salut|ciao/)) {
      const byes = [
        `À très bientôt${userName ? ' ' + userName : ''} ! 👋 

Et n'oubliez pas, je suis toujours là si vous avez des questions sur les **62 pages**, les **26 boutiques**, ou juste pour discuter culture et voyages. 

Bonne continuation dans vos découvertes ! ✨🌍`,
        
        `Salut${userName ? ' ' + userName : ''} ! Ça a été un vrai plaisir de discuter avec vous. 

Revenez quand vous voulez - que ce soit pour approfondir un sujet, découvrir une nouvelle destination, ou juste papoter culture. La porte est toujours ouverte !

Bon voyage dans vos explorations ! 🗺️❤️`
      ];
      return byes[Math.floor(Math.random() * byes.length)];
    }

    // AIDE
    if (msgLower.match(/aide|help|perdu|comment/)) {
      return `Pas de souci${userName ? ' ' + userName : ''}, je suis là pour ça ! Laissez-moi vous expliquer comment je peux vraiment vous aider. 😊

**🌍 PATRIMOINE & CULTURE - 62 PAGES COMPLÈTES**

Je connais **TOUT** sur :
• **France** - 49 sites UNESCO, châteaux, gastronomie
• **Guadeloupe** - Soufrière, gwoka, plages paradisiaques
• **Martinique** - Montagne Pelée, Aimé Césaire, rhum
• **Guyane** - Spatial, Amazonie, cultures amérindiennes
• **Réunion** - Piton de la Fournaise, cirques, maloya
• **Italie** - 58 sites UNESCO record mondial
• **Tous les autres pays** des 5 continents

Je peux vous raconter :
✅ **L'histoire détaillée** de chaque lieu
✅ **La culture locale** authentique
✅ **Les conseils pratiques** de voyage
✅ **Les bons plans** pour économiser
✅ **La gastronomie** locale
✅ **Les fêtes et traditions**

**🛍️ 26 BOUTIQUES - EXPERTISE COMPLÈTE**

Pour chaque boutique, je vous explique :
✅ Les **spécificités** du marché
✅ Les **avantages** de chaque pays
✅ Les **produits typiques** à découvrir
✅ Les **différences de prix**
✅ Les **conseils d'achat** pratiques

**✈️ CONSEILS VOYAGE AUTHENTIQUES**

Je vous aide sur :
• **Budget** - comment voyager pas cher
• **Sécurité** - conseils essentiels
• **Meilleures saisons** - quand partir
• **Transport** - comment se déplacer
• **Hébergement** - où dormir
• **Gastronomie** - où et quoi manger

**💬 EXEMPLES DE QUESTIONS**

Posez-moi des trucs comme :
• "Raconte-moi la Guadeloupe en détail"
• "France patrimoine UNESCO"
• "Conseils voyage Martinique budget"
• "Pourquoi la Réunion est exceptionnelle"
• "Boutique Italie spécialités"
• "Meilleure période Guyane"

**🎯 MON APPROCHE**

Je vous réponds :
✅ **En détail** - je développe vraiment
✅ **Comme un ami** - pas de jargon
✅ **Avec passion** - j'adore ce sujet
✅ **Pratiquement** - conseils concrets
✅ **Honnêtement** - je dis ce que je pense vraiment

${userName ? userName + ', p' : 'P'}arlez-moi comme à un pote, posez vos vraies questions, n'ayez pas peur d'être précis. Plus vous êtes spécifique, mieux je peux vous aider !

Alors, par quoi on commence ? 😊✨`;
    }

    // DÉFAUT INTELLIGENT
    return `Hmm${userName ? ' ' + userName : ''}, je ne suis pas sûr d'avoir bien compris votre question. Vous pouvez reformuler ?

Ou sinon, dites-moi ce qui vous intéresse parmi :

**🌍 PATRIMOINE & CULTURE (62 pages)**
• **DOM-TOM** : Guadeloupe, Martinique, Guyane, Réunion
• **Europe** : France, Italie, Allemagne, UK, Espagne...
• **Amériques** : USA, Canada, Brésil, Mexique...
• **Asie** : Inde, Japon, Singapour, Chine...
• **Afrique & Océanie** : Australie, Égypte...

**🛍️ 26 BOUTIQUES MONDIALES**
• Spécificités de chaque marché
• Conseils d'achat par pays
• Produits typiques à découvrir

**✈️ CONSEILS VOYAGE**
• Budget et bons plans
• Meilleures périodes
• Sécurité et santé
• Transport et hébergement

Je suis là pour vous aider vraiment, alors n'hésitez pas à me demander n'importe quoi ! 😊`;
  };

  const handleSubmit = function(e) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Ajouter message utilisateur
    setMessages(function(prev) { 
      return prev.concat({ role: 'user', content: userMessage }); 
    });
    
    setIsLoading(true);

    // Simuler réflexion humaine (600-1200ms)
    const thinkingTime = 600 + Math.random() * 600;
    
    setTimeout(function() {
      try {
        const response = getIntelligentResponse(userMessage);
        const emotion = userMessage.toLowerCase().includes('merci') ? 'empathetic' : 
                       userMessage.toLowerCase().match(/bonjour|salut/) ? 'enthusiastic' : 'neutral';
        
        setMessages(function(prev) { 
          return prev.concat({ role: 'assistant', content: response, emotion: emotion }); 
        });
        
        // Parler avec émotion
        speak(response, emotion);
        
      } catch (error) {
        console.error('Erreur:', error);
        setMessages(function(prev) { 
          return prev.concat({ 
            role: 'assistant', 
            content: `Oups, j'ai eu un petit bug là ! 😅 Vous pouvez répéter ? Je vous écoute attentivement.` 
          }); 
        });
      }
      setIsLoading(false);
    }, thinkingTime);
  };

  return (
    <div className="fixed z-50">
      {/* Bouton flottant ALEX */}
      <button
        onClick={function() { setIsOpen(!isOpen); }}
        className="fixed bottom-8 right-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all animate-pulse"
        style={{ 
          boxShadow: '0 0 60px rgba(59, 130, 246, 0.8), 0 0 120px rgba(168, 85, 247, 0.6)',
          width: '90px',
          height: '90px'
        }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-5xl mb-1">💬</span>
          <span className="text-sm font-bold tracking-wide">ALEX</span>
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
        <div className="fixed bottom-32 right-8 w-[650px] h-[850px] bg-white rounded-3xl shadow-2xl flex flex-col border-4 border-purple-600">
          
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-5xl shadow-lg">
                  👨
                </div>
                <div>
                  <h3 className="font-bold text-2xl">Alex</h3>
                  <p className="text-sm opacity-95">Expert Culture & Voyage • REUSSITESS</p>
                  <p className="text-xs opacity-90 mt-1">🧠 Passionné • Humain • Empathique</p>
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
          <div className="p-4 border-b-2 border-purple-200 flex gap-2 overflow-x-auto bg-gradient-to-r from-purple-50 to-pink-50">
            {languages.map(function(lang) {
              const isActive = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={function() { setCurrentLang(lang.code); }}
                  className={isActive 
                    ? 'px-5 py-3 rounded-xl text-base font-semibold whitespace-nowrap bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110'
                    : 'px-5 py-3 rounded-xl text-base font-semibold whitespace-nowrap bg-white hover:bg-purple-100 text-gray-700 border-2 border-purple-200'}
                  title={lang.voice ? 'Voix : ' + lang.voice : ''}
                >
                  {lang.flag} {lang.name}
                </button>
              );
            })}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-purple-50/30 to-white">
            {messages.map(function(msg, idx) {
              const isUser = msg.role === 'user';
              const htmlContent = msg.content
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                .replace(/\n/g, '<br/>')
                .replace(/• /g, '<br/>• ')
                .replace(/#{1,6}\s/g, '<br/><strong>')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline font-bold text-blue-600 hover:text-purple-600" target="_blank">$1</a>');
              
              return (
                <div key={idx} className={isUser ? 'flex justify-end' : 'flex justify-start'}>
                  <div 
                    className={isUser
                      ? 'max-w-[85%] p-5 rounded-2xl shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg leading-relaxed'
                      : 'max-w-[85%] p-5 rounded-2xl shadow-lg bg-white text-gray-800 border-2 border-purple-200 text-lg leading-relaxed'}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border-2 border-purple-200 p-5 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce" />
                      <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-4 h-4 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="text-gray-600 font-medium">Alex réfléchit...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-5 border-t-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={function(e) { setInput(e.target.value); }}
                placeholder="Parlez-moi comme à un ami... 💬"
                className="flex-1 border-2 border-purple-300 rounded-xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-purple-400 text-lg"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🚀
              </button>
            </div>
            {userName && (
              <p className="text-xs text-gray-500 mt-3 text-center">
                💬 Conversation avec {userName} • Alex est à votre écoute
              </p>
            )}
            <p className="text-xs text-gray-400 mt-2 text-center">
              🗣️ Voix masculine activée • 62 pages • 26 boutiques • Expert culture
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
