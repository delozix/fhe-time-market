const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying TimeMarketplace contract...");

  const TimeMarketplace = await ethers.getContractFactory("TimeMarketplace");
  const timeMarketplace = await TimeMarketplace.deploy();

  await timeMarketplace.waitForDeployment();

  const address = await timeMarketplace.getAddress();
  console.log("TimeMarketplace deployed to:", address);
  console.log("Contract address:", address);
  
  // Save the contract address for frontend
  const fs = require('fs');
  const contractInfo = {
    address: address,
    network: "sepolia",
    abi: require("../artifacts/contracts/TimeMarketplace.sol/TimeMarketplace.json").abi
  };
  
  fs.writeFileSync(
    '../contract-info.json', 
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("Contract info saved to frontend/contract-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
