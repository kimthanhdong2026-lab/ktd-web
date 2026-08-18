/**
 * Bộ icon SVG vẽ trên lưới 24×24, nét 1.75px, đầu nét bo tròn — cùng phong
 * cách với các bộ icon mà phần lớn website hiện đại đang dùng (Feather/Lucide).
 *
 * Vẽ thẳng bằng SVG thay vì dùng emoji hay thư viện ngoài vì ba lý do:
 *  - emoji hiển thị khác nhau trên Windows / iOS / Android, không kiểm soát được
 *  - không phải tải thêm thư viện, không ảnh hưởng tốc độ trang
 *  - đổi màu và độ dày nét theo ngữ cảnh chỉ bằng CSS
 */

type IconProps = {
  className?: string
  strokeWidth?: number
}

function Svg({ className, strokeWidth = 1.75, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

/** Chứng từ — dùng cho nút Yêu cầu báo giá (spec B6). */
export function IconQuote(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8M16 17H8M10 9H8" />
    </Svg>
  )
}

/** Bong bóng hội thoại — dùng cho nút Zalo. */
export function IconChat(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
    </Svg>
  )
}

/** Ống nghe điện thoại — dùng cho nút gọi hotline. */
export function IconPhone(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  )
}

/** Kính lúp — dùng cho nút tìm kiếm. */
export function IconSearch(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="7.5" />
      <path d="m20.5 20.5-4.2-4.2" />
    </Svg>
  )
}

/** Mũi tên lên — dùng cho nút về đầu trang. */
export function IconArrowUp(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 19.5V5M5.5 11.5 12 5l6.5 6.5" />
    </Svg>
  )
}

/** Phong bì — dùng cho email. */
export function IconMail(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6.5 9 6 9-6" />
    </Svg>
  )
}

// ---------------------------------------------------------------- danh mục

/** Khiên — Dụng cụ an toàn. */
export function IconShield(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2.5 4.5 5.5v6c0 4.6 3.1 8.6 7.5 10 4.4-1.4 7.5-5.4 7.5-10v-6z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  )
}

/** Mũi khoan xoắn — Dụng cụ cắt gọt CNC. */
export function IconDrill(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2v14" />
      <path d="M8 5h8M8 9h8M8 13h8" />
      <path d="m9 16 3 5.5L15 16" />
    </Svg>
  )
}

/** Đĩa mài — Mài, đánh bóng & hoàn thiện bề mặt. */
export function IconGrind(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="10" cy="10" r="6" />
      <circle cx="10" cy="10" r="2" />
      <path d="m15 15 6 6M18 14l3 1M14 18l1 3" />
    </Svg>
  )
}

/** Ê tô kẹp — Kẹp và vệ sinh khuôn mẫu. */
export function IconClamp(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="9" width="5" height="6" rx="1" />
      <rect x="16" y="9" width="5" height="6" rx="1" />
      <path d="M8 12h8M12 4v3M12 17v3" />
    </Svg>
  )
}

/** Tâm ngắm — Thiết bị đo & cân chỉnh gia công. */
export function IconTarget(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </Svg>
  )
}

/** Mã vuông — Đánh dấu & truy xuất. */
export function IconQr(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM20 14v0M14 20v0M20 20v0" />
    </Svg>
  )
}

/** Móc cẩu — Thiết bị nâng hạ & công thái học. */
export function IconHoist(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 4h12M8 4v5" />
      <path d="M8 9h6l-3 5" />
      <path d="M11 14v3a3 3 0 1 0 6 0v-1" />
    </Svg>
  )
}

/** Bánh răng — Thiết bị siết công nghiệp. */
export function IconGear(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.2 2.2M17.6 17.6l2.2 2.2M2 12h3M19 12h3M4.2 19.8l2.2-2.2M17.6 6.4l2.2-2.2" />
    </Svg>
  )
}

/** Tua vít — Dụng cụ siết lực cầm tay. */
export function IconScrewdriver(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M15 3.5 20.5 9l-3 3-5.5-5.5z" />
      <path d="m12 6.5-8 8V20h5.5l8-8" />
    </Svg>
  )
}

/** Góc vát — Máy vát mép & bo cạnh. */
export function IconBevel(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 20h16" />
      <path d="M4 20V8l8-4" />
      <path d="M12 4h8v16" />
    </Svg>
  )
}

/** Tổ ong — Dụng cụ gia công composite. */
export function IconHoneycomb(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 3.5h4l2 3.5-2 3.5H9L7 7z" />
      <path d="M9 13.5h4l2 3.5-2 3.5H9l-2-3.5z" />
      <path d="m17 8.5 2 3.5-2 3.5" />
      <path d="m5 8.5-2 3.5 2 3.5" />
    </Svg>
  )
}

/** Sóng đo — Thiết bị đo & kiểm tra máy hàn. */
export function IconWave(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M6 13h2.5l2-4 2.5 7 2-5 1.5 2H19" />
    </Svg>
  )
}

/** Kim cương — Xử lý & phục hồi bề mặt kim loại. */
export function IconDiamond(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 3h10l4 6-9 12L3 9z" />
      <path d="M3 9h18M9.5 9 12 21M14.5 9 12 21M7 3l2.5 6M17 3l-2.5 6" />
    </Svg>
  )
}

/** Khớp nối — Khớp nối nhanh công nghiệp. */
export function IconCoupling(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.5" y="8.5" width="7" height="7" rx="1.5" />
      <rect x="14.5" y="8.5" width="7" height="7" rx="1.5" />
      <path d="M9.5 12h5" />
      <path d="M6 6.5v11M18 6.5v11" />
    </Svg>
  )
}
