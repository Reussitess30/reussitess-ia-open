/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const { ethers } = require('ethers');

const TOKEN_CONTRACT = '0xbe8777aB450937bf107090F4F5F7c4834Db079cF'; // REUSS Principal
const YOUR_CONTRACT = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549';
const YOUR_EOA = '0x5d77d520a82447d2148ac799b2ef8e7ee0ec20ec';

const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

const ownerAbi = [
  'function owner() view returns (address)',
  'function getOwner() view returns (address)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)'
];

async function verifyOwnership() {
  console.log('\n🔍 VÉRIFICATION DE PROPRIÉTÉ DU TOKEN REUSSITESS\n');
  console.log('═'.repeat(80));
  
  const contract = new ethers.Contract(TOKEN_CONTRACT, ownerAbi, provider);
  
  try {
    // Informations du token
    const name = await contract.name();
    const symbol = await contract.symbol();
    const totalSupply = await contract.totalSupply();
    
    console.log('💎 TOKEN REUSSITESS:\n');
    console.log(`   Nom: ${name}`);
    console.log(`   Symbole: ${symbol}`);
    console.log(`   Supply Total: ${ethers.formatUnits(totalSupply, 18)}`);
    console.log(`   Contrat: ${TOKEN_CONTRACT}\n`);
    
    console.log('═'.repeat(80));
    
    // Essayer de trouver le propriétaire
    console.log('\n👤 RECHERCHE DU PROPRIÉTAIRE:\n');
    
    let ownerFound = false;
    
    // Essai 1: fonction owner()
    try {
      const owner = await contract.owner();
      console.log(`✅ Propriétaire trouvé (owner): ${owner}\n`);
      
      if (owner.toLowerCase() === YOUR_CONTRACT.toLowerCase()) {
        console.log('🎯 LE PROPRIÉTAIRE EST VOTRE ADRESSE 1 (Smart Contract)!');
        console.log('   Cela signifie que le contrat 0x69f4...01549');
        console.log('   contrôle le token REUSSITESS.\n');
        ownerFound = true;
      } else if (owner.toLowerCase() === YOUR_EOA.toLowerCase()) {
        console.log('🎯 LE PROPRIÉTAIRE EST VOTRE ADRESSE 2 (Wallet EOA)!');
        console.log('   Vous avez le contrôle total depuis cette adresse.\n');
        ownerFound = true;
      } else {
        console.log(`⚠  Le propriétaire est une autre adresse: ${owner}`);
        console.log('   Ce n\'est ni votre adresse 1 ni votre adresse 2.\n');
      }
    } catch (e) {
      console.log('❌ Fonction owner() non disponible\n');
    }
    
    // Balances
    console.log('═'.repeat(80));
    console.log('\n💰 DISTRIBUTION DES TOKENS:\n');
    
    const balance1 = await contract.balanceOf(YOUR_CONTRACT);
    const balance2 = await contract.balanceOf(YOUR_EOA);
    
    console.log(`Adresse 1 (Contract): ${ethers.formatUnits(balance1, 18)} REUSS`);
    console.log(`Adresse 2 (EOA):      ${ethers.formatUnits(balance2, 18)} REUSS`);
    
    const pct1 = (parseFloat(ethers.formatUnits(balance1, 18)) / parseFloat(ethers.formatUnits(totalSupply, 18))) * 100;
    const pct2 = (parseFloat(ethers.formatUnits(balance2, 18)) / parseFloat(ethers.formatUnits(totalSupply, 18))) * 100;
    
    console.log(`\nAdresse 1: ${pct1.toFixed(2)}% du supply total`);
    console.log(`Adresse 2: ${pct2.toFixed(2)}% du supply total\n`);
    
    console.log('═'.repeat(80));
    console.log('\n🎯 ANALYSE:\n');
    
    if (balance1 > 0n && balance1 === totalSupply) {
      console.log('✅ L\'adresse 1 détient 100% des tokens');
      console.log('   C\'est probablement le wallet de déploiement initial\n');
    }
    
    if (ownerFound) {
      console.log('💡 EN TANT QUE PROPRIÉTAIRE, VOUS POUVEZ:');
      console.log('   • Contrôler le contrat du token');
      console.log('   • Transférer les tokens');
      console.log('   • Modifier certaines fonctions (selon le contrat)');
      console.log('   • Gérer la distribution\n');
    }
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
  }
  
  console.log('═'.repeat(80));
}

verifyOwnership();
