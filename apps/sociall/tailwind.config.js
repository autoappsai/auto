/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors:{
        "text-primary": "#364A68"
      },
      fontFamily: {
        'primaryFont': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

