const { ethers } = require('ethers');

const WALLET = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549';
const TOKEN_REAL = '0xbe8777aB450937bf107090F4F5F7c4834Db079cF'; // Celui qui montre 1 milliard
const TOKEN_OLD = '0xB37531727fC07c6EED4f97F852A115B428046EB2';

const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
const abi = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)'
];

async function checkTokens() {
  console.log('\n💎 VÉRIFICATION DES TOKENS REUSS\n');
  console.log('━'.repeat(60));
  
  const tokens = [
    { name: 'Token Principal', addr: TOKEN_REAL },
    { name: 'Token Ancien', addr: TOKEN_OLD }
  ];
  
  for (const token of tokens) {
    try {
      const contract = new ethers.Contract(token.addr, abi, provider);
      
      const name = await contract.name();
      const symbol = await contract.symbol();
      const decimals = await contract.decimals();
      const totalSupply = await contract.totalSupply();
      const balance = await contract.balanceOf(WALLET);
      
      console.log(`\n✅ ${token.name} (${token.addr})`);
      console.log(`   Nom: ${name}`);
      console.log(`   Symbol: ${symbol}`);
      console.log(`   Total Supply: ${ethers.formatUnits(totalSupply, decimals)}`);
      console.log(`   VOTRE SOLDE: ${ethers.formatUnits(balance, decimals)} ${symbol}`);
      
      if (balance > 0n) {
        console.log(`   🎉 VOUS POSSÉDEZ DES TOKENS ICI!`);
      }
    } catch (error) {
      console.log(`\n❌ ${token.name}: ${error.message.substring(0, 80)}...`);
    }
  }
}

checkTokens();
