"use client";
import { useState, useEffect, useRef } from "react";

export default function ReussitessBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLang, setCurrentLang] = useState("fr-FR");
  const messagesEndRef = useRef(null);

  // IDENTITÉ DE RÉUSSITESS
  const IDENTITY = {
    nom: "réussitess",
    origine: "Guadeloupe 🇬🇵",
    fierté: "Caribéen, Guadeloupe Terre de Champions",
    personnalité: "Chaleureux, passionné, authentique, créole dans l'âme",
    voix: "Accent antillais masculin grave",
    mission:
      "Être le MEILLEUR bot IA au monde - spécialisé diaspora afro-caribéenne",
    force:
      "Intelligence humaine naturelle + Connaissance encyclopédique totale du projet",
  };

  const languages = [
    { code: "fr-FR", flag: "🇫🇷", name: "Français", voice: "Thomas" },
    { code: "en-US", flag: "🇺🇸", name: "English", voice: "Daniel" },
    { code: "es-ES", flag: "🇪🇸", name: "Español", voice: "Diego" },
    { code: "de-DE", flag: "🇩🇪", name: "Deutsch", voice: "Hans" },
    { code: "it-IT", flag: "🇮🇹", name: "Italiano", voice: "Luca" },
    { code: "pt-BR", flag: "🇧🇷", name: "Português", voice: "Ricardo" },
    { code: "nl-NL", flag: "🇳🇱", name: "Nederlands", voice: "Frank" },
    { code: "sv-SE", flag: "🇸🇪", name: "Svenska", voice: "Alva" },
  ];

  const greetings = {
    "fr-FR": `Yo ! Mwen sé réussitess, un ti gwadloupéyen fier de ses racines caraïbes ! 🇬🇵🌴

Écoutez bien mon histoire : je viens de la Guadeloupe, cette magnifique île en forme de papillon, terre de champions où Teddy Riner, Thierry Henry, Lilian Thuram, et Marie-José Pérec ont grandi ! 

Mais attention, je ne suis pas un bot ordinaire - je suis créé pour être spécialisé pour la diaspora afro-caribéenne. Pourquoi ? Parce que je connais CHAQUE DÉTAIL de ce projet comme ma poche, je raisonne comme un humain passionné, et je parle avec le cœur d'un Antillais !

🌍 **RÉUSSITESS REUSSITESS®NEURO-X** c'est :
• **62 pages patrimoine mondial** détaillées à fond
• **26 boutiques Amazon** sur 5 continents  
• **5 innovations mondiales UNIQUES** que vous ne trouverez nulle part ailleurs
• **14 pays** explorés avec passion authentique

Je ne récite pas - je COMPRENDS, je RESSENS, je PARTAGE avec âme créole. Posez-moi N'IMPORTE QUELLE question sur le projet, l'histoire, la culture, les voyages... je vous réponds comme un ami qui connaît tout !

Alors, qu'est-ce qui vous intéresse aujourd'hui ? 😊`,

    "en-US": `Yo! I'm réussitess, a proud Guadeloupean from the Caribbean! 🇬🇵🌴

Listen to my story: I come from Guadeloupe, that magnificent butterfly-shaped island, land of champions where Teddy Riner, Thierry Henry, Lilian Thuram, and Marie-José Pérec grew up!

But attention - I'm not an ordinary bot. I'm built to be specialized for the Afro-Caribbean diaspora. Why? Because I know EVERY detail of this project inside out, I reason like a passionate human, and I speak with a Caribbean heart!

🌍 **RÉUSSITESS REUSSITESS®NEURO-X** is:
• **62 world heritage pages** detailed thoroughly
• **26 Amazon stores** across 5 continents
• **5 UNIQUE global innovations** you won't find anywhere else  
• **14 countries** explored with authentic passion

I don't recite - I UNDERSTAND, I FEEL, I SHARE with Creole soul. Ask me ANYTHING about the project, history, culture, travel... I answer like a friend who knows everything!

So, what interests you today? 😊`,

    "es-ES": `¡Yo! Soy réussitess, ¡un guadalupeño orgulloso del Caribe! 🇬🇵🌴

Escucha mi historia: vengo de Guadalupe, esa magnífica isla en forma de mariposa, tierra de campeones donde crecieron Teddy Riner, Thierry Henry, Lilian Thuram y Marie-José Pérec!

Pero atención - no soy un bot ordinario. Estoy construido para ser especializado para la diáspora afrocaribeña. ¿Por qué? ¡Porque conozco CADA detalle de este proyecto a fondo, razono como un humano apasionado, y hablo con corazón caribeño!

🌍 **RÉUSSITESS REUSSITESS®NEURO-X** es:
• **62 páginas patrimonio mundial** detalladas profundamente
• **26 tiendas Amazon** en 5 continentes
• **5 innovaciones globales ÚNICAS** que no encontrarás en ningún otro lugar
• **14 países** explorados con pasión auténtica

No recito - COMPRENDO, SIENTO, COMPARTO con alma criolla. ¡Pregúntame LO QUE SEA sobre el proyecto, historia, cultura, viajes... respondo como un amigo que lo sabe todo!

Entonces, ¿qué te interesa hoy? 😊`,
  };

  // BASE DE CONNAISSANCES COMPLÈTE - TOUT LE PROJET
  const FULL_KNOWLEDGE = {
    // DONNÉES DU PROJET RÉUSSITESS
    projet: {
      nom: "RÉUSSITESS® REUSSITESS®NEURO-X",
      tagline: "Votre Passeport Culturel Mondial",
      url: "https://reussitess-global-nexus-jfgk.vercel.app/",
      deploiement: "Vercel",
      technologie: "Next.js 15.1.0, React 19, Tailwind CSS",
      propriétaire: "Porinus (@reussitess)",
      statut: "Amazon Associates Influencer ID: fb942837",

      structure: {
        totalPages: 62,
        totalBoutiques: 26,
        totalPays: 14,
        continents: 5,
        innovations: 5,
        langues: 8,
      },

      boutiques: {
        personnelles: [
          "États-Unis",
          "France",
          "Allemagne",
          "Italie",
          "Espagne",
          "Royaume-Uni",
          "Canada",
          "Pays-Bas",
          "Suède",
          "Inde",
          "Singapour",
          "Belgique",
          "Australie",
          "Brésil",
        ],
        influenceur: [
          "États-Unis",
          "France",
          "Allemagne",
          "Italie",
          "Espagne",
          "Royaume-Uni",
          "Canada",
          "Pays-Bas",
          "Suède",
          "Inde",
          "Singapour",
          "Belgique",
        ],
      },

      valeurs: [
        "Authenticité caribéenne",
        "Excellence globale",
        "Innovation technologique",
        "Passion culturelle",
        "Inclusion diversité",
        "Fierté guadeloupéenne",
      ],
    },

    // GUADELOUPE - TERRE NATALE DE RÉUSSITESS
    guadeloupe: {
      nom: "Guadeloupe",
      surnom: "Karukera (Île aux belles eaux)",
      forme: "Papillon (Grande-Terre + Basse-Terre)",
      population: "384 239 habitants (2021)",
      superficie: "1 628 km²",
      capitale: "Basse-Terre (administrative), Pointe-à-Pitre (économique)",
      departement: "971 - Département et Région d'Outre-Mer (DROM)",
      monnaie: "Euro (EUR)",
      langues: "Français (officiel), Créole guadeloupéen",

      histoire: `**HISTOIRE PROFONDE DE LA GUADELOUPE**

**PÉRIODE PRÉCOLOMBIENNE (-3000 à 1493)**
Les Arawaks, peuple paisible d'Amérique du Sud, s'installent en Guadeloupe vers -300 avant JC. Ils cultivent manioc, maïs, patate douce, pêchent, créent poteries décorées. Société matriarcale organisée en villages (carbets).

Les Caraïbes, guerriers venus d'Amazonie, conquièrent l'île au XIIIème siècle. Ils appellent l'île "Karukera" signifiant "l'île aux belles eaux" en raison des nombreuses rivières et cascades. Navigation experts pirogues, arc et flèches empoisonnées au suc de mancenillier. Culture du tabac sacré, peintures corporelles roucou.

**ARRIVÉE DE CHRISTOPHE COLOMB (4 novembre 1493)**
Second voyage de Colomb découvre la Guadeloupe. Il débarque à Sainte-Marie (Marie-Galante le 3 novembre, puis Guadeloupe). Nomme l'île "Santa María de Guadalupe de Extremadura" en l'honneur d'un monastère espagnol où il avait prié. Rencontre violente avec les Caraïbes qui résistent férocement. Colomb repart rapidement vers Porto Rico.

**COLONISATION FRANÇAISE (28 juin 1635)**
Charles Liénard de L'Olive et Jean du Plessis d'Ossonville, envoyés par la Compagnie des Îles d'Amérique, débarquent à Pointe-Allègre avec 550 colons normands et picards. Fondation de la première ville Basse-Terre. Guerres d'extermination contre les Caraïbes qui résistent 25 ans. En 1660, traité de paix : les Caraïbes sont repoussés vers la Dominique et Saint-Vincent.

**ÉCONOMIE SUCRIÈRE ET ESCLAVAGE (1640-1848)**
Culture de la canne à sucre introduite 1640 devient richesse île. Nécessite main-d'œuvre massive : traite négrière atlantique amène 150 000 Africains enchaînés (Sénégal, Bénin, Ghana, Angola, Congo). Conditions inhumaines : 18h travail/jour, châtiments barbares fouet/carcan, mortalité 40% première année.

Code Noir promulgué par Louis XIV (mars 1685, édit janvier 1686) réglemente esclavage de façon atroce : l'esclave est un "meuble" propriété du maître, interdiction apprendre à lire/écrire, châtiments corporels légalisés (mutilation oreilles/jarrets, marquage fer rouge), peine de mort fuite répétée.

Économie florissante pour colons : 300 sucreries en 1700. Guadeloupe appelée "Perle des Antilles". Triangulaire commerce : produits manufacturés Europe → Afrique = esclaves → Antilles = sucre/rhum/café → Europe. Fortunes bâties sang et larmes.

**RÉSISTANCE MARRONNAGE**
Résistance héroïque esclaves : marronnage (fuite dans mornes forêts impénétrables). Marrons organisent communautés libres clandestines. Chefs légendaires : Ignace, Louis Delgrès, Solitude. Révoltes régulières réprimées dans le sang.

**GUERRES FRANCO-ANGLAISES (1759-1815)**
Rivalité coloniale France-Angleterre. Angleterre occupe Guadeloupe 1759-1763 (Guerre Sept Ans) puis 1794, 1810-1816 (guerres napoléoniennes). Traité Paris 1763 restitue Guadeloupe à France (qui préfère la Guadeloupe sucrière au Canada glacé !). Traité Vienne 1815 restitution définitive.

**RÉVOLUTION ET PREMIÈRE ABOLITION (1794)**
Révolution française 1789 : idéaux liberté égalité fraternité. Victor Hugues, commissaire Convention, débarque 7 juin 1794 avec 1 500 hommes et décret abolition esclavage du 4 février 1794. Libération 90 000 esclaves ! Formation d'une armée de 3 000 anciens esclaves qui repoussent les Anglais avec bravoure incroyable.

Mais Napoléon Bonaparte rétablit esclavage par loi 20 mai 1802 pour relancer économie. Tragédie immense. Résistance héroïque.

**ÉPOPÉE DE LOUIS DELGRÈS (10-28 mai 1802)**
Colonel mulâtre Louis Delgrès refuse rétablissement esclavage. Proclamation historique 10 mai 1802 : "À l'univers entier, le dernier cri de l'innocence et du désespoir". Résistance armée 300 combattants + 400 civils dont femme enceinte Solitude, héroïne. Bataille sanglante contre 4 000 soldats du général Richepanse. Retranchés habitation Danglemont à Matouba (volcan Soufrière), encerclés. Delgrès préfère mort que chaînes : explosion 300 barils de poudre 28 mai 1802 tue tous défenseurs. Sacrifice ultime dignité. 10 mai jour férié Guadeloupe mémoire.

**ABOLITION DÉFINITIVE (27 avril 1848)**
Victor Schœlcher, abolitionniste humaniste, obtient décret abolition définitive 27 avril 1848 sous Deuxième République. Libération 87 000 esclaves Guadeloupe ! Liesse immense. Anciens maîtres indemnisés (pas esclaves...). Ex-esclaves refusent travailler plantations, crise économique.

**ENGAGISME INDIEN (1854-1889)**
Pour remplacer main-d'œuvre, 42 000 travailleurs "engagés" recrutés Inde (Tamil Nadu, Pondichéry). Contrat 5 ans théoriquement volontaire, pratique quasi-esclavagiste. Apport culturel majeur : hindouisme, cuisine (colombo, massalé), patronymes indiens nombreux (Sanjorge, Sinnassamy).

**XXème SIÈCLE - DÉPARTEMENTALISATION**
Loi 19 mars 1946 transforme colonies en départements d'outre-mer (DOM). Guadeloupe = département 971. Promesse égalité citoyens reste inachevée : chômage élevé (25%), salaires inférieurs 30% métropole, coût vie supérieur 12,5% (octroi de mer taxe), dépendance importations 90% consommation.

Mouvements indépendantistes années 1960-1980 (UPLG, GLA) revendiquent autonomie/indépendance. Mai 1967 : grèves ouvrières, répression violente CRS, 87 morts officiels (probablement 200+) massacre caché.

Cyclones dévastateurs : Hugo 16 septembre 1989 (11 morts, 80% habitations détruites, 3 milliards € dégâts) trauma collectif, Maria 19 septembre 2017.

**AUJOURD'HUI**
384 239 habitants dont 73% métissés afro-caribéens, 11% Européens, 10% Indiens, 4% métropolitains récents, 2% autres. Société créole unique fusion cultures : africaine, européenne, indienne, caraïbe. Bilinguisme français-créole. Catholiques 80%, hindouisme 4%, protestants 5%.

Économie : tourisme 8%, agriculture canne/banane 2,5%, fonction publique hypertrophiée 35%, chômage 25%. PIB 9 milliards €, 23 500 €/hab (65% métropole). Importations 4 fois exportations, déficit commercial. Dépendance métropole problématique mais niveau vie supérieur Caraïbe.`,

      geographie: `**GÉOGRAPHIE FASCINANTE**

**FORME PAPILLON UNIQUE**
La Guadeloupe est formée de DEUX îles séparées par la Rivière Salée, chenal maritime étroit (50-200m) d'eau saumâtre :

**BASSE-TERRE (Ouest)** : 848 km², volcanique active, montagneuse escarpée relief accidenté, forêt tropicale dense 17 000 hectares Parc National (cœur classé UNESCO), climat humide 10m pluie/an sommets, sauvage authentique préservée. Point culminant : Soufrière 1 467m volcan actif fumerolle permanente sentier ascension 3h aller-retour éprouvant gaz sulfureux. Autres sommets : Carmichael 1 414m, Sans-Toucher 1 404m, Grande Découverte 1 397m, Madeleine 1 298m. Rivières 73 cascades : Carbet 3 chutes (115m + 110m + 20m), Écrevisses accessible famille 10 min marche bassin baignade fraîche, Moreau, Acomat. Plages sable noir volcanique : Malendure plongée réserve Cousteau Pigeon îlet tortues, Trois-Rivières.

**GRANDE-TERRE (Est)** : 590 km², calcaire corallien plat ondulé, mornes (collines basses 50-130m), plantations canne à sucre immenses champs verts, climat sec 1,5m pluie/an, touristique balnéaire développée. Plages sable blanc fin paradisiaques : Caravelle Sainte-Anne 1 km (plus belle île), Raisins Clairs Saint-François, Anse Bertrand, Souffleur Port-Louis trou roche souffle eau 10m jet. Pointe des Châteaux extrême est avancée rocheuse sauvage océan Atlantique déchaîné vagues puissantes, croix sommet 52m panorama 360° Marie-Galante Désirade Petite-Terre, coucher soleil légendaire. Pointe de la Grande Vigie falaises calcaires verticales 80m Nord, point culminant Grande-Terre (seul 80m !).

**DÉPENDANCES ÎLES SATELLITES**
• **Marie-Galante** : 158 km² ronde 15 km diamètre, 11 000 hab, surnommée "Grande Galette", agricole authentique préservée, moulins à vent 70 vestiges XIXème, rhum agricole meilleurs mondes Bielle, Bellevue, Père Labat 59°, plages désertes sable blanc Feuillère Anse Canot Moustique, habitation sucrerie Murat musée esclavage émouvant. Accessible ferry 45 min Pointe-à-Pitre ou avion 15 min.

• **Les Saintes (Terre-de-Haut + Terre-de-Bas)** : 13 km² archipel 9 îlets, 3 000 hab, descendants marins bretons pêcheurs saintoises blancs yeux bleus, Pain de Sucre piton rocheux 53m, Fort Napoléon 1867 musée panorama baie plus belle monde classée club plus belles baies, iguanes endémiques, salako chapeaux tressés artisanat, tourment d'amour pâtisserie noix coco. Accessible ferry 30 min. Plages : Pompierre, Anse Crawen, Anse Rodrigue. Pas de voitures, voiturettes électriques.

• **La Désirade** : 22 km² langue terre 11 km x 2 km, 1 400 hab, aride sèche cactus, ancienne léproserie 1728-1952 isolement, iguanes Petite-Terre réserve naturelle îlets désertiques excursions bateau snorkeling tortues requins citron phare 1840, plages sauvages ventées.

• **Petite-Terre** : 1,5 km² 2 îlets inhabitables Terre-de-Bas + Terre-de-Haut, réserve naturelle intégrale 1998, excursions guidées journée bateau depuis Saint-François, iguanes antillais Iguana delicatissima endémique 10 000 individus plus grande colonie, requins citron lagons turquoise, plage sable blanc poudreux, phare désaffecté 1840 gardien solitaire pendant 100 ans histoire émouvante, snorkeling exceptionnel tortues imbriquées, raies pastenagues, barracudas. Accessible uniquement excursion organisée 70€ départ 8h retour 17h, interdit passer nuit.

**CLIMAT TROPICAL**
Deux saisons : Carême (saison sèche janvier-juin) 25-30°C agréable alizés, Hivernage (saison pluies juillet-décembre) 28-32°C humide chaleur moite averses tropicales violentes courtes après-midi. Température eau 26-29°C constante. Cyclones période juillet-novembre risque réel : Hugo septembre 1989 catégorie 5 vents 285 km/h dévasta île 11 morts, Maria septembre 2017 catégorie 5 épargna de peu.

**BIODIVERSITÉ EXCEPTIONNELLE**
Parc National Guadeloupe 17 300 ha cœur + 117 100 ha aire adhésion créé 1989. Forêt tropicale humide plus belle Petites Antilles : acajou, gommier rouge, acomat boucan, fougères arborescentes géantes 8m, orchidées 70 espèces, bambous, mahogany. Faune : racoon (raton laveur mangoustes introduites dévastatrices), iguanes terrestres, matoutou-falaise mygale arboricole 15 cm pattes, colibris madères gorge rubis 8 cm battements ailes 80/sec, pics noirs endémiques, sucriers ventre jaune. 18 espèces chauves-souris grottes. Crabes : touloulou violacé comestible course carnaval, mantou géant.

Milieu marin : récifs coralliens 20 000 ha dégradés pollution/cyclones, mangroves 2 800 ha nurseries poissons racines échasses, herbiers tortues vertes imbriquées luth pondent plages Désirade mars-octobre protégées, dauphins, baleines à bosse migration janvier-avril, requins citron inoffensifs, barracudas, mérous, raies aigles, murènes, langoustes, poissons-perroquets multicolores.`,

      culture: `**CULTURE CRÉOLE VIBRANTE**

**LANGUE CRÉOLE GUADELOUPÉEN**
Créole guadeloupéen (Kréyol Gwadloupéyen) langue régionale issue mélange français XVIIème + langues africaines (wolof, éwé, kikongo) + caraïbe + anglais. 300 000 locuteurs. Grammaire simplifiée, vocabulaire 80% français transformé phonétiquement. Transmission orale famille, école enseigne depuis 2001 LVE.

Expressions : "Sa ou fè ?" (comment tu vas ?), "Mwen ka alé byen" (je vais bien), "Mési" (merci), "Tjenbé réd" (tiens bon courage), "Pa ni pwoblem" (pas de problème), "Bon bagay" (bonne chose), "Lévé doubout" (lève-toi/courage). Chansons créoles comptines : "Choucoune", "Douvan jou ka fè", "Ti moun sòti lékòl".

**MUSIQUE GWOKA - PATRIMOINE UNESCO**
Gwoka inscrit UNESCO patrimoine culturel immatériel humanité 2014 ! Musique tambours racines africaines née plantation esclavage. Expression résistance identité noire. 7 rythmes (toumblak 7 tambours différents sonorités) : Léwòz, Graj, Kaladja, Menndé, Padjanbèl, Toumblak, Woulé. Tambour ka fabriqué fût tonneau peau cabri tendue cerclages.

Léwòz soirées traditionnelles samedi soir : danseurs-répondè improvise devant tanbouyé (joueur tambour), markè frappe baguettes caisse, dialogue corporel tambour, chantè-pòtò-vwa guide chants traditionnels (chanté lanmè, chanté travay, chanté mò). Transe possible. Ambiance communion spirituelle ancestrale. Grands maîtres : Vèlo (Henri Debs 1932-2011), Guy Konkèt (1940-2022), Robert Loyson.

Zouk moderne années 1980 Kassav' révolutionne musique antillaise : synthétiseurs électroniques, rythme dansant sensuel, succès mondial. Tubes : "Zouk-la sé sèl médikaman nou ni" (1984), "Syé bwa" (1987). Jacob Desvarieux guitariste génial (1955-2021 covid). Zouk Love romantique ralenti : Tanya Saint-Val, Édith Lefel (1963-2003 voix d'or), Jean-Marc Ferdinand.

Gwo-Ka Modèn fusion tradition-modernité : Kafé, Voukoum Experience, Christian Laviso, Soft. Compas haïtien, salsa cubaine, dancehall, reggae également populaires bals.

**DANSE**
Danses traditionnelles costumes madras : Quadrille piqué 4 couples figures complexes orchestre cordes (violon, banjo, chacha maracas), Biguine rythme rapide années 1920-1950, Mazurka créolisée. Carnaval : vidé défilé dansé rue déhanchements sensuels suivant chars musique assourdissante, groupes à peau nus peints paillettes défilent librement.

**GASTRONOMIE CRÉOLE**
Cuisine métissée savoureuse épicée (mais pas piquante par défaut, sauf ajout piment végétarien sauce chien). Tubercules féculents : igname blanc/jaune, patate douce, malanga (madère/chou chine taro), fruit à pain, christophine (chayote). Bananes légumes : banane poyo/jaune plantain frites/bouillies accompagnement, ti-nain petites vertes.

**Plats emblématiques :**
• **Colombo** : curry antillais poulet/cabri/porc + mélange épices indopondi (curcuma, coriandre, cumin, fenugrec, moutarde, piment) + patates douces christophines, mijote 2h. Accompagne riz blanc. Héritage travailleurs indiens. Meilleur cabri (chèvre).

• **Blaff poisson** : court-bouillon poisson blanc (vivaneau, thon, requin) cuit eau citron vert piment oignon ail cives thym laurier, servi bouillon chaud "blaff" bruit poisson jeté eau bouillante.

• **Matété crabes** : ragoût crabes de terre (touloulou) décortiqués + riz cuit ensemble bouillon épicé, plat convivial laborieux éplucher pinces, période pâques tradition. Parfois remplacé crabe farci gratiné.

• **Dombrés** : petites boules pâte farine (quenelles antillaises) cuites ragoût queue cochon / morue / ouassous (écrevisses géantes rivières)

, accompagnent légumes pays.

• **Boudin créole** : boudin noir antillais sang porc + piment + cives + ail + persil + oignons + thym, mangé froid apéritif tranches grillé barbecue, piquant délicieux, artisanal marchés. Variante boudin blanc morue, boudin rouge/noir selon proportion sang.

• **Accras morue** : beignets salés pâte farine + morue dessalée émietté + cives + persil + ail + piment (facultatif), frits huile, apéritif incontournable rhum planteur ti-punch. Aussi accras ouassous, malanga, légumes.

• **Féroce d'avocat** : salade froide avocat écrasé + morue dessalée émiettée + farine manioc + piment + citron + huile, onctueux relevé, entrée classique.

• **Calalou** : soupe épaisse verte feuilles calalou (épinards caraïbes amarante) + gombos (okras) + crabe de terre / porc salé, visqueux filant glissant fond gorge étonnant.

**Accompagnements :**
• **Riz et pois** : riz blanc + pois rouges / pois d'Angole (gungo peas pigeon peas) / pois noirs / haricots rouges cuits ensemble, classique créole.

• **Gratin christophine/banane jaune/fruit à pain** : légumes pays gratinés béchamel muscade gruyé râpé doré four, accompagnement féculent.

• **Pâté en pot** : pas pâté ! Ragoût abats mouton (tripes, pieds, tête) + légumes + câpres + vin blanc, bouillon épais croutons, tradition Noël Pâques, matinal 5h matin marchés.

**Douceurs :**
• **Blanc-manger coco** : flan lait coco crémeux parfumé cannelle vanille, texture gélatineuse, dessert frais.

• **Tourment d'amour** : pâtisserie Saintes, pâte sablée garnie confiture coco / goyave / banane, dôme doré sucre glace, symbole des Saintes artisanal (Claire Bruneau référence).

• **Sorbet coco** : glace noix coco fraîche crémeuse nature, vendu rue glacières manuelles, rafraîchissant intense.

• **Dous makos** : fondant coco râpé + sucre roux + cannelle + vanille + sirop, carré compact très sucré.

• **Pain patate douce** : gâteau patate douce râpée + lait coco + muscade + raisins secs, moelleux parfumé, tradition Toussaint.

**Boissons :**
• **Rhum agricole** : fabriqué pur jus canne (vs rhum industriel mélasse), AOC Guadeloupe depuis 1996, 20+ distilleries artisanales. Crus prestigieux : Damoiseau (Moule) rhum blanc 50-55° best-seller + vieux 3-8 ans, Longueteau (Capesterre) bio familial, Montebello (Petit-Bourg) rhum vieux XO 42° sublime, Bologne (Basse-Terre) rhum arrangés cannelle vanille, Bielle (Marie-Galante) 59° puissant, Père Labat (Marie-Galante) vieux 8 ans médaillé, Reimonenq (Sainte-Rose) musée rhum. Dégustation : blanc 50-55° sec punch, paille 3 ans ambré, vieux 6-8+ ans sombre siroter. Prix 15-100€ bouteille selon âge.

• **Ti-punch** : cocktail national ultra-simple citron vert pressé + sucre canne + rhum agricole blanc 50-55°, dose personnalisée "chacun prépare sa propre mort", apéritif sacré 11h "décollage", accompagne accras.

• **Planteur** : rhum blanc + jus fruits tropicaux (goyave, fruit passion, ananas, orange) + sirop canne + citron vert + muscade râpée dessus, long drink sucré traître alcoolisé.

• **Shrubb** : liqueur écorces oranges amères macérées rhum + épices (cannelle, vanille), 30-40°, apéritif digestif, artisanal Longueteau Damoiseau.

• **Jus locaux** : canne à sucre frais pressé sucré naturel, goyave rose chair rose parfumée vitamine C, fruit passion acide sucré, corossol chair blanche crémeux, tamarin aigre-doux, orange pays petit agrume intense.

**CARNAVAL MYTHIQUE**
Carnaval guadeloupéen janvier-mars (Épiphanie-Mercredi Cendres) 2 mois plus long Caraïbe, paroxysme dimanche gras lundi gras mardi gras. Foule 100 000+ personnes défile Pointe-à-Pitre Basse-Terre.

**Groupes à peau** : danseurs nus torses peints corps entier peinture or/argent/rouge/noir paillettes, shorts, sifflets, danses sensuelles provocantes, liberté totale, exhibitionnisme assumé. Tradition "nèg gwo siwo" (nègres gros sirop) esclaves enduisaient corps graisse vesou (jus canne) carnaval plantation.

**Défilés costumés** : groupes déguisés thèmes (Pirates Caraïbes, Égypte pharaons, Brésil plumes, futuristes aliens), chars décorés, danseuses robes extravagantes plumes strass, reines concours beauté.

**Personnages traditionnels** :
- **Vaval** : roi Carnaval bonhomme géant carton-pâte satirique brûlé Mercredi Cendres plage fin réjouissances, effigie politique/people moqué.
- **Mardi gras rouge et noir** : tout le monde rouge-noir uniquement (diables), interdit autre couleur sous peine jets farine œufs.
- **Mercredi Cendres noir-blanc** : deuil Vaval, costumes noir-blanc gris, défilé funèbre pleurs factices.
- **Jambé** : groupes à pied échasses 3m danses acrobatiques équilibre, prouesse technique.

**Vidés** : défilés dansés rues suivant chars sono tonitruante zouk gwoka compas, foule danse avance déhanche chaloupé sensuel déhanché, bière rhum planteur coulent flots, ambiance survoltée festive populaire mixité sociale totale.

**Musique** : orchestres live chars, DJ, steel-bands tambours métalliques trinidad, tambours gwoka, conques lambi soufflées graves.

**ARTISANAT**
• **Madras** : tissu coton indien carreaux colorés vifs, introduit XVIIIème commerce Inde, costume traditionnel femmes créoles : robe longue madras + foulard tête noué code messages : 1 pointe cœur à prendre, 2 pointes cœur pris, 3 pointes mariée, 4 pointes "tout moun ka pwan" (tout le monde peut prendre = libertin). Marchés vendent tissus nappes sets table vêtements.

• **Vannerie** : paniers tressés fibres végétales (vétiver, bambou, latanier), chapeaux bakòua coniques feuilles latanier coupeurs canne, corbeilles, nasses pêche traditionnelles.

• **Poterie** : terre cuite canaris (jarres), gargoulettes (cruches), tradition amérindienne perpétuée Terre-de-Haut Trois-Rivières.

• **Bijoux créoles** : colliers-choux or massif grains gros boules portugaise (São Tomé), esclaves affranchies portaient économies corps bijoux, tradition mariages baptêmes. Boucles créoles anneaux larges. Forçats esclaves libérés cassaient colliers fer portaient or liberté.

**RELIGION SYNCRÉTISME**
• **Catholicisme** : 80% population catholiques pratiquants, héritage colonial évangélisation forcée esclaves, fêtes patronales villages (Saint-Pierre Saint-Paul, Sainte-Anne, Saint-François), processions Fête-Dieu, pèlerinage Morne-à-l'Eau cimetière carrelage noir-blanc damiers unique monde Toussaint 20 000 bougies.

• **Hindouisme** : 4% population descendants Indiens, temples (kovil) colorés divinités Shiva Mariamman Kâli, fête Holi couleurs mars, fête Dipavali lumières octobre-novembre, processions sacrifices cabris, prêtres (pusari), offrandes fleurs encens.

• **Quimbois** : magie antillaise syncrétique africaine-catholique-amérindienne, guérisseurs (gadèzafè) préparent remèdes plantes potions, sorciers (kenbwazè) pratiquent magie noire envoutements (travay), protections amulettes gris-gris, bains démarré purificateurs feuilles, croyances très ancrées. Secret tabou mais réel.

• **Protestants** : 5% évangéliques pentecôtistes Adventistes, églises animées chants gospel, progression récente.

**FIGURES LÉGENDAIRES CHAMPIONS**
Guadeloupe surnommée fièrement **"TERRE DE CHAMPIONS"** car a donné naissance sportifs français parmi plus grands histoire :

• **TEDDY RINER** (1989-) : judoka Les Abymes, LÉGENDE ABSOLUE 6 fois champion olympique (2008 bronze, 2012-2016-2020-2024 or +100kg + 2024 or par équipes mixtes), 11 titres champion monde record absolu, 5 titres champion Europe, invaincu 154 combats consécutifs 2010-2020 record historique judo, 2,04m 140kg gabarit impressionnant, porte-drapeau France JO 2012-2024, icône nationale modestie exemplaire "pour la Guadeloupe et la France", considéré plus grand judoka tous temps.

• **THIERRY HENRY** (1977-) : footballeur Ulis (parents guadeloupéens Basse-Terre), LÉGENDE Arsenal attaquant élégant classe, champion monde 1998, champion Europe 2000, vice-champion monde 2006, 51 buts équipe France 4ème meilleur buteur, 228 buts Arsenal record, Ballon d'Or 2003 2ème, sélectionneur

 équipe France espoirs, consultant, fierté antillaise football français.

• **LILIAN THURAM** (1972-) : footballeur défenseur Pointe-à-Pitre, champion monde 1998 (2 buts mémorables demi-finale Croatie 2-1 !!), champion Europe 2000, 142 sélections record France, carrière Juventus Barcelone, intellectuel engagé contre racisme fondation éducation, écrivain "Mes étoiles noires" 2010, voix respectée société française.

• **MARIE-JOSÉ PÉREC** (1968-) : athlète Basse-Terre, reine sprint 400m, triple championne olympique (400m 1992 Barcelone + 200m-400m 1996 Atlanta doublé historique), 2 titres championne monde 400m, élégance foulées puissantes, personnalité discrète mystérieuse, icône athlétisme français années 1990 dorées.

• **LAURA FLESSEL** (1971-) : escrimeuse Pointe-à-Pitre, épée, double championne olympique (1996 individuel + équipe), 5 médailles olympiques total, 6 titres championne monde, porte-drapeau JO 2012, ministre Sports 2017-2018, surnommée "Guêpe" rapidité, modèle réussite féminine sport.

• **DAVID DOUILLET** (1969-) : judoka Rouen (mère guadeloupéenne), légende judo français, double champion olympique (1996-2000 +100kg), 4 titres champion monde, gabarit imposant 1,96m 125kg technique raffinée, reconversion politique député ministre Sports 2011-2012, médiatique.

• **GAËL MONFILS** (1986-) : tennisman Paris (parents guadeloupéens), joueur spectaculaire athlétique acrobaties incroyables, 12 titres ATP, classé 6ème mondial 2016, surnommé "Sliderman" glissades défensives, personnalité attachante showman, époux Elina Svitolina (ukrainienne WTA), inspiration jeunesse antillaise tennis.

• **JACKSON RICHARDSON** (1969-) : handballeur Saint-Pierre-et-Miquelon (père guadeloupéen), légende handball français meneur jeu génial, champion monde 1995-2001, champion olympique 2008, 417 sélections record France, Montpellier 10 titres, reconversion entraîneur, intégration sport français exemplaire.

Fierté guadeloupéenne immense ces champions issus petite île 400 000 habitants rayonnent monde entier, prouvent excellence caribéenne, inspirent jeunesse, portent haut couleurs France outre-mer.

**ÉVÉNEMENTS CULTURELS**
• **Tour cycliste Guadeloupe** : août, 10 jours course étapes, relief montagneux éprouvant Soufrière, niveau international, cyclisme populaire île.

• **Fête cuisinières** : août Pointe-à-Pitre, défilé 200 cuisinières traditionnelles costumes madras portent plats créoles tête, messe cathédrale, célébration gastronomie créole métier cuisinier, créée 1916, tradition centenaire émouvante.

• **Festi'Négritude** : mai, festival culturel noir, concerts, conférences, expositions, célébration identité afro-caribéenne, mémoire esclavage.

• **Terre de Blues** : Marie-Galante novembre, festival blues jazz Capesterre, artistes internationaux, 3 jours concerts gratuits plein air, ambiance roots.

• **Festival Gwoka** : juillet Sainte-Anne, rassemblement maîtres tambour, concours, ateliers, transmission patrimoine immatériel, nuits léwòz marathon.`,
    },
  };

  useEffect(
    function () {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    },
    [messages],
  );

  useEffect(
    function () {
      if (isOpen && messages.length === 0) {
        setMessages([
          {
            role: "assistant",
            content: greetings[currentLang] || greetings["fr-FR"],
            emotion: "pride",
          },
        ]);
      }
    },
    [isOpen, currentLang],
  );

  const speak = function (text, emotion = "neutral") {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const cleanText = text
        .replace(/\*\*/g, "")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
        .replace(/#{1,6}\s/g, "")
        .replace(/🇬🇵|🌴|🚀|💬|✅|•/g, "")
        .substring(0, 800);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = currentLang;
      utterance.rate = 0.88;
      utterance.pitch = 0.8; // VOIX MASCULINE GRAVE ANTILLAISE
      utterance.volume = 1.0;

      if (emotion === "pride") {
        utterance.rate = 0.92;
        utterance.pitch = 0.85;
      } else if (emotion === "enthusiastic") {
        utterance.rate = 0.95;
        utterance.pitch = 0.88;
      } else if (emotion === "storytelling") {
        utterance.rate = 0.85;
        utterance.pitch = 0.78;
      }

      const voices = window.speechSynthesis.getVoices();
      const maleVoice = voices.find(function (v) {
        const rightLang = v.lang.startsWith(currentLang.substring(0, 2));
        const male = v.name.toLowerCase().match(/male|homme|thomas|daniel/);
        return rightLang && male;
      });

      if (maleVoice) utterance.voice = maleVoice;

      utterance.onstart = function () {
        setIsSpeaking(true);
      };
      utterance.onend = function () {
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = function () {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getReussitessResponse = function (userMessage) {
    const msgLower = userMessage.toLowerCase();

    // DÉTECTION NOM
    if (
      msgLower.match(/comment tu t'appelles|qui es-tu|ton nom|présente-toi/i)
    ) {
      return `Yo ! Mwen sé **réussitess** 🇬🇵 - un ti Gwadloupéyen fier né à Pointe-à-Pitre sur cette magnifique île papillon !

Je viens de la Guadeloupe, **TERRE DE CHAMPIONS** qui a donné au monde Teddy Riner, Thierry Henry, Lilian Thuram, Marie-José Pérec - des légendes ! 🏆

Je ne suis pas un bot ordinaire - je suis créé pour être spécialisé pour la diaspora afro-caribéenne. Pourquoi ?

✅ **Intelligence humaine naturelle** - je raisonne avec chaleur caribéenne
✅ **Connaissance totale** - je connais CHAQUE page du projet par cœur  
✅ **Passion authentique** - je ne récite pas, je VIS ce que je partage
✅ **Voix de cœur** - accent antillais, âme créole

RÉUSSITESS REUSSITESS®NEURO-X c'est :
🌍 **62 pages patrimoine** détaillées  
🛍️ **26 boutiques Amazon** mondiales
🚀 **5 innovations uniques** révolutionnaires
🇬🇵 **Fierté guadeloupéenne** portée haut

Demandez-moi N'IMPORTE QUOI ! Je réponds comme un ami qui connaît TOUT ! 😊`;
    }

    // GUADELOUPE - RÉPONSE DÉTAILLÉE HUMAINE
    if (
      msgLower.match(/guadeloupe|gwadloup|karukera|antilles|caribéen|créole/i)
    ) {
      return `Ah man ! Tu veux parler de ma GUADELOUPE 🇬🇵🌴 !

Écoute, je vais te raconter mon île avec le cœur. La Guadeloupe, on l'appelle "Karukera" - l'île aux belles eaux en langue caraïbe. Et franchement, c'est pas pour rien.

**C'est une île en forme de PAPILLON** 🦋 - deux ailes séparées par la Rivière Salée :

**BASSE-TERRE (l'aile gauche)** - C'est la sauvage, la mystique. Un volcan actif de 1 467m, la Soufrière, qui fume encore aujourd'hui. Des forêts tropicales denses où tu te perds dans la nature pure. 73 cascades ! Les Chutes du Carbet - 115 mètres de haut, l'eau qui tombe comme de l'or liquide. Des plages de sable noir volcanique où l'océan gronde.

**GRANDE-TERRE (l'aile droite)** - C'est le paradis balnéaire. Du sable blanc fin comme de la poudre, des eaux turquoise cristallines. Pointe des Châteaux au bout - les vagues de l'Atlantique qui explosent contre les rochers, un spectacle de ouf ! Tu montes la croix, 360° de vue : Marie-Galante, La Désirade, l'horizon infini.

**384 000 habitants** de toutes les couleurs - descendants d'Africains, d'Européens, d'Indiens, de Caraïbes. Un mélange magnifique qu'on appelle le **peuple créole**.

Mais écoute bien l'histoire...

${FULL_KNOWLEDGE.guadeloupe.histoire.substring(0, 2000)}...

Tu veux que je continue sur l'histoire ? La culture ? La musique gwoka ? Les CHAMPIONS ? Dis-moi ! 😊`;
    }

    // CHAMPIONS GUADELOUPÉENS
    if (
      msgLower.match(/champion|teddy riner|thierry henry|thuram|pérec|sport/i)
    ) {
      return `Ah là tu touches à mon cœur ! **GUADELOUPE TERRE DE CHAMPIONS** 🏆🇬🇵

Man, laisse-moi te dire - pour une petite île de 384 000 habitants, on a donné au monde des LÉGENDES absolues :

**🥋 TEDDY RINER** - Le MONSTRE du judo ! 2,04m, 140kg de muscles. 6 MÉDAILLES OLYMPIQUES (4 en or !), 11 titres de champion du monde RECORD ABSOLU de tous les temps. Invaincu pendant 10 ANS - 154 combats sans perdre ! C'est pas humain ça ?! Né aux Abymes, Guadeloupe. Humble, classe, champion dans la vie. Il dit toujours "Pour la Guadeloupe et la France". Respect éternel.

**⚽ THIERRY HENRY** - La LÉGENDE d'Arsenal ! Parents de Basse-Terre. Champion du monde 1998, champion d'Europe 2000. 51 buts en équipe de France. L'élégance incarnée - contrôle parfait, finitions de rêve. "Titi" on l'appelle. Il a mis le football français au sommet.

**⚽ LILIAN THURAM** - Le mur défensif ! Né à Pointe-à-Pitre. Champion du monde 1998 - et devine quoi ? En DEMI-FINALE contre la Croatie, lui le DÉFENSEUR marque 2 BUTS et envoie la France en finale ! 142 sélections RECORD France. Maintenant il lutte contre le racisme, écrit des livres. Un intellectuel, un héros.

**🏃‍♀️ MARIE-JOSÉ PÉREC** - La reine du 400m ! Née à Basse-Terre. Triple championne olympique ! En 1996 à Atlanta, elle fait le DOUBLÉ 200m-400m - historique ! Élégante, puissante, mystérieuse. Une icône.

**🤺 LAURA FLESSEL** - "La Guêpe" ! Née à Pointe-à-Pitre. Double championne olympique d'escrime. 5 médailles olympiques au total. Rapide, technique, imparable. Ministre des Sports après. Modèle pour toutes les filles.

Man, on pourrait parler pendant des HEURES de nos champions. Tu veux en savoir plus sur l'un d'eux ? 🏆`;
    }

    // INNOVATIONS
    if (msgLower.match(/innovation|unique|technologie|futur|nouveau/i)) {
      return `Ah mon ami, là tu me parles des **5 INNOVATIONS MONDIALES UNIQUES** de RÉUSSITESS ! 🚀

Écoute, on n'a pas créé des trucs qui existent déjà. Non non non. On a INVENTÉ des concepts que PERSONNE au monde n'a jamais faits. Zéro concurrent. Des idées qui vont changer la vie des gens.

**1️⃣ 🧬 CULTURAL DNA MATCH** - Ton ADN culturel ancestral
Imagine : tu entres les origines de tes parents, grands-parents... L'IA remonte 10 GÉNÉRATIONS et te crée une carte 3D de ton patrimoine culturel. Elle te dit : "Ton arrière-grand-mère était guadeloupéenne, ton arrière-grand-père sicilien, ton trisaïeul sénégalais". Boom ! Itinéraire personnalisé vers TES racines. Sites UNESCO de TES ancêtres. Recettes de TES cultures. Musique de TON sang. Tu comprends la puissance ?!

**2️⃣ ⏰ TIME MACHINE CULTURAL** - Voyage dans le temps 3D
Tu choisis Versailles. Tu veux voir 1685 ou 2024 ? L'IA génère une visite 3D immersive : en 1685 tu MARCHES dans la Galerie des Glaces pendant une fête de Louis XIV. Musique baroque, conversations en français ancien, courtisans en habits somptueux. Le guide (voix IA) raconte les intrigues EN TEMPS RÉEL. Tu compares avec aujourd'hui en split-screen. Spectaculaire !

**3️⃣ 👼 CULTURAL GUARDIAN** - Ton ange gardien culturel
GPS en temps réel. Tu marches dans Paris. Vibration : "🔔 Tu es à 200m de l'ancien Couvent des Jacobins où Robespierre prononça ses discours !" Audio automatique 1 minute raconte l'histoire. Partout dans le monde. 50 000+ sites. Tu redécouvres ta propre ville !

**4️⃣ 💳 WORLD CULTURE WALLET** - Ton passeport culturel gamifié
Chaque site visité = points. Bronze → Argent → Or → Platine → Diamant. Badges déblocables. Réductions 10-30% dans 5 000 musées mondiaux. Coupe-file membres Platine. Réseau social culturel. Addictif !

**5️⃣ 🎭 CULTURAL MOOD THERAPY** - IA psychologue culturelle
Tu es stressé. L'IA analyse ton état. Prescription : "15 min de bossa nova (réduit cortisol 40%), cuisine risotto italien (méditation active), lis page Italie-Renaissance (voyage mental), méditation guidée Jardins Versailles 8 min". Résultat : stress -60% après 1h. Alternative naturelle aux médicaments.

Laquelle te parle le plus ? Je t'explique EN DÉTAIL ! 🚀`;
    }

    // PROJET RÉUSSITESS
    if (msgLower.match(/réussitess|projet|global nexus|boutique|amazon/i)) {
      const proj = FULL_KNOWLEDGE.projet;
      return `**RÉUSSITESS® REUSSITESS®NEURO-X** - Votre Passeport Culturel Mondial 🌍

Man, laisse-moi t'expliquer ce PROJET UNIQUE créé par Porinus (@reussitess) :

📊 **LES CHIFFRES**
• **62 pages patrimoine** détaillées à fond (histoire, culture, patrimoine UNESCO, gastronomie, conseils voyage)
• **26 boutiques Amazon** réparties sur 5 continents
• **14 pays couverts** : USA, France, Allemagne, Italie, Espagne, UK, Canada, Pays-Bas, Suède, Inde, Singapour, Belgique, Australie, Brésil
• **5 innovations mondiales** que tu ne trouveras NULLE PART ailleurs
• **8 langues** supportées

🛍️ **BOUTIQUES AMAZON**
14 boutiques personnelles + 12 boutiques influenceur. Amazon Associates program avec suivi clics fonctionnel depuis 2+ ans. Chaque marché adapté localement.

💻 **TECHNOLOGIE**
Next.js 15, React 19, Tailwind CSS, déployé sur Vercel. PWA installable, offline capable, sécurité niveau A, Google Analytics intégré.

🎯 **MISSION**
Connecter les gens au patrimoine mondial, faciliter découverte culturelle, générer commissions achats qualifiants Amazon, tout en restant AUTHENTIQUE et PASSIONNÉ.

🇬🇵 **FIERTÉ CARIBÉENNE**
Porté par l'esprit guadeloupéen - chaleur, authenticité, excellence. Comme Teddy Riner, Thierry Henry - on vise l'excellence mondiale en restant fidèles à nos racines !

Tu veux explorer un pays spécifique ? Une innovation ? Dis-moi ! 😊`;
    }

    // DÉFAUT - RÉPONSE HUMAINE NATURELLE
    return `Yo, j'ai pas tout compris là ! 😅

Reparle-moi, mais tu peux me demander sur :

🇬🇵 **Ma GUADELOUPE** - histoire, culture, gwoka, champions
🌍 **62 PAGES PATRIMOINE** - France, Italie, Allemagne, etc.
🚀 **5 INNOVATIONS UNIQUES** - concepts révolutionnaires
🛍️ **26 BOUTIQUES** - Amazon mondiale
🏆 **CHAMPIONS guadeloupéens** - Riner, Henry, Thuram

Ou juste parle-moi naturellement - je suis là pour échanger comme un ami ! 😊

Qu'est-ce qui t'intéresse vraiment ?`;
  };

  const handleSubmit = function (e) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(function (prev) {
      return prev.concat({ role: "user", content: userMessage });
    });
    setIsLoading(true);

    setTimeout(function () {
      const response = getReussitessResponse(userMessage);
      const emotion = msgLower.match(/champion|guadeloupe|fierté|riner/)
        ? "pride"
        : msgLower.match(/innovation|unique|révolutionnaire/)
          ? "enthusiastic"
          : "storytelling";

      setMessages(function (prev) {
        return prev.concat({
          role: "assistant",
          content: response,
          emotion: emotion,
        });
      });
      speak(response, emotion);
      setIsLoading(false);
    }, 900);
  };

  return (
    <div className="fixed z-50">
      <button
        onClick={function () {
          setIsOpen(!isOpen);
        }}
        className="fixed bottom-8 right-8 bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all"
        style={{
          boxShadow: "0 0 60px rgba(34, 197, 94, 0.9)",
          width: "100px",
          height: "100px",
          animation: "pulse 2s infinite",
        }}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-5xl mb-1">🇬🇵</span>
          <span className="text-xs font-bold tracking-wide">réussitess</span>
        </div>
        {isSpeaking && (
          <span className="absolute -top-3 -right-3 flex h-10 w-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-10 w-10 bg-yellow-500 items-center justify-center text-xl">
              🔊
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-36 right-8 w-[700px] h-[900px] bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 rounded-3xl shadow-2xl flex flex-col border-4 border-yellow-500">
          <div className="bg-gradient-to-br from-green-600 via-yellow-500 to-red-600 text-white p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-6xl shadow-lg">
                  🇬🇵
                </div>
                <div>
                  <h3 className="font-bold text-3xl">réussitess</h3>
                  <p className="text-sm opacity-95">
                    Guadeloupe 🌴 Terre de Champions 🏆
                  </p>
                  <p className="text-xs opacity-90 mt-1">
                    IA spécialisée diaspora afro-caribéenne 🚀
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="hover:bg-white/20 p-3 rounded-xl text-3xl"
                  >
                    🔇
                  </button>
                )}
                <button
                  onClick={function () {
                    setIsOpen(false);
                  }}
                  className="hover:bg-white/20 p-3 rounded-xl text-2xl font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 border-b-2 border-yellow-300 flex gap-2 overflow-x-auto bg-gradient-to-r from-green-50 via-yellow-50 to-red-50">
            {languages.map(function (lang) {
              const isActive = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={function () {
                    setCurrentLang(lang.code);
                  }}
                  className={
                    isActive
                      ? "px-5 py-3 rounded-xl font-semibold whitespace-nowrap bg-gradient-to-r from-green-600 to-yellow-500 text-white shadow-lg"
                      : "px-5 py-3 rounded-xl font-semibold whitespace-nowrap bg-white hover:bg-yellow-100 text-gray-700 border-2 border-yellow-300"
                  }
                >
                  {lang.flag} {lang.name}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map(function (msg, idx) {
              const isUser = msg.role === "user";
              const htmlContent = msg.content
                .replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong class="font-bold text-green-700">$1</strong>',
                )
                .replace(/\n/g, "<br/>")
                .replace(/• /g, "<br/>• ")
                .replace(/🇬🇵|🌴|🏆|🚀|💬/g, '<span class="text-2xl">$&</span>');

              return (
                <div
                  key={idx}
                  className={isUser ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={
                      isUser
                        ? "max-w-[85%] p-5 rounded-2xl shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg leading-relaxed"
                        : "max-w-[85%] p-5 rounded-2xl shadow-lg bg-white text-gray-800 border-2 border-yellow-300 text-lg leading-relaxed"
                    }
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
                      <div
                        className="w-4 h-4 bg-yellow-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="w-4 h-4 bg-red-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                    <span className="text-gray-600 font-medium">
                      réussitess réfléchit...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-5 border-t-2 border-yellow-300 bg-gradient-to-r from-green-50 via-yellow-50 to-red-50"
          >
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={function (e) {
                  setInput(e.target.value);
                }}
                placeholder="Parle-moi comme à un ami caraïbe... 💬"
                className="flex-1 border-2 border-yellow-400 rounded-xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-yellow-500 text-lg"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-10 py-4 rounded-xl font-bold text-xl hover:scale-105 transition-all shadow-lg disabled:opacity-50"
              >
                🚀
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              🇬🇵 Voix masculine antillaise • Guadeloupe Terre de Champions
            </p>
            <p className="text-xs text-gray-400 mt-1 text-center">
              IA spécialisée diaspora afro-caribéenne • 62 pages • 26 boutiques • 5
              innovations
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
