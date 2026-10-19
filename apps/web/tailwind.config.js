/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        unc: {
          blue: '#002A54',
          gold: '#F6B000',
        }
      }
    },
  },
  plugins: [],
}
