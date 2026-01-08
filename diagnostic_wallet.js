const { ethers } = require('ethers');

const WALLET = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549';

const providers = [
  { name: 'Polygon RPC', url: 'https://polygon-rpc.com' },
  { name: 'Polygon DRPC', url: 'https://polygon.drpc.org' },
  { name: 'Polygon Gateway', url: 'https://polygon.gateway.tenderly.co' },
  { name: 'Alchemy (public)', url: 'https://polygon-mainnet.g.alchemy.com/v2/demo' }
];

async function checkAllProviders() {
  console.log('🔍 DIAGNOSTIC MULTI-SOURCES\n');
  console.log('📍 Adresse analysée:', WALLET);
  console.log('━'.repeat(60));
  
  for (const prov of providers) {
    try {
      const provider = new ethers.JsonRpcProvider(prov.url);
      const balance = await provider.getBalance(WALLET);
      const txCount = await provider.getTransactionCount(WALLET);
      const network = await provider.getNetwork();
      
      console.log(`\n✅ ${prov.name}`);
      console.log(`   ChainID: ${network.chainId}`);
      console.log(`   Solde POL: ${ethers.formatEther(balance)} POL`);
      console.log(`   Transactions: ${txCount}`);
    } catch (error) {
      console.log(`\n❌ ${prov.name}: ${error.message.substring(0, 50)}...`);
    }
  }
}

checkAllProviders();
