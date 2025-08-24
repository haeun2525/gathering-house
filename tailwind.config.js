/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'mobile': {'max': '430px'},
        'tablet': {'min': '431px', 'max': '1024px'},
        'desktop': {'min': '1025px'},
      },
      colors: {
        primary: '#FF8C42',
        secondary: '#FF6B35',
        accent: '#2B1E16',
        orange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDB574',
          400: '#FF8C42',
          500: '#FF6B35',
          600: '#E55A2B',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        brown: {
          900: '#2B1E16',
        },
        blue: {
          500: '#2A66F5',
        },
        pink: {
          500: '#E54B8A',
        },
        gray: {
          50: '#F7F7F7',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#1A1A1A',
        }
      },
      spacing: {
        '18': '4.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'cinematic': ['4rem', { lineHeight: '1.0', fontWeight: '900' }],
        'venue': ['1.125rem', { lineHeight: '1.4', fontWeight: '700' }],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      }
    },
  },
  plugins: [],
};