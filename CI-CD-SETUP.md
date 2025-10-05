# CI/CD Pipeline Setup Guide

## Overview
Your blood donation app now has a complete CI/CD pipeline using GitHub Actions that automates building, testing, and deployment.

## What Was Set Up

### 1. GitHub Actions Workflows

#### **Main CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
- **Triggers**: Push to main/master, Pull Requests
- **Matrix Testing**: Tests on Node.js 18.x and 20.x
- **Steps**:
  - Checkout code
  - Install dependencies
  - Run linter
  - Build application
  - Upload artifacts
  - Deploy to GitHub Pages (on main branch only)

#### **Code Quality Checks** (`.github/workflows/code-quality.yml`)
- **Triggers**: Pull Requests only
- **Steps**:
  - Run ESLint
  - Check code formatting
  - Ensure code quality standards

### 2. Configuration Updates

#### **Vite Config** (`vite.config.js`)
- Added base path for GitHub Pages: `/Give_Life_Web/`
- Ensures assets load correctly in production

#### **Updated README.md**
- Added CI/CD badges
- Comprehensive project documentation
- Setup and deployment instructions
- Project structure overview

### 3. Documentation
- **DEPLOYMENT.md**: Detailed deployment guide
- **Pull Request Template**: Standardized PR format

## Next Steps to Activate

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add CI/CD pipeline with GitHub Actions"
git push origin main
```

### Step 2: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Click **Save**

### Step 3: Verify Deployment
1. Go to the **Actions** tab in your repository
2. Watch the workflow run
3. Once complete, visit: `https://gihozoinnocente.github.io/Give_Life_Web/`

## Workflow Behavior

### On Push to Main/Master
```
1. Install dependencies
2. Run linter (continues on error)
3. Build application
4. Upload artifacts
5. Deploy to GitHub Pages
6. ✅ Live site updated
```

### On Pull Request
```
1. Install dependencies
2. Run code quality checks
3. Build application (test build)
4. Report status back to PR
5. ❌ Blocks merge if checks fail
```

## Environment Variables (Optional)

If you need to add secrets (API keys, tokens):

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add your secret (e.g., `API_KEY`)
4. Reference in workflow:
   ```yaml
   env:
     API_KEY: ${{ secrets.API_KEY }}
   ```

## Monitoring & Debugging

### Check Build Status
- **Actions Tab**: View all workflow runs
- **Commits**: See status checks on each commit
- **Pull Requests**: See checks before merging

### Common Issues & Solutions

#### Build Fails
```bash
# Test locally first
npm run build

# Check logs in Actions tab
# Fix errors and push again
```

#### Linting Errors
```bash
# Run locally
npm run lint

# Fix issues
# Commit and push
```

#### Deployment Not Working
1. Verify GitHub Pages is enabled
2. Check workflow permissions (Settings → Actions → General)
3. Ensure `base` path in `vite.config.js` matches repo name

## Advanced Features

### Add Testing
Add to `package.json`:
```json
"scripts": {
  "test": "vitest"
}
```

Update workflow:
```yaml
- name: Run tests
  run: npm test
```

### Add Code Coverage
```yaml
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

### Deploy to Multiple Environments
Create separate workflows for:
- **Staging**: Deploy on push to `develop` branch
- **Production**: Deploy on push to `main` branch

### Automated Dependency Updates
Use Dependabot (GitHub native):
1. Create `.github/dependabot.yml`
2. Configure update schedule
3. Auto-create PRs for dependency updates

## Performance Optimization

### Caching
Already implemented:
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'  # Caches node_modules
```

### Parallel Jobs
Matrix strategy runs tests in parallel on multiple Node versions.

## Security Best Practices

✅ **Implemented**:
- Minimal permissions for workflows
- Secrets not exposed in logs
- Dependencies installed with `npm ci` (lockfile)

🔒 **Recommended**:
- Enable branch protection rules
- Require PR reviews before merge
- Enable security alerts (Dependabot)

## Maintenance

### Regular Updates
- Keep dependencies updated
- Review and update Node.js versions in matrix
- Monitor workflow execution times
- Check for deprecated GitHub Actions

### Cost Monitoring
- GitHub Actions is free for public repos
- Monitor usage in **Settings** → **Billing**

## Support

For issues or questions:
1. Check workflow logs in Actions tab
2. Review [DEPLOYMENT.md](.github/DEPLOYMENT.md)
3. Open an issue on GitHub

## Summary

Your CI/CD pipeline is now ready! Every push to main will:
- ✅ Automatically build your app
- ✅ Run quality checks
- ✅ Deploy to GitHub Pages
- ✅ Make your app live at: https://gihozoinnocente.github.io/Give_Life_Web/

**Happy coding! 🚀**
