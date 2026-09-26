/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#eafaf1",
          100: "#c8f0da",
          200: "#94e0b6",
          300: "#5ecb90",
          400: "#34ad6f",
          500: "#1f8f58",
          600: "#177047",
          700: "#14573a",
          800: "#123f2d",
          900: "#0F3D2E",
          950: "#082018",
        },
        lime: {
          400: "#4ADE80",
          500: "#22c55e",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(15, 61, 46, 0.12)",
        card: "0 2px 12px -2px rgba(15, 61, 46, 0.08)",
      },
      backgroundImage: {
        "eco-gradient": "linear-gradient(135deg, #0F3D2E 0%, #177047 50%, #1f8f58 100%)",
        "eco-glow": "radial-gradient(circle at top right, rgba(74,222,128,0.15), transparent 60%)",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(30px, -30px) scale(1.05)" },
        },
        floatSlower: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-40px, 20px) scale(1.08)" },
        },
        float: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(20px, 20px)" },
        },
      },
      animation: {
        "float-slow": "floatSlow 14s ease-in-out infinite",
        "float-slower": "floatSlower 18s ease-in-out infinite",
        float: "float 10s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};