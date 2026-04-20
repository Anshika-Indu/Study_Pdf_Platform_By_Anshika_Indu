/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f0ff',
          100: '#e4e4ff',
          200: '#cdccff',
          300: '#aba8ff',
          400: '#8178ff',
          500: '#6047ff',
          600: '#5028f7',
          700: '#4318e3',
          800: '#3916bf',
          900: '#30159c',
          950: '#1e0a6b',
        },
        accent: {
          cyan:    '#06B6D4',
          emerald: '#10B981',
          amber:   '#F59E0B',
          rose:    '#F43F5E',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6047ff 0%, #06B6D4 100%)',
        'gradient-mesh':  'radial-gradient(at 40% 20%, #6047ff33 0px, transparent 50%), radial-gradient(at 80% 0%, #06B6D433 0px, transparent 50%), radial-gradient(at 0% 50%, #10B98133 0px, transparent 50%)',
      },
      animation: {
        'gradient-shift': 'gradientShift 6s ease infinite',
        'float':          'float 3s ease-in-out infinite',
        'pulse-slow':     'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
