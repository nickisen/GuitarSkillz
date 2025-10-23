module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:astro/recommended',
    'plugin:jsx-a11y/recommended', // Für Accessibility in React
    'prettier', // Deaktiviert ESLint-Regeln, die mit Prettier in Konflikt stehen
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  // Überschreibt Regeln für Astro-Dateien
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        // Hier Astro-spezifische Regeln
      },
    },
    {
      // Stellt sicher, dass TSX-Dateien (React) korrekt geparst werden
      files: ['*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
      ],
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        'react/react-in-jsx-scope': 'off', // Nicht nötig mit neuem JSX-Transform
        'react/prop-types': 'off', // Wir verwenden TypeScript
      },
    }
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};