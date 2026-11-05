import Image from 'next/image'
import type { ReactNode } from 'react'
import type { Dictionary, Locale } from '@/lib/i18n'
import { duongAnh, layChung, tuDien } from '@/lib/noi-dung'

export type KhungGioiThieu = (khoa: string, node: ReactNode) => ReactNode

// Bảng cỡ chữ của trang — BGĐ đã chốt phương án 2 ngày 03/10/2026:
// to hơn phương án 1 khoảng 5% và tăng một bậc độ đậm.
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

/** Timeline ngang trên một hàng, nội dung so le trên/dưới trục. Số cột theo số mốc. */
function TimelineTrack({ items }: { items: Dictionary['about']['timeline'] }) {
  return (
    <div className="relative" style={{ height: TRACK_HEIGHT }}>
      <div className="absolute left-0 right-0 h-[2px] rounded bg-ktd-100" style={{ top: AXIS_TOP }} aria-hidden="true" />
      <ol className="grid h-full" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((t, i) => {
          const above = i % 2 === 0
          return (
            <li key={i} className="relative">
              <span
                className="absolute left-1/2 z-10 h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-ktd-600"
                style={{ top: AXIS_TOP }}
                aria-hidden="true"
              />
              <span
                className="absolute left-1/2 -translate-x-1/2 border-l border-dashed border-ktd-600/45"
                style={above ? { top: AXIS_TOP - CONNECTOR, height: CONNECTOR } : { top: AXIS_TOP, height: CONNECTOR }}
                aria-hidden="true"
              />
              <div
                className="absolute left-0 right-0 px-1.5 text-center"
                style={above ? { bottom: TRACK_HEIGHT - AXIS_TOP + CONNECTOR } : { top: AXIS_TOP + CONNECTOR }}
              >
                <span className={`mb-2 inline-block rounded-full border border-ktd-600/30 bg-white px-3.5 py-1 font-display font-bold text-ktd-600 ${CHU.namTimeline}`}>
                  {t.year}
                </span>
                {/* text-wrap:balance để các dòng tên thương hiệu dài gần bằng
                    nhau — đoạn 22 của "Sửa web 4". */}
                <span className={`mb-1 block font-display leading-snug text-ktd-600 [text-wrap:balance] ${CHU.tenMoc}`}>{t.title}</span>
                <span className={`block leading-relaxed text-ink-600 ${CHU.nho}`}>{t.text}</span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/**
 * Trang Giới thiệu. Dùng ở web thật và màn hình quản trị /admin/gioi-thieu.
 * Chữ từ từ điển đã đè phần admin sửa; ba ảnh từ khối gioi-thieu.anh.
 */
export async function TrangGioiThieu({ lang, moi = false, khung = (_, n) => n }: { lang: Locale; moi?: boolean; khung?: KhungGioiThieu }) {
  const [t, chungAnh] = await Promise.all([tuDien(lang, moi), layChung('gioi-thieu.anh', moi)])
  const anh = [1, 2, 3].map((i) => duongAnh(typeof chungAnh[`anh${i}`] === 'string' ? (chungAnh[`anh${i}`] as string) : ''))

  return (
    <>
      {khung(
        'gioi-thieu.dau',
        <>
          <section className="bg-white px-5 py-8 md:py-10">
            <div className="container-ktd text-center">
              <h1 className="font-display text-h2 leading-tight text-ktd-600">{t.about.heading}</h1>
            </div>
          </section>

          {/* Bề rộng bài giới thiệu bằng đúng ba ô ảnh bên dưới — đoạn 18 của "Sửa web 4". */}
          <section className="bg-white pb-14 md:pb-20">
            <div className="container-ktd">
              {t.about.story.map((para, i) => (
                <p key={i} className={`mb-5 leading-[1.75] text-ink-700 ${CHU.than}`}>
                  {para}
                </p>
              ))}
            </div>
          </section>
        </>
      )}

      {khung(
        'gioi-thieu.anh',
        <section className="bg-surface py-14 md:py-20">
          <div className="container-ktd">
            <ul className="grid gap-4 sm:grid-cols-3">
              {t.about.photos.map((caption, i) => (
                <li key={i} className="placeholder-hatch relative flex aspect-[4/3] flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-ink-100">
                  {anh[i] ? (
                    <>
                      <Image src={anh[i]!} alt={caption} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                      <span className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-8 text-white ${CHU.vua}`}>{caption}</span>
                    </>
                  ) : (
                    <>
                      <span className={`relative font-mono text-[#8b949e] ${CHU.nho}`}>{t.about.photoPlaceholder}</span>
                      <span className={`relative text-ink-600 ${CHU.vua}`}>{caption}</span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {khung(
        'gioi-thieu.tam-nhin',
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
      )}

      {khung(
        'gioi-thieu.gia-tri',
        <section className="bg-surface py-14 md:py-20">
          <div className="container-ktd">
            <h2 className="mb-8 text-center font-display text-h2 text-ktd-600">{t.about.valuesHeading}</h2>
            {/* Nền xanh đậm lấy đúng bộ màu của chân trang để cả trang một tông xanh. */}
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {t.about.values.map((v, i) => (
                <li key={i} className="rounded-[26px] bg-ktd-800 p-6 md:p-7">
                  <h3 className={`mb-2.5 text-center font-display text-white ${CHU.tieuDeThe}`}>{v.title}</h3>
                  <p className={`leading-relaxed text-ktd-100 ${CHU.vuaThan}`}>{v.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {khung(
        'gioi-thieu.chang-duong',
        <section className="container-ktd py-14 md:py-20">
          <h2 className="mb-8 text-center font-display text-h2 text-ktd-600">{t.about.timelineHeading}</h2>
          {/* Máy tính: một hàng; điện thoại: trục dọc. */}
          <div className="hidden md:block">
            <TimelineTrack items={t.about.timeline} />
          </div>
          <ol className="relative md:hidden">
            <span className="absolute bottom-2 left-[5px] top-2 w-[2px] bg-ktd-100" aria-hidden="true" />
            {t.about.timeline.map((m, i) => (
              <li key={i} className="relative pb-7 pl-7 last:pb-0">
                <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-[3px] border-white bg-ktd-600" aria-hidden="true" />
                <span className={`inline-block rounded-full border border-ktd-600/40 px-3 py-0.5 font-display font-bold text-ktd-600 ${CHU.namTimeline}`}>{m.year}</span>
                <span className={`mt-1.5 block font-display text-ktd-600 ${CHU.tieuDeNho}`}>{m.title}</span>
                <span className={`mt-0.5 block leading-relaxed text-ink-600 ${CHU.vuaThan}`}>{m.text}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  )
}
