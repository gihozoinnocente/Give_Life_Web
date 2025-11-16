# Give Life Web - Blood Donation App

[![CI/CD Pipeline](https://github.com/gihozoinnocente/Give_Life_Web/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/gihozoinnocente/Give_Life_Web/actions/workflows/ci-cd.yml)
[![Code Quality](https://github.com/gihozoinnocente/Give_Life_Web/actions/workflows/code-quality.yml/badge.svg)](https://github.com/gihozoinnocente/Give_Life_Web/actions/workflows/code-quality.yml)

A modern web application for blood donation management built with React, Vite, and Tailwind CSS.

## Figma Design 
Link to the Figma Design: https://www.figma.com/design/E5HbiRdTzTFKeVkljfTHyj/Give-Life?node-id=0-1&p=f&m=draw

## Live Demo
Visit the live application: [https://gihozoinnocente.github.io/Give_Life_Web/](https://gihozoinnocente.github.io/Give_Life_Web/)

## Link To Api Repository
Link to API Repository: https://github.com/gihozoinnocente/Give_Life_API

## Link To API Swagger Documentation
Visit the live application - Swagger Documentation: https://givelifeapi.up.railway.app/api-docs/

## Features
- User-friendly blood donation registration
- Find nearby donation centers
- Track donation history
- Responsive design with Tailwind CSS
- Modern UI with Lucide icons

## Tech Stack
- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 4.1.14
- **State Management**: Redux Toolkit 2.9.0
- **Icons**: Lucide React
- **CI/CD**: GitHub Actions

## Installation

### Prerequisites
- Node.js 18.x or 20.x
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/gihozoinnocente/Give_Life_Web.git
cd Give_Life_Web

# Install dependencies
npm install

# Start development server
npm run dev
```
## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```
## Deployment

This project uses GitHub Actions for automated CI/CD. Every push to the `main` branch triggers:
1. Dependency installation
2. Linting checks
3. Production build
4. Deployment to GitHub Pages

For detailed deployment documentation, see [.github/DEPLOYMENT.md](.github/DEPLOYMENT.md)

## Project Structure
```
blood-donation-app-web/
├── .github/
│   └── workflows/          # CI/CD workflows
├── public/                 # Static assets
├── src/
│   ├── app/               # Redux store configuration
│   ├── components/        # Reusable components
│   ├── features/          # Feature-specific code
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── package.json           # Dependencies and scripts
```

## License

This project is open source and available under the MIT License.

## Collaborators
- RBC (Rwanda Biomedical Center)
- Ministry of Health in Rwanda
- African Union

## Contact
For questions or support, please open an issue on GitHub.
