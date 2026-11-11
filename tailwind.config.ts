import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#081A2A",
          900: "#0B2338",
          800: "#102D48",
          700: "#183F62",
          600: "#244F76",
          100: "#E2E8E5",
          50: "#F7F8F5",
        },
        solar: {
          green: "#278463",
          "green-hover": "#1C664C",
          "green-light": "#EAF3EF",
          yellow: "#D7A84B",
          gold: "#D7A84B",
          "yellow-hover": "#B88B32",
          "yellow-light": "#FBF5E8",
        },
        slate: {
          main: "#263743",
          muted: "#667681",
          border: "#E2E8E5",
          bg: "#F7F8F5",
        },
        vps: {
          nav: "#FFFFFF",
          heading: "#102D48",
          dark: "#102D48",
          footer: "#0B2338",
          cta: "#278463",
          "cta-hover": "#1C664C",
          "section-bg": "#F7F8F5",
          card: "#FFFFFF",
          text: "#263743",
          "text-secondary": "#667681",
          border: "#E2E8E5",
          gold: "#D7A84B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-manrope)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
