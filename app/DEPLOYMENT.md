# Deployment Guide

## 🚀 Deploy to Vercel

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `time-marketplace` or any name you prefer
3. Make it public (required for free Vercel deployment)

### Step 2: Upload Code to GitHub

Since Git is not installed locally, you can:

#### Option A: Use GitHub Desktop
1. Download and install [GitHub Desktop](https://desktop.github.com/)
2. Clone your repository
3. Copy all project files to the cloned folder
4. Commit and push changes

#### Option B: Use GitHub Web Interface
1. Go to your repository on GitHub
2. Click "uploading an existing file"
3. Drag and drop all project files
4. Commit changes

#### Option C: Install Git
1. Download Git from [git-scm.com](https://git-scm.com/)
2. Install Git
3. Run these commands:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/time-marketplace.git
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Step 4: Set Environment Variables

In Vercel dashboard, go to Settings > Environment Variables and add:

```
NEXT_PUBLIC_CONTRACT_ADDRESS = 0xe0d337f0357Da1c562cDb609e601FC15F913f271
NEXT_PUBLIC_NETWORK = sepolia
```

**⚠️ Important:** 
- The contract is already deployed and working
- No private keys are needed for the frontend
- Users will connect with their own MetaMask wallets

### Step 5: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be available at `https://your-project-name.vercel.app`

## 🔧 Manual Deployment Files

If you prefer to upload files manually, here are the essential files:

### Required Files:
- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `tsconfig.json` - TypeScript configuration
- `app/` - Next.js app directory
- `contracts/` - Smart contract files
- `contract-info.json` - Contract ABI and address
- `README.md` - Project documentation
- `.gitignore` - Git ignore rules
- `vercel.json` - Vercel configuration

### Optional Files:
- `DEPLOYMENT.md` - This file
- `env.example` - Environment variables example

## 🌐 Live Demo

Once deployed, your app will be available at:
- **Vercel URL**: `https://your-project-name.vercel.app`
- **Contract**: [Sepolia Etherscan](https://sepolia.etherscan.io/address/0xe0d337f0357Da1c562cDb609e601FC15F913f271)

## 🔄 Updates

To update your deployed app:
1. Make changes to your code
2. Commit and push to GitHub
3. Vercel will automatically redeploy

## 📱 Testing

After deployment, test these features:
1. Connect MetaMask wallet
2. Switch to Sepolia network
3. Create a time offer
4. Browse active offers
5. Purchase an offer
6. Manage your offers (deactivate/delete)

## 🆘 Troubleshooting

### Common Issues:

1. **Build Fails**: Check that all dependencies are in `package.json`
2. **Contract Not Found**: Verify contract address in environment variables
3. **MetaMask Connection**: Ensure user is on Sepolia network
4. **RPC Issues**: App will automatically try different RPC providers

### Support:
- Check Vercel deployment logs
- Check browser console for errors
- Verify contract is deployed on Sepolia

---

Your Time Marketplace is now live! 🚀


