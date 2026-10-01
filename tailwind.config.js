/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F2F8FF',       // Hubstaff color-6: Soft ice-blue background
        surface: '#DFDFDF',      // Hubstaff color-5: Surface / divider
        brandNavy: '#253053',    // Hubstaff color-1: Primary text & dark accents
        actionBlue: '#0000EE',   // Hubstaff color-2: Primary action blue & active states
        mutedText: '#636B83',    // Hubstaff color-3: Secondary / muted text
        cardBorder: '#C6C6DD',   // Hubstaff color-4: Subtle card border
      },
      fontFamily: {
        sans: ['Poppins', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'sm': '12px',
        'md': '16px',
        'lg': '32px',
      },
      boxShadow: {
        'card': '0 2px 8px -1px rgba(37, 48, 83, 0.05), 0 1px 4px -1px rgba(37, 48, 83, 0.03)',
        'card-hover': '0 8px 24px -4px rgba(37, 48, 83, 0.08)',
        'modal': '0 20px 40px -15px rgba(37, 48, 83, 0.15)',
      }
    },
  },
  plugins: [],
}
