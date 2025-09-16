# Deployment Guide

This guide will help you deploy the Time Marketplace DApp to Vercel.

## Prerequisites

- GitHub account
- Vercel account
- MetaMask wallet with Sepolia ETH

## Step 1: Prepare GitHub Repository

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**:
   - Go to [GitHub](https://github.com) and create a new repository
   - Name it `time-marketplace-fhe`
   - Make it public

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/time-marketplace-fhe.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**:
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository you just created

3. **Configure Build Settings**:
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Add Environment Variables**:
   In the Vercel dashboard, add these environment variables:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x02D5ADeDf81F3c5Ee3FeBC76736Fe2d6A7124e51
   NEXT_PUBLIC_NETWORK=sepolia
   NEXT_PUBLIC_CHAIN_ID=11155111
   NEXT_PUBLIC_FHE_RELAYER_URL=https://relayer.testnet.zama.cloud
   NEXT_PUBLIC_FHE_NETWORK=sepolia
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for the deployment to complete
   - Your app will be available at `https://your-project.vercel.app`

## Step 3: Configure Custom Domain (Optional)

1. **Add Domain**:
   - Go to your project settings in Vercel
   - Click "Domains"
   - Add your custom domain

2. **Configure DNS**:
   - Add CNAME record pointing to `cname.vercel-dns.com`

## Step 4: Test Deployment

1. **Open Your App**:
   - Visit your deployed URL
   - Connect MetaMask to Sepolia network
   - Test creating and purchasing offers

2. **Verify Features**:
   - ✅ Wallet connection
   - ✅ Offer creation
   - ✅ Offer listing
   - ✅ Offer purchase
   - ✅ Offer deactivation

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation passes
   - Verify environment variables are set

2. **Contract Connection Issues**:
   - Verify contract address is correct
   - Check network configuration
   - Ensure contract is deployed to Sepolia

3. **MetaMask Connection**:
   - Make sure MetaMask is connected to Sepolia
   - Check browser console for errors
   - Verify RPC endpoints are working

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed contract address | `0x02D5ADeDf81F3c5Ee3FeBC76736Fe2d6A7124e51` |
| `NEXT_PUBLIC_NETWORK` | Blockchain network | `sepolia` |
| `NEXT_PUBLIC_CHAIN_ID` | Chain ID | `11155111` |
| `NEXT_PUBLIC_FHE_RELAYER_URL` | FHE relayer endpoint | `https://relayer.testnet.zama.cloud` |
| `NEXT_PUBLIC_FHE_NETWORK` | FHE network | `sepolia` |

## Security Considerations

- Never commit private keys to GitHub
- Use environment variables for sensitive data
- Test thoroughly on testnet before mainnet
- Consider implementing additional security measures

## Monitoring

- Monitor your Vercel dashboard for deployment status
- Check browser console for client-side errors
- Monitor contract interactions on Etherscan
- Set up error tracking (e.g., Sentry)

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure MetaMask is connected to Sepolia
4. Check Vercel deployment logs
5. Review the contract on Etherscan

---

**Happy Deploying! 🚀**
