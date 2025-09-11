const { heroui } = require('@heroui/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        tajawal: ['var(--font-tajawal)'],
      },
      colors: {
        grayBg: '#EEF0F2',
      },
    },
  },
  darkMode: false,
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#4B99E9',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            DEFAULT: '#4B99E9',
            foreground: '#ffffff',
          },
        },
      },
    },
  })],
};