/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#FAF7F2',
          100: '#F3EDE2',
          200: '#E6DEC8',
          300: '#D5C7A9'
        },
        lavanda: {
          50: '#F5F2FA',
          100: '#EBE4F5',
          200: '#D8C9EC',
          400: '#A58AD1',
          500: '#8B6BBF',
          600: '#7251A8',
          700: '#5B3E8A'
        },
        verde: {
          50: '#F1F8F4',
          100: '#DEF0E6',
          200: '#BFE2CF',
          300: '#98CFB2',
          500: '#5DA683',
          600: '#458968',
          700: '#356C52'
        },
        grafito: {
          700: '#4A4552',
          800: '#322E38',
          900: '#1F1C24'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
