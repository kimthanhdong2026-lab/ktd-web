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

// Bố cục một hàng timeline: tổng chiều cao, vị trí trục, độ dài nét đứt.
const TRACK_HEIGHT = 440
const AXIS_TOP = 220
const CONNECTOR = 38

/** Timeline ngang 9 mốc trên một hàng, nội dung so le trên/dưới trục. */
function TimelineTrack({ items }: { items: typeof ABOUT_TIMELINE }) {
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
                <span className="mb-2 inline-block rounded-full border border-ktd-600/30 bg-white px-3.5 py-1 font-display text-[15px] font-bold text-ktd-600">
                  {t.year}
                </span>
                <span className="mb-1 block font-display text-[13px] font-semibold leading-snug text-ktd-600">
                  {t.title}
                </span>
                <span className="block text-xs leading-relaxed text-ink-500">{t.text}</span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default function AboutPage() {
  return (
    <>
      <section className="bg-white px-5 py-8 md:py-10">
        <div className="container-ktd text-center">
          <h1 className="font-display text-h2 leading-tight text-ktd-600">
            Đồng hành cùng công nghiệp Việt Nam từ 2011
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-5 pb-12 md:pb-16">
        {/* Cả phần này dùng đúng một cỡ chữ và một màu chữ; trước đây đoạn đầu
            to và đậm hơn nên nhìn như hai khối khác nhau. */}
        {ABOUT_STORY.map((para, i) => (
          <p key={i} className="mb-5 text-[17px] leading-[1.75] text-ink-700">
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
            <h2 className="mb-4 text-center font-display text-h2 text-ktd-600">Tầm nhìn</h2>
            <p className="text-base leading-relaxed text-ink-700">{ABOUT_VISION}</p>
          </div>
          <div className="rounded-lg bg-ktd-50 p-8 md:p-10">
            <h2 className="mb-4 text-center font-display text-h2 text-ktd-600">Sứ mệnh</h2>
            <p className="text-base leading-relaxed text-ink-700">{ABOUT_MISSION}</p>
          </div>
        </div>
      </section>

      <section className="container-ktd pb-16 md:pb-20">
        <h2 className="mb-8 text-center font-display text-h2 text-ktd-600">
          Giá trị chúng tôi theo đuổi
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_VALUES.map((v, i) => (
            <li key={v.title} className="rounded-xl bg-ktd-50 p-5 md:p-6">
              <span className="mb-3 block text-center font-display text-[28px] font-bold text-ktd-600/30">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mb-2 text-center font-display text-[17px] font-semibold text-ink-900">{v.title}</h3>
              <p className="text-sm leading-relaxed text-ink-500">{v.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-ktd pb-16 md:pb-24">
        <h2 className="mb-8 text-center font-display text-h2 text-ktd-600">
          Chặng đường phát triển
        </h2>
        {/* Máy tính: một hàng 9 mốc, vừa khít bề rộng nên không phải cuộn.
            Điện thoại: chuyển sang trục dọc vì 9 cột trên màn hẹp là không đọc được. */}
        <div className="hidden md:block">
          <TimelineTrack items={ABOUT_TIMELINE} />
        </div>

        <ol className="relative md:hidden">
          <span className="absolute bottom-2 left-[5px] top-2 w-[2px] bg-ktd-100" aria-hidden="true" />
          {ABOUT_TIMELINE.map((t) => (
            <li key={t.year} className="relative pb-7 pl-7 last:pb-0">
              <span
                className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-[3px] border-white bg-ktd-600"
                aria-hidden="true"
              />
              <span className="inline-block rounded-full border border-ktd-600/30 px-3 py-0.5 font-display text-sm font-bold text-ktd-600">
                {t.year}
              </span>
              <span className="mt-1.5 block font-display text-sm font-semibold text-ktd-600">
                {t.title}
              </span>
              <span className="mt-0.5 block text-sm leading-relaxed text-ink-500">{t.text}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
