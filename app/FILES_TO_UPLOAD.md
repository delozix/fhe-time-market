# Files to Upload to GitHub

## ✅ Safe to Upload (Required Files)

### Root Directory
- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `tsconfig.json` - TypeScript configuration
- `next-env.d.ts` - Next.js TypeScript definitions
- `vercel.json` - Vercel deployment configuration
- `README.md` - Project documentation
- `DEPLOYMENT.md` - Deployment instructions
- `LOCAL_DEVELOPMENT.md` - Local development guide
- `FILES_TO_UPLOAD.md` - This file
- `.gitignore` - Git ignore rules
- `env.example` - Environment variables example

### App Directory
- `app/` - Complete Next.js app directory
  - `components/` - All React components
  - `hooks/` - Custom React hooks
  - `lib/` - Utility libraries
  - `globals.css` - Global styles
  - `layout.tsx` - Root layout
  - `page.tsx` - Main page

### Contracts Directory
- `contracts/contracts/TimeMarketplace.sol` - Smart contract source
- `contracts/scripts/deploy.js` - Deployment script
- `contracts/test/TimeMarketplace.test.js` - Contract tests
- `contracts/hardhat.config.js` - Hardhat configuration
- `contracts/package.json` - Contract dependencies
- `contracts/env.example` - Environment variables example

### Contract Artifacts (Optional)
- `contracts/artifacts/` - Compiled contract artifacts
- `contracts/cache/` - Hardhat cache

### Contract Info
- `contract-info.json` - Contract ABI and address

## ❌ Do NOT Upload (Excluded by .gitignore)

- `node_modules/` - Dependencies (will be installed via npm)
- `.next/` - Next.js build output
- `.env` - Environment variables (contains sensitive data)
- `.env.local` - Local environment variables
- `contracts/.env` - Contract environment variables

## 🚀 Upload Instructions

### Method 1: GitHub Web Interface
1. Go to your GitHub repository
2. Click "uploading an existing file"
3. Drag and drop all files from the "Safe to Upload" list
4. Commit changes

### Method 2: Git Command Line
```bash
git add .
git commit -m "Initial commit: Time Marketplace with FHE"
git push origin main
```

## ✅ Verification

After upload, verify:
- [ ] No private keys in any files
- [ ] All source code is included
- [ ] Documentation is complete
- [ ] Contract address is correct
- [ ] Environment examples are provided

---

**Total files to upload: ~50 files**
**Estimated size: ~2-3 MB (excluding node_modules)**


