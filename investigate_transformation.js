/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const https = require('https');
const { ethers } = require('ethers');

const WALLET = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549';
const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

console.log('\n🔍 ENQUÊTE : COMMENT CETTE ADRESSE EST DEVENUE UN CONTRAT?\n');
console.log('═'.repeat(80));

async function investigate() {
  // 1. Récupérer la PREMIÈRE transaction (création)
  const url = `https://api.polygonscan.com/api?module=account&action=txlist&address=${WALLET}&startblock=0&endblock=99999999&page=1&offset=150&sort=asc&apikey=YourApiKeyToken`;
  
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    
    res.on('end', async () => {
      try {
        const json = JSON.parse(data);
        
        if (json.status === '1' && json.result.length > 0) {
          const firstTx = json.result[0];
          const creationDate = new Date(parseInt(firstTx.timeStamp) * 1000);
          
          console.log('📅 PREMIÈRE TRANSACTION:\n');
          console.log(`Date: ${creationDate.toLocaleString()}`);
          console.log(`Hash: ${firstTx.hash}`);
          console.log(`De: ${firstTx.from}`);
          console.log(`À: ${firstTx.to || 'CONTRACT CREATION'}`);
          console.log(`Valeur: ${(parseInt(firstTx.value) / 1e18).toFixed(6)} POL`);
          console.log('');
          
          // ANALYSE CRITIQUE
          console.log('═'.repeat(80));
          console.log('🎯 ANALYSE :\n');
          
          if (!firstTx.to || firstTx.to === '') {
            console.log('🚨 CETTE TRANSACTION EST UNE CRÉATION DE CONTRAT!\n');
            console.log('Cela signifie que cette adresse a TOUJOURS été un contrat,');
            console.log('jamais un wallet normal.\n');
            console.log(`Créé par: ${firstTx.from}`);
            console.log(`Le ${creationDate.toLocaleDateString()}`);
            console.log('');
            console.log('❓ QUESTION: Qui est ' + firstTx.from + ' ?');
            console.log('   Est-ce VOUS? Un service? Un bot?');
          } else {
            console.log('✅ La première transaction est un transfert normal');
            console.log(`Vers: ${firstTx.to}`);
            console.log('');
            console.log('Mais attendez... le code montre que c\'est un contrat...');
            console.log('Regardons plus en détail...');
          }
          
          console.log('\n' + '═'.repeat(80));
          console.log('📊 LES 10 PREMIÈRES TRANSACTIONS:\n');
          
          json.result.slice(0, 10).forEach((tx, i) => {
            const date = new Date(parseInt(tx.timeStamp) * 1000);
            const isContractCreation = !tx.to || tx.to === '';
            
            console.log(`${i + 1}. ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);
            console.log(`   ${isContractCreation ? '🏗️  CONTRACT CREATION' : '📤 Transaction'}`);
            console.log(`   De: ${tx.from.substring(0, 20)}...`);
            if (tx.to) console.log(`   À: ${tx.to.substring(0, 20)}...`);
            console.log(`   Fonction: ${tx.functionName || 'N/A'}`);
            console.log(`   Hash: ${tx.hash}`);
            console.log('');
          });
          
          // Vérifier le code maintenant
          const currentCode = await provider.getCode(WALLET);
          console.log('═'.repeat(80));
          console.log('🔬 CODE ACTUEL DU CONTRAT:\n');
          console.log(`Bytecode: ${currentCode}`);
          console.log(`Longueur: ${currentCode.length} caractères`);
          console.log('');
          
          if (currentCode !== '0x') {
            console.log('✅ Confirmation: C\'est un smart contract');
            console.log(`   Code: ${currentCode.substring(0, 66)}...`);
          }
          
          console.log('\n' + '═'.repeat(80));
          console.log('💡 THÉORIES POSSIBLES:\n');
          console.log('A. VOUS avez créé ce contrat (volontairement ou non)');
          console.log('   → Via un outil de création de wallet contractuel');
          console.log('   → Via un service comme Safe, Argent, etc.\n');
          
          console.log('B. Quelqu\'un d\'autre a créé ce contrat');
          console.log('   → Et vous a donné l\'adresse');
          console.log('   → Ou les tokens ont été envoyés là par erreur\n');
          
          console.log('C. C\'est un contrat proxy ou upgradeable');
          console.log('   → Le code peut avoir changé depuis la création\n');
          
          console.log('═'.repeat(80));
          console.log('\n🔗 VÉRIFIEZ MANUELLEMENT SUR POLYGONSCAN:');
          console.log(`   https://polygonscan.com/address/${WALLET}`);
          console.log('');
          console.log('Regardez:');
          console.log('• Onglet "Contract" → Nom du contrat, créateur');
          console.log('• Première transaction → Qui l\'a créé et quand');
          console.log('• Source code → S\'il est vérifié, vous verrez le code\n');
          
        } else {
          console.log('⚠️  Impossible de récupérer l\'historique via API');
          console.log('Vérification manuelle requise sur Polygonscan\n');
        }
      } catch (e) {
        console.log('❌ Erreur:', e.message);
      }
    });
  }).on('error', (e) => {
    console.log('❌ Erreur réseau:', e.message);
  });
}

investigate();
