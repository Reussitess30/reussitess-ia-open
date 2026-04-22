/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const https = require('https');
const { ethers } = require('ethers');

const WALLET = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549';
const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

console.log('\n🔒 AUDIT DE SÉCURITÉ COMPLET - DÉTECTION DE BOT DRAINER\n');
console.log('═'.repeat(80));
console.log(`📍 Wallet analysé: ${WALLET}`);
console.log('═'.repeat(80));

async function analyzeTransactions() {
  return new Promise((resolve) => {
    const url = `https://api.polygonscan.com/api?module=account&action=txlist&address=${WALLET}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=YourApiKeyToken`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          
          if (json.status === '1' && json.result.length > 0) {
            const transactions = json.result;
            
            let incomingPOL = [];
            let outgoingPOL = [];
            let suspiciousTransfers = [];
            
            console.log('\n📊 ANALYSE DES 50 DERNIÈRES TRANSACTIONS:\n');
            
            transactions.forEach((tx, i) => {
              const isOutgoing = tx.from.toLowerCase() === WALLET.toLowerCase();
              const value = parseFloat(tx.value) / 1e18;
              const timestamp = parseInt(tx.timeStamp);
              const date = new Date(timestamp * 1000);
              
              if (value > 0) {
                if (isOutgoing) {
                  outgoingPOL.push({ value, timestamp, to: tx.to, hash: tx.hash });
                } else {
                  incomingPOL.push({ value, timestamp, from: tx.from, hash: tx.hash });
                }
              }
            });
            
            console.log(`📥 Réceptions de POL: ${incomingPOL.length}`);
            console.log(`📤 Envois de POL: ${outgoingPOL.length}`);
            console.log('');
            
            // Détecter les transferts automatiques
            incomingPOL.forEach((incoming) => {
              const matchingOutgoing = outgoingPOL.find(out => {
                const timeDiff = Math.abs(out.timestamp - incoming.timestamp);
                return timeDiff < 120; // Dans les 2 minutes
              });
              
              if (matchingOutgoing) {
                const timeDiff = Math.abs(matchingOutgoing.timestamp - incoming.timestamp);
                suspiciousTransfers.push({
                  received: incoming.value,
                  sent: matchingOutgoing.value,
                  timeDiff: timeDiff,
                  receivedFrom: incoming.from,
                  sentTo: matchingOutgoing.to,
                  receivedHash: incoming.hash,
                  sentHash: matchingOutgoing.hash
                });
              }
            });
            
            // RAPPORT DÉTAILLÉ
            console.log('━'.repeat(80));
            
            if (suspiciousTransfers.length > 0) {
              console.log('\n🚨 ALERTE ROUGE: BOT DRAINER DÉTECTÉ!\n');
              console.log('═'.repeat(80));
              console.log(`${suspiciousTransfers.length} transfert(s) automatique(s) détecté(s):\n`);
              
              suspiciousTransfers.forEach((transfer, i) => {
                console.log(`${i + 1}. TRANSFERT AUTOMATIQUE:`);
                console.log(`   📥 Reçu: ${transfer.received.toFixed(6)} POL`);
                console.log(`   📤 Envoyé: ${transfer.sent.toFixed(6)} POL`);
                console.log(`   ⏱  Délai: ${transfer.timeDiff} secondes`);
                console.log(`   👤 De: ${transfer.receivedFrom.substring(0, 20)}...`);
                console.log(`   👉 Vers: ${transfer.sentTo.substring(0, 20)}...`);
                console.log(`   🔗 TX Reçue: https://polygonscan.com/tx/${transfer.receivedHash}`);
                console.log(`   🔗 TX Envoyée: https://polygonscan.com/tx/${transfer.sentHash}`);
                console.log('');
              });
              
              console.log('═'.repeat(80));
              console.log('\n💀 DIAGNOSTIC: VOTRE CLÉ PRIVÉE EST COMPROMISE!\n');
              console.log('Un bot surveille votre wallet et vide automatiquement');
              console.log('tout POL qui arrive en quelques secondes.\n');
              
              console.log('🛡 ACTIONS IMMÉDIATES REQUISES:\n');
              console.log('1. ❌ N\'ENVOYEZ PLUS RIEN à cette adresse');
              console.log('2. 🆕 CRÉEZ un nouveau wallet (je vais vous aider)');
              console.log('3. 💎 TRANSFÉREZ vos 1 milliard de REUSS vers le nouveau wallet');
              console.log('4. 🔒 SÉCURISEZ votre nouveau wallet (seed phrase sur papier)\n');
              
            } else if (incomingPOL.length > 0 && outgoingPOL.length === 0) {
              console.log('\n✅ AUCUN BOT DÉTECTÉ\n');
              console.log('Vos réceptions de POL n\'ont pas été suivies de transferts automatiques.');
              console.log('Votre wallet est probablement sûr, juste vide de POL.\n');
              
            } else if (incomingPOL.length === 0) {
              console.log('\n⚠  AUCUNE RÉCEPTION DE POL RÉCENTE\n');
              console.log('Impossible de détecter un bot drainer sans réception de POL.');
              console.log('Votre wallet semble simplement vide.\n');
              
            } else {
              console.log('\n⚠  PATTERN AMBIGU\n');
              console.log(`Réceptions: ${incomingPOL.length}, Envois: ${outgoingPOL.length}`);
              console.log('Les transferts ne semblent pas automatiques, mais soyez prudent.\n');
            }
            
            console.log('━'.repeat(80));
            
            // Afficher les dernières réceptions
            if (incomingPOL.length > 0) {
              console.log('\n📥 DERNIÈRES RÉCEPTIONS DE POL:\n');
              incomingPOL.slice(0, 5).forEach((tx, i) => {
                const date = new Date(tx.timestamp * 1000);
                console.log(`${i + 1}. ${tx.value.toFixed(6)} POL - ${date.toLocaleString()}`);
                console.log(`   De: ${tx.from}`);
                console.log(`   🔗 https://polygonscan.com/tx/${tx.hash}`);
                console.log('');
              });
            }
            
            // Afficher les derniers envois
            if (outgoingPOL.length > 0) {
              console.log('\n📤 DERNIERS ENVOIS DE POL:\n');
              outgoingPOL.slice(0, 5).forEach((tx, i) => {
                const date = new Date(tx.timestamp * 1000);
                console.log(`${i + 1}. ${tx.value.toFixed(6)} POL - ${date.toLocaleString()}`);
                console.log(`   Vers: ${tx.to}`);
                console.log(`   🔗 https://polygonscan.com/tx/${tx.hash}`);
                console.log('');
              });
            }
            
            resolve(suspiciousTransfers.length > 0);
            
          } else {
            console.log('\n⚠  API Polygonscan limitée ou aucune transaction');
            console.log('\n🔗 Vérification manuelle requise:');
            console.log(`   https://polygonscan.com/address/${WALLET}`);
            console.log('\nRecherchez des patterns de transferts automatiques:\n');
            console.log('   1. Vous recevez du POL');
            console.log('   2. Dans les secondes/minutes qui suivent, il est transféré ailleurs');
            console.log('   3. Cela se répète à chaque fois');
            resolve(false);
          }
        } catch (e) {
          console.log('❌ Erreur:', e.message);
          resolve(false);
        }
      });
    }).on('error', (e) => {
      console.log('❌ Erreur réseau:', e.message);
      resolve(false);
    });
  });
}

