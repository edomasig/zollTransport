// This file enables TailwindCSS in your Next.js project
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // Indigo-600
          light: '#3b82f6', // Indigo-500
          dark: '#1d4ed8',  // Indigo-700
        },
        secondary: {
          DEFAULT: '#10b981', // Emerald-500
          light: '#34d399', // Emerald-400
          dark: '#059669',  // Emerald-600
        },
        accent: {
          DEFAULT: '#f59e0b', // Amber-500
          light: '#fbbf24', // Amber-400
          dark: '#d97706',  // Amber-600
        },
        neutral: {
          light: '#f3f4f6', // Gray-100
          DEFAULT: '#e5e7eb', // Gray-200
          dark: '#6b7280',  // Gray-500
          darker: '#1f2937', // Gray-800
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
