/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Updated to match your CSS variables
        title: ["var(--font-playfair)", "serif"],
        content: ["var(--font-inter)", "sans-serif"],
        // Keep the old names as aliases for backwards compatibility
        heading: ["var(--font-playfair)", "serif"],
      },
      borderRadius: {
        lg: "var(--rounded-btn)", // Use DaisyUI's button radius
        md: "calc(var(--rounded-btn) - 2px)",
        sm: "calc(var(--rounded-btn) - 4px)",
      },
      colors: {
        // Map shadcn colors to DaisyUI theme colors
        background: "hsl(var(--b1))", // DaisyUI base-100
        foreground: "hsl(var(--bc))", // DaisyUI base-content
        card: {
          DEFAULT: "hsl(var(--b1))", // DaisyUI base-100
          foreground: "hsl(var(--bc))", // DaisyUI base-content
        },
        popover: {
          DEFAULT: "hsl(var(--b1))", // DaisyUI base-100
          foreground: "hsl(var(--bc))", // DaisyUI base-content
        },
        primary: {
          DEFAULT: "hsl(var(--p))", // DaisyUI primary
          foreground: "hsl(var(--pc))", // DaisyUI primary-content
        },
        secondary: {
          DEFAULT: "hsl(var(--s))", // DaisyUI secondary
          foreground: "hsl(var(--sc))", // DaisyUI secondary-content
        },
        muted: {
          DEFAULT: "hsl(var(--b2))", // DaisyUI base-200
          foreground: "hsl(var(--bc))", // DaisyUI base-content
        },
        accent: {
          DEFAULT: "hsl(var(--a))", // DaisyUI accent
          foreground: "hsl(var(--ac))", // DaisyUI accent-content
        },
        destructive: {
          DEFAULT: "hsl(var(--er))", // DaisyUI error
          foreground: "hsl(var(--erc))", // DaisyUI error-content
        },
        border: "hsl(var(--b3))", // DaisyUI base-300
        input: "hsl(var(--b3))", // DaisyUI base-300
        ring: "hsl(var(--p))", // DaisyUI primary
        chart: {
          1: "hsl(var(--in))", // DaisyUI info
          2: "hsl(var(--su))", // DaisyUI success
          3: "hsl(var(--wa))", // DaisyUI warning
          4: "hsl(var(--er))", // DaisyUI error
          5: "hsl(var(--s))", // DaisyUI secondary
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("daisyui")],
  daisyui: {
    themes: ["corporate"],
    // Optional:
    // darkTheme: "corporate", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element
    styled: true, // include daisyUI colors and design decisions for all components
  },
};
