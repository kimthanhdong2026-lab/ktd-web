import type { Metadata } from 'next'
import { DEFAULT_LOCALE, dict, isLocale, type Dictionary, type Locale } from '@/lib/i18n'

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const t = dict(isLocale(params.lang) ? params.lang : DEFAULT_LOCALE)
  return {
    title: t.about.metaTitle,
    description: t.about.metaDesc,
    alternates: {
      canonical: params.lang === 'en' ? '/en/gioi-thieu' : '/gioi-thieu',
      languages: { 'vi-VN': '/gioi-thieu', 'en-US': '/en/gioi-thieu' },
    },
  }
}

// Bảng cỡ chữ của trang — BGĐ đã chốt phương án 2 ngày 03/10/2026:
// to hơn phương án 1 khoảng 5% và tăng một bậc độ đậm.
//
// Gom vào một chỗ để khi nhân ra các trang còn lại thì sửa đúng một nơi.
const CHU = {
  than: 'text-[18px] font-medium', // đoạn văn dài
  vua: 'text-[16px]', // chú thích ảnh — không in đậm
  vuaThan: 'text-[16px] font-medium', // nội dung thẻ, mô tả mốc trên điện thoại
  nho: 'text-[14px]', // mô tả nhỏ nhất, timeline trên máy tính
  tieuDeThe: 'text-[18px] font-bold', // tên giá trị
  tieuDeNho: 'text-[16px] font-bold', // tên mốc trên điện thoại
  namTimeline: 'text-[16px]', // ô năm
  tenMoc: 'text-[15px] font-bold', // tên mốc trên máy tính
} as const

// Bố cục một hàng timeline: tổng chiều cao, vị trí trục, độ dài nét đứt.
const TRACK_HEIGHT = 440
const AXIS_TOP = 220
const CONNECTOR = 38

