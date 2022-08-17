module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        dark: "#242529",
        "dark-lighten": "#3B3C3D",
        primary: "var(--primary-color)",
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
        "fade-in-left": {
          from: { opacity: 0, transform: "translateX(-100%)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        "fade-in-right": {
          from: { opacity: 0, transform: "translateX(100%)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
      },
      animation: {
        "scroll-to-top": "scroll-to-top 0.8s forwards",
        "fade-in": "fade-in 0.8s forwards",
        "fade-in-left": "fade-in-left 0.5s forwards",
        "fade-in-right": "fade-in-right 0.5s forwards",
      },
    },
  },
  plugins: [],
};
