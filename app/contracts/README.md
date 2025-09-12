# Smart Contracts

This directory contains the smart contracts for the Time Marketplace application.

## 📁 Structure

- `contracts/TimeMarketplace.sol` - Main smart contract
- `scripts/deploy.js` - Deployment script
- `test/TimeMarketplace.test.js` - Contract tests
- `hardhat.config.js` - Hardhat configuration
- `package.json` - Dependencies

## 🚀 Usage

### Install Dependencies
```bash
npm install
```

### Compile Contracts
```bash
npm run compile
```

### Run Tests
```bash
npm run test
```

### Deploy to Sepolia
```bash
npm run deploy
```

### Deploy Locally
```bash
npm run deploy:local
```

## 🔧 Configuration

Create a `.env` file with:
```env
SEPOLIA_RPC_URL=https://sepolia.drpc.org
PRIVATE_KEY=your_private_key_here
```

## 📋 Contract Functions

### Public Functions
- `createOffer()` - Create a new time offer
- `purchaseOffer()` - Purchase an existing offer
- `deactivateOffer()` - Deactivate your offer
- `deleteOffer()` - Delete your offer
- `getOffer()` - Get offer details
- `getActiveOffers()` - Get all active offers
- `getUserOffers()` - Get user's offers
- `getUserPurchases()` - Get user's purchases

### Owner Functions
- `setPlatformFee()` - Set platform fee
- `withdrawFees()` - Withdraw collected fees
- `getContractBalance()` - Get contract balance

## 🔐 Security

- Only offer creators can deactivate/delete their offers
- Platform fee is capped at 10%
- All payments are handled securely
- No private keys in contract code

## 📄 License

MIT License


