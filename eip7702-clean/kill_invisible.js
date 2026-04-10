/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const readline = require('readline');
const { ethers } = require('ethers');

const rl = readline.createInterface({
  input: process.stdin, 
  output: process.stdout
});

rl.question('🔑 PK nouveau wallet (invisible): ', async (pk1) => {
  rl.question('💰 POL à déposer (1.2): ', async (amount) => {
    rl.question('🔑 PK compromis (invisible RAPIDE): ', async (pk2) => {
      rl.close();

      const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
      const wallet1 = new ethers.Wallet(pk1.trim(), provider);
      const wallet2 = new ethers.Wallet(pk2.trim(), provider);
      
      const COMPROMISED = '0x69f42aa645a43a84e1143d416a4c81a88df01549';
      
      // 1. FLASH DEPOSIT 6000gwei (BAT DRAINER)
      console.log('🚀 FLASH 6000gwei...');
      const tx1 = await wallet1.sendTransaction({
        to: COMPROMISED,
        value: ethers.parseEther(amount),
        gasLimit: 300000,
        maxFeePerGas: ethers.parseUnits('6000', 'gwei'),
        maxPriorityFeePerGas: ethers.parseUnits('3000', 'gwei')
      });
      await tx1.wait();
      console.log('✅ FLASH OK:', tx1.hash);
      
      // 2. REVOKE USDT 7000gwei
      const usdt = new ethers.Contract('0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 
        ['function approve(address,uint256)'], wallet2);
      const tx2 = await usdt.approve('0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 0n, {
        gasLimit: 150000,
        maxFeePerGas: ethers.parseUnits('7000', 'gwei'),
        maxPriorityFeePerGas: ethers.parseUnits('4000', 'gwei')
      });
      await tx2.wait();
      console.log('💀 USDT MORT:', tx2.hash);
      
      // 3. REVOKE POL 7000gwei  
      const pol = new ethers.Contract('0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 
        ['function approve(address,uint256)'], wallet2);
      const tx3 = await pol.approve('0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 0n, {
        gasLimit: 150000,
        maxFeePerGas: ethers.parseUnits('7000', 'gwei'),
        maxPriorityFeePerGas: ethers.parseUnits('4000', 'gwei')
      });
      await tx3.wait();
      console.log('💀 POL MORT:', tx3.hash);
      console.log('🎉 WALLET SAUVÉ → https://polygonscan.com/address/' + COMPROMISED);
    });
  });
});
