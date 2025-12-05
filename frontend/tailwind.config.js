/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Montreal"', "sans-serif"],   // main font
        serif: ['"Playfair Display"', "serif"], // optional for luxury headings
      },
      colors: {
        cream: "#f9f6f1",
        gold: "#d4af37",
        dark: "#111",
      },
      fontWeight: {
        regular: 400,
        bold: 700,
      }
    },
  },
  plugins: [],
};
