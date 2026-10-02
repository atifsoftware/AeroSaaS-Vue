/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './resources/js/**/*.{js,ts,jsx,tsx,vue}',
    './server.ts'
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F17',
        surface: {
          DEFAULT: '#111827',
          hover: '#1F2937',
          border: '#374151'
        },
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
        accent: {
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          sky: '#0EA5E9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(99, 102, 241, 0.4)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
      }
    },
  },
  plugins: [],
}
