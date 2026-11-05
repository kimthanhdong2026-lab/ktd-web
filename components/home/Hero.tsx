import Link from 'next/link'
import { HeroSearch } from '@/components/home/HeroSearch'
import { HeroVideo } from '@/components/home/HeroVideo'
import { QuoteButton } from '@/components/QuoteButton'
import { href, type Dictionary, type Locale } from '@/lib/i18n'

/**
 * Dải đầu trang chủ: video nền, tiêu đề, ô tìm kiếm, hai nút và ba con số.
 *
 * Chữ (`t`) là từ điển đã đè phần admin sửa. Hai con số "năm kinh nghiệm" và
 * "khách hàng" admin gõ tay; số thương hiệu lấy thẳng từ dữ liệu để không bao
 * giờ lệch với dải logo và bộ lọc ở trang sản phẩm.
 */
export function Hero({
  t,
  lang,
  soHang,
  soNam,
  soKhach,
}: {
  t: Dictionary
  lang: Locale
  soHang: number
  soNam: string
  soKhach: string
}) {
  const path = (p: string) => href(p, lang)
  const HERO_STATS = [
    { num: soNam, label: t.hero.statYears },
    { num: String(soHang), label: t.hero.statBrands },
    { num: soKhach, label: t.hero.statCustomers },
  ]

  return (
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
  )
}
