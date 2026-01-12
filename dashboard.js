const { ethers } = require('ethers');

const WALLET = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549';
const TOKEN1 = '0xbe8777aB450937bf107090F4F5F7c4834Db079cF';
const TOKEN2 = '0xB37531727fC07c6EED4f97F852A115B428046EB2';

const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
const abi = ['function balanceOf(address) view returns (uint256)'];

async function dashboard() {
  console.clear();
  console.log('═'.repeat(70));
  console.log('           🏆 REUSSITESS DASHBOARD - TERRES DE CHAMPIONS 🇬🇵');
  console.log('═'.repeat(70));
  console.log();
  
  // POL Balance
  const polBalance = await provider.getBalance(WALLET);
  const polFormatted = ethers.formatEther(polBalance);
  const polValue = parseFloat(polFormatted) * 0.5; // Prix estimé POL = $0.50
  
  console.log('⛽ GAZ (POL):');
  console.log(`   Balance: ${polFormatted} POL`);
  console.log(`   Valeur: ~$${polValue.toFixed(4)} USD`);
  console.log(`   Statut: ${polBalance > 0n ? '✅ OK' : '❌ VIDE - RECHARGE NÉCESSAIRE!'}`);
  console.log();
  
  // Token 1
  const contract1 = new ethers.Contract(TOKEN1, abi, provider);
  const balance1 = await contract1.balanceOf(WALLET);
  const formatted1 = ethers.formatUnits(balance1, 18);
  
  console.log('💎 REUSS TOKEN PRINCIPAL:');
  console.log(`   Contract: ${TOKEN1}`);
  console.log(`   Balance: ${parseFloat(formatted1).toLocaleString()} REUSS`);
  console.log(`   Statut: ${balance1 > 0n ? '✅ 1 MILLIARD!' : '❌ Vide'}`);
  console.log();
  
  // Token 2
  const contract2 = new ethers.Contract(TOKEN2, abi, provider);
  const balance2 = await contract2.balanceOf(WALLET);
  const formatted2 = ethers.formatUnits(balance2, 18);
  
  console.log('💰 REUSS TOKEN ANCIEN:');
  console.log(`   Contract: ${TOKEN2}`);
  console.log(`   Balance: ${parseFloat(formatted2).toLocaleString()} REUSS`);
  console.log(`   Statut: ${balance2 > 0n ? '✅ 12.7 MILLIONS!' : '❌ Vide'}`);
  console.log();
  
  // Total
  const total = parseFloat(formatted1) + parseFloat(formatted2);
  console.log('═'.repeat(70));
  console.log(`💰 TOTAL REUSS: ${total.toLocaleString()} REUSS`);
  console.log('═'.repeat(70));
  console.log();
  
  // Actions requises
  if (polBalance === 0n) {
    console.log('⚠️  ACTION REQUISE:');
    console.log('   1. Obtenez du POL via un faucet (gratuit)');
    console.log('   2. Ou achetez 0.01 POL sur un exchange');
    console.log('   3. Envoyez à: 0x69f42Aa645A43A84e1143D416a4C81A88DF01549');
    console.log();
    console.log('🚰 Faucets recommandés:');
    console.log('   • https://www.alchemy.com/faucets/polygon-pos');
    console.log('   • https://faucet.polygon.technology/');
  } else {
    console.log('✅ TOUT EST PRÊT! Vous pouvez effectuer des transactions!');
  }
  
  console.log();
  console.log('═'.repeat(70));
  console.log(`📅 Dernière mise à jour: ${new Date().toLocaleString()}`);
  console.log('═'.repeat(70));
}

dashboard().catch(console.error);
