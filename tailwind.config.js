/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern 2026 Obsidian & Champagne Luxury Ramp
        obsidian: {
          DEFAULT: "#0F172A",
          950: "#090D16",
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
        },
        champagne: {
          DEFAULT: "#F97316",
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          gold: "#F97316",
        },
        pearl: {
          DEFAULT: "#F8FAFC",
          card: "#FFFFFF",
          muted: "#F1F5F9",
        },
        // Cinnamon brand ramp — remapped to orange accents
        cinnamon: {
          DEFAULT: "#F97316",
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#0F172A",
          800: "#090D16",
          900: "#05080E",
          light: "#FDBA74",
          dark: "#0F172A",
        },
        bark: {
          50: "#F8FAFC",
          100: "#E2E8F0",
          300: "#64748B",
          500: "#334155",
          700: "#0F172A",
          900: "#090D16",
        },
        cream: {
          DEFAULT: "#FAF9F6",
          card: "#FFFFFF",
        },
        sand: "#E2E8F0",
        beige: "#F1F5F9",
        gold: "#F97316",
        ink: "#0F172A",
        charcoal: "#0F172A",
        warmgray: "#64748B",
        sage: "#10B981",
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "Plus Jakarta Sans", "Outfit", "sans-serif"],
        body: ["var(--font-jakarta)", "Inter", "sans-serif"],
        mono: ["monospace"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(15, 23, 42, 0.08)",
        "glass-hover": "0 12px 40px 0 rgba(249, 115, 22, 0.18)",
        glow: "0 0 25px -5px rgba(249, 115, 22, 0.35)",
        "card-modern": "0 10px 30px -10px rgba(15, 23, 42, 0.05)",
      },
      borderRadius: {
        curl: "0 999px 0 999px",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

