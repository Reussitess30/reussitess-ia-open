const { ethers } = require('ethers');

const OFFICIAL_TOKEN = '0xB37531727fC07c6EED4f97F852A115B428046EB2';
const OTHER_TOKEN = '0xbe8777aB450937bf107090F4F5F7c4834Db079cF';

const ADDRESS_1 = '0x69f42Aa645A43A84e1143D416a4C81A88DF01549';
const ADDRESS_2 = '0x5d77d520a82447d2148ac799b2ef8e7ee0ec20ec';

const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
const abi = ['function balanceOf(address) view returns (uint256)'];

async function checkAll() {
  console.log('\n💎 VÉRIFICATION EXACTE DE VOS BALANCES\n');
  console.log('═'.repeat(80));
  
  // Token Officiel
  const official = new ethers.Contract(OFFICIAL_TOKEN, abi, provider);
  const bal1_official = await official.balanceOf(ADDRESS_1);
  const bal2_official = await official.balanceOf(ADDRESS_2);
  
  console.log('✅ TOKEN OFFICIEL (0xB375...):\n');
  console.log(`   Adresse 1: ${ethers.formatUnits(bal1_official, 18)} REUSS`);
  console.log(`   Adresse 2: ${ethers.formatUnits(bal2_official, 18)} REUSS`);
  console.log(`   Total: ${parseFloat(ethers.formatUnits(bal1_official, 18)) + parseFloat(ethers.formatUnits(bal2_official, 18))} REUSS\n`);
  
  // Autre Token
  const other = new ethers.Contract(OTHER_TOKEN, abi, provider);
  const bal1_other = await other.balanceOf(ADDRESS_1);
  const bal2_other = await other.balanceOf(ADDRESS_2);
  
  console.log('💎 AUTRE TOKEN (0xbe87...):\n');
  console.log(`   Adresse 1: ${ethers.formatUnits(bal1_other, 18)} REUSS`);
  console.log(`   Adresse 2: ${ethers.formatUnits(bal2_other, 18)} REUSS`);
  console.log(`   Total: ${parseFloat(ethers.formatUnits(bal1_other, 18)) + parseFloat(ethers.formatUnits(bal2_other, 18))} REUSS\n`);
  
  console.log('═'.repeat(80));
  console.log('🎯 TOTAL COMBINÉ:\n');
  const totalAll = parseFloat(ethers.formatUnits(bal1_official, 18)) + 
                   parseFloat(ethers.formatUnits(bal2_official, 18)) +
                   parseFloat(ethers.formatUnits(bal1_other, 18)) + 
                   parseFloat(ethers.formatUnits(bal2_other, 18));
  console.log(`   ${totalAll.toLocaleString()} REUSS\n`);
  console.log('═'.repeat(80));
}

checkAll();
