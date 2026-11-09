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
          900: "#0A1D30",
          800: "#102A43",
          700: "#1A3E61",
          600: "#275482",
          100: "#E2EAF1",
          50: "#F0F4F8",
        },
        solar: {
          green: "#16803C",
          "green-hover": "#126730",
          "green-light": "#EAF5ED",
          yellow: "#F6C453",
          "yellow-hover": "#E5B23E",
          "yellow-light": "#FEF8E7",
        },
        slate: {
          muted: "#667085",
          border: "#E4E7EC",
          bg: "#F9FAFB",
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
