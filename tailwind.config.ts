import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      animation: {
        envelope: "moveEnvelope 3s forwards",
        checkmark: "fadeInCheckmark 1s ease forwards",
      },
      keyframes: {
        moveEnvelope: {
          "0%": {
            transform: "translateY(0) translateX(0)",
            opacity: "1",
          },
          "100%": {
            transform: "translateY(-100vh) translateX(100vw)",
            opacity: "0",
          },
        },
        fadeInCheckmark: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
