import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#10b981",
          foreground: "#0b1b13",
        },
      },
      boxShadow: {
        card: "0 20px 45px -20px rgba(16, 185, 129, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;


