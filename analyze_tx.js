const { ethers } = require('ethers');
const https = require('https');

const TX_HASH = '0x9564b0e94c8cb1674b16e2201c0c450275268e67a15e1856950c9750dc4c8a2d';
const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

console.log('\n🔍 ANALYSE DE LA TRANSACTION\n');
console.log('═'.repeat(80));
console.log(`📍 Hash: ${TX_HASH}\n`);

async function analyzeTx() {
  try {
    // Récupérer les détails de la transaction
    const tx = await provider.getTransaction(TX_HASH);
    const receipt = await provider.getTransactionReceipt(TX_HASH);
    
    if (!tx) {
      console.log('❌ Transaction non trouvée sur Polygon');
      console.log('   Vérifiez que c\'est bien une transaction Polygon\n');
      return;
    }
    
    console.log('📊 DÉTAILS DE LA TRANSACTION:\n');
    console.log(`De (From): ${tx.from}`);
    console.log(`Vers (To): ${tx.to || 'Contract Creation'}`);
    console.log(`Valeur: ${ethers.formatEther(tx.value)} POL`);
    console.log(`Statut: ${receipt.status === 1 ? '✅ Réussie' : '❌ Échouée'}`);
    console.log(`Block: ${tx.blockNumber}`);
    console.log(`Gas utilisé: ${receipt.gasUsed.toString()}`);
    
    const date = new Date();
    if (tx.blockNumber) {
      const block = await provider.getBlock(tx.blockNumber);
      const txDate = new Date(block.timestamp * 1000);
      console.log(`Date: ${txDate.toLocaleString()}`);
    }
    
    console.log('\n═'.repeat(80));
    console.log('🎯 ANALYSE:\n');
    
    // Vérifier si c'est vers une de vos adresses
    const addr1 = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549'.toLowerCase();
    const addr2 = '0x5d77d520a82447d2148ac799b2ef8e7ee0ec20ec'.toLowerCase();
    const toAddr = (tx.to || '').toLowerCase();
    
    if (toAddr === addr1) {
      console.log('📍 Cette transaction va vers votre ADRESSE 1 (Smart Contract)');
      console.log('   ⚠️  Le smart contract peut avoir rejeté le POL\n');
    } else if (toAddr === addr2) {
      console.log('📍 Cette transaction va vers votre ADRESSE 2 (Wallet EOA) ✅');
      console.log('   Le POL devrait être arrivé!\n');
    } else {
      console.log('📍 Cette transaction va vers une autre adresse');
      console.log(`   ${tx.to}\n`);
    }
    
    if (receipt.status === 1) {
      console.log('✅ TRANSACTION RÉUSSIE!');
      if (parseFloat(ethers.formatEther(tx.value)) > 0) {
        console.log(`   ${ethers.formatEther(tx.value)} POL ont été transférés`);
      } else {
        console.log('   Mais aucun POL transféré (interaction avec contrat)');
      }
    } else {
      console.log('❌ TRANSACTION ÉCHOUÉE!');
      console.log('   Le POL n\'a PAS été transféré');
    }
    
    console.log('\n🔗 Voir sur Polygonscan:');
    console.log(`   https://polygonscan.com/tx/${TX_HASH}`);
    console.log('\n═'.repeat(80));
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
    console.log('\n💡 Vérification manuelle:');
    console.log(`   https://polygonscan.com/tx/${TX_HASH}`);
  }
}

analyzeTx();
