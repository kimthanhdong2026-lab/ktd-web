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


/** Chồng lớp — dùng cho khối "Dòng sản phẩm KTĐ cung cấp" trên trang thương hiệu. */
export function IconLayers(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </Svg>
  )
}

/** Khiên — dùng cho khối "Điểm nổi bật". */
export function IconShield(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  )
}

/** Bánh răng — dùng cho khối "Ứng dụng tiêu biểu". */
export function IconGear(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 14a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V20a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 18.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" />
    </Svg>
  )
}

/** Dấu tích — dùng cho các gạch đầu dòng trên trang thương hiệu. */
export function IconCheck(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m4.5 12.5 5 5 10-11" />
    </Svg>
  )
}
