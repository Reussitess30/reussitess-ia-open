const hre = require("hardhat");

async function main() {
  const contratAdresse = "0xB37531727fC07c6EED4f97F852A115B428046EB2"; 
  const voleur1 = "0x885b37586ad4263835f949c17b38b367541b85ea";
  const voleur2 = "0xB3E28eF64A312abB5F13CDE0400697cdE25da60b"; 

  const [deployer] = await hre.ethers.getSigners();
  console.log("BASE : Guadeloupe - Terres De Champions");
  console.log("EXECUTION via la Réserve :", deployer.address);

  // Interface simplifiée pour l'approve
  const abi = ["function approve(address spender, uint256 amount) public returns (bool)"];
  const Reussitess = await hre.ethers.getContractAt(abi, contratAdresse);

  console.log("Action : Neutralisation de 0x885b...");
  const tx1 = await Reussitess.approve(voleur1, 0);
  await tx1.wait();
  console.log("Succès : 0x885b éliminé.");

  console.log("Action : Neutralisation de 0xB3E2...");
  const tx2 = await Reussitess.approve(voleur2, 0);
  await tx2.wait();
  console.log("Succès : 0xB3E2 éliminé.");

  console.log("BOUDOUM ! Le siphonnage est terminé. Reussitess© est libre.");
}

main().catch((error) => {
  console.error("Erreur d'exécution :", error);
  process.exitCode = 1;
});
