module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6F61',    // Morado
        secondary: '#F3A953',  // Morado-medio
        accent: '#FFABAB',     // Morado claro
        background: '#FFF3E0', // Arena
        alt: '#f6a316',
        alt2: '#f07f11',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        gobold: ['Gobold', 'sans-serif'],
        retro: ['Retro Vintage', 'serif'],
      }
    },
  },
  plugins: [],
}