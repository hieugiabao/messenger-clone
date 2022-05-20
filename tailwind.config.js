module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        dark: "#242529",
        "dark-lighten": "#3B3C3D",
        primary: "var(--primary-color)",
      },
    },
    keyframes: {
      "fade-in": {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      "scroll-to-top": {
        from: { transform: "translate(0px, 0px)" },
        to: { transform: "translate(-400px, -300px) scale(0.35)" },
      },
    },
    animation: {
      "scroll-to-top": "scroll-to-top 0.8s forwards",
      "fade-in": "fade-in 0.8s forwards",
    },
  },
  plugins: [],
};
