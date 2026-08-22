import Link from 'next/link'
import Image from 'next/image'
import { HeroSearch } from '@/components/home/HeroSearch'
import { HeroVideo } from '@/components/home/HeroVideo'
import { CategoryTiles } from '@/components/home/CategoryTiles'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { QuoteButton } from '@/components/QuoteButton'
import { BRANDS, NEWS } from '@/lib/ktd-data'
import {
  HERO_BADGE,
  HERO_BADGE_SHORT,
  HERO_SUBTITLE,
  HERO_TITLE,
  SECTOR_CARDS,
  WHY_ITEMS,
} from '@/lib/constants'

// Số thương hiệu lấy thẳng từ dữ liệu để không bao giờ lệch với dải logo
// và bộ lọc ở trang sản phẩm.
const HERO_STATS = [
  { num: '15+', label: 'Năm kinh nghiệm' },
  { num: String(BRANDS.length), label: 'Thương hiệu quốc tế' },
  { num: '500+', label: 'Khách hàng doanh nghiệp' },
]

export default function HomePage() {
  return (
    <>
      {/* ---------- 1. Hero ---------- */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-ktd-900 pb-16 pt-12 md:min-h-[calc(90vh-108px)]">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage: 'repeating-linear-gradient(135deg,#012c48 0 24px,#00263F 24px 48px)',
          }}
          aria-hidden="true"
        />

        {/* Video nền chỉ tải trên desktop; nếu chưa có file thì nền kẻ sọc
            phía trên vẫn giữ nguyên (spec C1). */}
        <HeroVideo />

        {/* Lớp phủ để rất nhẹ (khoảng 90% trong suốt) cho video hiện rõ.
            Phần bảo vệ chữ trắng chuyển sang dùng đổ bóng trên từng dòng chữ,
            thay vì làm tối cả khung hình. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(120deg,rgba(0,38,63,.18) 0%,rgba(0,38,63,.10) 50%,rgba(0,63,108,.05) 100%)',
          }}
          aria-hidden="true"
        />

        <div className="container-ktd relative">
          {/* Câu đầy đủ dài 56 ký tự, không thể nằm một dòng trên màn 375px dù
              có thu nhỏ cỡ chữ. Điện thoại dùng bản rút gọn giữ đủ ba vế. */}
          <p className="text-on-video mb-6 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[rgba(199,223,239,.25)] bg-[rgba(0,38,63,.35)] px-3.5 py-1.5 text-xs font-semibold tracking-[0.04em] text-white">
            <span className="md:hidden">{HERO_BADGE_SHORT}</span>
            <span className="hidden md:inline">{HERO_BADGE}</span>
          </p>

          {/* Tiêu đề dùng hết bề rộng container, không bó trong 820px như phần
              nội dung bên dưới — có vậy mới đủ chỗ nằm một dòng trên desktop. */}
          <h1 className="text-on-video mb-5 font-display text-display-1 text-white">
            {HERO_TITLE}
          </h1>

          <div className="max-w-[820px]">
            <p className="text-on-video mb-8 text-base leading-relaxed text-white">
              {HERO_SUBTITLE}
            </p>

            <HeroSearch />

            <div className="mb-14 flex flex-wrap gap-3.5">
              <Link href="/san-pham" className="btn-primary">
                Xem sản phẩm
              </Link>
              <QuoteButton>Tư vấn &amp; Báo giá</QuoteButton>
            </div>

            <dl className="flex flex-wrap gap-x-10 gap-y-6 border-t border-[rgba(199,223,239,.18)] pt-8 md:gap-x-14">
              {HERO_STATS.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="text-on-video block font-display text-[40px] font-bold leading-none text-white">
                      {s.num}
                    </span>
                    <span className="text-on-video mt-1.5 block text-[13px] uppercase tracking-[0.06em] text-white/90">
                      {s.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-scroll-hint text-xs tracking-[0.1em] text-white/70 md:block">
          ↓ CUỘN XUỐNG
        </div>
      </section>

      {/* ---------- 2. Brand strip ---------- */}
      <section className="bg-white py-14 md:py-24">
        <div className="container-ktd">
          <div className="mb-12 text-center">
            <p className="label-caps mb-3 text-ktd-600">Phân phối chính hãng</p>
            <h2 className="font-display text-h2 text-ink-900">
              {BRANDS.length} thương hiệu quốc tế chúng tôi đang phân phối
            </h2>
          </div>

          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:gap-4 lg:grid-cols-6">
            {BRANDS.map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/san-pham?brand=${b.slug}`}
                  title={b.name}
                  className="flex h-full min-h-[88px] items-center justify-center rounded-[10px] border border-[#e2e7ec] bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-ktd-600 hover:shadow-md"
                >
                  {b.logo ? (
                    // Logo để nguyên màu gốc. Bản trước dùng grayscale + hover mới
                    // hiện màu, nên trên máy thật và trên điện thoại (không có
                    // hover) logo luôn bị trắng xám.
                    <Image
                      src={b.logo}
                      alt={b.name}
                      width={160}
                      height={56}
                      className="max-h-12 w-auto max-w-full object-contain"
                    />
                  ) : (
                    // Chưa có file logo thì hiện tên hãng, nếu không ô sẽ trống
                    // và khách không biết đó là thương hiệu nào.
                    <span className="text-center font-display text-[15px] font-bold leading-tight text-ink-700">
                      {b.name}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 text-center">
            <Link href="/san-pham" className="btn-ghost text-ktd-600">
              Xem tất cả sản phẩm theo thương hiệu →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- 3. Categories ---------- */}
      <CategoryTiles />

      {/* ---------- 4. Sectors ---------- */}
      <section className="overflow-hidden bg-ktd-900 pb-4 pt-12 md:pt-14">
        <div className="container-ktd">
          <p className="label-caps mb-3 text-[#4f7ea3]">Lĩnh vực phục vụ</p>
          <h2 className="mb-7 font-display text-h2 text-white">
            Giải pháp cho các ngành công nghiệp
          </h2>
        </div>
        <ul className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-3 sm:px-6 md:px-8 lg:px-10">
          {SECTOR_CARDS.map((s) => (
            <li
              key={s.name}
              className="relative h-[304px] w-[320px] flex-none snap-start overflow-hidden rounded-lg bg-[#012c48] sm:w-[420px]"
            >
              <span className="placeholder-hatch-dark absolute inset-0 opacity-60" aria-hidden="true" />
              <span
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg,rgba(0,38,63,0) 40%,rgba(0,38,63,.95) 100%)',
                }}
                aria-hidden="true"
              />
              <span className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.08em] text-[#4f7ea3]">
                [ ẢNH NGÀNH ]
              </span>
              <span className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                <span className="mb-2 block font-display text-[18px] font-semibold text-white sm:text-[22px]">
                  {s.name}
                </span>
                <span className="block text-sm leading-relaxed text-ktd-100">{s.desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- 5. Featured products ---------- */}
      <FeaturedProducts />

      {/* ---------- 6. Why KTĐ ---------- */}
      <section className="bg-ktd-50 py-14 md:py-24">
        <div className="container-ktd">
          <h2 className="mb-10 text-center font-display text-h2 text-ink-900">
            Vì sao chọn Kim Thành Đông
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_ITEMS.map((w) => (
              <li key={w.title} className="rounded-xl bg-white p-6 md:p-8">
                <h3 className="mb-2.5 font-display text-[19px] font-semibold text-ink-900">
                  {w.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-500">{w.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- 7. News ---------- */}
      <section className="bg-white py-14 md:py-24">
        <div className="container-ktd">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-h2 text-ink-900">Tin tức &amp; Giải pháp</h2>
            <Link href="/tin-tuc" className="btn-ghost text-ktd-600">
              Xem tất cả tin tức →
            </Link>
          </div>
          <ul className="grid gap-6 md:grid-cols-3">
            {NEWS.slice(0, 3).map((n) => (
              <li key={n.slug}>
                <Link
                  href={`/tin-tuc/${n.slug}`}
                  className="block h-full overflow-hidden rounded-xl border border-hairline bg-white transition duration-200 hover:shadow-md"
                >
                  <span className="placeholder-hatch relative flex aspect-video items-center justify-center bg-ink-100">
                    <span className="relative font-mono text-[11px] text-[#9aa3ad]">[ ẢNH 16:9 ]</span>
                  </span>
                  <span className="block p-5 md:p-6">
                    <span className="label-caps mb-2.5 block text-ktd-600">{n.cat}</span>
                    <span className="mb-3 block font-display text-[19px] font-semibold leading-snug text-ink-900">
                      {n.title}
                    </span>
                    <span className="block text-[13px] text-[#9aa3ad]">{n.date}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </>
  )
}
