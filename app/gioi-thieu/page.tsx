import type { Metadata } from 'next'
import {
  ABOUT_MISSION,
  ABOUT_STORY,
  ABOUT_TIMELINE,
  ABOUT_VALUES,
  ABOUT_VISION,
} from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Giới thiệu — Đồng hành cùng công nghiệp Việt Nam từ 2011',
  description:
    'Công ty TNHH Kim Thành Đông thành lập 2011, cung cấp thiết bị, dụng cụ công nghiệp chất lượng cao và giải pháp phục vụ sản xuất tại Việt Nam.',
  alternates: { canonical: '/gioi-thieu' },
}

export default function AboutPage() {
  return (
    <>
      <section className="bg-white px-5 py-8 md:py-10">
        <div className="container-ktd text-center">
          <h1 className="font-display text-h1 leading-tight text-ktd-600">
            Đồng hành cùng công nghiệp Việt Nam từ 2011
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-5 pb-12 md:pb-16">
        {ABOUT_STORY.map((para, i) => (
          <p
            key={i}
            className={
              i === 0
                ? 'mb-6 text-[19px] leading-[1.75] text-ink-700'
                : 'mb-5 text-[17px] leading-[1.75] text-ink-500'
            }
          >
            {para}
          </p>
        ))}
      </section>

      {/* Chờ Marketing cấp ảnh nhà xưởng, văn phòng và triển lãm (spec E4 mục 11). */}
      <section className="container-ktd pb-16 md:pb-20">
        <ul className="grid gap-4 sm:grid-cols-3">
          {['Văn phòng & kho hàng', 'Đội ngũ kỹ thuật', 'Triển lãm MTA Vietnam'].map((caption) => (
            <li
              key={caption}
              className="placeholder-hatch relative flex aspect-[4/3] flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-ink-100"
            >
              <span className="relative font-mono text-[11px] text-[#9aa3ad]">[ ẢNH ]</span>
              <span className="relative text-sm text-ink-500">{caption}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-ktd pb-16 md:pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-ktd-50 p-8 md:p-10">
            <h2 className="mb-4 font-display text-2xl font-bold text-ktd-600">Tầm nhìn</h2>
            <p className="text-base leading-relaxed text-ink-700">{ABOUT_VISION}</p>
          </div>
          <div className="rounded-lg bg-ktd-50 p-8 md:p-10">
            <h2 className="mb-4 font-display text-2xl font-bold text-ktd-600">Sứ mệnh</h2>
            <p className="text-base leading-relaxed text-ink-700">{ABOUT_MISSION}</p>
          </div>
        </div>
      </section>

      <section className="container-ktd pb-16 md:pb-20">
        <h2 className="mb-8 font-display text-[26px] font-bold text-ink-900 md:text-3xl">
          Giá trị chúng tôi theo đuổi
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_VALUES.map((v, i) => (
            <li key={v.title} className="rounded-xl border border-hairline bg-white p-5 md:p-6">
              <span className="mb-3 block font-display text-[28px] font-bold text-ktd-100">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mb-2 font-display text-[17px] font-semibold text-ink-900">{v.title}</h3>
              <p className="text-sm leading-relaxed text-ink-500">{v.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-ktd pb-16 md:pb-24">
        <h2 className="mb-8 font-display text-[26px] font-bold text-ink-900 md:text-3xl">
          Chặng đường phát triển
        </h2>
        <ol className="flex gap-5 overflow-x-auto pb-3">
          {ABOUT_TIMELINE.map((t) => (
            <li key={t.year} className="w-[260px] flex-none border-t-[3px] border-ktd-600 pt-4">
              <span className="mb-1.5 block font-display text-[22px] font-bold text-ktd-600">
                {t.year}
              </span>
              <span className="mb-2 block font-display text-[15px] font-semibold leading-snug text-ink-900">
                {t.title}
              </span>
              <span className="block text-sm leading-relaxed text-ink-500">{t.text}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
