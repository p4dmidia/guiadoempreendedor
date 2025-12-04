/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/react-app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#013855',
        cta: '#ee5100',
        secondary: '#061a2b',
        accent: '#4ca4e9',
        body: '#f8f8f8',
        text: {
          light: '#1e293b',
          dark: '#ffffff',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
