/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A0A09",
          panel: "#141412",
          raised: "#1C1C1A",
          border: "#2E2E2B",
          hover: "#252523",
          muted: "#9E9E9E",
          subtle: "#6B6B68",
        },
        primary: {
          50: "#fff1f0",
          100: "#ffe0de",
          200: "#ffc5c0",
          300: "#ffa89f",
          400: "#ff6b5b",
          500: "#E8453C",
          600: "#C9332A",
          700: "#A62822",
          800: "#852019",
          900: "#5C1510",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Bebas Neue", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        beat: "0 8px 32px rgba(0, 0, 0, 0.55)",
      },
    },
  },
  plugins: [],
};
