import { existsSync } from 'node:fs'
import { join } from 'node:path'
import Image from 'next/image'
import { SECTOR_CARDS, SECTORS_HEADING } from '@/lib/constants'

/** Ảnh ngành đặt tên theo số thứ tự trong SECTOR_CARDS: public/sectors/1.webp …
 *  Kiểm tra lúc build, chưa có file thì ô dùng nền kẻ nhạt thay ảnh. */
const imageOf = (i: number) => {
  const rel = `/sectors/${i + 1}.webp`
  return existsSync(join(process.cwd(), 'public', rel)) ? rel : null
}

const CARDS = SECTOR_CARDS.map((s, i) => ({ ...s, image: imageOf(i) }))

/**
 * Lĩnh vực phục vụ — băng ảnh tự chạy ngang, không cần bấm hay kéo.
 *
 * Danh sách được nhân đôi rồi dịch trái đúng 50% nên tới cuối vòng khung hình
 * trùng khít với lúc bắt đầu, mắt không thấy điểm nối. Rê chuột thì dừng lại
 * để khách đọc kịp; máy bật "giảm chuyển động" thì tắt hẳn và chuyển sang kéo
 * ngang bằng tay.
 */
export function SectorMarquee() {
  return (
    <section className="overflow-hidden bg-white py-14 md:py-24">
      <div className="container-ktd">
        <h2 className="mb-10 text-center font-display text-h2 text-ktd-600 md:mb-14">
          {SECTORS_HEADING}
        </h2>
      </div>

      {/* Mờ dần hai mép để ô không bị cắt cụt ở rìa màn hình */}
      <div className="group overflow-hidden [mask-image:linear-gradient(90deg,transparent_0,#000_5%,#000_95%,transparent_100%)] motion-reduce:overflow-x-auto">
        <ul className="flex w-max animate-marquee gap-5 px-2.5 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...CARDS, ...CARDS].map((s, i) => (
            <li
              key={i}
              aria-hidden={i >= CARDS.length || undefined}
              className="w-[280px] flex-none overflow-hidden rounded-xl border border-hairline bg-white sm:w-[340px]"
            >
              <span className="placeholder-hatch relative block aspect-[3/2] bg-ink-100">
                {s.image && (
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    sizes="340px"
                    className="object-cover"
                  />
                )}
              </span>
              <span className="block p-5">
                <span className="mb-1.5 block font-display text-[17px] font-semibold leading-snug text-ink-900 md:text-[19px]">
                  {s.name}
                </span>
                <span className="block text-[13px] leading-relaxed text-ink-500">{s.desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
