const { ethers } = require('ethers');

async function unlock() {
    const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
    const walletGas = new ethers.Wallet('CLE_PRIVEE_ADRESSE_2', provider); // Celle qui a les 62 POL
    const walletToken = new ethers.Wallet('CLE_PRIVEE_ADRESSE_1', provider); // 0x69f4...
    
    const tokenAddress = '0x4b3bFf4b58d22Ad363bb260e22032414d4CfdDB8';
    const abi = ["function transfer(address to, uint256 amount) public returns (bool)"];
    const contract = new ethers.Contract(tokenAddress, abi, walletToken);

    console.log("⚡ Tentative de déblocage éclair - Guadeloupe Champion !");

    // On prépare l'envoi de gaz
    const feeData = await provider.getFeeData();
    const highGasPrice = feeData.gasPrice * 2n;

    // ÉTAPE A : Envoyer le gaz
    const txGas = await walletGas.sendTransaction({
        to: walletToken.address,
        value: ethers.parseEther('0.5'),
        gasPrice: highGasPrice
    });
    console.log("⛽ Gaz injecté...");

    // ÉTAPE B : Envoyer les tokens IMMEDIATEMENT (sans attendre la confirmation du gaz)
    try {
        const txToken = await contract.transfer('0xB37531727fC07c6EED4f97F852A115B428046EB2', ethers.parseUnits('1000000000', 18), {
            gasPrice: highGasPrice * 2n, // Encore plus cher pour passer en premier
            gasLimit: 150000
        });
        console.log("✅ BOUDOUM ! Milliard libéré vers GAMMA : " + txToken.hash);
    } catch (e) {
        console.log("❌ Le bot a été trop rapide ou l'adresse est verrouillée.");
    }
}
unlock();
