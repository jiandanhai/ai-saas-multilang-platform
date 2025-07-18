/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // 开启暗黑模式
  theme: {
    extend: {
      colors: {
        brand: "#4F46E5", // 统一主色
        frost: "#F0F4FF",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(90, 98, 192, 0.15)",
      },
      animation: {
        fadein: "fadein 0.25s linear",
        shake: "shake 0.3s cubic-bezier(.36,.07,.19,.97) both",
        pop: "pop 0.2s cubic-bezier(.8,2,.6,1)",
      },
      keyframes: {
        fadein: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
        shake: {
          '10%, 90%': { transform: 'translateX(-1px)' },
          '20%, 80%': { transform: 'translateX(2px)' },
          '30%, 50%, 70%': { transform: 'translateX(-4px)' },
          '40%, 60%': { transform: 'translateX(4px)' }
        },
      },
    },
  },
  plugins: [],
};
