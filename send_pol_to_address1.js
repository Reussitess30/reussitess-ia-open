const { ethers } = require('ethers');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ADDRESS_1 = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549';
const ADDRESS_2 = '0x5d77d520a82447d2148ac799b2ef8e7ee0ec20ec';

console.log('\n💸 ENVOYER DU POL À L\'ADRESSE 1\n');
console.log('═'.repeat(80));
console.log('\nPour que l\'adresse 1 puisse transférer les tokens,');
console.log('elle a besoin de POL pour payer les frais.\n');
console.log('On va envoyer 10 POL depuis l\'adresse 2 vers l\'adresse 1\n');
console.log('═'.repeat(80));

rl.question('\nEntrez la CLÉ PRIVÉE de l\'adresse 2: ', async (privateKey) => {
  console.log('\n🔄 Traitement...\n');
  
  try {
    let cleanKey = privateKey.trim();
    if (!cleanKey.startsWith('0x')) {
      cleanKey = '0x' + cleanKey;
    }
    
    const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
    const wallet = new ethers.Wallet(cleanKey, provider);
    
    console.log(`✅ Wallet créé: ${wallet.address}\n`);
    
    // Vérifier l'adresse
    if (wallet.address.toLowerCase() !== ADDRESS_2.toLowerCase()) {
      console.log('❌ Cette clé ne correspond pas à l\'adresse 2!');
      console.log(`   Attendu: ${ADDRESS_2}`);
      console.log(`   Obtenu:  ${wallet.address}\n`);
      rl.close();
      return;
    }
    
    console.log('✅ Clé privée valide pour l\'adresse 2!\n');
    
    // Vérifier le balance
    const balance = await provider.getBalance(wallet.address);
    console.log(`💰 Balance actuel: ${ethers.formatEther(balance)} POL\n`);
    
    if (parseFloat(ethers.formatEther(balance)) < 10) {
      console.log('❌ Pas assez de POL sur l\'adresse 2!');
      console.log(`   Nécessaire: 10 POL`);
      console.log(`   Disponible: ${ethers.formatEther(balance)} POL\n`);
      rl.close();
      return;
    }
    
    console.log('═'.repeat(80));
    console.log('\n🎯 RÉCAPITULATIF:\n');
    console.log(`De:       ${ADDRESS_2}`);
    console.log(`Vers:     ${ADDRESS_1}`);
    console.log(`Montant:  10 POL\n`);
    console.log('═'.repeat(80));
    
    rl.question('\n⚠️  Confirmer l\'envoi? (oui/non): ', async (confirm) => {
      if (confirm.toLowerCase() !== 'oui' && confirm.toLowerCase() !== 'o') {
        console.log('\n❌ Envoi annulé\n');
        rl.close();
        return;
      }
      
      console.log('\n🚀 ENVOI EN COURS...\n');
      
      try {
        const tx = await wallet.sendTransaction({
          to: ADDRESS_1,
          value: ethers.parseEther('10')
        });
        
        console.log(`✅ Transaction envoyée: ${tx.hash}`);
        console.log(`   🔗 https://polygonscan.com/tx/${tx.hash}\n`);
        console.log('⏳ Attente de confirmation...\n');
        
        await tx.wait();
        
        console.log('═'.repeat(80));
        console.log('✅ ENVOI RÉUSSI!\n');
        
        // Vérifier les nouveaux balances
        const newBal1 = await provider.getBalance(ADDRESS_1);
        const newBal2 = await provider.getBalance(ADDRESS_2);
        
        console.log('💰 NOUVEAUX BALANCES:\n');
        console.log(`Adresse 1: ${ethers.formatEther(newBal1)} POL`);
        console.log(`Adresse 2: ${ethers.formatEther(newBal2)} POL\n`);
        
        console.log('═'.repeat(80));
        console.log('✅ L\'adresse 1 a maintenant du POL!');
        console.log('   Vous pouvez lancer le transfert de tokens!\n');
        console.log('Commande suivante: node transfer_all_tokens.js\n');
        console.log('═'.repeat(80));
        
      } catch (error) {
        console.log(`\n❌ Erreur: ${error.message}\n`);
      }
      
      rl.close();
    });
    
  } catch (error) {
    console.log(`\n❌ Erreur: ${error.message}\n`);
    rl.close();
  }
});
