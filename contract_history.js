const https = require('https');

const CONTRACT = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549';

console.log('\n📜 HISTORIQUE DU CONTRAT\n');
console.log('═'.repeat(80));

// Récupérer la transaction de création
const url = `https://api.polygonscan.com/api?module=account&action=txlist&address=${CONTRACT}&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=YourApiKeyToken`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      
      if (json.status === '1' && json.result.length > 0) {
        const firstTx = json.result[0];
        const creationDate = new Date(parseInt(firstTx.timeStamp) * 1000);
        
        console.log('📅 PREMIÈRE TRANSACTION (Création):');
        console.log(`   Date: ${creationDate.toLocaleString()}`);
        console.log(`   De: ${firstTx.from}`);
        console.log(`   Hash: ${firstTx.hash}`);
        console.log(`   🔗 https://polygonscan.com/tx/${firstTx.hash}`);
        console.log('');
        
        // Analyser les 10 premières transactions
        console.log('📊 LES 10 PREMIÈRES TRANSACTIONS:\n');
        json.result.slice(0, 10).forEach((tx, i) => {
          const date = new Date(parseInt(tx.timeStamp) * 1000);
          const value = (parseInt(tx.value) / 1e18).toFixed(6);
          
          console.log(`${i + 1}. ${date.toLocaleDateString()}`);
          console.log(`   Fonction: ${tx.functionName || 'Transfer'}`);
          console.log(`   Valeur: ${value} POL`);
          console.log(`   De: ${tx.from.substring(0, 20)}...`);
          console.log('');
        });
        
        console.log('═'.repeat(80));
        console.log('\n💡 CONCLUSION:\n');
        
        if (firstTx.from.toLowerCase() === CONTRACT.toLowerCase()) {
          console.log('⚠️  Ce contrat s\'est auto-créé (pattern inhabituel)');
        } else {
          console.log(`✅ Créé par: ${firstTx.from}`);
          console.log('   Vérifiez si c\'est VOTRE adresse ou un service tiers.');
        }
        
      } else {
        console.log('⚠️  Impossible de récupérer l\'historique');
        console.log('Vérifiez manuellement sur Polygonscan');
      }
    } catch (e) {
      console.log('❌ Erreur:', e.message);
    }
  });
}).on('error', (e) => {
  console.log('❌ Erreur réseau:', e.message);
});
