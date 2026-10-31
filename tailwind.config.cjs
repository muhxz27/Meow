/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F8F7FB',
        ink: '#17141F',
        accent: {
          DEFAULT: '#5B3DF5',
          deep: '#3E26C9',
          soft: '#EEEAFE',
        },
        moss: '#12866B',
        amber: '#B7791F',
        rose: '#B4433C',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'Cambria', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(23, 20, 31, 0.04), 0 18px 40px -24px rgba(23, 20, 31, 0.28)',
        lift: '0 2px 4px rgba(23, 20, 31, 0.04), 0 30px 60px -30px rgba(23, 20, 31, 0.35)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
