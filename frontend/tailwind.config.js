/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0f',
          surface: '#16161e',
          border: '#2a2a3a',
          hover: '#1e1e2e',
        },
        primary: {
          DEFAULT: '#6366f1',
          hover: '#818cf8',
          light: '#a5b4fc',
        },
        accent: {
          pink: '#ec4899',
          green: '#22c55e',
          orange: '#f97316',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
