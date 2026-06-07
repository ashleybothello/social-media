import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background:   "hsl(var(--background))",
        foreground:   "hsl(var(--foreground))",
        card:         { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover:      { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary:      { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary:    { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted:        { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent:       { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive:  { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border:       "hsl(var(--border))",
        input:        "hsl(var(--input))",
        ring:         "hsl(var(--ring))",
        // Brand colors
        brand: {
          50:  "#f0eeff",
          100: "#e4e0ff",
          200: "#ccc5ff",
          300: "#aa9dff",
          400: "#8b76ff",
          500: "#7c6ef5",
          600: "#6d54eb",
          700: "#5c3fd1",
          800: "#4c35ab",
          900: "#402f88",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },
      backgroundImage: {
        "gradient-brand":   "linear-gradient(135deg, #7c6ef5 0%, #a855f7 100%)",
        "gradient-surface": "linear-gradient(180deg, rgba(124,110,245,0.05) 0%, transparent 100%)",
        "gradient-hero":    "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(124,110,245,0.25), transparent)",
      },
      boxShadow: {
        "brand-sm": "0 0 0 1px rgba(124,110,245,0.2), 0 2px 4px rgba(0,0,0,0.3)",
        "brand-md": "0 0 0 1px rgba(124,110,245,0.3), 0 4px 16px rgba(124,110,245,0.15)",
        "brand-lg": "0 0 0 1px rgba(124,110,245,0.4), 0 8px 32px rgba(124,110,245,0.2)",
        "card":     "0 1px 3px rgba(0,0,0,0.4), 0 1px 1px rgba(0,0,0,0.3)",
        "card-hover": "0 4px 24px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)",
      },
      animation: {
        "fade-in":      "fadeIn 0.4s ease forwards",
        "slide-up":     "slideUp 0.4s ease forwards",
        "slide-in-left":"slideInLeft 0.3s ease forwards",
        "pulse-brand":  "pulseBrand 2s ease-in-out infinite",
        "shimmer":      "shimmer 1.5s linear infinite",
        "glow":         "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn:      { from: { opacity: "0" },                    to: { opacity: "1" } },
        slideUp:     { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideInLeft: { from: { opacity: "0", transform: "translateX(-16px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        pulseBrand:  { "0%,100%": { opacity: "1" },               "50%": { opacity: "0.6" } },
        shimmer:     { from: { backgroundPosition: "-200% 0" },   to: { backgroundPosition: "200% 0" } },
        glow:        { from: { boxShadow: "0 0 8px rgba(124,110,245,0.3)" }, to: { boxShadow: "0 0 24px rgba(124,110,245,0.6)" } },
      },
    },
  },
  plugins: [],
};

export default config;
