import type { Config } from 'tailwindcss'

// Tokens transcribed from the design handoff, Part B (Design System).
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      screens: {
        // Mốc riêng cho thanh điều hướng chính.
        //
        // Từ khi thêm mục THƯƠNG HIỆU, thanh có 6 mục và không còn vừa ở mốc
        // lg (1024px) — đo thật thì cần khoảng 1104px. Đặt 1140px cho có biên,
        // dưới mức đó dùng nút ba gạch.
        nav: '1140px',
        // Số điện thoại trên header chỉ hiện khi còn thừa chỗ thật sự. Ở 1280px
        // nó bị bẻ thành ba dòng và đẩy cao cả thanh.
        tel: '1400px',
      },
      colors: {
        ktd: {
          50: '#EEF6FC',
          100: '#C7DFEF',
          // Xanh chủ đạo lấy trực tiếp từ file logo gốc (Logo Công ty.jpg).
          // Cả site chỉ dùng đúng mã này cho nút, link, viền và tiêu đề xanh.
          600: '#005E96', // brand primary = xanh logo
          700: '#004A78', // primary hover
          800: '#003F6C', // dark section / utility bar
          900: '#00263F', // hero + footer ground
        },
        // Màu nền của mọi dải nội dung, thay cho nền xanh nhạt cũ (#EEF6FC).
        //
        // "Sử dụng 2 màu nền trên của web này, không dùng màu nền xanh nhạt
        // nữa: amphenol.com" — Sửa web 4, đoạn 4. Đã dựng thử cả hai sắc xám
        // của amphenol rồi trình BGĐ; BGĐ chốt ngày 03/10/2026 dùng ĐÚNG MỘT
        // màu nền là sắc nhạt, điểm nhấn để dành cho màu xanh logo.
        surface: '#F8F8F8',
        // Red is reserved for the quote CTA and "Mới" badges only (spec B1).
        quote: {
          DEFAULT: '#E30613',
          700: '#B8050F',
        },
        ink: {
          900: '#111418',
          700: '#3D444D',
          // "màu chữ rõ hơn 1 chút nữa" — Sửa web 4, đoạn 5. ink-600 đậm hơn
          // ink-500 một bậc, dùng cho chữ nhỏ ở những chỗ trước đây khó đọc.
          600: '#58626D',
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
        // Tiêu đề Hero dài 40 ký tự. Ở cỡ 52px cần ~1144px, vừa bề rộng
        // container (1280px). Hệ số 3.9vw giữ cho nó không tràn ở màn hẹp hơn:
        // tại 1280px chữ tự co còn ~50px, cần 1098px trong 1200px khả dụng.
        'display-1': ['clamp(1.5rem, 3.9vw, 3.25rem)', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
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
