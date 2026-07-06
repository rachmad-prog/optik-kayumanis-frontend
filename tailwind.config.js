/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cinnamon brand ramp — DEFAULT (500) matches the reference design's primary brown
        cinnamon: {
          DEFAULT: "#8B5E3C",
          50: "#F7EFE7",
          100: "#EFDFCE",
          200: "#DCC0A0",
          300: "#C79E71",
          400: "#A8794F", // "light" accent
          500: "#8B5E3C", // primary
          600: "#6E4A2F",
          700: "#4A2E1E", // "dark"
          800: "#3A2416",
          900: "#241608",
          light: "#A8794F",
          dark: "#4A2E1E",
        },
        // Bark kept for backward compatibility with existing markup, remapped to the
        // charcoal/warm-gray text scale used across the reference design.
        bark: {
          50: "#F2EEE9",
          100: "#E4D8C8",
          300: "#7A756D", // warm gray — muted text
          500: "#4A2E1E",
          700: "#2A2622", // charcoal — headings/body
          900: "#1C1915",
        },
        cream: {
          DEFAULT: "#F5EDE3",
          card: "#FFFCF8",
        },
        sand: "#E4D8C8",
        beige: "#E4D8C8",
        gold: "#A8794F",
        ink: "#2A2622",
        charcoal: "#2A2622",
        warmgray: "#7A756D",
        sage: "#6E8B63",
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "sans-serif"],
        body: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-jakarta)", "sans-serif"],
        sans: ["var(--font-jakarta)", "sans-serif"],
      },
      borderRadius: {
        curl: "0 999px 0 999px",
      },
    },
  },
  plugins: [],
};
