/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Schibsted Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        weber: {
          red: '#e41e13',          // EXACT Weber Logo Red sampled from schriftzug.png & Button.png
          darkred: '#c51910',      // Weber Deep Red for hover
          vibrant: '#ff2d20',      // Weber Accent Red
          gray: '#acabab',         // Weber Betongrau hell
          darkgray: '#808080',     // Weber Betongrau dunkel
        },
        theme: {
          dark: '#111111',
          surface: '#1d1d1d',
          card: '#222222',
          muted: '#565656',
          border: 'rgba(255, 255, 255, 0.15)',
          'border-dark': 'rgba(17, 17, 17, 0.1)',
        }
      },
      maxWidth: {
        container: '1440px',
      }
    },
  },
  plugins: [],
};
