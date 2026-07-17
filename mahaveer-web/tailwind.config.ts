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
        brand: {
          // Figma design tokens (file c0mJUUqcNZPsVA9R4CVksJ, frame 35:1217)
          orange: "#EA580C",
          "orange-light": "#F87853",
          "orange-dark": "#C2410C",
          navy: "#002350",
          "navy-light": "#1A2B3C",
          blue: "#00449A",
          ink: "#262626",
          body: "#525252",
          muted: "#A3A3A3",
          dark: "#0A0A0A",
          light: "#FAFAFA",
          gray: "#F5F5F5",
          cream: "#F5F5F5",
          "cream-dark": "#E5E2E1",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        display: ["var(--font-newsreader)", "Georgia", "serif"],
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
        manrope: ["var(--font-manrope)", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Figma type scale @1920 — fluid up to a 1280px "standard desktop" reference,
        // then flat at the exact Figma px value (previously only hit full size at ~1920px+,
        // which under-sized headings — and broke intended line-wraps — on normal screens).
        "display-xl": ["clamp(3.25rem, 8.125vw, 6.5rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 3.125vw, 2.5rem)", { lineHeight: "1.2", letterSpacing: "-1.6px" }],
        "display-md": ["clamp(1.75rem, 3.125vw, 2.5rem)", { lineHeight: "1.2", letterSpacing: "-1.6px" }],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
