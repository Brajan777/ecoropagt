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
          50: '#F9FAF8',
          100: '#F1F4F0',
          200: '#E2E7E0',
          300: '#CBD4C8',
        },
        // Ahora "lavanda" usa variables dinámicas con la nueva paleta Elegante & Fresca (Azul Océano / Petróleo Editorial por defecto)
        lavanda: {
          50: 'rgb(var(--accent-50) / <alpha-value>)',
          100: 'rgb(var(--accent-100) / <alpha-value>)',
          200: 'rgb(var(--accent-200) / <alpha-value>)',
          300: 'rgb(var(--accent-300) / <alpha-value>)',
          400: 'rgb(var(--accent-400) / <alpha-value>)',
          500: 'rgb(var(--accent-500) / <alpha-value>)',
          600: 'rgb(var(--accent-600) / <alpha-value>)',
          700: 'rgb(var(--accent-700) / <alpha-value>)',
          800: 'rgb(var(--accent-800) / <alpha-value>)',
        },
        // Verde Esmeralda / Eucalipto Fresco de alto contraste
        verde: {
          50: 'rgb(var(--fresh-50) / <alpha-value>)',
          100: 'rgb(var(--fresh-100) / <alpha-value>)',
          200: 'rgb(var(--fresh-200) / <alpha-value>)',
          300: 'rgb(var(--fresh-300) / <alpha-value>)',
          500: 'rgb(var(--fresh-500) / <alpha-value>)',
          600: 'rgb(var(--fresh-600) / <alpha-value>)',
          700: 'rgb(var(--fresh-700) / <alpha-value>)',
          800: 'rgb(var(--fresh-800) / <alpha-value>)',
          900: 'rgb(var(--fresh-900) / <alpha-value>)',
        },
        grafito: {
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