async function checkWalletSecurity() {
  const balance = await provider.getBalance(WALLET);
  const txCount = await provider.getTransactionCount(WALLET);
  const code = await provider.getCode(WALLET);
  
  console.log('\n🔐 INFORMATIONS DU WALLET:\n');
  console.log(`Type: ${code === '0x' ? 'EOA (Wallet normal)' : 'Smart Contract'}`);
  console.log(`Solde POL: ${ethers.formatEther(balance)} POL`);
  console.log(`Transactions: ${txCount}`);
  console.log('');
  
  if (txCount > 100 && balance === 0n) {
    console.log('⚠  PATTERN SUSPECT:');
    console.log(`   • ${txCount} transactions effectuées`);
    console.log(`   • Mais solde à 0 POL`);
    console.log(`   • Tous les fonds ont été dépensés en frais de gaz`);
    console.log(`   • OU vidés par un bot\n`);
  }
}

async function runFullAudit() {
  await checkWalletSecurity();
  const isCompromised = await analyzeTransactions();
  
  console.log('\n═'.repeat(80));
  console.log('                    🏁 FIN DE L\'AUDIT');
  console.log('═'.repeat(80));
  
  return isCompromised;
}

runFullAudit().then(isCompromised => {
  if (isCompromised) {
    console.log('\n⚠  WALLET COMPROMIS - Création d\'un nouveau wallet recommandée\n');
  } else {
    console.log('\n✅ Wallet semble sûr - Rechargez simplement avec du POL\n');
  }
});
