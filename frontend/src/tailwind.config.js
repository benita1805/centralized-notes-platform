/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  darkMode: 'class', // Optional: use 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        'sunset-retro': 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
      },
      fontFamily: {
      sans: ['Sora', 'sans-serif'],
      arcade: ['"Press Start 2P"', 'cursive'], // optional if using for headings only
      },
    },
      colors: {
        cyanGlow: '#00f0ff',
        magentaGlow: '#ff00c8',
        retroBlack: '#0f0c29',
        retroBlue: '#302b63',
        retroPurple: '#24243e',
      },
      boxShadow: {
        soft: '0 2px 6px rgba(0, 0, 0, 0.1)',
        neon: '0 0 10px #00f0ff, 0 0 20px #ff00c8',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        modalSlideIn: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(-20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-in-out',
        slideIn: 'slideIn 0.4s ease-out',
        pulse: 'pulse 2s infinite',
        modalSlideIn: 'modalSlideIn 0.3s ease-out',
        spin: 'spin 1s linear infinite',
      },
    },
  
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
};
