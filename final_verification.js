/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const { ethers } = require('ethers');

const WALLET = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549';
const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

async function finalCheck() {
  console.log('\n🔬 VÉRIFICATION FINALE ULTRA-PRÉCISE\n');
  console.log('═'.repeat(80));
  console.log(`📍 Adresse: ${WALLET}\n`);
  
  // 1. Code du contrat
  const code = await provider.getCode(WALLET);
  console.log('1️⃣ TYPE D\'ADRESSE:');
  console.log(`   Bytecode: ${code}`);
  console.log(`   Longueur: ${code.length} caractères\n`);
  
  if (code === '0x') {
    console.log('   ✅ C\'EST UN WALLET NORMAL (EOA)!');
    console.log('   Aucun code de contrat détecté.\n');
  } else {
    console.log('   ⚠️  C\'EST UN SMART CONTRACT');
    console.log(`   Code présent: ${code.substring(0, 66)}...\n`);
  }
  
  // 2. Solde POL
  const balance = await provider.getBalance(WALLET);
  console.log('2️⃣ SOLDE POL:');
  console.log(`   ${ethers.formatEther(balance)} POL`);
  console.log(`   Wei: ${balance.toString()}\n`);
  
  // 3. Transactions
  const txCount = await provider.getTransactionCount(WALLET);
  console.log('3️⃣ NOMBRE DE TRANSACTIONS:');
  console.log(`   ${txCount} transactions\n`);
  
  // 4. Diagnostic
  console.log('═'.repeat(80));
  console.log('🎯 DIAGNOSTIC FINAL:\n');
  
  if (code === '0x') {
    console.log('✅ WALLET EOA NORMAL CONFIRMÉ!');
    console.log('   Vous POUVEZ recevoir du POL normalement.\n');
    
    if (balance === 0n && txCount > 0) {
      console.log('⚠️  MAIS: 0 POL avec ' + txCount + ' transactions');
      console.log('   → Tout le POL a été dépensé en frais de gaz');
      console.log('   → OU vous n\'avez jamais reçu de POL avec succès\n');
      
      console.log('💡 SOLUTION:');
      console.log('   1. Envoyez 0.01-0.1 POL à cette adresse');
      console.log('   2. Vérifiez sur Polygonscan que ça arrive');
      console.log('   3. Si ça n\'arrive toujours pas:');
      console.log('      → Vérifiez que vous envoyez sur le réseau POLYGON');
      console.log('      → Pas sur Ethereum, BSC ou autre réseau');
    }
  } else {
    console.log('🚨 SMART CONTRACT CONFIRMÉ');
    console.log('   Ne peut pas recevoir de POL comme un wallet normal.\n');
    
    console.log('💡 SOLUTION:');
    console.log('   Créez un nouveau wallet EOA (voir script précédent)');
  }
  
  console.log('\n═'.repeat(80));
}

finalCheck().catch(console.error);
