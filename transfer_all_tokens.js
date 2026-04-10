/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const { ethers } = require('ethers');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const TOKEN_CONTRACT = '0xbe8777aB450937bf107090F4F5F7c4834Db079cF';
const DESTINATION = '0x5d77d520a82447d2148ac799b2ef8e7ee0ec20ec'; // Votre adresse 2

const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

const tokenAbi = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address) view returns (uint256)',
  'function name() view returns (string)',
  'function symbol() view returns (string)'
];

console.log('\n🔐 TRANSFERT SÉCURISÉ DES TOKENS REUSSITESS\n');
console.log('═'.repeat(80));
console.log('\n⚠️  SÉCURITÉ: Votre clé privée ne sera JAMAIS enregistrée');
console.log('Elle sera utilisée uniquement pour cette transaction\n');
console.log('═'.repeat(80));

rl.question('\nEntrez votre CLÉ PRIVÉE de l\'adresse 1: ', async (privateKey) => {
  console.log('\n🔄 Traitement en cours...\n');
  
  try {
    // Nettoyer la clé privée
    let cleanKey = privateKey.trim();
    if (!cleanKey.startsWith('0x')) {
      cleanKey = '0x' + cleanKey;
    }
    
    // Créer le wallet
    const wallet = new ethers.Wallet(cleanKey, provider);
    
    console.log('✅ Wallet créé');
    console.log(`   Adresse: ${wallet.address}\n`);
    
    // Vérifier que c'est bien l'adresse 1
    const expectedAddress = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549';
    if (wallet.address.toLowerCase() !== expectedAddress.toLowerCase()) {
      console.log('❌ ERREUR: Cette clé privée ne correspond pas à l\'adresse 1!');
      console.log(`   Attendu: ${expectedAddress}`);
      console.log(`   Obtenu:  ${wallet.address}\n`);
      rl.close();
      return;
    }
    
    console.log('✅ Clé privée valide pour l\'adresse 1!\n');
    
    // Se connecter au token
    const token = new ethers.Contract(TOKEN_CONTRACT, tokenAbi, wallet);
    
    // Vérifier les infos du token
    const name = await token.name();
    const symbol = await token.symbol();
    console.log(`💎 Token: ${name} (${symbol})`);
    console.log(`   Contrat: ${TOKEN_CONTRACT}\n`);
    
    // Vérifier le balance
    const balance = await token.balanceOf(wallet.address);
    const formattedBalance = ethers.formatUnits(balance, 18);
    
    console.log('💰 BALANCE ACTUEL:');
    console.log(`   ${formattedBalance} ${symbol}\n`);
    
    if (balance === 0n) {
      console.log('⚠️  Aucun token à transférer!\n');
      rl.close();
      return;
    }
    
    // Vérifier le balance POL pour les frais
    const polBalance = await provider.getBalance(wallet.address);
    console.log('⛽ POL POUR FRAIS:');
    console.log(`   ${ethers.formatEther(polBalance)} POL\n`);
    
    if (polBalance === 0n) {
      console.log('❌ PROBLÈME: Pas de POL pour payer les frais!');
      console.log('   L\'adresse 1 ne peut pas effectuer de transaction sans POL.\n');
      console.log('💡 SOLUTION ALTERNATIVE:');
      console.log('   1. Envoyez 0.01 POL à l\'adresse 1 depuis l\'adresse 2');
      console.log('   2. Puis relancez ce script\n');
      rl.close();
      return;
    }
    
    console.log('═'.repeat(80));
    console.log('\n🎯 RÉCAPITULATIF DU TRANSFERT:\n');
    console.log(`De:       ${wallet.address}`);
    console.log(`Vers:     ${DESTINATION}`);
    console.log(`Montant:  ${formattedBalance} ${symbol}`);
    console.log(`Frais:    ~0.001 POL (estimation)\n`);
    console.log('═'.repeat(80));
    
    rl.question('\n⚠️  Confirmer le transfert? (oui/non): ', async (confirm) => {
      if (confirm.toLowerCase() !== 'oui' && confirm.toLowerCase() !== 'o') {
        console.log('\n❌ Transfert annulé\n');
        rl.close();
        return;
      }
      
      console.log('\n🚀 TRANSFERT EN COURS...\n');
      
      try {
        // Envoyer la transaction
        const tx = await token.transfer(DESTINATION, balance);
        
        console.log('✅ Transaction envoyée!');
        console.log(`   Hash: ${tx.hash}`);
        console.log(`   🔗 https://polygonscan.com/tx/${tx.hash}\n`);
        console.log('⏳ Attente de confirmation...\n');
        
        // Attendre la confirmation
        const receipt = await tx.wait();
        
        console.log('═'.repeat(80));
        console.log('🎉 TRANSFERT RÉUSSI!\n');
        console.log(`Block: ${receipt.blockNumber}`);
        console.log(`Gas utilisé: ${receipt.gasUsed.toString()}\n`);
        
        // Vérifier les nouveaux balances
        const newBalance1 = await token.balanceOf(wallet.address);
        const newBalance2 = await token.balanceOf(DESTINATION);
        
        console.log('💰 NOUVEAUX BALANCES:\n');
        console.log(`Adresse 1: ${ethers.formatUnits(newBalance1, 18)} ${symbol}`);
        console.log(`Adresse 2: ${ethers.formatUnits(newBalance2, 18)} ${symbol}\n`);
        
        console.log('═'.repeat(80));
        console.log('✅ TOUS VOS TOKENS SONT MAINTENANT SUR L\'ADRESSE 2!');
        console.log('   Vous pouvez les utiliser normalement.\n');
        console.log('🔒 Sécurité: La clé privée n\'a pas été enregistrée\n');
        console.log('═'.repeat(80));
        
      } catch (error) {
        console.log('\n❌ ERREUR lors du transfert:');
        console.log(`   ${error.message}\n`);
        
        if (error.message.includes('insufficient funds')) {
          console.log('💡 Cause probable: Pas assez de POL pour les frais');
          console.log('   Envoyez 0.01 POL à l\'adresse 1 et réessayez\n');
        }
      }
      
      rl.close();
    });
    
  } catch (error) {
    console.log('\n❌ ERREUR:');
    console.log(`   ${error.message}\n`);
    
    if (error.message.includes('invalid private key')) {
      console.log('💡 La clé privée fournie n\'est pas valide');
      console.log('   Vérifiez qu\'elle commence par 0x et fait 66 caractères\n');
    }
    
    rl.close();
  }
});
