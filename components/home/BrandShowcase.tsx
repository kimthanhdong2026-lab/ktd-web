'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Brand } from '@/lib/ktd-data'
import { useLang } from '@/components/LangProvider'
import type { Locale } from '@/lib/i18n'

/** Nhịp tự chuyển giữa các thương hiệu (ms). */
const ROTATE_MS = 3600

/**
 * Số cột ở khổ màn rộng, chọn sao cho không có hàng lẻ: ưu tiên 6, không chia
 * hết thì 5. Danh sách hãng còn thay đổi nên để máy tự chọn, đỡ phải sửa tay
 * mỗi lần thêm hoặc bớt một thương hiệu.
 */
const tileWidth = (soHang: number) =>
  soHang % 6 === 0
    ? 'xl:w-[calc((100%-3.75rem)/6)] min-[1400px]:w-[calc((100%-5rem)/6)]'
    : 'xl:w-[calc((100%-3rem)/5)] min-[1400px]:w-[calc((100%-4rem)/5)]'

/**
 * Khối "thương hiệu phân phối": giữ đủ 19 logo trên lưới, cứ mỗi vài giây có
 * một ô tự nổi to lên. Rê chuột (hoặc tab tới) một logo thì ô đó được chọn ngay
 * và vòng quay tạm dừng cho tới khi rời chuột.
 *
 * Bấm vào logo đi thẳng tới trang riêng của hãng.
 */
export function BrandShowcase({ brands }: { brands: Brand[]; lang?: Locale }) {
  const { t, path } = useLang()
  const TILE_WIDTH = tileWidth(brands.length)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Không chạy đồng hồ khi khối chưa lọt vào màn hình — tránh việc cột phải
  // đã đổi qua mấy hãng trước khi khách kịp cuộn xuống nhìn thấy.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (paused || !visible) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setActive((i) => (i + 1) % brands.length), ROTATE_MS)
    return () => window.clearInterval(id)
  }, [paused, visible])

  return (
    <section
      id="thuong-hieu"
      ref={sectionRef}
      className="relative overflow-hidden py-14 md:py-24"
      style={{
        background:
          'linear-gradient(135deg,#00263F 0%,#003F6C 52%,#005E96 100%)',
      }}
    >
      {/* Vệt sáng nhẹ ở góc phải cho nền xanh đỡ phẳng */}
      <span
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle,rgba(0,94,150,.55) 0%,rgba(0,94,150,0) 70%)' }}
        aria-hidden="true"
      />

      {/* Khối logo cần bề ngang lớn hơn khung chung (1360px) thì hai bên mới
          không bị trống và tiêu đề mới đủ chỗ nằm một dòng. */}
      <div className="relative mx-auto w-full max-w-[1600px] px-5 sm:px-6 md:px-8 lg:px-10">
        <div className="mb-11 text-center md:mb-16">
          {/* "Phân phối chính hãng" to lên 3–4 cỡ so với label-caps 12px — yêu
              cầu ở đoạn 6 của "Sửa web 4". Giữ nguyên kiểu in hoa giãn chữ, chỉ
              đổi cỡ và độ đậm. Màu chữ nâng từ #7FB3D5 lên ktd-100 cho rõ hơn
              trên nền xanh đậm, đúng ý "màu chữ rõ hơn 1 chút" ở đoạn 5. */}
          <p className="mb-3 font-display text-[19px] font-bold uppercase tracking-[0.1em] text-ktd-100 md:text-[21px]">
            {t.brands.eyebrow}
          </p>
          <h2 className="mb-5 font-display text-h2 text-white [text-wrap:balance]">
            {t.brands.heading(brands.length)}
          </h2>
          <p className="mx-auto max-w-[1100px] text-body-lg text-ktd-100 [text-wrap:balance]">
            {t.brands.intro}
          </p>
        </div>

        {/* Số cột logo đổi theo khổ màn: 6 cột (18 hãng = đúng 3 hàng) chỉ đủ
            chỗ từ 1400px trở lên, hẹp hơn thì 4 rồi 3 — nếu không ô logo bị bóp
            nhỏ tới mức không đọc được.

            Lưới hai cột của bản cũ dành 300px bên phải cho panel chi tiết hãng.
            Panel đã bỏ nên logo dùng trọn bề ngang. */}
        <div>
          {/* --- Lưới logo --- */}
          <ul
            className="flex flex-wrap justify-center gap-2.5 sm:gap-3 min-[1400px]:gap-4"
            onMouseLeave={() => setPaused(false)}
          >
            {brands.map((b, i) => {
              const on = i === active
              return (
                <li
                  key={b.slug}
                  className={`w-[calc((100%-1.25rem)/3)] sm:w-[calc((100%-2.25rem)/4)] ${TILE_WIDTH}`}
                  onMouseEnter={() => {
                    setActive(i)
                    setPaused(true)
                  }}
                >
                  {/* Trỏ thẳng tới trang riêng của hãng. Trước đây trỏ vào bộ lọc
                      trang Sản phẩm vì chưa có trang thương hiệu; nay có rồi thì
                      đó mới là đích đúng. */}
                  <Link
                    href={path(`/thuong-hieu/${b.slug}`)}
                    title={t.brands.productsOf(b.name)}
                    onFocus={() => setActive(i)}
                    className={`relative flex aspect-[5/2] items-center justify-center overflow-hidden rounded-xl bg-white p-2 transition-all duration-300 ease-entrance sm:p-2.5 min-[1400px]:p-3.5 ${
                      on
                        ? 'z-10 scale-[1.12] shadow-[0_14px_36px_rgba(0,0,0,.32)] ring-2 ring-white'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {b.logo ? (
                      <Image
                        src={b.logo}
                        alt={b.name}
                        width={320}
                        height={128}
                        sizes="(max-width: 640px) 30vw, (max-width: 1024px) 22vw, 180px"
                        className="max-h-full w-auto max-w-full object-contain"
                      />
                    ) : (
                      // Chưa có file logo thì hiện tên hãng, nếu không ô sẽ trống
                      // và khách không biết đó là thương hiệu nào.
                      <span className="px-0.5 text-center font-display text-[13px] font-bold leading-tight text-ktd-800 sm:text-[13px] min-[1400px]:text-[15px]">
                        {b.name}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Panel chi tiết hãng đã bỏ theo đoạn 14 của "Sửa web 4".
              Nội dung đó nay nằm ở trang riêng của từng hãng
              (/thuong-hieu/{slug}), nên để lại đây là nói hai lần. */}
        </div>

        <div className="mt-10 text-center md:mt-12">
          <Link
            href={path('/san-pham')}
            className="inline-flex min-h-[44px] items-center rounded-md border border-[rgba(199,223,239,.35)] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[rgba(199,223,239,.12)]"
          >
            {t.brands.cta}
          </Link>
        </div>
      </div>
    </section>
  )
}
