# Time Marketplace with FHE Encryption

A decentralized marketplace for time-based services with **Fully Homomorphic Encryption (FHE)** using Zama technology. This project allows users to create, sell, and purchase time-based services while keeping sensitive pricing data encrypted.

## 🚀 Features

- **FHE-Encrypted Offers**: Create offers with encrypted pricing data using Zama's FHE technology
- **Decentralized Marketplace**: Built on Ethereum Sepolia testnet
- **Wallet Integration**: MetaMask support for secure transactions
- **Real-time Updates**: Live offer management and purchasing
- **Responsive UI**: Modern, mobile-friendly interface
- **RPC Fallback**: Multiple RPC providers for reliable connection

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Ethers.js 6** - Ethereum interaction
- **React Hot Toast** - User notifications

### Smart Contracts
- **Solidity** - Smart contract language
- **Hardhat** - Development environment
- **FHEVM** - Fully Homomorphic Encryption for Ethereum
- **OpenZeppelin** - Security libraries

### FHE Integration
- **Zama Relayer** - FHE computation service
- **@fhevm/solidity** - FHE library for Solidity
- **@zama-fhe/relayer-sdk** - Zama Relayer SDK

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask wallet
- Sepolia ETH for gas fees

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd time-marketplace-fhe
npm install
```

### 2. Environment Setup
Create `.env.local` file:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x02D5ADeDf81F3c5Ee3FeBC76736Fe2d6A7124e51
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_FHE_RELAYER_URL=https://relayer.testnet.zama.cloud
NEXT_PUBLIC_FHE_NETWORK=sepolia
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## 🔧 Smart Contract Deployment

### Deploy to Sepolia
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy-fhe.js --network sepolia
```

### Contract Details
- **Address**: `0x02D5ADeDf81F3c5Ee3FeBC76736Fe2d6A7124e51`
- **Network**: Sepolia Testnet
- **Chain ID**: 11155111

## 📱 How to Use

### 1. Connect Wallet
- Click "Connect Wallet" button
- Approve MetaMask connection
- Ensure you're on Sepolia network

### 2. Create Offer
- Click "Create Offer" button
- Fill in offer details:
  - Title and description
  - Price (in ETH)
  - Duration (in hours)
  - Available slots
- Submit transaction (uses FHE encryption)

### 3. Purchase Offer
- Browse available offers
- Click "Purchase" on desired offer
- Confirm transaction in MetaMask
- Offer automatically updates

### 4. Manage Offers
- View your created offers
- Deactivate offers when needed
- Monitor transaction status

## 🔐 FHE Implementation

### How It Works
1. **Offer Creation**: Price, duration, and slots are encrypted using FHE
2. **Encrypted Storage**: Sensitive data stored as encrypted handles on-chain
3. **Purchase Validation**: FHE computation validates encrypted pricing
4. **Public Display**: Only public price shown in UI

### Zama Relayer Integration
- Handles FHE encryption/decryption
- Manages encrypted data attestations
- Provides secure computation environment

## 🌐 Network Configuration

### Supported RPC Providers
- Ankr (Primary)
- Alchemy (Backup)
- BlockPi (Fallback)
- Gateway.fm (Backup)
- 1RPC (Free tier)
- DRPC (Fallback)

### Auto-Switch Logic
- Automatically switches RPC on connection failure
- Maintains connection stability
- Reduces rate limiting issues

## 📁 Project Structure

```
time-marketplace-fhe/
├── app/                          # Next.js app directory
│   ├── components/               # React components
│   │   ├── CreateOfferModal.tsx  # Offer creation modal
│   │   ├── OfferCard.tsx         # Individual offer display
│   │   ├── RPCSelector.tsx       # RPC provider selector
│   │   └── NetworkInstructions.tsx
│   ├── context/                  # React context
│   │   └── AppContext.tsx        # Global app state
│   ├── hooks/                    # Custom hooks
│   │   ├── useContract.ts        # Smart contract interaction
│   │   ├── useWallet.ts          # Wallet management
│   │   └── useBlockchainProvider.ts # RPC management
│   ├── lib/                      # Utilities
│   │   ├── zamaRelayer.ts        # Zama Relayer client
│   │   └── polyfills.ts          # Browser polyfills
│   └── page.tsx                  # Main page
├── contracts/                    # Smart contracts
│   ├── contracts/
│   │   └── TimeMarketplaceFHE.sol # Main FHE contract
│   ├── scripts/
│   │   └── deploy-fhe.js         # Deployment script
│   └── hardhat.config.js         # Hardhat configuration
└── README.md
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run compile      # Compile smart contracts
npm run deploy       # Deploy contracts to Sepolia
```

### Smart Contract Development
```bash
cd contracts
npx hardhat compile  # Compile contracts
npx hardhat test     # Run tests
npx hardhat node     # Start local network
```

## 🚀 Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Environment Variables for Vercel
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x02D5ADeDf81F3c5Ee3FeBC76736Fe2d6A7124e51
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_FHE_RELAYER_URL=https://relayer.testnet.zama.cloud
NEXT_PUBLIC_FHE_NETWORK=sepolia
```

## 🔍 Troubleshooting

### Common Issues

**Wallet Connection Issues**
- Ensure MetaMask is installed
- Check if you're on Sepolia network
- Try refreshing the page

**RPC Connection Problems**
- App automatically switches RPC providers
- Check internet connection
- Wait a few seconds for auto-reconnection

**Transaction Failures**
- Ensure sufficient ETH for gas
- Check network congestion
- Try increasing gas limit

**FHE Operations**
- FHE operations may take longer
- Ensure Zama Relayer is accessible
- Check contract deployment status

### Debug Mode
Enable debug logging by opening browser console and looking for:
- 🔍 Contract interaction logs
- 🔐 FHE operation logs
- 🌐 RPC connection logs

## 📚 Resources

- [Zama Documentation](https://docs.zama.ai/)
- [FHEVM Documentation](https://docs.fhevm.org/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Hardhat Documentation](https://hardhat.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zama** for FHE technology and Relayer service
- **FHEVM** for Ethereum FHE implementation
- **OpenZeppelin** for security libraries
- **Ethereum Foundation** for blockchain infrastructure

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check the troubleshooting section
- Review Zama documentation

---

**Built with ❤️ using Zama FHE technology**
