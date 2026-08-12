import Link from 'next/link'
import Image from 'next/image'
import { HeroSearch } from '@/components/home/HeroSearch'
import { HeroVideo } from '@/components/home/HeroVideo'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { QuoteButton } from '@/components/QuoteButton'
import { BRANDS, CATEGORIES, NEWS, countByCategory } from '@/lib/ktd-data'
import { SECTOR_CARDS, WHY_ITEMS, ZALO_URL } from '@/lib/constants'

const HERO_STATS = [
  { num: '13+', label: 'Năm kinh nghiệm' },
  { num: String(BRANDS.length), label: 'Thương hiệu chính hãng' },
  { num: '3', label: 'Kho hàng toàn quốc' },
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

        {/* Overlay luôn nằm trên video để chữ trắng không bị chìm vào
            vùng sáng của cảnh quay. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(120deg,rgba(0,38,63,.92) 0%,rgba(0,38,63,.72) 45%,rgba(0,63,108,.45) 100%)',
          }}
          aria-hidden="true"
        />

        <div className="container-ktd relative">
          <div className="max-w-[820px]">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(199,223,239,.25)] bg-[rgba(199,223,239,.12)] px-3.5 py-1.5 text-xs font-semibold tracking-[0.04em] text-ktd-100">
              CÔNG NGHỆ TOÀN CẦU · KỸ THUẬT BẢN ĐỊA · GIAO HÀNG NHANH
            </p>

            <h1 className="mb-5 font-display text-display-1 text-white">
              Thiết bị công nghiệp
              <br />
              cho nhà máy Việt Nam
            </h1>

            <p className="mb-8 max-w-[620px] text-base leading-relaxed text-ktd-100">
              {BRANDS.length} thương hiệu quốc tế chính hãng · Kỹ sư tư vấn kỹ thuật · Báo giá trong
              24 giờ.
            </p>

            <HeroSearch />

            <div className="mb-14 flex flex-wrap gap-3.5">
              <Link href="/san-pham" className="btn-primary">
                Xem sản phẩm
              </Link>
              <QuoteButton />
            </div>

            <dl className="flex flex-wrap gap-x-10 gap-y-6 border-t border-[rgba(199,223,239,.18)] pt-8 md:gap-x-14">
              {HERO_STATS.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-display text-[40px] font-bold leading-none text-white">
                      {s.num}
                    </span>
                    <span className="mt-1.5 block text-[13px] uppercase tracking-[0.06em] text-[#8fb3cf]">
                      {s.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-scroll-hint text-xs tracking-[0.1em] text-[#6b93b5] md:block">
          ↓ CUỘN XUỐNG
        </div>
      </section>

      {/* ---------- 2. Brand strip ---------- */}
      <section className="bg-white py-14 md:py-24">
        <div className="container-ktd">
          <div className="mb-12 text-center">
            <p className="label-caps mb-3 text-ktd-600">Phân phối chính hãng</p>
            <h2 className="font-display text-h2 text-ink-900">
              {BRANDS.length} thương hiệu quốc tế chúng tôi phân phối
            </h2>
          </div>

          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:gap-4 lg:grid-cols-6">
            {BRANDS.map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/san-pham?brand=${b.slug}`}
                  className="flex h-full flex-col items-center gap-2.5 rounded-[10px] border border-[#e2e7ec] bg-white px-3.5 pb-3.5 pt-4 transition duration-200 hover:-translate-y-0.5 hover:border-ktd-600 hover:shadow-md"
                >
                  <span className="relative flex h-14 w-full items-center justify-center overflow-hidden rounded-md bg-white">
                    {b.logo ? (
                      <Image
                        src={b.logo}
                        alt={`Logo ${b.name}`}
                        width={160}
                        height={56}
                        className="max-h-11 w-auto max-w-[88%] object-contain grayscale transition duration-200 hover:grayscale-0"
                      />
                    ) : (
                      <>
                        <span
                          className="absolute inset-0 opacity-70"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(135deg,#eef1f4 0 8px,#F7F9FB 8px 16px)',
                          }}
                          aria-hidden="true"
                        />
                        <span className="relative font-mono text-[9px] tracking-[0.08em] text-[#b3bcc5]">
                          LOGO
                        </span>
                      </>
                    )}
                  </span>
                  <span className="flex flex-col items-center gap-0.5">
                    <span className="text-center font-display text-[15px] font-bold leading-tight text-ink-700">
                      {b.name}
                    </span>
                    <span className="text-[11px] text-[#9aa3ad]">{b.origin}</span>
                  </span>
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
      <section className="bg-ktd-50 py-14 md:py-24">
        <div className="container-ktd">
          <h2 className="mb-10 text-center font-display text-h2 text-ink-900">
            Bạn đang cần loại thiết bị nào?
          </h2>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/san-pham?category=${c.slug}`}
                  className="flex h-full flex-col rounded-[10px] border border-[#dbe6f0] bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-ktd-600 hover:shadow-md md:p-6"
                >
                  <span
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-[10px] bg-ktd-50 text-[22px]"
                    aria-hidden="true"
                  >
                    {c.icon}
                  </span>
                  <span className="mb-1.5 font-display text-[17px] font-semibold text-ink-900 md:text-lg">
                    {c.name}
                  </span>
                  <span className="text-[13px] text-ink-500">
                    {countByCategory(c.slug)} sản phẩm
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- 4. Sectors ---------- */}
      <section className="overflow-hidden bg-ktd-900 pb-4 pt-12 md:pt-14">
        <div className="container-ktd">
          <p className="label-caps mb-3 text-[#4f7ea3]">Lĩnh vực phục vụ</p>
          <h2 className="mb-7 max-w-[640px] font-display text-h2 text-white">
            Đồng hành cùng 8 ngành công nghiệp trọng điểm
          </h2>
        </div>
        <ul className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-3 sm:px-6 md:px-8 lg:px-10">
          {SECTOR_CARDS.map((s) => (
            <li
              key={s.name}
              className="relative h-[304px] w-[300px] flex-none snap-start overflow-hidden rounded-lg bg-[#012c48] sm:w-[340px]"
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
              <span className="absolute bottom-0 left-0 right-0 p-7">
                <span className="mb-2 block font-display text-[22px] font-semibold text-white">
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
                <span
                  className="mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-ktd-50 text-2xl"
                  aria-hidden="true"
                >
                  {w.icon}
                </span>
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

      {/* ---------- 8. Closing CTA ---------- */}
      <section className="bg-ktd-600 px-5 py-11 text-center">
        <div className="mx-auto max-w-[760px]">
          <h2 className="mb-4 font-display text-h2 text-white">Không tìm thấy sản phẩm bạn cần?</h2>
          <p className="mb-8 text-lg leading-relaxed text-ktd-100">
            Gửi yêu cầu — kỹ sư của chúng tôi phản hồi trong vòng 24 giờ làm việc.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <QuoteButton />
            <a
              href={ZALO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white text-ktd-600 hover:bg-ktd-50"
            >
              Chat Zalo
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
