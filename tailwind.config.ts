import type { Config } from 'tailwindcss'

// Tokens transcribed from the design handoff, Part B (Design System).
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ktd: {
          50: '#EEF6FC',
          100: '#C7DFEF',
          600: '#006BB2', // brand primary
          700: '#005490', // primary hover
          800: '#003F6C', // dark section / utility bar
          900: '#00263F', // hero + footer ground
        },
        // Red is reserved for the quote CTA and "Mới" badges only (spec B1).
        quote: {
          DEFAULT: '#E30613',
          700: '#B8050F',
        },
        ink: {
          900: '#111418',
          700: '#3D444D',
          500: '#6B747E',
          300: '#D4D9DE',
          100: '#F3F5F7',
        },
        hairline: '#e6eaee',
        success: '#0E8A4F',
        warning: '#C77700',
        zalo: '#0068FF',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Cỡ nhỏ nhất được hạ xuống 28px để trên điện thoại 360–414px mỗi
        // câu của tiêu đề Hero nằm gọn đúng một dòng, không vỡ giữa chừng.
        'display-1': ['clamp(1.75rem, 7.2vw, 4.0625rem)', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-2': ['clamp(2.125rem, 4.5vw, 3.5rem)', { lineHeight: '1.1', fontWeight: '700' }],
        h1: ['clamp(1.875rem, 4vw, 2.75rem)', { lineHeight: '1.15', fontWeight: '700' }],
        h2: ['clamp(1.5625rem, 3vw, 2.25rem)', { lineHeight: '1.2', fontWeight: '700' }],
        h3: ['clamp(1.25rem, 2vw, 1.5rem)', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.65' }],
        'body-sm': ['0.875rem', { lineHeight: '1.55' }],
        caption: ['0.75rem', { lineHeight: '1.45', fontWeight: '500' }],
        'label-caps': ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.1em', fontWeight: '600' }],
      },
      maxWidth: {
        container: '1360px',
        prose: '760px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '14px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,38,63,.06)',
        md: '0 4px 14px rgba(0,38,63,.10)',
        lg: '0 12px 40px rgba(0,38,63,.16)',
        cta: '0 6px 20px rgba(227,6,19,.30)',
        header: '0 2px 12px rgba(0,38,63,.08)',
        overlay: '0 24px 80px rgba(0,0,0,.4)',
      },
      transitionTimingFunction: {
        micro: 'cubic-bezier(.4,0,.2,1)',
        entrance: 'cubic-bezier(.16,1,.3,1)',
      },
      transitionDuration: {
        // Spec B4: 150ms micro-interactions, 250ms state changes, 600ms scroll entrances.
        250: '250ms',
        600: '600ms',
      },
      keyframes: {
        'ktd-fadeup': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'ktd-toastin': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'ktd-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
        'ktd-marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        fadeup: 'ktd-fadeup .25s cubic-bezier(.16,1,.3,1)',
        toastin: 'ktd-toastin .3s cubic-bezier(.16,1,.3,1)',
        'scroll-hint': 'ktd-bounce 2s ease-in-out infinite',
        marquee: 'ktd-marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
