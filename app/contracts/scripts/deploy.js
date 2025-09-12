const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying TimeMarketplace contract...");
  
  const TimeMarketplace = await ethers.getContractFactory("TimeMarketplace");
  const timeMarketplace = await TimeMarketplace.deploy();
  
  await timeMarketplace.waitForDeployment();
  
  const contractAddress = await timeMarketplace.getAddress();
  console.log("TimeMarketplace deployed to:", contractAddress);
  
  // Get contract ABI
  const contractArtifact = await hre.artifacts.readArtifact("TimeMarketplace");
  const contractABI = contractArtifact.abi;
  
  // Save contract info
  const contractInfo = {
    address: contractAddress,
    network: "sepolia",
    abi: contractABI
  };
  
  const fs = require('fs');
  const path = require('path');
  
  // Save to root directory
  fs.writeFileSync(
    path.join(__dirname, '../../contract-info.json'),
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("Contract info saved to contract-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


