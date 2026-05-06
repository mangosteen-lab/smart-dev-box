import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontSize: {
        // Map Tailwind utility classes to our fluid CSS custom properties.
        // Using a CSS var() in the value array: [fontSize, lineHeight]
        '2xs': ['var(--fs-2xs)', { lineHeight: '1.4' }],
        xs:    ['var(--fs-xs)',  { lineHeight: '1.5' }],
        sm:    ['var(--fs-sm)',  { lineHeight: '1.55' }],
        base:  ['var(--fs-md)',  { lineHeight: '1.6' }],
        lg:    ['var(--fs-lg)',  { lineHeight: '1.5' }],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        border: "var(--border)",
        primary: "var(--primary)",
        accent: "var(--accent)",
        muted: "var(--muted)",
        success: "var(--success)",
        error: "var(--error)",
        warning: "var(--warning)",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glow: 'var(--shadow-glow)',
      },
    },
  },
  plugins: [],
};
export default config;
