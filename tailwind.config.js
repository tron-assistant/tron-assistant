/* global module */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      Satoshi12px: ['Satoshi12px'],
      Satoshi14px: ['Satoshi14px', 'Helvetica', 'Arial', 'sans-serif'],
      Satoshi16px: ['Satoshi16px', 'Helvetica', 'Arial', 'sans-serif'],
      Satoshi20px: ['Satoshi20px', 'Helvetica', 'Arial', 'sans-serif'],
      Satoshi24px: ['Satoshi24px', 'Helvetica', 'Arial', 'sans-serif'],
    },
    extend: {
      animation: {
        fadeIn: 'fadeIn 2s ease-in-out',
        translate: 'translateY 1s ease-in-out',
      },
      keyframes: (theme) => ({
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        translateY: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50px)' },
        },
      }),
      transitionProperty: {
        transform: 'transform',
      },
    },
  },
  plugins: [],
};
