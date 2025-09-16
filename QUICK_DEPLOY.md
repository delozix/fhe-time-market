# Quick Deploy Guide 🚀

## Step 1: Upload to GitHub

1. **Create GitHub Repository**:
   - Go to [GitHub](https://github.com/new)
   - Name: `time-marketplace-fhe`
   - Make it public
   - Don't initialize with README

2. **Upload Files**:
   ```bash
   git init
   git add .gitignore env.example vercel.json README.md DEPLOYMENT.md package.json package-lock.json next.config.js tailwind.config.js postcss.config.js tsconfig.json app/ contracts/package.json contracts/package-lock.json contracts/hardhat.config.js contracts/env.example contracts/contracts/ contracts/scripts/ .github/
   git commit -m "Initial commit: Time Marketplace FHE DApp"
   git remote add origin https://github.com/YOUR_USERNAME/time-marketplace-fhe.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. **Go to Vercel**: [vercel.com](https://vercel.com)

2. **Import Project**:
   - Click "New Project"
   - Import from GitHub
   - Select your repository

3. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x02D5ADeDf81F3c5Ee3FeBC76736Fe2d6A7124e51
   NEXT_PUBLIC_NETWORK=sepolia
   NEXT_PUBLIC_CHAIN_ID=11155111
   NEXT_PUBLIC_FHE_RELAYER_URL=https://relayer.testnet.zama.cloud
   NEXT_PUBLIC_FHE_NETWORK=sepolia
   ```

4. **Deploy**: Click "Deploy"

## Step 3: Test Your App

1. **Open Your App**: Visit the Vercel URL
2. **Connect MetaMask**: Make sure it's on Sepolia network
3. **Test Features**:
   - ✅ Connect wallet
   - ✅ Create offer
   - ✅ View offers
   - ✅ Purchase offer
   - ✅ Deactivate offer

## That's It! 🎉

Your FHE-powered Time Marketplace is now live on the internet!

**Live Demo**: `https://your-project.vercel.app`

---

**Need Help?** Check `DEPLOYMENT.md` for detailed instructions.
