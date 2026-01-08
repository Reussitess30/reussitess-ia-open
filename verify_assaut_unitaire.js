const { ethers } = require('ethers');

async function verify() {
    const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
    const txHashes = [
        "0x725d43c911824359807ad3941b27998c0dfe2a69fbae9cc022aa32beba88b585", // France
        "0x1b92a84825e86d3578440442f61abc1435297b2e1a7cfadbc3bc43f73a78e027", // Royaume-Uni
        "0x4e2019f22b718913d74b37590a149e9ced36eb5f9a7cc94bd2dad8d3b875586d", // Italie
        "0xc988e6764deab4845d488ce2a7c20715c5f440bf39555197282c36b253dc3c1e", // Allemagne
        "0x8e1ea742c8e9149e304d544ee10d99ab72875aead41f04072b2e2f416cf9b6bd", // Suède
        "0xc89596024644ec71334f5e2e8474692e9714ab2b8ec49719a9ec5b8a71b9f567", // Singapour
        "0x214838743d30f3f9d595ac3c6b71dc63e639a19978af5a4627c9eb4f96e02fd7", // Australie
        "0x403a3836f58f78b6b4e03358f05a51644c636367556063db77ae0fddcc9..." // Espagne
    ];

    console.log("🔍 Analyse des Hashs de l'Assaut Unitaire...");
    for (let hash of txHashes) {
        try {
            const tx = await provider.getTransactionReceipt(hash);
            if (tx) {
                console.log(`✅ Transaction ${hash.substring(0,10)}... CONFIRMÉE sur le bloc ${tx.blockNumber}`);
            }
        } catch (e) {
            console.log(`⚠️ Impossible de lire le hash ${hash.substring(0,10)}`);
        }
    }
}
verify();
