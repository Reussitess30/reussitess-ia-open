const { ethers } = require('ethers');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const OFFICIAL_TOKEN = '0xB37531727fC07c6EED4f97F852A115B428046EB2';
const OTHER_TOKEN = '0xbe8777aB450937bf107090F4F5F7c4834Db079cF';

const ADDRESS_1 = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549';
const ADDRESS_2 = '0x5d77d520a82447d2148ac799b2ef8e7ee0ec20ec';

const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');

const tokenAbi = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function name() view returns (string)',
  'function symbol() view returns (string)'
];

console.log('\n🎯 SOLUTION ALTERNATIVE - TRANSFERT SANS POL SUR ADRESSE 1\n');
console.log('═'.repeat(80));
console.log('\nPROBLÈME: L\'adresse 1 est un smart contract qui refuse le POL');
console.log('SOLUTION: Utiliser approve + transferFrom\n');
console.log('═'.repeat(80));

console.log('\n📋 PLAN D\'ACTION:\n');
console.log('1. Depuis l\'adresse 1: Approuver l\'adresse 2');
console.log('2. Depuis l\'adresse 2: Utiliser transferFrom pour récupérer les tokens');
console.log('3. Les frais sont payés par l\'adresse 2 (qui a du POL)\n');
console.log('═'.repeat(80));

rl.question('\n🔑 Entrez la CLÉ PRIVÉE de l\'ADRESSE 1: ', async (privateKey1) => {
  console.log('\n🔄 Validation...\n');
  
  try {
    let cleanKey1 = privateKey1.trim();
    if (!cleanKey1.startsWith('0x')) {
      cleanKey1 = '0x' + cleanKey1;
    }
    
    const wallet1 = new ethers.Wallet(cleanKey1, provider);
    
    if (wallet1.address.toLowerCase() !== ADDRESS_1.toLowerCase()) {
      console.log('❌ Cette clé ne correspond pas à l\'adresse 1!\n');
      rl.close();
      return;
    }
    
    console.log('✅ Adresse 1 validée\n');
    
    rl.question('🔑 Entrez la CLÉ PRIVÉE de l\'ADRESSE 2: ', async (privateKey2) => {
      console.log('\n🔄 Validation...\n');
      
      try {
        let cleanKey2 = privateKey2.trim();
        if (!cleanKey2.startsWith('0x')) {
          cleanKey2 = '0x' + cleanKey2;
        }
        
        const wallet2 = new ethers.Wallet(cleanKey2, provider);
        
        if (wallet2.address.toLowerCase() !== ADDRESS_2.toLowerCase()) {
          console.log('❌ Cette clé ne correspond pas à l\'adresse 2!\n');
          rl.close();
          return;
        }
        
        console.log('✅ Adresse 2 validée\n');
        
        // Vérifier le POL sur adresse 2
        const pol2 = await provider.getBalance(ADDRESS_2);
        console.log(`⛽ POL sur adresse 2: ${ethers.formatEther(pol2)} POL\n`);
        
        if (parseFloat(ethers.formatEther(pol2)) < 0.05) {
          console.log('⚠️  Peu de POL sur l\'adresse 2');
          console.log('   Assurez-vous d\'avoir au moins 0.05 POL pour les frais\n');
        }
        
        console.log('═'.repeat(80));
        console.log('🚀 ÉTAPE 1: APPROBATIONS (depuis adresse 1)\n');
        
        // Token Officiel
        const officialToken = new ethers.Contract(OFFICIAL_TOKEN, tokenAbi, wallet1);
        const bal1_official = await officialToken.balanceOf(ADDRESS_1);
        
        console.log(`Token Officiel: ${ethers.formatUnits(bal1_official, 18)} REUSS`);
        
        if (bal1_official > 0n) {
          console.log('Approbation en cours...');
          
          try {
            const approveTx1 = await officialToken.approve(ADDRESS_2, bal1_official);
            console.log(`TX envoyée: ${approveTx1.hash}`);
            await approveTx1.wait();
            console.log('✅ Token officiel approuvé\n');
          } catch (error) {
            console.log(`❌ Erreur d'approbation: ${error.message}\n`);
            console.log('💡 L\'adresse 1 ne peut pas signer de transactions!');
            console.log('   C\'est un smart contract sans fonction d\'approbation.\n');
            console.log('CONCLUSION: Les tokens sont BLOQUÉS sur ce contrat.\n');
            console.log('═'.repeat(80));
            console.log('🎯 SOLUTION ULTIME:\n');
            console.log('1. Créer un nouveau token REUSSITESS V2');
            console.log('2. Le déployer depuis l\'adresse 2');
            console.log('3. Faire un airdrop aux vrais détenteurs');
            console.log('4. Abandonner l\'ancien contrat\n');
            rl.close();
            return;
          }
        }
        
        // Autre Token
        const otherToken = new ethers.Contract(OTHER_TOKEN, tokenAbi, wallet1);
        const bal1_other = await otherToken.balanceOf(ADDRESS_1);
        
        console.log(`Autre Token: ${ethers.formatUnits(bal1_other, 18)} REUSS`);
        
        if (bal1_other > 0n) {
          console.log('Approbation en cours...');
          const approveTx2 = await otherToken.approve(ADDRESS_2, bal1_other);
          console.log(`TX envoyée: ${approveTx2.hash}`);
          await approveTx2.wait();
          console.log('✅ Autre token approuvé\n');
        }
        
        console.log('═'.repeat(80));
        console.log('🚀 ÉTAPE 2: TRANSFERTS (depuis adresse 2)\n');
        
        // TransferFrom Token Officiel
        if (bal1_official > 0n) {
          const officialToken2 = new ethers.Contract(OFFICIAL_TOKEN, tokenAbi, wallet2);
          console.log('Transfert du token officiel...');
          const transferTx1 = await officialToken2.transferFrom(ADDRESS_1, ADDRESS_2, bal1_official);
          console.log(`TX envoyée: ${transferTx1.hash}`);
          await transferTx1.wait();
          console.log('✅ Token officiel transféré\n');
        }
        
        // TransferFrom Autre Token
        if (bal1_other > 0n) {
          const otherToken2 = new ethers.Contract(OTHER_TOKEN, tokenAbi, wallet2);
          console.log('Transfert de l\'autre token...');
          const transferTx2 = await otherToken2.transferFrom(ADDRESS_1, ADDRESS_2, bal1_other);
          console.log(`TX envoyée: ${transferTx2.hash}`);
          await transferTx2.wait();
          console.log('✅ Autre token transféré\n');
        }
        
        console.log('═'.repeat(80));
        console.log('🎉 TRANSFERT RÉUSSI!\n');
        console.log('Vérification des nouveaux balances...\n');
        
        const newBal2_official = await officialToken.balanceOf(ADDRESS_2);
        const newBal2_other = await otherToken.balanceOf(ADDRESS_2);
        
        console.log(`Adresse 2:`);
        console.log(`  Token Officiel: ${ethers.formatUnits(newBal2_official, 18)} REUSS`);
        console.log(`  Autre Token: ${ethers.formatUnits(newBal2_other, 18)} REUSS\n`);
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
