# Glance

Your intelligent email companion built with React, TypeScript, and Vite.

## Features

- 🔥 **React 19** with TypeScript for type-safe development
- ⚡ **Vite** for lightning-fast HMR and optimized builds
- 🎨 **Tailwind CSS v4** for modern styling
- 🧩 **shadcn/ui** for beautiful, accessible components
- 🔒 **Firebase** for authentication and database
- 🧪 **Vitest + React Testing Library** for comprehensive testing
- 📦 **ESLint + Prettier** with pre-commit hooks for code quality

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project (see [Setup Firebase](#setup-firebase))

### Installation

```bash
# Clone the repository
git clone https://github.com/{username}/glance.git
cd glance

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your Firebase credentials to .env
```

### Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → Email/Password provider
4. Enable **Firestore Database** → Start in test mode
5. Go to Project Settings → Add Web App
6. Copy the Firebase config to your `.env` file

### Development

```bash
# Start dev server (http://localhost:5173)
npm run dev

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Type-check
npm run type-check

# Lint and format
npm run lint
npm run format
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Deploy to Vercel

1. **Push to GitHub** (if not already done):

   ```bash
   # Create GitHub repo (using GitHub CLI)
   gh repo create glance --public --source=. --remote=origin

   # Or manually:
   git remote add origin https://github.com/{username}/glance.git
   git branch -M main
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings from `vercel.json`

3. **Add Environment Variables** in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all `VITE_*` variables from your `.env` file
   - Set them for Production, Preview, and Development

4. **Deploy**:
   - Click "Deploy" button
   - Every push to `main` will auto-deploy
   - Pull requests get preview deployments automatically

### vercel.json Configuration

The `vercel.json` file ensures SPA routing works correctly:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

This prevents 404 errors when navigating directly to routes like `/dashboard`.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
