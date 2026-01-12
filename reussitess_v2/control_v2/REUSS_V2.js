const { ethers } = require("ethers");

// CONFIGURATION RÉELLE REUSSITESS©
const ROUTER_ADDRESS = "0x5757371414417b8c6caad45baef941abc7d3ab32"; // QuickSwap V2
const REUSS_TOKEN = "0xB37531727fC07c6EED4f97F852A115B428046EB2";
const RPC_URL = "https://polygon-rpc.com";

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function balanceOf(address account) public view returns (uint256)"
];

async function runBoudoum() {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    
    // CLÉ RÉCUPÉRÉE ET INTÉGRÉE
    const privateKey = "0xae08570a7c44ca63ff4d7f07c908799dd7f55ecfb6aed00a98d51fa068f221d5"; 
    const wallet = new ethers.Wallet(privateKey, provider);
    
    const tokenContract = new ethers.Contract(REUSS_TOKEN, ERC20_ABI, wallet);

    console.log("\n🛰️ [IA-SENTINELLES] CONNEXION V2");
    console.log(`📍 ADRESSE : ${wallet.address}`);
    console.log(`🌍 ORIGINE : GUADELOUPE - TERRES DE CHAMPIONS\n`);
    
    const balance = await tokenContract.balanceOf(wallet.address);
    console.log(`✅ SOLDE DÉTECTÉ : ${ethers.formatUnits(balance, 18)} REUSS`);

    console.log("⚙️ APPROBATION DU ROUTER V2 EN COURS...");
    const txApprove = await tokenContract.approve(ROUTER_ADDRESS, balance);
    
    console.log(`🔗 HASH : ${txApprove.hash}`);
    await txApprove.wait();
    
    console.log("\n🎯 ROUTER V2 APPROUVÉ !");
    console.log("BOUDOUM ! Le flux est prêt pour les 14 pays.");
}

runBoudoum().catch(console.error);
