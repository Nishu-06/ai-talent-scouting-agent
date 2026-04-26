/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08111f",
        mist: "#d8e9ff",
        accent: "#6ee7b7",
        brand: "#7dd3fc",
        warning: "#fbbf24",
      },
      boxShadow: {
        soft: "0 30px 80px rgba(8, 17, 31, 0.28)",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(125, 211, 252, 0.12) 1px, transparent 0)",
      },
      fontFamily: {
        sans: ["'Segoe UI'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
