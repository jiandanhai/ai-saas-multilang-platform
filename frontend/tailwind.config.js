// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        brand: '#7b47ff', // 品牌主色，可换
        'brand-light': '#ede9fe',
        'brand-dark': '#512da8',
        'frost': 'rgba(255,255,255,0.75)',
      },
      boxShadow: {
        glass: '0 4px 32px 0 rgba(123,71,255,.12), 0 1.5px 6px 0 rgba(0,0,0,.06)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #7b47ff 0%, #6ae3ff 100%)',
      },
    },
  },
  plugins: [],
}
