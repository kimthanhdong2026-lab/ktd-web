import Image from 'next/image'
import Link from 'next/link'
import { href, type Dictionary, type Locale } from '@/lib/i18n'
import type { BrandPage } from '@/lib/ktd-data'
import { maQuocKy } from '@/lib/quoc-ky'

/**
 * Chiều cao (px) của từng logo trên thẻ, để 19 logo NHÌN to bằng nhau — góp ý
 * của team web ngày 04/11/2026 (ảnh chụp: Beveltools và Buchem lệch cỡ).
 *
 * Bản trước chỉ có hai cỡ: 32px cho mọi logo và 60px cho bốn logo nhiều tầng
 * (TH02 của "Sửa web 5"). Cùng chiều cao nhưng logo vuông vức như Buchem trông
 * nhỏ hơn hẳn logo dài như Karnasch.
 *
 * Các số dưới đây ĐO ĐƯỢC từ file logo gốc (đã cắt sát viền): mỗi logo được
 * cho cùng một diện tích khung bao, rồi bù theo độ đậm nét — logo nét mảnh,
 * nhiều khoảng trống thì cộng thêm, logo đặc thì bớt đi.
 *
 * Thêm hãng mới mà chưa có số thì logo cao 34px.
 */
const LOGO_CAO: Record<string, number> = {
  martor: 32, karnasch: 21, hartner: 55, helical: 26, corehog: 33, ata: 48, morrisflex: 28,
  garryson: 39, 'bevel-tools': 37, diprofil: 25, buchem: 42, rocklinizer: 58, tschorn: 56,
  lenzkes: 48, fiam: 43, sloky: 34, technomark: 33, tecna: 36, rtc: 58,
}

/**
 * Thẻ một hãng ở trang danh sách Thương hiệu. Dùng chung với màn hình quản trị
 * (xem trước thẻ khi sửa câu ngắn), nên hai bên luôn giống nhau.
 */
export function TheHang({ b, t, lang }: { b: BrandPage; t: Dictionary; lang: Locale }) {
  return (
    <Link
      href={href(`/thuong-hieu/${b.slug}`, lang)}
      className="group flex h-full flex-col overflow-hidden rounded-xl bg-white transition-shadow hover:shadow-md"
    >
      {b.banner ? (
        <Image src={b.banner} alt="" width={1200} height={900} className="aspect-[4/3] w-full object-cover" />
      ) : (
        <div className="aspect-[4/3] w-full bg-ink-100" />
      )}

      <div className="flex flex-1 flex-col p-5 md:p-6">
        {/* Logo giữ tỉ lệ gốc (admin tải lên, hoặc file gốc trong public/), không
            phải bản đã đóng khung 320×128 của dải logo trang chủ: thẻ chia tỉ lệ
            theo chiều cao, bản đóng khung làm logo chữ dài như Karnasch thành
            một vệt mờ. Logo nằm trong ô cao cố định 60px, căn giữa dọc: logo
            cao thấp khác nhau nhưng dòng "Thương hiệu đến từ…" của các thẻ cùng
            hàng vẫn thẳng hàng. */}
        {b.logo ? (
          <div className="mb-3 flex h-[60px] items-center">
            <Image
              src={b.logoGoc ?? `/assets/brands/${b.slug}.webp`}
              alt={b.name}
              width={320}
              height={128}
              style={{ height: LOGO_CAO[b.slug] ?? 34 }}
              className="w-auto max-w-[220px] object-contain object-left"
            />
          </div>
        ) : (
          <span className="mb-3 font-display text-[18px] font-bold text-ink-900">{b.name}</span>
        )}

        {/* Cờ nước là ảnh thật, xem ghi chú trong components/brands/NhanXuatXu.tsx. */}
        <p className="mb-2 flex items-center gap-2 font-mono text-[13px] uppercase tracking-[.1em] text-ink-500">
          {maQuocKy(b.origin) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/assets/co/${maQuocKy(b.origin)}.svg`}
              alt=""
              width={18}
              height={13}
              className="h-[13px] w-[18px] flex-none rounded-[2px] object-cover ring-1 ring-black/10"
            />
          )}
          {t.brandPage.from(b.origin)}
        </p>

        {/* Câu mô tả ngắn team viết cho từng hãng (sheet "MTN - Brand", câu A2
            vòng 2), vừa 3 dòng. Hãng nào chưa có câu ngắn thì lấy đoạn giới
            thiệu dài, cắt ở dòng thứ 3. */}
        <p className="line-clamp-3 text-[16px] leading-relaxed text-ink-600">{b.desc || b.intro}</p>

        <span className="mt-auto pt-4 text-[16px] font-semibold text-ktd-600 group-hover:underline">
          {t.brandPage.viewAll(b.name)} →
        </span>
      </div>
    </Link>
  )
}
