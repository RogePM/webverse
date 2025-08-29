/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        accent: 'hsl(var(--accent))',
        mutedForeground: 'hsl(var(--muted-foreground))',
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
