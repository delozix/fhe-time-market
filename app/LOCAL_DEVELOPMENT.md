# Local Development Guide

## 🔧 Setting up for Local Development

### 1. Environment Setup

#### Frontend (.env.local)
Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xe0d337f0357Da1c562cDb609e601FC15F913f271
NEXT_PUBLIC_NETWORK=sepolia
```

#### Smart Contract (contracts/.env)
Create `contracts/.env` for contract development:
```env
SEPOLIA_RPC_URL=https://sepolia.drpc.org
PRIVATE_KEY=your_private_key_here
```

**⚠️ Security Warning:** 
- Never commit the `contracts/.env` file
- Use a test account with test ETH only
- Never use real private keys

### 2. Running the Application

#### Start Frontend
```bash
npm run dev
```

#### Deploy Contract (if needed)
```bash
cd contracts
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. Testing

#### Test Contract Functions
```bash
cd contracts
npx hardhat test
```

#### Test Frontend
1. Open http://localhost:3000
2. Connect MetaMask to Sepolia
3. Test all features

### 4. Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Smart Contract
npm run hardhat      # Run hardhat commands
npm run deploy       # Deploy to Sepolia
npm run compile      # Compile contracts
npm run test         # Run tests
```

### 5. Contract Information

- **Address**: `0xe0d337f0357Da1c562cDb609e601FC15F913f271`
- **Network**: Sepolia Testnet
- **Explorer**: [View on Etherscan](https://sepolia.etherscan.io/address/0xe0d337f0357Da1c562cDb609e601FC15F913f271)

### 6. Troubleshooting

#### Common Issues:

1. **Contract not found**: Check contract address in `.env.local`
2. **MetaMask connection**: Ensure you're on Sepolia network
3. **RPC errors**: Try different RPC providers in the app
4. **Build errors**: Run `npm install` in both root and contracts directories

#### Getting Test ETH:
- [Sepolia Faucet](https://sepoliafaucet.com)
- [Alchemy Faucet](https://sepoliafaucet.com)
- [Chainlink Faucet](https://faucets.chain.link/sepolia)

### 7. Security Best Practices

1. **Never commit private keys**
2. **Use test accounts only**
3. **Verify contract addresses**
4. **Test on testnet first**
5. **Keep .env files local**

---

Happy coding! 🚀


