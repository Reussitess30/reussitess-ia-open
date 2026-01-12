const { ethers } = require('ethers');

const CONTRACT_ADDR = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549';
const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

async function analyzeContract() {
  console.log('\n🔬 ANALYSE DU SMART CONTRACT\n');
  console.log('═'.repeat(80));
  console.log(`📍 Adresse: ${CONTRACT_ADDR}`);
  console.log('═'.repeat(80));
  
  try {
    // Récupérer le bytecode du contrat
    const code = await provider.getCode(CONTRACT_ADDR);
    
    console.log('\n📝 CODE DU CONTRAT:');
    console.log(`   Longueur: ${code.length} caractères`);
    console.log(`   Bytecode: ${code.substring(0, 100)}...`);
    console.log('');
    
    // Vérifier le solde
    const balance = await provider.getBalance(CONTRACT_ADDR);
    console.log(`💰 Solde POL: ${ethers.formatEther(balance)} POL`);
    
    // Nombre de transactions
    const txCount = await provider.getTransactionCount(CONTRACT_ADDR);
    console.log(`📊 Transactions: ${txCount}`);
    console.log('');
    
    console.log('═'.repeat(80));
    console.log('\n🚨 DIAGNOSTIC:\n');
    console.log('Ceci est un SMART CONTRACT, pas un wallet standard.');
    console.log('Les smart contracts peuvent avoir des règles qui empêchent');
    console.log('la réception de POL ou le redirigent automatiquement.\n');
    
    console.log('🔍 VÉRIFICATIONS À FAIRE:\n');
    console.log('1. Qui a créé ce contrat?');
    console.log('2. Quelle est sa fonction?');
    console.log('3. Avez-vous la clé privée qui le contrôle?\n');
    
    console.log('🔗 Vérifiez le contrat sur Polygonscan:');
    console.log(`   https://polygonscan.com/address/${CONTRACT_ADDR}#code`);
    console.log('');
    
    // Tenter de détecter si c'est un proxy ou un contrat connu
    console.log('💡 HYPOTHÈSES POSSIBLES:\n');
    console.log('A. C\'est un contrat wallet (Gnosis Safe, Argent, etc.)');
    console.log('   → Nécessite une signature multi-sig ou des conditions spéciales');
    console.log('');
    console.log('B. C\'est un contrat de staking ou vault');
    console.log('   → Ne peut pas recevoir de POL directement');
    console.log('');
    console.log('C. C\'est un contrat avec une fonction receive() bloquée');
    console.log('   → Le POL est rejeté ou redirigé automatiquement');
    console.log('');
    
    console.log('═'.repeat(80));
    
  } catch (error) {
    console.log(`\n❌ Erreur: ${error.message}`);
  }
}

analyzeContract();
