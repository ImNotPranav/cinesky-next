/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Ubuntu', "Arial", "serif"],
        rye: ["Rye", "cursive"],
        cinzel: ['"Cinzel Decorative"', "serif"],
      },
    },
  },
  plugins: [],
};

