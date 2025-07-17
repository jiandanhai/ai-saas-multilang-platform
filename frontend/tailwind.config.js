/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#5B73FF",
        frost: "#F0F4FF",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(90, 98, 192, 0.15)",
      },
      animation: {
        fadein: "fadein 0.7s cubic-bezier(.39,.575,.565,1) both",
      },
      keyframes: {
        fadein: {
          '0%': { opacity: 0, transform: "translateY(16px)" },
          '100%': { opacity: 1, transform: "translateY(0)" }
        },
      },
    },
  },
  plugins: [],
};
