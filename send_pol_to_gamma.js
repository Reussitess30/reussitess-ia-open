const { ethers } = require('ethers');
const ADDRESS_GAMMA = '0xB37531727fC07c6EED4f97F852A115B428046EB2';
const ADDRESS_2 = '0x5d77d520a82447d2148ac799b2ef8e7ee0ec20ec';

async function send() {
    const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
    // Remplace par ta clé privée de l'adresse 2
    const wallet = new ethers.Wallet('TA_CLE_PRIVEE_ICI', provider);
    
    console.log("🚀 Envoi de 10 POL vers GAMMA...");
    const tx = await wallet.sendTransaction({
        to: ADDRESS_GAMMA,
        value: ethers.parseEther('10')
    });
    await tx.wait();
    console.log("✅ Réussi ! Hash:", tx.hash);
}
send();
