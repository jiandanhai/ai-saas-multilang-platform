/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
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
        pop: "pop 0.2s cubic-bezier(.8,2,.6,1)",
      },
      keyframes: {
        fadein: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
      shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' }
        },
      },
    },
  },
  plugins: [],
};
