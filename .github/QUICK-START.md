# Quick Start Guide - CI/CD Pipeline

## 🚀 Get Your App Live in 3 Steps

### Step 1: Push Your Code
```bash
git add .
git commit -m "Setup CI/CD pipeline"
git push origin main
```

### Step 2: Enable GitHub Pages
1. Open your repository: https://github.com/gihozoinnocente/Give_Life_Web
2. Go to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Click **Save**

### Step 3: Wait & Visit
1. Go to **Actions** tab
2. Wait for the green checkmark ✅
3. Visit: https://gihozoinnocente.github.io/Give_Life_Web/

## 🎉 That's It!

Your app is now live and will auto-deploy on every push to main!

---

## 📊 CI/CD Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Developer Workflow                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   git push main  │
                    └──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions Trigger                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Checkout Code   │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Setup Node.js   │
                    │  (18.x & 20.x)   │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │Install Dependencies│
                    │    npm ci        │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Run Linter     │
                    │   npm run lint   │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Build App       │
                    │  npm run build   │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │Upload Artifacts  │
                    └──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Deploy to GitHub Pages                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   🎉 LIVE! 🎉   │
                    │  App Deployed    │
                    └──────────────────┘
```

---

## 🔄 Pull Request Flow

```
Developer creates PR
        │
        ▼
Code Quality Checks Run
        │
        ├─→ ESLint ✓
        ├─→ Build Test ✓
        └─→ Format Check ✓
        │
        ▼
All Checks Pass? ──No──→ Fix Issues & Push Again
        │
       Yes
        │
        ▼
Ready to Merge! 🎉
        │
        ▼
Merge to Main
        │
        ▼
Auto-Deploy Triggered
```

---

## 📝 Common Commands

### Local Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
```

### Git Workflow
```bash
git checkout -b feature/my-feature  # Create feature branch
git add .                           # Stage changes
git commit -m "Add feature"         # Commit changes
git push origin feature/my-feature  # Push to GitHub
# Create PR on GitHub
# After merge, main auto-deploys!
```

---

## 🎯 What Happens Automatically

### Every Push to Main
✅ Code is built  
✅ Tests run  
✅ App deploys  
✅ Live site updates  

### Every Pull Request
✅ Code quality checked  
✅ Build tested  
✅ Status reported on PR  

---

## 🛠️ Troubleshooting

### Build Failed?
```bash
# Test locally first
npm run build

# Check the error in Actions tab
# Fix and push again
```

### Can't See Deployment?
1. Check Actions tab for errors
2. Verify GitHub Pages is enabled
3. Wait 2-3 minutes for DNS propagation

### Linting Errors?
```bash
npm run lint
# Fix the errors shown
# Commit and push
```

---

## 📚 More Information

- **Full Setup Guide**: [CI-CD-SETUP.md](../CI-CD-SETUP.md)
- **Deployment Details**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Contributing**: [README.md](../README.md#contributing)

---

## 🎊 Success Checklist

- [ ] Code pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] Workflow completed successfully
- [ ] Site is live and accessible
- [ ] CI/CD badges showing in README

**Congratulations! Your CI/CD pipeline is active! 🚀**
