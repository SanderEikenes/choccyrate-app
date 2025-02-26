/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FFECB3",
        secondary: {
          DEFAULT: "#793510",
        },
        button: {
          DEFAULT: "#d97706",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
      },
      fontFamily: {
        abold: ["Atma-Bold", "sans-serif"],
        amedium: ["Atma-Medium", "sans-serif"],
        aregular: ["Atma-Regular", "sans-serif"],
        alight: ["Atma-Light", "sans-serif"],
        asemibold: ["Atma-SemiBold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
