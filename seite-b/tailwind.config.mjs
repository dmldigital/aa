/** @type {import('tailwindcss').Config} */
// Farb- und Bewegungswerte sind zusätzlich als CSS-Variablen in src/styles/global.css hinterlegt.
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        // Eine Schrift für alles: Schibsted Grotesk
        sans: ['"Schibsted Grotesk"', 'system-ui', 'sans-serif'],
        heading: ['"Schibsted Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Schibsted Grotesk"', 'system-ui', 'sans-serif'],
      },
      colors: {
        weber: {
          red: '#c4271c',       // Weber-Rot (Primär-Buttons, feine Akzente)
          darkred: '#a71f15',   // Hover
          vibrant: '#c4271c',   // vereinheitlicht mit weber.red
          light: '#e5675c',     // Rot für kleine Texte auf dunklem Grund
          gray: '#acabab',
          darkgray: '#808080',
        },
        ink: {
          DEFAULT: '#15171a',   // Anthrazit tief
          2: '#1d2024',         // Anthrazit Fläche 2
        },
        paper: '#f4f2ee',       // warmes Papier
        stone: '#e7e3dc',       // Stein
        text: '#1a1b1e',
        muted: '#5c6067',
        hairline: 'rgba(20, 22, 26, 0.10)',
        'hairline-dark': 'rgba(255, 255, 255, 0.12)',
        theme: {
          dark: '#15171a',
          surface: '#1d2024',
          card: '#1d2024',
          muted: '#5c6067',
          border: 'rgba(255, 255, 255, 0.12)',
          'border-dark': 'rgba(20, 22, 26, 0.10)',
        },
      },
      transitionTimingFunction: {
        mw: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      maxWidth: {
        container: '1440px',
      },
    },
  },
  plugins: [],
};
