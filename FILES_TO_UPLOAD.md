# Files to Upload to GitHub

## Essential Files (Must Upload)

### Root Directory
- `.gitignore` - Git ignore rules
- `env.example` - Environment variables template
- `vercel.json` - Vercel deployment configuration
- `README.md` - Project documentation
- `DEPLOYMENT.md` - Deployment instructions
- `package.json` - Node.js dependencies
- `package-lock.json` - Lock file for dependencies
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `tsconfig.json` - TypeScript configuration

### Frontend (app/)
- `app/layout.tsx` - Root layout
- `app/page.tsx` - Main page
- `app/globals.css` - Global styles
- `app/next-env.d.ts` - Next.js TypeScript definitions
- `app/contract-info.json` - Contract ABI and address
- `app/components/` - All React components
  - `CreateOfferModal.tsx`
  - `NetworkInstructions.tsx`
  - `OfferCard.tsx`
  - `RPCSelector.tsx`
- `app/context/` - React context
  - `AppContext.tsx`
- `app/hooks/` - Custom hooks
  - `useBlockchainProvider.ts`
  - `useContract.ts`
  - `useRPC.ts`
  - `useWallet.ts`
- `app/lib/` - Utility libraries
  - `fheRelayer.ts`
  - `polyfills.ts`
  - `zamaRelayer.ts`

### Smart Contracts (contracts/)
- `contracts/package.json` - Contract dependencies
- `contracts/package-lock.json` - Contract lock file
- `contracts/hardhat.config.js` - Hardhat configuration
- `contracts/env.example` - Contract environment template
- `contracts/contracts/TimeMarketplaceFHE.sol` - Main contract
- `contracts/scripts/deploy-fhe.js` - Deployment script
- `contracts/artifacts/` - Compiled contracts (if needed)
- `contracts/cache/` - Hardhat cache (optional)

### GitHub Actions
- `.github/workflows/ci.yml` - CI/CD pipeline

## Files to Exclude (.gitignore)

### Never Upload
- `.env` - Local environment variables
- `node_modules/` - Dependencies
- `.next/` - Build output
- `contracts/artifacts/` - Compiled contracts (regenerated)
- `contracts/cache/` - Hardhat cache
- `.vercel` - Vercel configuration
- `*.log` - Log files
- `.DS_Store` - macOS files
- `Thumbs.db` - Windows files

## Upload Instructions

1. **Initialize Git Repository**:
   ```bash
   git init
   git add .gitignore
   git add env.example
   git add vercel.json
   git add README.md
   git add DEPLOYMENT.md
   git add package.json
   git add package-lock.json
   git add next.config.js
   git add tailwind.config.js
   git add postcss.config.js
   git add tsconfig.json
   git add app/
   git add contracts/package.json
   git add contracts/package-lock.json
   git add contracts/hardhat.config.js
   git add contracts/env.example
   git add contracts/contracts/
   git add contracts/scripts/
   git add .github/
   ```

2. **Commit and Push**:
   ```bash
   git commit -m "Initial commit: Time Marketplace FHE DApp"
   git remote add origin https://github.com/YOUR_USERNAME/time-marketplace-fhe.git
   git push -u origin main
   ```

## Environment Variables for Vercel

After uploading to GitHub and connecting to Vercel, add these environment variables:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x02D5ADeDf81F3c5Ee3FeBC76736Fe2d6A7124e51
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_FHE_RELAYER_URL=https://relayer.testnet.zama.cloud
NEXT_PUBLIC_FHE_NETWORK=sepolia
```

## Quick Upload Commands

```bash
# Initialize repository
git init

# Add all essential files
git add .gitignore env.example vercel.json README.md DEPLOYMENT.md
git add package.json package-lock.json next.config.js tailwind.config.js postcss.config.js tsconfig.json
git add app/
git add contracts/package.json contracts/package-lock.json contracts/hardhat.config.js
git add contracts/env.example contracts/contracts/ contracts/scripts/
git add .github/

# Commit
git commit -m "Initial commit: Time Marketplace FHE DApp ready for deployment"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/time-marketplace-fhe.git
git branch -M main
git push -u origin main
```

## Verification Checklist

Before uploading, verify:
- ✅ All files compile successfully (`npm run build`)
- ✅ No sensitive data in files (private keys, etc.)
- ✅ Environment variables use NEXT_PUBLIC_ prefix for client-side
- ✅ Contract address is correct in all files
- ✅ README.md has accurate instructions
- ✅ vercel.json has correct configuration
