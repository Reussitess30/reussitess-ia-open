const https = require('https');

const WALLET = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549';

// Utilisation de l'API Polygonscan (sans clé, limitée mais fonctionnelle)
const url = `https://api.polygonscan.com/api?module=account&action=txlist&address=${WALLET}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc`;

https.get(url, (res) => {
  let data = '';
  
  res.on('data', (chunk) => { data += chunk; });
  
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      
      if (json.status === '1' && json.result.length > 0) {
        console.log('\n📜 DERNIÈRES TRANSACTIONS DÉTECTÉES:\n');
        
        json.result.slice(0, 5).forEach((tx, i) => {
          const date = new Date(tx.timeStamp * 1000).toLocaleString();
          const value = (parseInt(tx.value) / 1e18).toFixed(4);
          const isIn = tx.to.toLowerCase() === WALLET.toLowerCase();
          
          console.log(`${i + 1}. ${isIn ? '📥 REÇU' : '📤 ENVOYÉ'}`);
          console.log(`   Montant: ${value} POL`);
          console.log(`   Date: ${date}`);
          console.log(`   Hash: ${tx.hash}`);
          console.log(`   Status: ${tx.isError === '0' ? '✅ Réussi' : '❌ Échoué'}`);
          console.log('');
        });
      } else {
        console.log('\n⚠️ Aucune transaction trouvée ou API limitée');
        console.log('💡 Vérifiez manuellement sur: https://polygonscan.com/address/' + WALLET);
      }
    } catch (e) {
      console.log('❌ Erreur parsing:', e.message);
    }
  });
}).on('error', (e) => {
  console.log('❌ Erreur réseau:', e.message);
});
