/** @type {import('tailwindcss').Config} */
const { theme } = require('app/design/tailwind/theme')

module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    '../../packages/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  important: 'html',
  darkMode: ['class'],
  theme: {
    ...theme,
  },
}
