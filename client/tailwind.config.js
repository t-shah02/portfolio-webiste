/** @type {import('tailwindcss').Config} */

const preline = require("./src/preline/plugin");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    preline
  ],

}