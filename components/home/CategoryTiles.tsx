import Image from 'next/image'
import Link from 'next/link'
import {
  IconBevel,
  IconClamp,
  IconCoupling,
  IconDiamond,
  IconDrill,
  IconGear,
  IconGrind,
  IconHoist,
  IconHoneycomb,
  IconQr,
  IconScrewdriver,
  IconShield,
  IconTarget,
  IconWave,
} from '@/components/Icons'
import { CATEGORIES } from '@/lib/ktd-data'

const ICONS: Record<string, (p: { className?: string }) => JSX.Element> = {
  shield: IconShield,
  drill: IconDrill,
  grind: IconGrind,
  clamp: IconClamp,
  target: IconTarget,
  qr: IconQr,
  hoist: IconHoist,
  gear: IconGear,
  screwdriver: IconScrewdriver,
  bevel: IconBevel,
  honeycomb: IconHoneycomb,
  wave: IconWave,
  diamond: IconDiamond,
  coupling: IconCoupling,
}

/**
 * Danh mục sản phẩm dạng ô lớn — bố cục theo bản demo của team web.
 *
 * Mỗi ô là một đường dẫn tới trang Sản phẩm đã lọc sẵn theo danh mục đó, nên
 * bấm vào bất kỳ chỗ nào trong ô cũng đi đúng chỗ.
 *
 * Nền ô hiện là dải màu kỹ thuật. Khi Marketing cấp ảnh minh họa từng danh mục,
 * chỉ cần thêm trường `image` vào CATEGORIES và đặt làm ảnh nền — phần chữ đã có
 * sẵn lớp phủ tối nên không phải chỉnh gì thêm.
 */
export function CategoryTiles() {
  return (
    <section className="bg-ktd-50 py-14 md:py-24">
      <div className="container-ktd">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-10">
          <div>
            <h2 className="mb-3 font-display text-h2 text-ink-900">Danh mục sản phẩm</h2>
            <p className="text-[15px] leading-relaxed text-ink-500">
              Giải pháp và thiết bị chuyên nghiệp cho sản xuất &amp; công nghiệp.
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {CATEGORIES.map((c, i) => {
              const Icon = ICONS[c.icon]
              return (
                <li key={c.slug}>
                  <Link
                    href={`/san-pham?category=${c.slug}`}
                    className="group relative flex h-full min-h-[190px] flex-col overflow-hidden rounded-xl bg-ktd-900 p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {c.image ? (
                      // Ảnh thiết bị đặt chìm: giảm độ đậm rồi phủ dải tối lên trên,
                      // vừa nhận ra thiết bị vừa giữ chữ trắng đọc được.
                      <Image
                        src={c.image}
                        alt=""
                        fill
                        sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
                        className="absolute inset-0 object-cover opacity-60 transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span
                        className="placeholder-hatch-dark absolute inset-0 opacity-60"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(180deg,rgba(0,38,63,.40) 0%,rgba(0,38,63,.87) 62%)',
                      }}
                      aria-hidden="true"
                    />

                    <span className="relative font-mono text-[13px] font-medium text-ktd-100/70">
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <span className="relative mt-auto">
                      {Icon && <Icon className="mb-2.5 h-6 w-6 text-white" />}
                      <span className="mb-1 block font-display text-[15px] font-semibold leading-snug text-white">
                        {c.name}
                      </span>
                      <span className="block pr-8 text-[12px] leading-relaxed text-ktd-100/85">
                        {c.sub}
                      </span>
                    </span>

                    <span
                      className="absolute bottom-3.5 right-3.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/40 text-[13px] text-white transition-colors group-hover:border-white group-hover:bg-white group-hover:text-ktd-900"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
