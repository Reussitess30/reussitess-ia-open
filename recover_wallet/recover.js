const { ethers } = require("ethers");
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY; // Ajoutez votre clé
const YOUR_ADDRESS = "0x69f42aa645a43a84e1143d416a4c81a88df01549";
const RPC = "https://rpc.edennetwork.io/polygon";

const provider = new ethers.JsonRpcProvider(RPC);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// REVOKE Uniswap Router (Reuss swap typique)
const UNISWAP_ROUTER = "0xa85233c1ed6b66c2b2ee4d476506cd6a2defb9a6";
const REVOKE_DATA = "0x095ea7b3000000000000000000000000" + UNISWAP_ROUTER.slice(2) + "0000000000000000000000000000000000000000000000000000000000000000";

async function recover() {
  const tx = await wallet.sendTransaction({
    to: YOUR_ADDRESS,
    data: REVOKE_DATA,
    gasLimit: 200000,
    maxFeePerGas: ethers.parseUnits("600", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("50", "gwei"),
    type: 2
  });
  console.log("TX envoyée:", tx.hash);
  console.log("Vérifiez: https://polygonscan.com/tx/" + tx.hash);
}

recover().catch(console.error);
