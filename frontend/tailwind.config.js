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
        fadein: "fadein 0.4s ease-in",
      },
      keyframes: {
        fadein: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      colors: {
        brand: "#234be7",
        "brand-dark": "#1b338b",
      }
    },
  },
  plugins: [],
};
