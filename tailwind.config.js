/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#7FE87F",
          hover: "#6FD86F",
          dark: "#5FBF5F",
          light: "rgba(127, 232, 127, 0.14)",
          foreground: "#080C14",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#7FE87F",
          foreground: "#080C14",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          DEFAULT: "#7FE87F",
          hover: "#6FD86F",
          dark: "#5FBF5F",
          light: "rgba(127, 232, 127, 0.14)",
          textOnPrimary: "#080C14"
        },
        surface: {
          DEFAULT: "#111726",
          elevated: "#182236",
          hover: "#1E293B",
          overlay: "rgba(0, 0, 0, 0.75)"
        },
        txt: {
          primary: "#FFFFFF",
          secondary: "#A2A2BA",
          muted: "#6E6E85"
        },
        bdr: {
          hairline: "rgba(255, 255, 255, 0.06)",
          strong: "#2C2C44",
          focus: "#7FE87F"
        },
        gold: {
          DEFAULT: "#7FE87F",
          light: "#7FE87F",
          dark: "#5FBF5F",
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#7FE87F",
          500: "#7FE87F",
          600: "#5FBF5F",
          700: "#22C55E",
          800: "#16A34A",
          900: "#15803D",
        },
        dark: {
          bg: "#080C14",
          surface: "#111726",
          card: "#111726",
          border: "#2C2C44",
          hover: "#1E293B",
          muted: "#6E6E85"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
