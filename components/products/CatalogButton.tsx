'use client'

import { useStore } from '@/components/StoreProvider'
import { pdfLine, type Product } from '@/lib/ktd-data'
import { DEFAULT_LOCALE, dict, type Locale } from '@/lib/i18n'

/**
 * Spec C3 — nút tải tài liệu.
 *  - Có datasheet thật (docPdf): tải thẳng file.
 *  - Chỉ có catalog series demo: báo toast cho tới khi có file thật.
 *  - Không có gì: ẩn nút, không để nút chết trên giao diện.
 */
export function CatalogButton({
  product,
  lang = DEFAULT_LOCALE,
}: {
  product: Product
  lang?: Locale
}) {
  const t = dict(lang)
  const { showToast } = useStore()
  const line = pdfLine(product, t.product.pages)

  const shell =
    'mb-6 flex w-full items-center gap-3.5 rounded-[10px] border-[1.5px] border-ktd-600 bg-white px-4 py-3.5 text-left font-semibold text-ktd-600 transition-colors hover:bg-ktd-50'

  const label = (title: string, sub?: string | null) => (
    <>
      <span className="text-xl" aria-hidden="true">⬇</span>
      <span className="flex flex-col leading-snug">
        <span className="text-[15px]">{title}</span>
        {sub && <span className="font-mono text-[13px] font-normal text-ink-500">{sub}</span>}
      </span>
    </>
  )

  if (product.docPdf) {
    return (
      <a href={product.docPdf} target="_blank" rel="noopener noreferrer" className={shell}>
        {label(t.product.downloadPdf, `${product.name} · ${product.part}`)}
      </a>
    )
  }

  if (product.pdf) {
    return (
      <button
        type="button"
        onClick={() => showToast(`Đang tải Catalog ${product.pdf!.name} (${product.pdf!.size})…`)}
        className={shell}
      >
        {label(t.product.catalogTitle(product.series), line)}
      </button>
    )
  }

  if (product.docUrl) {
    return (
      <a href={product.docUrl} target="_blank" rel="noopener noreferrer" className={shell}>
        {label(t.product.manufacturerPage)}
      </a>
    )
  }

  return null
}
