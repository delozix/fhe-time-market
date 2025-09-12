# Time Marketplace - FHEVM DApp

A decentralized time marketplace built with Next.js, Hardhat, and FHEVM (Fully Homomorphic Encryption Virtual Machine) from Zama.

## 🚀 Features

- **Time-based Services**: Create and purchase time-based service offers
- **FHEVM Integration**: Encrypted data storage and computation using Zama's FHEVM
- **Wallet Integration**: MetaMask support for Sepolia testnet
- **Real-time Updates**: Live offer listings and purchases
- **User Management**: Create, manage, and track your offers and purchases

## 🛠️ Tech Stack

- **Frontend**: Next.js 14.2.5, React 18.3.1, TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Hardhat 2.22.9, Solidity 0.8.24
- **FHE**: @fhevm/solidity 0.8.0, @zama-fhe/relayer-sdk 0.2.0
- **Web3**: ethers.js 6.14.0
- **Network**: Sepolia Testnet

## 📋 Prerequisites

- Node.js 20.x or higher
- MetaMask wallet
- Sepolia ETH for gas fees

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd time-marketplace
npm install
cd contracts
npm install
```

### 2. Environment Setup

```bash
# Copy environment files
cp env.example .env
cp contracts/env.example contracts/.env

# Edit .env files with your configuration
# You'll need a private key for contract deployment
```

### 3. Deploy Contract

```bash
cd contracts
npx hardhat run scripts/deploy-v2.js --network sepolia
```

### 4. Start Development Server

```bash
cd ..
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
SEPOLIA_RPC_URL=https://sepolia.drpc.org
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=0xEca1b6BBEE238a403c258D3FF49aF46d92cc9DbA
CHAIN_ID=11155111
```

### Contract Deployment

The contract is already deployed at:
- **Address**: `0xEca1b6BBEE238a403c258D3FF49aF46d92cc9DbA`
- **Network**: Sepolia Testnet
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0xEca1b6BBEE238a403c258D3FF49aF46d92cc9DbA)

## 🎯 Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect MetaMask
2. **Create Offer**: Fill out the form to create a time-based service offer
3. **Browse Offers**: View all active offers in the marketplace
4. **Purchase**: Buy offers with ETH
5. **Manage**: Deactivate or delete your own offers

## 🔐 FHEVM Features

This DApp demonstrates FHEVM capabilities:

- **Encrypted Storage**: Sensitive data is encrypted using FHEVM
- **Private Computation**: Operations on encrypted data without decryption
- **Privacy-Preserving**: User data remains private even on public blockchain

## 📁 Project Structure

```
├── app/                    # Next.js frontend
│   ├── components/         # React components
│   ├── hooks/             # Custom hooks
│   └── page.tsx           # Main page
├── contracts/             # Smart contracts
│   ├── contracts/         # Solidity files
│   ├── scripts/           # Deployment scripts
│   └── test/              # Contract tests
└── contract-info.json     # Contract ABI and address
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect to GitHub**: Push your code to GitHub
2. **Import to Vercel**: Connect your GitHub repository to Vercel
3. **Environment Variables**: Add your environment variables in Vercel dashboard
4. **Deploy**: Vercel will automatically deploy your application

### Required Vercel Environment Variables

```
SEPOLIA_RPC_URL=https://sepolia.drpc.org
CONTRACT_ADDRESS=0xEca1b6BBEE238a403c258D3FF49aF46d92cc9DbA
CHAIN_ID=11155111
```

## 🧪 Testing

```bash
# Run contract tests
cd contracts
npx hardhat test

# Run frontend tests
npm test
```

## 📝 Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Contract deployment
cd contracts
npx hardhat run scripts/deploy-v2.js --network sepolia

# Contract verification
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)

## ⚠️ Security Notice

This is a demonstration project. For production use:

- Use proper key management
- Implement additional security measures
- Conduct thorough security audits
- Use mainnet contracts for production

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Ensure MetaMask is connected to Sepolia
3. Verify you have sufficient ETH for gas fees
4. Check that the contract address is correct

---

**Built with ❤️ using Zama FHEVM**