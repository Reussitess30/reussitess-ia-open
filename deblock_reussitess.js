const { ethers } = require('ethers');

async function checkAndUnlock() {
    const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
    const wallet = new ethers.Wallet('TA_CLE_PRIVEE_ADRESSE_1', provider);
    const contractAddress = '0x4b3bFf4b58d22Ad363bb260e22032414d4CfdDB8';
    
    // ABI minimale pour vérifier les fonctions de blocage
    const abi = [
        "function transfer(address to, uint256 amount) public returns (bool)",
        "function balanceOf(address account) view returns (uint256)",
        "function owner() view returns (address)"
    ];
    
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    try {
        const balance = await contract.balanceOf(wallet.address);
        console.log(`💰 Solde REUSS détecté: ${ethers.formatUnits(balance, 18)}`);
        
        const owner = await contract.owner();
        console.log(`👑 Owner du contrat: ${owner}`);

        if (balance > 0n) {
            console.log("🚀 Tentative de déblocage vers GAMMA (0xB375...)...");
            
            // On utilise un Gas Price fixe très élevé pour "écraser" tout blocage réseau
            const tx = await contract.transfer('0xB37531727fC07c6EED4f97F852A115B428046EB2', balance, {
                gasLimit: 200000,
                maxPriorityFeePerGas: ethers.parseUnits('500', 'gwei'),
                maxFeePerGas: ethers.parseUnits('600', 'gwei')
            });
            
            console.log("✅ BOUDOUM ! Transaction envoyée: " + tx.hash);
            console.log("Vérifie sur PolygonScan, le milliard arrive !");
        }
    } catch (error) {
        console.log("❌ Blocage détecté: " + error.message);
        if (error.message.includes("insufficient funds")) {
            console.log("💡 Le problème est UNIQUEMENT le manque de POL sur l'adresse 1.");
        }
    }
}
checkAndUnlock();
