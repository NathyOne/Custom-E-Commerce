module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0b0b0b',
        champagne: '#D4AF37',
        'champagne-dark': '#B78E2B',
        nude: '#F4EDE1'
      },
      fontFamily: {
        body: ['Montserrat', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        heading: ['Playfair Display', 'serif']
      }
    },
  },
  plugins: [],
};
