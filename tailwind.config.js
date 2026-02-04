/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#050E3C",
        secondary: "#002455",
        accent: "#DC0000",
        accent50: "#FF5555",
      },
      fontFamily: {
        rhregular: ["Rhodium-Regular", "sans-serif"],
        nunmedium: ["Nunito-Medium", "sans-serif"],
        nunbold: ["Nunito-Bold", "sans-serif"],
        nunlight: ["Nunito-Light", "sans-serif"],
        metroregular: ["Metrophobic-Regular", "sans-serif"],
      }
    },
  },
  plugins: [],
}