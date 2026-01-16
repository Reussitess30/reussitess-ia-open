const { ethers } = require("ethers");

const PRIVATE_KEY = process.env.PRIVATE_KEY // Clé privée depuis variable d'environnement;  // Remplacez ICI
const YOUR_ADDRESS = "0x69f42aa645a43a84e1143d416a4c81a88df01549";

// RPC Polygon OFFICIEL
const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Revoke UNISWAP ROUTER (Reuss)
const UNISWAP_ROUTER = "0xa85233c1ed6b66c2b2ee4d476506cd6a2defb9a6";
const iface = new ethers.Interface(["function approve(address,uint256)"]);
const REVOKE_DATA = iface.encodeFunctionData("approve", [UNISWAP_ROUTER, 0]);

async function recover() {
  console.log("🔄 Connexion RPC...");
  const balance = await provider.getBalance(YOUR_ADDRESS);
  console.log("💰 Solde POL:", ethers.formatEther(balance));
  
  const tx = await wallet.sendTransaction({
    to: YOUR_ADDRESS,
    data: REVOKE_DATA,
    gasLimit: 150000,
    maxFeePerGas: ethers.parseUnits("800", "gwei"),   // Battre draineur
    maxPriorityFeePerGas: ethers.parseUnits("100", "gwei")
  });
  
  console.log("✅ TX envoyée:", tx.hash);
  console.log("🔗 https://polygonscan.com/tx/" + tx.hash);
}

recover().catch(console.error);
