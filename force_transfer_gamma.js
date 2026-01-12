const { ethers } = require('ethers');

async function unlock() {
    const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
    // CLÉ PRIVÉE DE L'ADRESSE QUI DÉTIENT LES TOKENS (0x69f4...)
    const privateKey = 'TA_CLE_PRIVEE_ICI'; 
    const wallet = new ethers.Wallet(privateKey, provider);
    
    const tokenAddress = '0xbe8777aB450937bf107090F4F5F7c4834Db079cF';
    const abi = ["function transfer(address to, uint256 amount) public returns (bool)"];
    const contract = new ethers.Contract(tokenAddress, abi, wallet);

    // On définit une priorité très haute pour passer avant les bots (300 Gwei)
    const feeData = await provider.getFeeData();
    const priorityFee = ethers.parseUnits('300', 'gwei');

    console.log("🚀 TENTATIVE DE DÉBLOCAGE VERS GAMMA...");
    
    try {
        const amount = ethers.parseUnits('1000000000', 18); // Ton milliard de REUSS
        const tx = await contract.transfer('0xB37531727fC07c6EED4f97F852A115B428046EB2', amount, {
            maxPriorityFeePerGas: priorityFee,
            maxFeePerGas: priorityFee + feeData.gasPrice
        });
        
        console.log("✅ TRANSFERT RÉUSSI VERS GAMMA !");
        console.log("🔗 Hash:", tx.hash);
    } catch (e) {
        console.log("❌ ERREUR :", e.message);
    }
}
unlock();
