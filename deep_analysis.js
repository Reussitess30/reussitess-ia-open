const https = require('https');
const { ethers } = require('ethers');

const WALLET = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549';
const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

console.log('\n🔬 ANALYSE APPROFONDIE - QU\'EST-CE QUI A CHANGÉ?\n');
console.log('═'.repeat(80));

async function deepAnalysis() {
  // 1. Vérifier le type actuel
  const code = await provider.getCode(WALLET);
  const balance = await provider.getBalance(WALLET);
  const txCount = await provider.getTransactionCount(WALLET);
  
  console.log('📊 ÉTAT ACTUEL:\n');
  console.log(`Type: ${code === '0x' ? 'Wallet EOA' : 'Smart Contract'}`);
  console.log(`Bytecode: ${code}`);
  console.log(`POL Balance: ${ethers.formatEther(balance)} POL`);
  console.log(`Transactions: ${txCount}`);
  console.log('');
  
  // 2. Analyser TOUTES les transactions
  const url = `https://api.polygonscan.com/api?module=account&action=txlist&address=${WALLET}&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=YourApiKeyToken`;
  
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        
        if (json.status === '1' && json.result.length > 0) {
          const txs = json.result;
          
          console.log('═'.repeat(80));
          console.log(`📜 ANALYSE DE ${txs.length} TRANSACTIONS:\n`);
          
          // Compter les types de transactions
          let incomingPOL = [];
          let outgoingPOL = [];
          let contractInteractions = [];
          let tokenTransfers = [];
          
          txs.forEach(tx => {
            const isIncoming = tx.to && tx.to.toLowerCase() === WALLET.toLowerCase();
            const isOutgoing = tx.from.toLowerCase() === WALLET.toLowerCase();
            const value = parseFloat(tx.value) / 1e18;
            
            if (value > 0) {
              if (isIncoming) {
                incomingPOL.push({
                  date: new Date(parseInt(tx.timeStamp) * 1000),
                  value: value,
                  from: tx.from,
                  hash: tx.hash
                });
              } else if (isOutgoing) {
                outgoingPOL.push({
                  date: new Date(parseInt(tx.timeStamp) * 1000),
                  value: value,
                  to: tx.to,
                  hash: tx.hash
                });
              }
            }
            
            if (isOutgoing && tx.input && tx.input !== '0x') {
              contractInteractions.push({
                date: new Date(parseInt(tx.timeStamp) * 1000),
                to: tx.to,
                function: tx.functionName || 'Unknown',
                hash: tx.hash
              });
            }
          });
          
          console.log('📥 RÉCEPTIONS DE POL:');
          console.log(`   Total: ${incomingPOL.length} transactions\n`);
          
          if (incomingPOL.length > 0) {
            console.log('   🎯 DERNIÈRES RÉCEPTIONS:\n');
            incomingPOL.slice(-10).forEach((tx, i) => {
              console.log(`   ${incomingPOL.length - 10 + i + 1}. ${tx.date.toLocaleDateString()} - ${tx.value.toFixed(6)} POL`);
              console.log(`      De: ${tx.from.substring(0, 20)}...`);
              console.log(`      TX: ${tx.hash}`);
              console.log('');
            });
            
            console.log('   ✅ VOUS AVEZ DÉJÀ REÇU DU POL AVEC SUCCÈS!\n');
            console.log('   🤔 Alors pourquoi maintenant ça ne marche plus?\n');
          } else {
            console.log('   ❌ AUCUNE réception de POL détectée\n');
            console.log('   🤔 Vous êtes sûr d\'avoir reçu du POL sur CETTE adresse?\n');
          }
          
          console.log('═'.repeat(80));
          console.log('📤 ENVOIS DE POL:');
          console.log(`   Total: ${outgoingPOL.length} transactions\n`);
          
          if (outgoingPOL.length > 0) {
            console.log('   Derniers envois:\n');
            outgoingPOL.slice(-5).forEach((tx, i) => {
              console.log(`   ${i + 1}. ${tx.date.toLocaleDateString()} - ${tx.value.toFixed(6)} POL`);
              console.log(`      Vers: ${tx.to.substring(0, 20)}...`);
              console.log('');
            });
          }
          
          console.log('═'.repeat(80));
          console.log('🔧 INTERACTIONS AVEC CONTRATS:');
          console.log(`   Total: ${contractInteractions.length} interactions\n`);
          
          if (contractInteractions.length > 0) {
            console.log('   Dernières interactions:\n');
            contractInteractions.slice(-10).forEach((tx, i) => {
              console.log(`   ${i + 1}. ${tx.date.toLocaleDateString()} - ${tx.function}`);
              console.log(`      Contrat: ${tx.to.substring(0, 20)}...`);
              console.log('');
            });
          }
          
          // DIAGNOSTIC FINAL
          console.log('═'.repeat(80));
          console.log('🎯 DIAGNOSTIC:\n');
          
          if (incomingPOL.length > 0) {
            const lastReceived = incomingPOL[incomingPOL.length - 1];
            const daysSinceLastReceived = (Date.now() - lastReceived.date.getTime()) / (1000 * 60 * 60 * 24);
            
            console.log('✅ Vous AVEZ déjà reçu du POL sur cette adresse!');
            console.log(`   Dernière réception: ${lastReceived.date.toLocaleDateString()}`);
            console.log(`   Il y a ${Math.floor(daysSinceLastReceived)} jours\n`);
            
            if (code !== '0x') {
              console.log('🤔 MYSTÈRE:');
              console.log('   • L\'adresse est un smart contract MAINTENANT');
              console.log('   • MAIS vous avez reçu du POL AVANT');
              console.log('');
              console.log('💡 HYPOTHÈSES POSSIBLES:\n');
              console.log('   A. Le contrat a été déployé APRÈS vos premières TX');
              console.log('      → Vérifiez la date de la première TX vs date du contrat\n');
              console.log('   B. C\'est un contrat upgradeable');
              console.log('      → Le code a changé depuis\n');
              console.log('   C. Erreur dans l\'analyse');
              console.log('      → Vérifiez manuellement sur Polygonscan\n');
            }
            
            console.log('═'.repeat(80));
            console.log('🔗 VÉRIFICATION MANUELLE REQUISE:\n');
            console.log(`   https://polygonscan.com/address/${WALLET}\n`);
            console.log('   Regardez:');
            console.log('   1. Onglet "Transactions" → Triez par date');
            console.log('   2. Première TX → Quelle date?');
            console.log('   3. Contract → Quand a-t-il été créé?');
            console.log('   4. Si contrat créé AVANT première TX → Incompatible!\n');
            
          } else {
            console.log('⚠️  AUCUNE réception de POL détectée dans l\'historique');
            console.log('');
            console.log('💡 POSSIBILITÉS:\n');
            console.log('   A. Vous pensez à une AUTRE adresse');
            console.log('   B. Le POL était sur un autre réseau (Ethereum, BSC)');
            console.log('   C. C\'était du Wrapped POL (token), pas du POL natif');
            console.log('   D. Les transactions sont trop anciennes (API limitée)\n');
          }
          
          console.log('═'.repeat(80));
          
        } else {
          console.log('⚠️  API Polygonscan limitée');
          console.log('Vérification manuelle requise\n');
        }
      } catch (e) {
        console.log('❌ Erreur:', e.message);
      }
    });
  }).on('error', (e) => {
    console.log('❌ Erreur réseau:', e.message);
  });
}

deepAnalysis();
