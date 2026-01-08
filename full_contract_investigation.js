const { ethers } = require('ethers');
const https = require('https');

const CONTRACT = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549';
const YOUR_EOA = '0x5d77d520a82447d2148ac799b2ef8e7ee0ec20ec';
const TOKEN = '0xbe8777aB450937bf107090F4F5F7c4834Db079cF';

const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

async function fullInvestigation() {
  console.log('\n🔬 INVESTIGATION COMPLÈTE DU CONTRAT\n');
  console.log('═'.repeat(80));
  
  // 1. INFORMATIONS DE BASE
  console.log('📊 ÉTAPE 1/5: INFORMATIONS DE BASE\n');
  
  const code = await provider.getCode(CONTRACT);
  const balance = await provider.getBalance(CONTRACT);
  const txCount = await provider.getTransactionCount(CONTRACT);
  
  console.log(`Adresse: ${CONTRACT}`);
  console.log(`Type: ${code === '0x' ? 'EOA' : 'Smart Contract'}`);
  console.log(`Bytecode: ${code.substring(0, 100)}...`);
  console.log(`Longueur bytecode: ${code.length} caractères`);
  console.log(`POL Balance: ${ethers.formatEther(balance)} POL`);
  console.log(`Transactions: ${txCount}\n`);
  
  // 2. PREMIÈRE TRANSACTION (Création)
  console.log('═'.repeat(80));
  console.log('📜 ÉTAPE 2/5: TRANSACTION DE CRÉATION\n');
  
  const url = `https://api.polygonscan.com/api?module=account&action=txlist&address=${CONTRACT}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc&apikey=YourApiKeyToken`;
  
  await new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.status === '1' && json.result.length > 0) {
            const firstTx = json.result[0];
            const date = new Date(parseInt(firstTx.timeStamp) * 1000);
            
            console.log(`Transaction de création:`);
            console.log(`  Hash: ${firstTx.hash}`);
            console.log(`  Date: ${date.toLocaleString()}`);
            console.log(`  Créé par: ${firstTx.from}`);
            console.log(`  Vers: ${firstTx.to || 'CONTRACT CREATION'}`);
            
            if (firstTx.from.toLowerCase() === YOUR_EOA.toLowerCase()) {
              console.log(`  🎯 CRÉÉ PAR VOTRE ADRESSE 2! Vous avez le contrôle!`);
            } else if (firstTx.from.toLowerCase() === CONTRACT.toLowerCase()) {
              console.log(`  ⚠️  Auto-création (pattern inhabituel)`);
            } else {
              console.log(`  ℹ️  Créé par une autre adresse`);
            }
          }
        } catch (e) {
          console.log('⚠️ API limitée, continuons...');
        }
        resolve();
      });
    }).on('error', () => resolve());
  });
  
  console.log('');
  
  // 3. TESTER TOUTES LES FONCTIONS POSSIBLES
  console.log('═'.repeat(80));
  console.log('🔧 ÉTAPE 3/5: TEST DES FONCTIONS DISPONIBLES\n');
  
  const testAbis = [
    // Propriété
    { name: 'owner', abi: 'function owner() view returns (address)' },
    { name: 'getOwner', abi: 'function getOwner() view returns (address)' },
    { name: 'admin', abi: 'function admin() view returns (address)' },
    
    // Safe/Multisig
    { name: 'getOwners', abi: 'function getOwners() view returns (address[])' },
    { name: 'getThreshold', abi: 'function getThreshold() view returns (uint256)' },
    { name: 'isOwner', abi: 'function isOwner(address) view returns (bool)' },
    
    // Proxy
    { name: 'implementation', abi: 'function implementation() view returns (address)' },
    
    // Exécution
    { name: 'execute', abi: 'function execute(address,uint256,bytes) returns (bytes)' },
  ];
  
  let workingFunctions = [];
  
  for (const test of testAbis) {
    try {
      const contract = new ethers.Contract(CONTRACT, [test.abi], provider);
      
      if (test.name === 'isOwner') {
        const result = await contract.isOwner(YOUR_EOA);
        console.log(`✅ ${test.name}(${YOUR_EOA.substring(0, 10)}...): ${result}`);
        workingFunctions.push({ name: test.name, result: result.toString() });
      } else {
        const result = await contract[test.name]();
        console.log(`✅ ${test.name}(): ${result.toString().substring(0, 60)}...`);
        workingFunctions.push({ name: test.name, result: result.toString() });
      }
    } catch (e) {
      // Fonction non disponible
    }
  }
  
  if (workingFunctions.length === 0) {
    console.log('❌ Aucune fonction standard détectée');
    console.log('   Ce contrat utilise des fonctions personnalisées\n');
  } else {
    console.log(`\n✅ ${workingFunctions.length} fonction(s) trouvée(s)\n`);
  }
  
  // 4. VÉRIFIER LES ALLOWANCES DU TOKEN
  console.log('═'.repeat(80));
  console.log('🔐 ÉTAPE 4/5: VÉRIFICATION DES APPROVALS\n');
  
  const tokenAbi = [
    'function allowance(address owner, address spender) view returns (uint256)'
  ];
  
  const tokenContract = new ethers.Contract(TOKEN, tokenAbi, provider);
  
  try {
    // Vérifier si l'adresse 2 peut dépenser depuis l'adresse 1
    const allowance = await tokenContract.allowance(CONTRACT, YOUR_EOA);
    
    console.log(`Allowance de l'adresse 1 vers l'adresse 2:`);
    console.log(`  ${ethers.formatUnits(allowance, 18)} REUSS`);
    
    if (allowance > 0n) {
      console.log(`  ✅ Vous POUVEZ transférer des tokens!`);
      console.log(`  💡 Utilisez transferFrom sur le token contract\n`);
    } else {
      console.log(`  ❌ Pas d'approval - Vous devez d'abord approuver\n`);
    }
  } catch (e) {
    console.log('⚠️ Impossible de vérifier les allowances\n');
  }
  
  // 5. RECOMMANDATIONS
  console.log('═'.repeat(80));
  console.log('🎯 ÉTAPE 5/5: RECOMMANDATIONS\n');
  
  console.log('OPTIONS DISPONIBLES:\n');
  
  console.log('OPTION 1: Utiliser Polygonscan Write Contract');
  console.log('  • Allez sur Polygonscan');
  console.log('  • Connectez l\'adresse 2 (qui a du POL)');
  console.log('  • Essayez les fonctions disponibles\n');
  
  console.log('OPTION 2: Créer un script de transfert');
  console.log('  • Si vous avez la clé privée de l\'adresse 1');
  console.log('  • Signez depuis l\'adresse 1');
  console.log('  • Transférez vers l\'adresse 2\n');
  
  console.log('OPTION 3: Utiliser le token contract');
  console.log('  • Approuver l\'adresse 2 depuis l\'adresse 1');
  console.log('  • Puis transferFrom depuis l\'adresse 2\n');
  
  console.log('OPTION 4: Créer un nouveau projet');
  console.log('  • Déployer REUSSITESS V2');
  console.log('  • Depuis l\'adresse 2');
  console.log('  • Contrôle total garanti\n');
  
  console.log('═'.repeat(80));
  console.log('\n💡 QUESTION CLÉ:\n');
  console.log('Avez-vous la SEED PHRASE ou CLÉ PRIVÉE de l\'adresse 1?');
  console.log('  [ ] OUI → On peut tout débloquer facilement');
  console.log('  [ ] NON → Il faut trouver une autre méthode\n');
  console.log('═'.repeat(80));
}

fullInvestigation();
