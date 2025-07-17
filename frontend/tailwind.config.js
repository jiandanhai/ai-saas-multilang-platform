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
        fadein: "fadeIn 0.5s ease",
      },
      keyframes: {
        fadein: {
          from: { opacity: 0 }, to: { opacity: 1 }
        },
      },
    },
  },
  plugins: [],
};
