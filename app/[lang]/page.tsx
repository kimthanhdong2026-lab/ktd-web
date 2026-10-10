import Link from 'next/link'
import { HeroSearch } from '@/components/home/HeroSearch'
import { HeroVideo } from '@/components/home/HeroVideo'
import { BrandShowcase } from '@/components/home/BrandShowcase'
import { CategoryTiles } from '@/components/home/CategoryTiles'
import { SectorMarquee } from '@/components/home/SectorMarquee'
import { WhyChoose } from '@/components/home/WhyChoose'
import { QuoteButton } from '@/components/QuoteButton'
import { newsFor } from '@/lib/ktd-data'
import { getBrands } from '@/lib/db'
import { DEFAULT_LOCALE, dict, href, isLocale, type Locale } from '@/lib/i18n'

export default async function HomePage({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  const t = dict(lang)
  const path = (p: string) => href(p, lang)
  const brands = await getBrands(lang)
  const news = newsFor(lang)

  // Số thương hiệu lấy thẳng từ dữ liệu để không bao giờ lệch với dải logo
  // và bộ lọc ở trang sản phẩm.
  const HERO_STATS = [
    { num: '15+', label: t.hero.statYears },
    { num: String(brands.length), label: t.hero.statBrands },
    { num: '500+', label: t.hero.statCustomers },
  ]

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
          <p className="text-on-video mb-6 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[rgba(199,223,239,.25)] bg-[rgba(0,38,63,.35)] px-3.5 py-1.5 text-[13px] font-semibold tracking-[0.04em] text-white">
            <span className="md:hidden">{t.hero.badgeShort}</span>
            <span className="hidden md:inline">{t.hero.badge}</span>
          </p>

          {/* Tiêu đề dùng hết bề rộng container, không bó trong 820px như phần
              nội dung bên dưới — có vậy mới đủ chỗ nằm một dòng trên desktop. */}
          <h1 className="text-on-video mb-5 font-display text-display-1 text-white">
            {t.hero.title}
          </h1>

          <div className="max-w-[820px]">
            <p className="text-on-video mb-8 text-base leading-relaxed text-white">
              {t.hero.subtitle}
            </p>

            <HeroSearch />

            <div className="mb-14 flex flex-wrap gap-3.5">
              <Link href={path('/san-pham')} className="btn-primary">
                {t.hero.ctaProducts}
              </Link>
              <QuoteButton>{t.hero.ctaQuote}</QuoteButton>
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

        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-scroll-hint text-[13px] tracking-[0.1em] text-white/70 md:block">
          {t.hero.scrollHint}
        </div>
      </section>

      {/* ---------- 2. Brand showcase ---------- */}
      <BrandShowcase brands={brands} lang={lang} />

      {/* ---------- 3. Categories ---------- */}
      <CategoryTiles lang={lang} />

      {/* ---------- 4. Sectors ---------- */}
      <SectorMarquee lang={lang} />

      {/* ---------- 5. Featured products ---------- */}
      {/* Khối "Sản phẩm được quan tâm" đã bỏ khỏi trang chủ theo quyết định
          của Ban Giám đốc ngày 03/10/2026. Cột `featured` trong cơ sở dữ liệu
          và hàm getFeaturedProducts vẫn giữ — trang Tin tức đang dùng để gợi ý
          sản phẩm liên quan. */}

      {/* ---------- 6. Why KTD ---------- */}
      <WhyChoose lang={lang} />

      {/* ---------- 7. News ---------- */}
      <section className="bg-white py-14 md:py-24">
        <div className="container-ktd">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-h2 text-ktd-600">{t.news.heading}</h2>
            <Link href={path('/tin-tuc')} className="btn-ghost text-ktd-600">
              {t.news.viewAll}
            </Link>
          </div>
          <ul className="grid gap-6 md:grid-cols-3">
            {news.slice(0, 3).map((n) => (
              <li key={n.slug}>
                <Link
                  href={path(`/tin-tuc/${n.slug}`)}
                  className="block h-full overflow-hidden rounded-xl border border-hairline bg-white transition duration-200 hover:shadow-md"
                >
                  <span className="placeholder-hatch relative flex aspect-video items-center justify-center bg-ink-100">
                    <span className="relative font-mono text-[13px] text-[#9aa3ad]">{t.news.imagePlaceholder}</span>
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
