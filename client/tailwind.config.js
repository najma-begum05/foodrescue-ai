/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#14532d',    // Deep Forest Green
          primary: '#15803d', // Forest Green
          emerald: '#059669', // Vibrant Emerald
          light: '#86efac',   // Soft Lime / Light Mint
          surface: '#F8FAF8', // Crisp Off-white background
        }
      }
    },
  },
  plugins: [],
}
