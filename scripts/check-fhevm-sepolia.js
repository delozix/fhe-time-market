const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking FHEVM compatibility with Sepolia...");
  
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Using account:", deployer.address);
    
    // Check if we can connect to Sepolia
    console.log("\n1. Testing Sepolia connection...");
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log("   ✅ Connected to Sepolia, current block:", blockNumber);
    
    // Check if FHEVM contracts are available
    console.log("\n2. Checking FHEVM contracts availability...");
    
    const fhevmContracts = {
      FHEVM_EXECUTOR: "0x848B0066793BcC60346Da1F49049357399B8D595",
      ACL_CONTRACT: "0x687820221192C5B662b25367F70076A37bc79b6c",
      KMS_VERIFIER: "0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC",
      INPUT_VERIFIER: "0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4"
    };
    
    for (const [name, address] of Object.entries(fhevmContracts)) {
      try {
        const code = await ethers.provider.getCode(address);
        if (code === "0x") {
          console.log(`   ❌ ${name} not found at ${address}`);
        } else {
          console.log(`   ✅ ${name} found at ${address}`);
        }
      } catch (error) {
        console.log(`   ❌ Error checking ${name}: ${error.message}`);
      }
    }
    
    // Try to deploy a simple FHE contract
    console.log("\n3. Testing FHE contract deployment...");
    
    const TimeMarketplaceFHE = await ethers.getContractFactory("TimeMarketplaceFHE");
    console.log("   ✅ Contract factory created");
    
    console.log("   📦 Attempting deployment...");
    const contract = await TimeMarketplaceFHE.deploy();
    console.log("   ⏳ Waiting for deployment...");
    
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    console.log("   ✅ FHE contract deployed successfully to:", contractAddress);
    
    // Test basic contract functions
    console.log("\n4. Testing contract functions...");
    
    const owner = await contract.owner();
    console.log("   ✅ Owner:", owner);
    
    const totalOffers = await contract.totalOffersCreated();
    console.log("   ✅ Total offers:", totalOffers.toString());
    
    console.log("\n🎉 FHEVM Sepolia compatibility check PASSED!");
    console.log("✅ Your FHE contract can be deployed to Sepolia");
    
  } catch (error) {
    console.error("\n❌ FHEVM Sepolia compatibility check FAILED:");
    console.error("Error:", error.message);
    
    if (error.message.includes("could not decode result data")) {
      console.error("\n💡 This might indicate FHEVM contracts are not properly configured.");
      console.error("   Make sure you're using the correct RPC that supports FHEVM.");
    }
    
    if (error.message.includes("timeout")) {
      console.error("\n💡 Deployment is timing out. This might be due to:");
      console.error("   - Slow RPC connection");
      console.error("   - High gas requirements for FHE operations");
      console.error("   - Network congestion");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script error:", error);
    process.exit(1);
  });

