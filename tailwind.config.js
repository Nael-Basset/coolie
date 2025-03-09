/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./index.html"
  ],
  darkMode: 'class', // Active le dark mode basé sur une classe
  theme: {
    extend: {
      colors: {
        'background': '#ffffff', // Light sand/parchment background
        'background-darker': '#f5f5f5', // Slightly darker beige for containers
        'green-primary': '#558B2F', // Medium-dark olive/forest green
        'orange-secondary': '#FFB300', // Warm amber/mustard orange
        'text-dark': '#333333', // Dark gray for text
        'text-light': '#666666', // Lighter gray for secondary text
      },
      fontFamily: {
        'logo': ['Quicksand', 'sans-serif'], // Playful, rounded font for logo
        'header': ['Montserrat', 'sans-serif'], // Clean sans-serif for headers
        'body': ['Roboto', 'sans-serif'], // Clean sans-serif for body text
      },
      borderRadius: {
        'card': '0.75rem', // Rounded corners for cards
        'button': '0.5rem', // Rounded corners for buttons
      },
      boxShadow: {
        'card': '0 3px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for cards
        'button': '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for buttons
      },
      height: {
        'screen-without-nav': 'calc(100vh - 70px)',
      }
    },
  },
  plugins: [],
}
