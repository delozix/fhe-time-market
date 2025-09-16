const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying TimeMarketplaceMockFHE to Sepolia...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  
  if (balance === 0n) {
    console.log("❌ Account has no ETH! You need Sepolia ETH to deploy.");
    return;
  }

  console.log("📦 Deploying TimeMarketplaceMockFHE contract...");
  
  const TimeMarketplaceMockFHE = await ethers.getContractFactory("TimeMarketplaceMockFHE");
  const contract = await TimeMarketplaceMockFHE.deploy();
  
  console.log("⏳ Waiting for deployment...");
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  console.log("✅ TimeMarketplaceMockFHE deployed to:", contractAddress);
  
  // Get initial stats
  const [totalOffers, totalPurchases, totalVolume, activeOffers] = await contract.getContractStats();
  console.log("📊 Initial contract stats:", {
    totalOffers: totalOffers.toString(),
    totalPurchases: totalPurchases.toString(),
    totalVolume: ethers.formatEther(totalVolume) + " ETH",
    activeOffers: activeOffers.toString()
  });
  
  // Save contract info
  const contractInfo = {
    address: contractAddress,
    abi: TimeMarketplaceMockFHE.interface.fragments,
    network: "sepolia",
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    type: "mock-fhe",
    description: "Mock FHE contract for Sepolia testing"
  };
  
  const fs = require('fs');
  fs.writeFileSync('mock-fhe-contract-info.json', JSON.stringify(contractInfo, null, 2));
  
  console.log("💾 Contract info saved to mock-fhe-contract-info.json");
  console.log("🌐 Network: Sepolia");
  console.log("🔐 FHE: Mock implementation for testing");
  console.log("✅ Deployment completed successfully!");

  console.log("\n=== 📋 NEXT STEPS ===");
  console.log("1. Update frontend to use this contract address");
  console.log("2. Test mock FHE functionality");
  console.log("3. Deploy to Vercel with updated contract info");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });

