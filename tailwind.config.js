/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Include app files but exclude backend folder to avoid node_modules scanning
    './app/layout.{js,jsx,ts,tsx}',
    './app/page.{js,jsx,ts,tsx}',
    './app/globals.css',
    './app/api/**/*.{js,ts,jsx,tsx}',
    // Explicitly exclude app/backend to prevent node_modules scanning
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        techCyan: 'hsl(var(--tech-cyan))',
        successGreen: 'hsl(var(--success-green))',
        electricBlue: 'hsl(var(--electric-blue))',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'Helvetica', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Fira Mono', 'Menlo', 'Monaco', 'monospace'],
        luxury: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        antonio: ['var(--font-antonio)', 'sans-serif'],
        inria: ['var(--font-inria-serif)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        inriaSerif: ['var(--font-inria-serif)', 'serif'],
      },
    },
  },
  plugins: [],
}
