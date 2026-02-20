const quizCrypto = {
  title: "Crypto & Blockchain",
  description: "Testez vos connaissances sur les cryptomonnaies et la blockchain !",
  emoji: "₿",
  questions: [
    {
      question: "₿ Qui a créé le Bitcoin ?",
      answers: ["Elon Musk", "Satoshi Nakamoto", "Vitalik Buterin", "Bill Gates"],
      correct: 1,
      explanation: "Bitcoin a été créé en 2008 par une personne (ou un groupe) sous le pseudonyme Satoshi Nakamoto. Son identité réelle reste inconnue à ce jour.",
    },
    {
      question: "🔗 Qu'est-ce qu'une blockchain ?",
      answers: ["Un type de monnaie physique", "Une base de données décentralisée et immuable", "Un réseau social crypté", "Un serveur bancaire sécurisé"],
      correct: 1,
      explanation: "Une blockchain est une chaîne de blocs de données, décentralisée et partagée entre des milliers d'ordinateurs. Chaque bloc contient des transactions vérifiées et ne peut pas être modifié.",
    },
    {
      question: "💎 Quelle blockchain supporte les NFT et les smart contracts principalement ?",
      answers: ["Bitcoin", "Litecoin", "Ethereum", "Dogecoin"],
      correct: 2,
      explanation: "Ethereum est la blockchain pionnière des smart contracts et des NFT. Elle permet de créer des programmes autonomes (DApps) qui s'exécutent sans intermédiaire.",
    },
    {
      question: "🏦 Qu'est-ce qu'un wallet (portefeuille) crypto ?",
      answers: ["Un compte bancaire crypto", "Un logiciel qui stocke vos clés privées et permet de gérer vos cryptos", "Une carte de crédit crypto", "Un exchange centralisé"],
      correct: 1,
      explanation: "Un wallet crypto ne stocke pas vraiment vos cryptos — il stocke vos clés privées qui prouvent que vous êtes propriétaire de vos actifs sur la blockchain.",
    },
    {
      question: "🔥 Qu'est-ce que le 'halving' du Bitcoin ?",
      answers: ["La division du prix par deux", "La réduction de moitié de la récompense des mineurs tous les 4 ans environ", "La fermeture de la moitié des exchanges", "Un bug informatique"],
      correct: 1,
      explanation: "Tous les 210 000 blocs (~4 ans), la récompense des mineurs Bitcoin est divisée par 2. Cela rend le Bitcoin plus rare avec le temps — un mécanisme anti-inflation prévu dès le départ par Satoshi.",
    },
    {
      question: "🌐 Qu'est-ce que la DeFi ?",
      answers: ["De la finance défensive", "La finance décentralisée — des services financiers sans banques ni intermédiaires", "Un type de cryptomonnaie", "Un réseau de paiement gouvernemental"],
      correct: 1,
      explanation: "La DeFi (Finance Décentralisée) regroupe tous les services financiers (prêts, épargne, échanges) qui fonctionnent via des smart contracts, sans banque ni autorité centrale.",
    },
    {
      question: "📊 Qu'est-ce qu'un stablecoin ?",
      answers: ["Un Bitcoin très stable", "Une cryptomonnaie dont la valeur est indexée sur une monnaie stable comme le dollar", "Un token de gouvernance", "Une action d'entreprise crypto"],
      correct: 1,
      explanation: "Les stablecoins comme USDT ou USDC sont indexés sur le dollar américain (1 stablecoin = 1$). Ils permettent de rester dans l'écosystème crypto sans subir la volatilité.",
    },
    {
      question: "🔑 Que signifie 'Not your keys, not your coins' ?",
      answers: ["Il faut acheter des clés USB pour stocker ses cryptos", "Si vous ne contrôlez pas vos clés privées, vous ne possédez pas vraiment vos cryptos", "Les exchanges sont toujours sûrs", "Il faut partager ses clés avec sa famille"],
      correct: 1,
      explanation: "Ce principe fondamental signifie que si vos cryptos sont sur un exchange (Binance, Coinbase...), c'est l'exchange qui détient vraiment vos fonds. Pour une vraie possession, il faut utiliser son propre wallet.",
    },
  ],
  tips: [
    "💡 Ne jamais investir plus que ce qu'on peut se permettre de perdre",
    "🔐 Toujours garder ses clés privées hors ligne dans un endroit sûr",
    "📚 Se former avant d'investir — la connaissance protège mieux que n'importe quel stop-loss",
    "⛏️ Le minage Bitcoin via GoMining est une façon passive de s'exposer au BTC sans gérer de matériel",
  ],
};

export default quizCrypto;
