/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.{js,jsx,ts,tsx}","./app/**/*.{js,jsx,ts,tsx}" , "./components/**/*.{js,jsx,ts,tsx}","./assets/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#678a1d", // Your custom primary color
      },
      fontFamily:{
        OutfitRegular:["Outfit-Regular","sans-serif"],
        OutfitMedium:["Outfit-Medium","sans-serif"],
        OutfitBold:["Outfit-Bold","sans-serif"],
      },
    },
  },
  plugins: [],
};