/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      width: {
        'app': '390px',
      },
      maxWidth: {
        'app': '390px',
      },
      colors: {
        'primary-blue': '#4285f4', // Adjust this to match your branding blue color from the image
      },
    },
  },
  plugins: [],
}

