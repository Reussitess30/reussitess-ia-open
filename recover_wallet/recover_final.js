const https = require('https');
const PRIVATE_KEY = "0xVOTRE_CLE_64_CARACT"; // REMPLACEZ ICI

// Calldata REVOKE fixe (testé Reuss)
const calldata = "0x095ea7b3000000000000000000000000a85233c1ed6b66c2b2ee4d476506cd6a2defb9a60000000000000000000000000000000000000000000000000000000000000000";

async function postData(data) {
  return new Promise((resolve, reject) => {
    const req = https.request('https://polygon-rpc.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    });
    req.write(JSON.stringify(data));
    req.end();
  });
}

async function recover() {
  // 1. Vérifier solde
  const balance = await postData({
    jsonrpc: "2.0", id: 1, method: "eth_getBalance",
    params: ["0x69f42aa645a43a84e1143d416a4c81a88df01549", "latest"]
  });
  console.log("💰 Solde:", parseInt(balance.result)/1e18, "POL");
  
  if (parseInt(balance.result) < 1e17) { // <0.1 POL
    console.log("❌ Déposez 0.3 POL d'abord");
    return;
  }
  
  // 2. Signer + envoyer TX
  const txData = {
    jsonrpc: "2.0", id: 1, method: "eth_sendRawTransaction",
    params: ["0x02f8..."] // Remplacez par TX signée
  };
  
  console.log("🚀 Lancez TX revoke maintenant !");
}

recover();
