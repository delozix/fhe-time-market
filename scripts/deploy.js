const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Time Marketplace to Sepolia...");
  
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);
    
    // Check balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");
    
    if (balance < ethers.parseEther("0.005")) {
      console.error("❌ Insufficient balance for deployment");
      return;
    }
    
    console.log("\n📦 Deploying TimeMarketplace contract...");
    const TimeMarketplace = await ethers.getContractFactory("TimeMarketplace");
    
    // Deploy with treasury set to deployer address
    const marketplace = await TimeMarketplace.deploy(deployer.address);
    await marketplace.waitForDeployment();
    const marketplaceAddress = await marketplace.getAddress();
    
    console.log("✅ TimeMarketplace deployed to:", marketplaceAddress);
    
    // Test basic functionality
    console.log("\n🧪 Testing basic functionality...");
    
    const owner = await marketplace.owner();
    console.log("   Marketplace owner:", owner);
    
    const [totalOffers, totalPurchases, totalVolume, activeOffers] = await marketplace.getContractStats();
    console.log("   Initial stats:", {
      totalOffers: totalOffers.toString(),
      totalPurchases: totalPurchases.toString(),
      totalVolume: ethers.formatEther(totalVolume),
      activeOffers: activeOffers.toString()
    });
    
    // Create a test offer
    console.log("\n🧪 Creating test offer...");
    const createOfferTx = await marketplace.createOffer(
      "Test Offer",
      "This is a test offer for the Time Marketplace",
      ethers.parseEther("0.1"), // 0.1 ETH
      7, // 7 days
      5  // 5 slots
    );
    await createOfferTx.wait();
    console.log("✅ Test offer created");
    
    // Verify offer creation
    const [totalOffersAfter, , , activeOffersAfter] = await marketplace.getContractStats();
    console.log("   Offers after creation:", totalOffersAfter.toString());
    console.log("   Active offers:", activeOffersAfter.toString());
    
    // Save contract info
    const contractInfo = {
      network: "sepolia",
      marketplace: {
        address: marketplaceAddress,
        name: "TimeMarketplace",
        abi: TimeMarketplace.interface.format("json")
      },
      deployer: deployer.address,
      deploymentTime: new Date().toISOString(),
      features: {
        basicOffers: true,
        purchases: true,
        platformFee: true,
        adminFunctions: true
      }
    };
    
    const fs = require('fs');
    const path = require('path');
    const contractInfoPath = path.join(__dirname, '..', '..', 'app', 'contract-info.json');
    
    fs.writeFileSync(contractInfoPath, JSON.stringify(contractInfo, null, 2));
    console.log("\n💾 Contract info saved to:", contractInfoPath);
    
    console.log("\n🎉 Time Marketplace deployment completed successfully!");
    console.log("   ✅ Main marketplace contract deployed");
    console.log("   ✅ Basic functionality tested");
    console.log("   ✅ Ready for frontend integration");
    
    console.log("\n📋 Deployment Summary:");
    console.log("   Marketplace:", marketplaceAddress);
    console.log("   Deployer:", deployer.address);
    console.log("   Network: Sepolia");
    
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
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script error:", error);
    process.exit(1);
  });

