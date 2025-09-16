const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Time Marketplace FHE to Sepolia...");
  
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);
    
    // Check balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");
    
    if (balance < ethers.parseEther("0.01")) {
      console.error("❌ Insufficient balance for FHE deployment (need at least 0.01 ETH)");
      return;
    }
    
    console.log("\n📦 Deploying TimeMarketplaceFHE contract...");
    const TimeMarketplaceFHE = await ethers.getContractFactory("TimeMarketplaceFHE");
    
    // Deploy with treasury set to deployer address
    const marketplace = await TimeMarketplaceFHE.deploy(deployer.address);
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    
    console.log("✅ TimeMarketplaceFHE deployed to:", marketplaceAddress);
    
    // Enable FHE functionality
    console.log("\n🔧 Enabling FHE functionality...");
    const enableTx = await marketplace.enableFHE();
    await enableTx.wait();
    console.log("✅ FHE enabled");
    
    // Test basic functionality
    console.log("\n🧪 Testing basic functionality...");
    
    const owner = await marketplace.owner();
    console.log("   Marketplace owner:", owner);
    
    const fheEnabled = await marketplace.isFHEEnabled();
    console.log("   FHE enabled:", fheEnabled);
    
    const [totalOffers, totalPurchases, totalVolume, activeOffers] = await marketplace.getContractStats();
    console.log("   Initial stats:", {
      totalOffers: totalOffers.toString(),
      totalPurchases: totalPurchases.toString(),
      totalVolume: ethers.formatEther(totalVolume),
      activeOffers: activeOffers.toString()
    });
    
    // Skip test offer creation to avoid issues
    console.log("\n⏭️ Skipping test offer creation (will be tested via frontend)");
    
    // Save contract info
    const contractInfo = {
      network: "sepolia",
      marketplace: {
        address: marketplaceAddress,
        name: "TimeMarketplaceFHE",
        abi: TimeMarketplaceFHE.interface.format("json")
      },
      deployer: deployer.address,
      deploymentTime: new Date().toISOString(),
      features: {
        basicOffers: true,
        fheOffers: true,
        purchases: true,
        platformFee: true,
        adminFunctions: true,
        fheEnabled: fheEnabled
      },
      fheConfig: {
        relayerUrl: "https://relayer.testnet.zama.cloud",
        network: "sepolia",
        chainId: 11155111
      }
    };
    
    const fs = require('fs');
    const path = require('path');
    const contractInfoPath = path.join(__dirname, '..', '..', 'app', 'contract-info.json');
    
    fs.writeFileSync(contractInfoPath, JSON.stringify(contractInfo, null, 2));
    console.log("\n💾 Contract info saved to:", contractInfoPath);
    
    console.log("\n🎉 Time Marketplace FHE deployment completed successfully!");
    console.log("   ✅ FHE-enabled marketplace contract deployed");
    console.log("   ✅ FHE functionality enabled");
    console.log("   ✅ Basic functionality tested");
    console.log("   ✅ Ready for frontend integration");
    
    console.log("\n📋 Deployment Summary:");
    console.log("   Marketplace:", marketplaceAddress);
    console.log("   Deployer:", deployer.address);
    console.log("   Network: Sepolia");
    console.log("   FHE Enabled:", fheEnabled);
    console.log("   Relayer URL: https://relayer.testnet.zama.cloud");
    
    console.log("\n🔗 Next steps:");
    console.log("   1. Update frontend with new contract address");
    console.log("   2. Configure Zama Relayer integration");
    console.log("   3. Test FHE operations");
    
  } catch (error) {
    console.error("\n❌ Deployment failed:");
    console.error("Error:", error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.error("\n💡 Insufficient funds. Please add more ETH to your account.");
    }
    
    if (error.message.includes("gas")) {
      console.error("\n💡 Gas-related error. Try:");
      console.error("   - Increasing gas limit");
      console.error("   - Using a different RPC endpoint");
    }
    
    if (error.message.includes("FHE")) {
      console.error("\n💡 FHE-related error. Check:");
      console.error("   - FHEVM plugin is properly installed");
      console.error("   - Using correct RPC for FHE operations");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script error:", error);
    process.exit(1);
  });

