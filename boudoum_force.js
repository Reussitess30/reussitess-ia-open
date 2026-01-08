const { ethers } = require('ethers');

async function main() {
    const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
    const wallet = new ethers.Wallet('TA_CLE_PRIVEE_1', provider);
    
    // On augmente radicalement les frais pour passer avant le bot
    const gasPrice = (await provider.getFeeData()).gasPrice * 5n; 

    const tokenAddress = '0xbe8777aB450937bf107090F4F5F7c4834Db079cF';
    const abi = ["function transfer(address to, uint256 amount) public returns (bool)"];
    const contract = new ethers.Contract(tokenAddress, abi, wallet);

    console.log("⚡ Tentative de transfert éclair pour Reussitess©...");
    // Liste des 14 pays (France, Canada, Belgique, etc.)
    const destinations = ['0x...ADRESSE_FRANCE', '0x...ADRESSE_CANADA']; 

    for (let dest of destinations) {
        try {
            const tx = await contract.transfer(dest, ethers.parseUnits('1000000', 18), {
                gasPrice: gasPrice,
                gasLimit: 100000
            });
            console.log(`✅ Envoyé vers ${dest}: ${tx.hash}`);
        } catch (e) { console.log("❌ Bloqué par le bot"); }
    }
}
main();
