# Time Marketplace - FHE Demo

A decentralized time marketplace application built with Next.js, Hardhat, and Zama's FHE libraries.

## 🚀 Features

- **Create Time Offers**: List your services with encrypted pricing
- **Browse Active Offers**: Discover available time-based services
- **Purchase Offers**: Buy services using ETH
- **Manage Your Offers**: Deactivate or delete your own offers
- **FHE Integration**: Demonstrates confidential computations on encrypted data
- **Multi-RPC Support**: Works with any Sepolia RPC provider
- **MetaMask Integration**: Secure wallet connection

## 🛠️ Tech Stack

- **Frontend**: Next.js 14.2.5, React 18.3.1, Tailwind CSS
- **Blockchain**: Hardhat 2.22.9, Ethers 6.14.0
- **FHE**: @fhevm/solidity 0.8.0, @zama-fhe/relayer-sdk 0.2.0
- **Network**: Ethereum Sepolia Testnet
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 20.x (LTS)
- MetaMask wallet
- Sepolia ETH for gas fees

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xe0d337f0357Da1c562cDb609e601FC15F913f271
NEXT_PUBLIC_NETWORK=sepolia
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Smart Contract

The smart contract is deployed on Sepolia testnet:
- **Address**: `0xe0d337f0357Da1c562cDb609e601FC15F913f271`
- **Network**: Sepolia
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0xe0d337f0357Da1c562cDb609e601FC15F913f271)

## 🔐 FHE Features

This application demonstrates several FHE concepts:

1. **Confidential Price Storage**: Prices are encrypted using FHE
2. **Private Computations**: Calculations on encrypted data
3. **Zero-Knowledge Verification**: Prove properties without revealing data
4. **Confidential Matching**: Find offers within budget without revealing budget

## 🌐 RPC Providers

The application supports multiple Sepolia RPC providers:
- 1RPC (https://1rpc.io/sepolia)
- DRPC (https://sepolia.drpc.org)
- PublicNode (https://ethereum-sepolia-rpc.publicnode.com)
- Alchemy Demo (https://eth-sepolia.g.alchemy.com/v2/demo)

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Vercel
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xe0d337f0357Da1c562cDb609e601FC15F913f271
NEXT_PUBLIC_NETWORK=sepolia
```

## 📱 Usage

1. **Connect Wallet**: Click "Connect Wallet" and connect your MetaMask
2. **Select RPC**: Choose your preferred RPC provider
3. **Create Offer**: Click "Create Time Offer" to list your services
4. **Browse Offers**: View available time-based services
5. **Purchase**: Buy services with ETH
6. **Manage**: Deactivate or delete your own offers

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using Zama's FHE technology