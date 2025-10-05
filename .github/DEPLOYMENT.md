# CI/CD Pipeline Documentation

## Overview
This project uses GitHub Actions for continuous integration and deployment. The pipeline automatically builds, tests, and deploys the application.

## Workflows

### 1. CI/CD Pipeline (`ci-cd.yml`)
**Triggers:**
- Push to `main` or `master` branch
- Pull requests to `main` or `master` branch

**Jobs:**
- **build-and-test**: Builds the application on Node.js 18.x and 20.x
  - Installs dependencies
  - Runs linter
  - Builds the application
  - Uploads build artifacts

- **deploy**: Deploys to GitHub Pages (only on main/master branch)
  - Builds the production version
  - Deploys to GitHub Pages

### 2. Code Quality Checks (`code-quality.yml`)
**Triggers:**
- Pull requests to `main` or `master` branch

**Jobs:**
- Runs ESLint checks
- Validates code formatting

## Setup Instructions

### Enable GitHub Pages
1. Go to your repository settings
2. Navigate to **Pages** section
3. Under **Source**, select **GitHub Actions**
4. Save the settings

### Environment Variables
No environment variables are required for basic deployment. If you need to add API keys or other secrets:

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Add your secrets (e.g., `API_KEY`, `DATABASE_URL`)
3. Reference them in workflows using `${{ secrets.SECRET_NAME }}`

### Branch Protection (Recommended)
1. Go to **Settings** → **Branches**
2. Add a branch protection rule for `main`/`master`
3. Enable:
   - Require pull request reviews
   - Require status checks to pass before merging
   - Require branches to be up to date before merging

## Deployment URL
After successful deployment, your app will be available at:
```
https://gihozoinnocente.github.io/Give_Life_Web/
```

## Local Testing
To test the production build locally:
```bash
npm run build
npm run preview
```

## Troubleshooting

### Build Fails
- Check the Actions tab for detailed error logs
- Ensure all dependencies are listed in `package.json`
- Verify that the build works locally: `npm run build`

### Deployment Fails
- Ensure GitHub Pages is enabled in repository settings
- Check that the workflow has proper permissions
- Verify the `base` path in `vite.config.js` matches your repository name

### Linting Errors
- Run `npm run lint` locally to see errors
- Fix linting issues before pushing
- Configure ESLint rules in `eslint.config.js` if needed

## Manual Deployment
To manually trigger a deployment:
1. Go to **Actions** tab
2. Select **CI/CD Pipeline** workflow
3. Click **Run workflow**
4. Select the branch and run

## Monitoring
- Check the **Actions** tab for workflow runs
- Review build logs for any warnings or errors
- Monitor deployment status in the **Environments** section
