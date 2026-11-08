import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        cream: "#F3EBDD",
        ink: "#111111",
        gold: {
          DEFAULT: "#B8975A",
          dark: "#8C7344",
          ink: "#5A431C",
        },
        ivory: "#FBF7F2",
      },
      borderRadius: {
        card: "0.75rem",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        arabic: ["var(--font-cairo)", "system-ui", "sans-serif"],
      },
    },
  },
};

export default config;
