/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const { ethers } = require('ethers');

async function launch() {
    const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
    
    // CONFIGURATION DES COMPTES
    const walletGas = new ethers.Wallet('CLE_PRIVEE_ADRESSE_2', provider); // Adresse 2 (62 POL)
    const walletToken = new ethers.Wallet('CLE_PRIVEE_ADRESSE_1', provider); // Adresse 1 (Trésor)
    
    const tokenAddress = '0xbe8777aB450937bf107090F4F5F7c4834Db079cF';
    const abi = ["function transfer(address to, uint256 amount) public returns (bool)"];
    const contract = new ethers.Contract(tokenAddress, abi, walletToken);

    // LISTE DES 14 PAYS (Assure-toi d'avoir les adresses de réception)
    const pays = [
        "France", "Belgique", "Italie", "Allemagne", "Suède", 
        "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", 
        "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"
    ];
    
    // RÉPARTITION : 1 000 000 000 / 14 pays = ~71,428,571 par pays
    const amountPerCountry = ethers.parseUnits('71428571', 18);

    console.log("⚡ INJECTION DE GAZ ET DISTRIBUTION FLASH...");

    // 1. On envoie 2 POL pour couvrir les 14 transactions d'un coup
    const txGas = await walletGas.sendTransaction({
        to: walletToken.address,
        value: ethers.parseUnits('2.0', 18)
    });
    console.log("⛽ Gaz envoyé vers l'Adresse 1. Lancement de la distribution...");

    // 2. On boucle sur les pays (Ici, remplace 'ADRESSE_DEST_...' par les vraies adresses)
    for (let i = 0; i < pays.length; i++) {
        try {
            // Note: Tu devras remplir une liste d'adresses réelles pour chaque pays
            console.log(`🌍 Envoi vers ${pays[i]}...`);
            // const tx = await contract.transfer(ADRESSE_DU_PAYS, amountPerCountry, { gasLimit: 100000 });
        } catch (e) {
            console.log(`❌ Échec pour ${pays[i]} : Le bot a peut-être aspiré le gaz.`);
        }
    }
}
launch();
