/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const { ethers } = require('ethers');

async function scan() {
    const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
    const tokenAddress = '0xbe8777aB450937bf107090F4F5F7c4834Db079cF';
    
    // On regarde les événements de transfert (Transfer) depuis le début
    const abi = ["event Transfer(address indexed from, address indexed to, uint256 value)"];
    const contract = new ethers.Contract(tokenAddress, abi, provider);

    console.log("🔍 Scan des transferts Reussitess© en cours...");
    
    const filter = contract.filters.Transfer();
    const logs = await contract.queryFilter(filter, 0, 'latest');

    let recipients = new Set();
    logs.forEach(log => recipients.add(log.args.to));

    console.log(`✅ ${recipients.size} adresses de réception trouvées sur la blockchain.`);
    console.log("----------------------------------------------------------");
    
    // On vérifie le solde actuel de chaque adresse trouvée
    const balanceAbi = ["function balanceOf(address account) view returns (uint256)"];
    const balanceContract = new ethers.Contract(tokenAddress, balanceAbi, provider);

    for (let addr of recipients) {
        const bal = await balanceContract.balanceOf(addr);
        if (bal > 0n) {
            console.log(`📍 Destination: ${addr} | Solde: ${ethers.formatUnits(bal, 18)} REUSS`);
        }
    }
}
scan();
