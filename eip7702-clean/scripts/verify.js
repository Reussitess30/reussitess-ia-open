/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */

const hre = require("hardhat");

async function main() {
  await hre.run("verify:verify", {
    address: "0xB37531727fC07c6EED4f97F852A115B428046EB2",
    constructorArguments: [
      "0x4b3bff4b58d22ad363bb260e22032414d4cfddb8",  // recipient
      "0x0000000000000000000000000000000000000000"   // initialOwner (à confirmer)
    ]
  });
  console.log("✅ VÉRIFIÉ SUR POLYGONSCAN !");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
