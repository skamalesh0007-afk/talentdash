/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coral: '#FF5A5F',
        'td-black': '#222222',
        'td-dark': '#484848',
        'td-muted': '#717171',
        'td-border': '#EBEBEB',
        'td-hover': '#F2F2F2',
        'td-bg': '#F7F7F7',
        'td-success': '#008A05',
        'td-warning': '#FFB400',
        'td-error': '#D93025',
        'data-blue': '#0369A1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
