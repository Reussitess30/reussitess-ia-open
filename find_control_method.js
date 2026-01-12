const { ethers } = require('ethers');

const CONTRACT_ADDR = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549';
const YOUR_EOA = '0x5d77d520a82447d2148ac799b2ef8e7ee0ec20ec';
const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

// Fonctions communes pour contrôler un contrat
const controlAbis = [
  // Gnosis Safe
  'function getOwners() view returns (address[])',
  'function isOwner(address) view returns (bool)',
  'function getThreshold() view returns (uint256)',
  
  // Ownable simple
  'function owner() view returns (address)',
  
  // Multi-sig
  'function owners(uint256) view returns (address)',
  
  // Proxy
  'function implementation() view returns (address)',
  'function admin() view returns (address)',
  
  // Execute
  'function execute(address,uint256,bytes) returns (bytes)',
  'function execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes) returns (bool)'
];

async function findControlMethod() {
  console.log('\n🔍 RECHERCHE DE LA MÉTHODE DE CONTRÔLE\n');
  console.log('═'.repeat(80));
  console.log(`📍 Contrat: ${CONTRACT_ADDR}`);
  console.log(`👤 Votre EOA: ${YOUR_EOA}\n`);
  
  console.log('Test des fonctions de contrôle communes...\n');
  
  let foundMethods = [];
  
  for (const abiStr of controlAbis) {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDR, [abiStr], provider);
      const functionName = abiStr.match(/function (\w+)/)[1];
      
      // Essayer d'appeler la fonction
      const result = await contract[functionName]();
      
      foundMethods.push({
        function: functionName,
        result: result.toString(),
        abi: abiStr
      });
      
      console.log(`✅ ${functionName}()`);
      console.log(`   Résultat: ${result.toString().substring(0, 100)}...\n`);
      
    } catch (error) {
      // Fonction non disponible, c'est normal
    }
  }
  
  console.log('═'.repeat(80));
  console.log('\n🎯 RÉSULTATS:\n');
  
  if (foundMethods.length === 0) {
    console.log('❌ Aucune fonction de contrôle standard trouvée\n');
    console.log('💡 CELA SIGNIFIE:');
    console.log('   • C\'est un type de contrat personnalisé');
    console.log('   • Ou un wallet contractuel spécifique');
    console.log('   • Vous devez voir le code source sur Polygonscan\n');
    
  } else {
    console.log(`✅ ${foundMethods.length} fonction(s) de contrôle trouvée(s):\n`);
    
    foundMethods.forEach(method => {
      console.log(`• ${method.function}()`);
    });
    
    console.log('\n💡 PROCHAINES ÉTAPES:');
    console.log('   1. Ces fonctions indiquent le type de contrat');
    console.log('   2. Vérifiez si votre EOA est autorisée');
    console.log('   3. Utilisez l\'interface appropriée pour contrôler\n');
  }
  
  console.log('═'.repeat(80));
  console.log('\n🔗 VÉRIFICATION MANUELLE URGENTE:\n');
  console.log(`   https://polygonscan.com/address/${CONTRACT_ADDR}#code\n`);
  console.log('REGARDEZ:');
  console.log('   1. Le code source est-il vérifié?');
  console.log('   2. Quel est le nom du contrat?');
  console.log('   3. Y a-t-il une interface web associée?\n');
  console.log('═'.repeat(80));
}

findControlMethod();
