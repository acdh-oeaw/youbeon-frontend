const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./index.html', './src/**/*.@(css|ts|vue)'],
  theme: {
    colors: {
      neutral: { 0: colors.white, ...colors.slate, 1000: colors.black },
      primary: colors.slate,
      accent: colors.slate,
      nprogress: colors.slate[700],
      brand: {
        cyan: 'hsl(175.9deg 38.6% 77.6%)',
        red: 'hsl(1.8deg 71.3% 63.1%)',
        yellow: 'hsl(47deg 77.8% 59.4%)',
        'cyan-tint': 'hsl(175.9deg 38.6% 92%)',
        'red-tint': 'hsl(1.8deg 71.3% 92%)',
        'yellow-tint': 'hsl(47deg 77.8% 92%)',
      },
      background: colors.neutral[50],
      text: colors.neutral[900],
    },
    extend: {
      fontFamily: {
        display: [
          'Chicago',
          'Noto Sans DisplayVariable',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        sans: ['Noto Sans DisplayVariable', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      screens: {
        xxs: '360px',
        xs: '480px',
      },
      zIndex: {
        dialog: '100',
        elevated: '1',
        nprogress: '50',
        overlay: '200',
      },
    },
  },
  plugins: [require('@headlessui/tailwindcss')],
}

module.exports = config
