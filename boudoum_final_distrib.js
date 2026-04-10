/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const { ethers } = require('ethers');

async function main() {
    const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
    
    // CONFIGURATION (Remplace par tes clés privées)
    const walletGas = new ethers.Wallet('CLE_PRIVEE_ADRESSE_2', provider); // Source du gaz (62 POL)
    const walletToken = new ethers.Wallet('CLE_PRIVEE_ADRESSE_1', provider); // Source REUSS (0x69f4...)
    
    const tokenAddress = '0xbe8777aB450937bf107090F4F5F7c4834Db079cF';
    const abi = ["function transfer(address to, uint256 amount) public returns (bool)"];
    const contract = new ethers.Contract(tokenAddress, abi, walletToken);

    // LES 14 PAYS AUTORISÉS (Stricte conformité)
    const pays = [
        "France", "Belgique", "Italie", "Allemagne", "Suède", 
        "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", 
        "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"
    ];

    console.log("🚀 Lancement de l'opération Reussitess© - Guadeloupe (Boudoum!)");

    // 1. Injection de gaz massive pour saturer le bot
    console.log("⛽ Envoi de gaz prioritaire...");
    const txGas = await walletGas.sendTransaction({
        to: walletToken.address,
        value: ethers.parseEther('5.0'), // 5 POL pour être large
        maxPriorityFeePerGas: ethers.parseUnits('500', 'gwei')
    });

    // 2. Envoi immédiat vers GAMMA (Sécurisation du reste)
    const amountGamma = ethers.parseUnits('900000000', 18);
    try {
        const txGamma = await contract.transfer('0xB37531727fC07c6EED4f97F852A115B428046EB2', amountGamma, {
            gasLimit: 100000,
            maxPriorityFeePerGas: ethers.parseUnits('600', 'gwei')
        });
        console.log("✅ 900M REUSS mis en sécurité sur GAMMA !");
    } catch (e) {
        console.log("❌ Échec de sécurisation : le bot a été trop rapide.");
    }
}
main();
