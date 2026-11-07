import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { QuoteButton } from '@/components/QuoteButton'
import { href, type Dictionary, type Locale } from '@/lib/i18n'
import type { Product } from '@/lib/ktd-data'
import type { BaiViet } from '@/lib/tin-tuc'
import { ThanBai } from './ThanBai'

/** Bọc một phần của bài: web để nguyên, màn hình quản trị bọc khung "Sửa". */
export type KhungBai = (khoa: 'bai.dau' | 'bai.than', node: ReactNode) => ReactNode

/**
 * Trang một bài viết. Dùng ở web thật và màn hình quản trị /admin/tin-tuc/<slug>.
 */
export function TrangBaiViet({
  bai,
  related,
  lang,
  t,
  khung = (_, node) => node,
}: {
  bai: BaiViet
  related: Product[]
  lang: Locale
  t: Dictionary
  khung?: KhungBai
}) {
  const path = (p: string) => href(p, lang)
  return (
    <article className="mx-auto max-w-prose px-5 pb-16 pt-10 md:pb-24">
      <nav aria-label="Breadcrumb" className="mb-6 text-body-sm text-ink-500">
        <Link href={path('/')}>{t.nav.home}</Link> / <Link href={path('/tin-tuc')}>{t.nav.news}</Link>
      </nav>

      {khung(
        'bai.dau',
        <div>
          <p className="label-caps mb-3.5 text-ktd-600">{bai.catLabel}</p>
          <h1 className="mb-4 font-display text-[30px] font-bold leading-tight text-ink-900 md:text-[38px]">{bai.title}</h1>
          <p className="mb-8 text-sm text-[#9aa3ad]">{bai.date}</p>
          <div className="placeholder-hatch relative mb-8 flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-ink-100">
            {bai.image ? (
              <Image src={bai.image} alt="" fill sizes="(max-width: 768px) 100vw, 680px" className="object-cover" />
            ) : (
              <span className="relative font-mono text-[13px] text-[#9aa3ad]">{t.news.imagePlaceholder}</span>
            )}
          </div>
        </div>
      )}

      {khung(
        'bai.than',
        <div>
          <p className="mb-5 text-lg leading-[1.8] text-ink-700">{bai.excerpt}</p>
          {bai.body.length ? (
            <ThanBai doan={bai.body} />
          ) : (
            <p className="mb-5 text-[17px] leading-[1.8] text-ink-700">{t.news.bodyPlaceholder}</p>
          )}
        </div>
      )}

      <section className="mt-10 border-t border-hairline pt-8">
        <h2 className="mb-5 font-display text-[22px] font-bold text-ink-900">{t.news.related}</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {related.map((p) => (
            <li key={p.part}>
              <Link href={path(`/san-pham/${p.slug}`)} className="block h-full rounded-[10px] border border-hairline p-4 transition hover:shadow-md">
                <span className="mb-1.5 block font-display text-[15px] font-semibold leading-tight text-ink-900">{p.name}</span>
                <span className="part-no block text-[13px] text-ink-500">{p.part}</span>
                <span className="mt-1 block text-[13px] text-ink-500">{p.brandLabel}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8">
        <QuoteButton />
      </div>
    </article>
  )
}