/** Timeline ngang 9 mốc trên một hàng, nội dung so le trên/dưới trục. */
function TimelineTrack({ items }: { items: Dictionary['about']['timeline'] }) {
  return (
    <div className="relative" style={{ height: TRACK_HEIGHT }}>
      <div
        className="absolute left-0 right-0 h-[2px] rounded bg-ktd-100"
        style={{ top: AXIS_TOP }}
        aria-hidden="true"
      />
      <ol className="grid h-full grid-cols-9">
        {items.map((t, i) => {
          const above = i % 2 === 0
          return (
            <li key={t.year} className="relative">
              <span
                className="absolute left-1/2 z-10 h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-ktd-600"
                style={{ top: AXIS_TOP }}
                aria-hidden="true"
              />
              <span
                className="absolute left-1/2 -translate-x-1/2 border-l border-dashed border-ktd-600/45"
                style={
                  above
                    ? { top: AXIS_TOP - CONNECTOR, height: CONNECTOR }
                    : { top: AXIS_TOP, height: CONNECTOR }
                }
                aria-hidden="true"
              />
              <div
                className="absolute left-0 right-0 px-1.5 text-center"
                style={
                  above
                    ? { bottom: TRACK_HEIGHT - AXIS_TOP + CONNECTOR }
                    : { top: AXIS_TOP + CONNECTOR }
                }
              >
                <span
                  className={`mb-2 inline-block rounded-full border border-ktd-600/30 bg-white px-3.5 py-1 font-display font-bold text-ktd-600 ${CHU.namTimeline}`}
                >
                  {t.year}
                </span>
                {/* text-wrap:balance để các dòng tên thương hiệu dài gần bằng
                    nhau — đoạn 22 của "Sửa web 4". Để trình duyệt tự cân thay vì
                    xếp lại tay: thêm bớt một hãng là không phải sửa lại. */}
                <span
                  className={`mb-1 block font-display leading-snug text-ktd-600 [text-wrap:balance] ${CHU.tenMoc}`}
                >
                  {t.title}
                </span>
                <span className={`block leading-relaxed text-ink-600 ${CHU.nho}`}>{t.text}</span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default function AboutPage({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  const t = dict(lang)
  return (
    <>
      <section className="bg-white px-5 py-8 md:py-10">
        <div className="container-ktd text-center">
          <h1 className="font-display text-h2 leading-tight text-ktd-600">
            {t.about.heading}
          </h1>
        </div>
      </section>

      {/* Bề rộng bài giới thiệu bằng đúng ba ô ảnh bên dưới — đoạn 18 của
          "Sửa web 4". Dùng container-ktd giống khối ảnh thay vì max-w-[900px].

          Đổi lại là mỗi dòng dài hơn, khoảng 110 ký tự thay vì 75. Nếu đọc thấy
          mỏi mắt thì quay về max-w-[1100px] là vừa phải. */}
      <section className="bg-white pb-14 md:pb-20">
        <div className="container-ktd">
          {/* Cả phần này dùng đúng một cỡ chữ và một màu chữ; trước đây đoạn đầu
              to và đậm hơn nên nhìn như hai khối khác nhau. */}
          {t.about.story.map((para, i) => (
            <p key={i} className={`mb-5 leading-[1.75] text-ink-700 ${CHU.than}`}>
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* Chờ Marketing cấp ảnh nhà xưởng, văn phòng và triển lãm (spec E4 mục 11). */}
      <section className="bg-surface py-14 md:py-20">
        <div className="container-ktd">
          <ul className="grid gap-4 sm:grid-cols-3">
            {t.about.photos.map((caption) => (
              <li
                key={caption}
                className="placeholder-hatch relative flex aspect-[4/3] flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-ink-100"
              >
                <span className={`relative font-mono text-[#8b949e] ${CHU.nho}`}>{t.about.photoPlaceholder}</span>
                <span className={`relative text-ink-600 ${CHU.vua}`}>{caption}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-surface py-14 md:py-20">
        <div className="container-ktd">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-8 md:p-10">
              <h2 className="mb-4 text-center font-display text-h2 text-ktd-600">{t.about.visionHeading}</h2>
              <p className={`leading-[1.7] text-ink-700 ${CHU.than}`}>{t.about.vision}</p>
            </div>
            <div className="rounded-lg bg-white p-8 md:p-10">
              <h2 className="mb-4 text-center font-display text-h2 text-ktd-600">{t.about.missionHeading}</h2>
              <p className={`leading-[1.7] text-ink-700 ${CHU.than}`}>{t.about.mission}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-14 md:py-20">
        <div className="container-ktd">
          <h2 className="mb-8 text-center font-display text-h2 text-ktd-600">
            {t.about.valuesHeading}
          </h2>
          {/* Bốn ô giá trị dùng nền xanh đậm lấy đúng bộ màu của chân trang
              (bg-ktd-800 + chữ ktd-100) để cả trang chỉ có một tông xanh.
              Số thứ tự 01–04 đã bỏ theo đoạn 19 của "Sửa web 4". */}
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.about.values.map((v) => (
              <li key={v.title} className="rounded-[26px] bg-ktd-800 p-6 md:p-7">
                <h3 className={`mb-2.5 text-center font-display text-white ${CHU.tieuDeThe}`}>{v.title}</h3>
                <p className={`leading-relaxed text-ktd-100 ${CHU.vuaThan}`}>{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-ktd py-14 md:py-20">
        <h2 className="mb-8 text-center font-display text-h2 text-ktd-600">
          {t.about.timelineHeading}
        </h2>
        {/* Máy tính: một hàng 9 mốc, vừa khít bề rộng nên không phải cuộn.
            Điện thoại: chuyển sang trục dọc vì 9 cột trên màn hẹp là không đọc được. */}
        <div className="hidden md:block">
          <TimelineTrack items={t.about.timeline} />
        </div>

        <ol className="relative md:hidden">
          <span className="absolute bottom-2 left-[5px] top-2 w-[2px] bg-ktd-100" aria-hidden="true" />
          {t.about.timeline.map((t) => (
            <li key={t.year} className="relative pb-7 pl-7 last:pb-0">
              <span
                className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-[3px] border-white bg-ktd-600"
                aria-hidden="true"
              />
              <span className={`inline-block rounded-full border border-ktd-600/40 px-3 py-0.5 font-display font-bold text-ktd-600 ${CHU.namTimeline}`}>
                {t.year}
              </span>
              <span className={`mt-1.5 block font-display text-ktd-600 ${CHU.tieuDeNho}`}>
                {t.title}
              </span>
              <span className={`mt-0.5 block leading-relaxed text-ink-600 ${CHU.vuaThan}`}>{t.text}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
