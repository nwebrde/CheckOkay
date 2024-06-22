// @ts-check

const { theme } = require('app/design/tailwind/theme')

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./App.tsx', './app/**/*.{js,jsx,ts,tsx}', '../../packages/**/*.{js,jsx,ts,tsx}'],
  presets: [require("nativewind/preset")],
  darkMode: ['class'],
  theme: {
    ...theme,
  },
  plugins: [],
}
