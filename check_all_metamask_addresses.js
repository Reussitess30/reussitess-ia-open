/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const { ethers } = require('ethers');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔍 VÉRIFICATION DE TOUTES VOS ADRESSES METAMASK\n');
console.log('═'.repeat(80));
console.log('Ouvrez MetaMask et vérifiez CHAQUE compte que vous avez\n');

const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
const addresses = [];

function askForAddress() {
  rl.question('Entrez une adresse (ou "fin" pour terminer): ', async (input) => {
    if (input.toLowerCase() === 'fin') {
      console.log('\n═'.repeat(80));
      console.log('📊 RÉSUMÉ DE TOUTES VOS ADRESSES:\n');
      
      for (let i = 0; i < addresses.length; i++) {
        console.log(`\n${i + 1}. ${addresses[i].address}`);
        console.log(`   Type: ${addresses[i].type}`);
        console.log(`   POL: ${addresses[i].balance} POL`);
        console.log(`   Status: ${addresses[i].status}`);
      }
      
      console.log('\n═'.repeat(80));
      rl.close();
      return;
    }
    
    try {
      const code = await provider.getCode(input);
      const balance = await provider.getBalance(input);
      const isContract = code !== '0x';
      
      addresses.push({
        address: input,
        type: isContract ? 'Smart Contract ❌' : 'Wallet EOA ✅',
        balance: ethers.formatEther(balance),
        status: parseFloat(ethers.formatEther(balance)) > 0 ? '✅ A du POL' : '❌ Vide'
      });
      
      console.log(`\n✅ Ajoutée: ${input}`);
      console.log(`   Type: ${isContract ? 'Smart Contract ❌' : 'Wallet EOA ✅'}`);
      console.log(`   POL: ${ethers.formatEther(balance)}\n`);
      
      askForAddress();
    } catch (error) {
      console.log('❌ Adresse invalide, réessayez\n');
      askForAddress();
    }
  });
}

console.log('Entrez chaque adresse que vous voyez dans MetaMask:');
console.log('(Cliquez sur l\'icône du compte en haut pour voir tous vos comptes)\n');
askForAddress();
