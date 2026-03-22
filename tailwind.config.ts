import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#FFFBF0',
          100: '#FEF3D0',
          200: '#FDE49A',
          300: '#FBCF55',
          400: '#F9B920',
          500: '#C9952A',
          600: '#A87820',
          700: '#7D5A17',
          800: '#533C0F',
          900: '#2A1E07',
        },
        ink: {
          50:  '#F5F4F0',
          100: '#E8E6DF',
          200: '#C9C6BB',
          300: '#9E9B8E',
          400: '#6E6B60',
          500: '#3D3B33',
          600: '#2C2B25',
          700: '#1E1D19',
          800: '#131210',
          900: '#0A0908',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up':   'fadeUp 0.5s ease forwards',
        'fade-in':   'fadeIn 0.3s ease forwards',
        'shimmer':   'shimmer 1.5s infinite',
        'pulse-gold':'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        pulseGold: { '0%,100%': { boxShadow: '0 0 0 0 rgba(201,149,42,0.3)' }, '50%': { boxShadow: '0 0 0 8px rgba(201,149,42,0)' } },
      },
    },
  },
  plugins: [],
}

export default config
