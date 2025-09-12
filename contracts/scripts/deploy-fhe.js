const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying TimeMarketplaceFHE contract...");
  
  // Get the contract factory
  const TimeMarketplaceFHE = await ethers.getContractFactory("TimeMarketplaceFHE");
  
  // Deploy the contract
  const timeMarketplaceFHE = await TimeMarketplaceFHE.deploy();
  
  // Wait for deployment to complete
  await timeMarketplaceFHE.waitForDeployment();
  
  const contractAddress = await timeMarketplaceFHE.getAddress();
  
  console.log("TimeMarketplaceFHE deployed to:", contractAddress);
  
  // Get the contract ABI
  const contractABI = TimeMarketplaceFHE.interface.format("json");
  
  // Save contract info
  const contractInfo = {
    address: contractAddress,
    abi: JSON.parse(contractABI),
    network: "sepolia",
    contractName: "TimeMarketplaceFHE"
  };
  
  const fs = require('fs');
  const path = require('path');
  
  // Save to contract-info.json in the root directory
  fs.writeFileSync(
    path.join(__dirname, '../../contract-info.json'),
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("Contract info saved to contract-info.json");
  console.log("Contract ABI length:", contractInfo.abi.length);
  
  // Set a dummy public key for testing (in production, this would be generated properly)
  const dummyPublicKey = ethers.keccak256(ethers.toUtf8Bytes("dummy-public-key"));
  await timeMarketplaceFHE.setPublicKey(dummyPublicKey);
  console.log("Public key set:", dummyPublicKey);
  
  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
