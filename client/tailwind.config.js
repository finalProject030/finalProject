/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "share-tech": ['"Share Tech"', "sans-serif"],
      },
      colors: {
        "regal-blue": "#243c5a",
        gray: "#D1D5DB", // Example of a custom gray color
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(-150deg, #222222 15%, #373737 70%, #3c4859 94%)",
      },
      colors: {
        white: "#ffffff",
      },
      animation: {
        fadeIn: "fadeIn 1s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
