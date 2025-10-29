/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // BeSimple AI Brand Colors
        primary: {
          50: '#fef8ec',
          100: '#fceeca',
          200: '#fad98f',
          300: '#f8c154',
          400: '#f6aa2b',
          500: '#eda436', // Main brand color (logo tomato)
          600: '#d17d1f',
          700: '#ad5c19',
          800: '#8d491a',
          900: '#743d18',
          950: '#421e09',
        },
        secondary: {
          50: '#f4f7f2',
          100: '#e5ede1',
          200: '#ccdcc4',
          300: '#a7c39a',
          400: '#7fa66d',
          500: '#5f8f4f', // Main brand color (logo leaves)
          600: '#4a703d',
          700: '#3b5832',
          800: '#31462a',
          900: '#293b24',
          950: '#142012',
        },
      },
    },
  },
  plugins: [],
}
