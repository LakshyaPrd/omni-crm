import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#07080f",
        surface: "#0d0e1a",
        elevated: "#13152a",
        border: "#1c1f35",
        "border-light": "#252840",
        accent: {
          DEFAULT: "#818cf8",
          dim: "#4f46e5",
          subtle: "#1e1f3a",
        },
        ai: {
          DEFAULT: "#fb923c",
          dim: "#ea580c",
          subtle: "#271a0f",
        },
        success: "#34d399",
        warning: "#fbbf24",
        danger: "#f87171",
        text: {
          primary: "#e2e8f0",
          secondary: "#64748b",
          muted: "#3a3f5c",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        pulseDot: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.3" } },
        shimmer: { from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } },
      },
    },
  },
  plugins: [],
};
export default config;
