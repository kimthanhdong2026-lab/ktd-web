import Image from 'next/image'
import Link from 'next/link'
import { href, type Dictionary, type Locale } from '@/lib/i18n'
import type { BaiViet } from '@/lib/tin-tuc'

/** Khối "Tin tức & Kiến thức" cuối trang chủ: ba bài mới nhất. */
export function NewsBlock({ t, lang, news }: { t: Dictionary; lang: Locale; news: BaiViet[] }) {
  const path = (p: string) => href(p, lang)
  return (
    <section className="bg-surface py-14 md:py-24">
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
                  {n.image ? (
                    <Image src={n.image} alt="" fill sizes="(max-width: 768px) 100vw, 440px" className="object-cover" />
                  ) : (
                    <span className="relative font-mono text-[13px] text-[#9aa3ad]">{t.news.imagePlaceholder}</span>
                  )}
                </span>
                <span className="block p-5 md:p-6">
                  <span className="label-caps mb-2.5 block text-ktd-600">{n.catLabel}</span>
                  <span className="mb-3 block font-display text-[19px] font-semibold leading-snug text-ink-900">{n.title}</span>
                  <span className="block text-[13px] text-[#9aa3ad]">{n.date}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
