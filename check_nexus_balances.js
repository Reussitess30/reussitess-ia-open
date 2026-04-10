/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const { ethers } = require('ethers');

async function checkAll() {
    const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
    const tokenAddress = '0xbe8777aB450937bf107090F4F5F7c4834Db079cF';
    const abi = ["function balanceOf(address account) view returns (uint256)"];
    const contract = new ethers.Contract(tokenAddress, abi, provider);

    // Liste des 14 pays partenaires Reussitess©
    const pays = [
        { nom: "France", addr: "ADRESSE_FRANCE" },
        { nom: "Belgique", addr: "ADRESSE_BELGIQUE" },
        { nom: "Italie", addr: "ADRESSE_ITALIE" },
        { nom: "Allemagne", addr: "ADRESSE_ALLEMAGNE" },
        { nom: "Suède", addr: "ADRESSE_SUEDE" },
        { nom: "Singapour", addr: "ADRESSE_SINGAPOUR" },
        { nom: "Australie", addr: "ADRESSE_AUSTRALIE" },
        { nom: "Espagne", addr: "ADRESSE_ESPAGNE" },
        { nom: "Brésil", addr: "ADRESSE_BRESIL" },
        { nom: "Royaume-Uni", addr: "ADRESSE_UK" },
        { nom: "Inde", addr: "ADRESSE_INDE" },
        { nom: "Nouvelle-Zélande", addr: "ADRESSE_NZ" },
        { nom: "États-Unis", addr: "ADRESSE_USA" },
        { nom: "Canada", addr: "ADRESSE_CANADA" }
    ];

    console.log("\n📊 RAPPORT DE DISTRIBUTION REUSSITESS© - TERRES DE CHAMPIONS\n");
    console.log("----------------------------------------------------------");

    for (let p of pays) {
        try {
            if (p.addr === "ADRESSE_ICI") {
                console.log(`⚪ ${p.nom.padEnd(15)} : Adresse non configurée`);
                continue;
            }
            const balance = await contract.balanceOf(p.addr);
            console.log(`✅ ${p.nom.padEnd(15)} : ${ethers.formatUnits(balance, 18)} REUSS`);
        } catch (e) {
            console.log(`❌ ${p.nom.padEnd(15)} : Erreur de lecture`);
        }
    }
    console.log("----------------------------------------------------------\n");
}
checkAll();
