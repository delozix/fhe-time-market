const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying TimeMarketplaceV2 contract...");
  
  // Get the contract factory
  const TimeMarketplaceV2 = await ethers.getContractFactory("TimeMarketplaceV2");
  
  // Deploy the contract
  const timeMarketplaceV2 = await TimeMarketplaceV2.deploy();
  
  // Wait for deployment to complete
  await timeMarketplaceV2.waitForDeployment();
  
  const contractAddress = await timeMarketplaceV2.getAddress();
  
  console.log("TimeMarketplaceV2 deployed to:", contractAddress);
  
  // Get the contract ABI
  const contractABI = TimeMarketplaceV2.interface.format();
  
  // Set a dummy public key for FHE (in production, this would be generated properly)
  const dummyPublicKey = ethers.keccak256(ethers.toUtf8Bytes("fhe-demo-public-key-v2"));
  console.log("Setting public key:", dummyPublicKey);
  await timeMarketplaceV2.setPublicKey(dummyPublicKey);
  
  // Enable FHE functionality
  await timeMarketplaceV2.setFHEEnabled(true);
  
  // Get initial contract stats
  const stats = await timeMarketplaceV2.getContractStats();
  console.log("Initial contract stats:", {
    totalOffers: stats[0].toString(),
    totalPurchases: stats[1].toString(),
    totalVolume: ethers.formatEther(stats[2]) + " ETH",
    activeOffers: stats[3].toString(),
    fheEnabled: stats[4]
  });
  
  // Save contract info
  const contractInfo = {
    address: contractAddress,
    abi: contractABI,
    network: "sepolia",
    contractName: "TimeMarketplaceV2",
    version: "2.0.0",
    features: [
      "FHEVM Integration",
      "Encrypted Data Storage",
      "Advanced Statistics",
      "User Management",
      "Platform Fees"
    ],
    deployedAt: new Date().toISOString(),
    publicKey: dummyPublicKey
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
  console.log("Features:", contractInfo.features.join(", "));
  
  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("Contract Address:", contractAddress);
  console.log("Network: Sepolia");
  console.log("FHE Enabled: true");
  console.log("Public Key:", dummyPublicKey);
  console.log("Deployment completed successfully!");
  
  // Verify contract on Etherscan (optional)
  console.log("\nTo verify the contract on Etherscan, run:");
  console.log(`npx hardhat verify --network sepolia ${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
