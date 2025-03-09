/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Active le dark mode basé sur une classe
  theme: {
    extend: {
      colors: {
        'background': '#FAF0E6', // Light sand/parchment background
        'background-darker': '#F5EEDC', // Slightly darker beige for containers
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
        'card': '15px', // Rounded corners for cards
        'button': '10px', // Rounded corners for buttons
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.05)', // Subtle shadow for cards
        'button': '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for buttons
      }
    },
  },
  plugins: [],
}
