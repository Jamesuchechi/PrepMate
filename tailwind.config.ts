import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#0F172A", // Dark Navy
          foreground: "#F8FAFC",
        },
        accent: {
          DEFAULT: "#38BDF8", // Electric Blue
          foreground: "#0F172A",
        },
      },
    },
  },
  plugins: [],
};
export default config;
