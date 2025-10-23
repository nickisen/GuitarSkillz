/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        // Definiere das Primär-Akzentrot
        primary: {
          DEFAULT: '#E63946',
          dark: '#D62828',
        },
        // Definiere neutrale Farben
        dark: {
          900: '#1D3557',
          700: '#457B9D',
        },
        light: {
          100: '#F1FAEE',
          300: '#A8DADC',
        },
      },
      fontFamily: {
        // Monospace für Tabs
        mono: ['"Source Code Pro"', 'Menlo', 'monospace'],
        // Sans-Serif für UI
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};