/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#02040A',
          800: '#090D1A',
          700: '#111827',
          600: '#1F2937',
        },
        primary: {
          violet: '#8B5CF6',
          cyan: '#06B6D4',
          emerald: '#10B981',
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'drift': 'drift 20s linear infinite',
        'drift-reverse': 'drift-reverse 25s linear infinite',
        'wave-slow': 'wave 15s linear infinite',
        'wave-fast': 'wave 8s linear infinite',
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '50%': { transform: 'translate(100px, 80px) rotate(180deg)' },
          '100%': { transform: 'translate(0px, 0px) rotate(360deg)' },
        },
        'drift-reverse': {
          '0%': { transform: 'translate(0px, 0px) rotate(360deg)' },
          '50%': { transform: 'translate(-80px, -100px) rotate(180deg)' },
          '100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
        },
        wave: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-25%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      boxShadow: {
        'glass-sm': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glass-md': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-lg': '0 10px 40px 0 rgba(0, 0, 0, 0.5)',
        'glow-violet': '0 0 20px 2px rgba(139, 92, 246, 0.3)',
        'glow-cyan': '0 0 20px 2px rgba(6, 182, 212, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
