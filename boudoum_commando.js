const { ethers } = require('ethers');

async function main() {
    const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
    
    // Adresse 2 (Celle qui a les 62 POL)
    const walletGas = new ethers.Wallet('CLE_PRIVEE_ADRESSE_2', provider);
    // Adresse 1 (Celle qui a le milliard de REUSS)
    const walletToken = new ethers.Wallet('CLE_PRIVEE_ADRESSE_1', provider);
    
    const tokenAddress = '0xbe8777aB450937bf107090F4F5F7c4834Db079cF';
    const abi = ["function transfer(address to, uint256 amount) public returns (bool)"];
    const contract = new ethers.Contract(tokenAddress, abi, walletToken);

    console.log("⚡ Tentative de transfert éclair...");
    
    // On envoie juste assez de gaz pour UNE transaction
    const txGas = await walletGas.sendTransaction({
        to: walletToken.address,
        value: ethers.parseEther('0.1') 
    });
    console.log("⛽ Gaz envoyé, on n'attend pas la confirmation...");

    // On lance le transfert de jetons IMMEDIATEMENT après
    try {
        const amount = ethers.parseUnits('1000000000', 18);
        const txToken = await contract.transfer('0xB37531727fC07c6EED4f97F852A115B428046EB2', amount, {
            gasLimit: 100000,
            gasPrice: (await provider.getFeeData()).gasPrice * 3n // On paye 3x plus cher pour passer devant le bot
        });
        console.log("✅ BOUDOUM ! Jetons transférés vers GAMMA : " + txToken.hash);
    } catch (e) {
        console.log("❌ Le bot a été plus rapide. Il faut augmenter le gasPrice.");
    }
}
main();
