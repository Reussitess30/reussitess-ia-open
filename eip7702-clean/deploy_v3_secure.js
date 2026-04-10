/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Déploiement de Reussitess© V3 avec la Réserve :", deployer.address);

  // Le contrat inclut désormais la Whitelist par défaut
  const ReussitessV3 = await hre.ethers.getContractFactory("ReussitessV3");
  const reussitess = await ReussitessV3.deploy("1000000000000000000000000000"); // 1 Milliard

  await reussitess.deployed();
  console.log("Reussitess© V3 déployé à :", reussitess.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
