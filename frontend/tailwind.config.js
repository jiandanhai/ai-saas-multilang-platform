// tailwind.config.js 极致UI动画渐变阴影扩展

module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#6366f1', // 统一品牌主色
        frost: '#e0e7ef',
      },
      boxShadow: {
        glass: '0 8px 40px 0 rgba(99,102,241,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.07)',
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '2rem',
      },
      animation: {
        fadein: 'fadein 1s cubic-bezier(.4,0,.2,1)',
        popin: 'popin .4s cubic-bezier(.43,.38,.38,1)',
        shake: 'shake .4s cubic-bezier(.36,.07,.19,.97)',
      },
      keyframes: {
        fadein: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        popin: {
          from: { opacity: 0, transform: 'scale(.85)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%,60%': { transform: 'translateX(-10px)' },
          '40%,80%': { transform: 'translateX(10px)' },
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(120deg, #6366f1 0%, #3b82f6 100%)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
