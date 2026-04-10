/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const { ethers } = require('ethers');

const WALLET = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549';
const WRAPPED_POL = '0x0000000000000000000000000000000000001010';
const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

async function checkWrappedPol() {
  console.log('\n💎 VÉRIFICATION DU WRAPPED POL\n');
  console.log('═'.repeat(80));
  
  const abi = ['function balanceOf(address) view returns (uint256)'];
  
  try {
    // POL natif (pour gaz)
    const nativePol = await provider.getBalance(WALLET);
    console.log('⛽ POL NATIF (pour frais de gaz):');
    console.log(`   ${ethers.formatEther(nativePol)} POL`);
    console.log(`   ${nativePol === 0n ? '❌ VIDE - Besoin de POL natif!' : '✅ OK'}`);
    console.log('');
    
    // Wrapped POL (token ERC20)
    const contract = new ethers.Contract(WRAPPED_POL, abi, provider);
    const wrappedPol = await contract.balanceOf(WALLET);
    console.log('💰 WRAPPED POL (token ERC20):');
    console.log(`   ${ethers.formatEther(wrappedPol)} WPOL`);
    console.log(`   ${wrappedPol > 0n ? '✅ Vous en avez!' : '❌ Aucun wrapped POL'}`);
    console.log('');
    
    console.log('═'.repeat(80));
    console.log('🎯 DIAGNOSTIC:\n');
    
    if (nativePol === 0n && wrappedPol === 0n) {
      console.log('❌ Vous n\'avez NI POL natif NI wrapped POL');
      console.log('');
      console.log('💡 SOLUTION:');
      console.log('   Votre wallet étant un smart contract, vous ne pouvez');
      console.log('   probablement recevoir QUE du wrapped POL (token).');
      console.log('');
      console.log('   Options:');
      console.log('   1. Créer un nouveau wallet EOA (recommandé)');
      console.log('   2. Demander du wrapped POL au lieu de POL natif');
      
    } else if (wrappedPol > 0n) {
      console.log('✅ Vous avez du wrapped POL!');
      console.log('   Vous pouvez l\'utiliser pour payer les frais en l\'unwrappant');
      console.log('   ou en interagissant avec des dApps qui acceptent wrapped POL.');
      
    } else if (nativePol > 0n) {
      console.log('✅ Vous avez du POL natif!');
      console.log('   C\'est parfait pour payer les frais de transaction.');
    }
    
    console.log('\n═'.repeat(80));
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
}

checkWrappedPol();
