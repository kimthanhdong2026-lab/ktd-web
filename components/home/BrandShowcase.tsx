'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BRANDS } from '@/lib/ktd-data'
import { BRANDS_CTA, BRANDS_EYEBROW, BRANDS_INTRO } from '@/lib/constants'

/** Nhịp tự chuyển giữa các thương hiệu (ms). */
const ROTATE_MS = 3600

/**
 * Khối "thương hiệu phân phối" theo yêu cầu tài liệu L3: giữ đủ 18 logo trên
 * lưới, cứ mỗi vài giây có một ô tự nổi to lên và thông tin hãng đó hiện ở
 * cột bên phải. Rê chuột (hoặc tab tới) một logo thì ô đó được chọn ngay và
 * vòng quay tạm dừng cho tới khi rời chuột.
 */
export function BrandShowcase() {
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
    const id = window.setInterval(() => setActive((i) => (i + 1) % BRANDS.length), ROTATE_MS)
    return () => window.clearInterval(id)
  }, [paused, visible])

  const brand = BRANDS[active]

  return (
    <section
      id="thuong-hieu"
      ref={sectionRef}
      className="relative overflow-hidden py-14 md:py-24"
      style={{
        background:
          'linear-gradient(135deg,#00263F 0%,#003F6C 52%,#0060A0 100%)',
      }}
    >
      {/* Vệt sáng nhẹ ở góc phải cho nền xanh đỡ phẳng */}
      <span
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle,rgba(0,107,178,.55) 0%,rgba(0,107,178,0) 70%)' }}
        aria-hidden="true"
      />

      {/* Khối logo cần bề ngang lớn hơn khung chung (1360px) thì hai bên mới
          không bị trống và tiêu đề mới đủ chỗ nằm một dòng. */}
      <div className="relative mx-auto w-full max-w-[1600px] px-5 sm:px-6 md:px-8 lg:px-10">
        <div className="mb-11 text-center md:mb-16">
          <p className="label-caps mb-3 text-[#7FB3D5]">{BRANDS_EYEBROW}</p>
          <h2 className="mb-5 font-display text-h2 text-white [text-wrap:balance]">
            {BRANDS.length} thương hiệu quốc tế chúng tôi đang phân phối
          </h2>
          <p className="mx-auto max-w-[1100px] text-body-lg text-ktd-100 [text-wrap:balance]">
            {BRANDS_INTRO}
          </p>
        </div>

        {/* Số cột logo đổi theo khổ màn: 6 cột (18 hãng = đúng 3 hàng) chỉ đủ
            chỗ từ 1400px trở lên, hẹp hơn thì 4 rồi 3 — nếu không ô logo bị bóp
            nhỏ tới mức không đọc được. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center lg:gap-10 min-[1400px]:grid-cols-[minmax(0,1fr)_340px] min-[1400px]:gap-12">
          {/* --- Lưới logo --- */}
          <ul
            className="flex flex-wrap justify-center gap-2.5 sm:gap-3 min-[1400px]:gap-4"
            onMouseLeave={() => setPaused(false)}
          >
            {BRANDS.map((b, i) => {
              const on = i === active
              return (
                <li
                  key={b.slug}
                  className="w-[calc((100%-1.25rem)/3)] sm:w-[calc((100%-2.25rem)/4)] xl:w-[calc((100%-3.75rem)/6)] min-[1400px]:w-[calc((100%-5rem)/6)]"
                  onMouseEnter={() => {
                    setActive(i)
                    setPaused(true)
                  }}
                >
                  <Link
                    href={`/san-pham?brand=${b.slug}`}
                    title={`Sản phẩm ${b.name}`}
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
                      <span className="px-0.5 text-center font-display text-[11px] font-bold leading-tight text-ktd-800 sm:text-[12px] min-[1400px]:text-[15px]">
                        {b.name}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* --- Thông tin hãng đang được chọn --- */}
          <div className="min-h-[228px] rounded-lg border border-[rgba(199,223,239,.22)] bg-[rgba(0,38,63,.35)] p-6 md:p-8 lg:min-h-[268px]">
            {/* key = slug để mỗi lần đổi hãng nội dung chạy lại hiệu ứng trượt lên */}
            <div key={brand.slug} className="animate-fadeup">
              <p className="label-caps mb-2.5 text-[#7FB3D5]">{brand.origin}</p>
              <h3 className="mb-3.5 font-display text-[26px] font-bold leading-tight text-white md:text-[30px]">
                {brand.name}
              </h3>
              <p className="mb-6 text-[15px] leading-relaxed text-ktd-100">{brand.desc}</p>
              <Link
                href={`/san-pham?brand=${brand.slug}`}
                className="inline-flex min-h-[44px] items-center text-sm font-semibold text-white underline-offset-4 hover:underline"
              >
                Xem sản phẩm {brand.name} →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center md:mt-12">
          <Link
            href="/san-pham"
            className="inline-flex min-h-[44px] items-center rounded-md border border-[rgba(199,223,239,.35)] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[rgba(199,223,239,.12)]"
          >
            {BRANDS_CTA}
          </Link>
        </div>
      </div>
    </section>
  )
}
