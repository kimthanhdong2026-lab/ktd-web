'use client'

import { useMemo, useState } from 'react'
import { pdfLine, productSectors, type Product } from '@/lib/ktd-data'
import { DEFAULT_LOCALE, dict, type Locale } from '@/lib/i18n'
import { cx } from '@/lib/utils'

/**
 * Các tab chỉ hiện khi thật sự có nội dung — sản phẩm nhập từ dữ liệu hãng
 * chưa có bảng thông số, nếu vẫn hiện tab rỗng thì khách bấm vào lại thấy
 * trang trắng.
 */
export function ProductTabs({
  product,
  lang = DEFAULT_LOCALE,
}: {
  product: Product
  lang?: Locale
}) {
  const T = dict(lang)
  const applications = product.applications?.length
    ? product.applications
    : productSectors(product)

  const tabs = useMemo(() => {
    const out: { id: string; label: string }[] = [{ id: 'mota', label: T.product.tabs.desc }]
    if (product.specs?.length) out.push({ id: 'spec', label: T.product.tabs.specs })
    if (applications.length) out.push({ id: 'app', label: T.product.tabs.apps })
    if (product.docPdf || product.pdf || product.docUrl)
      out.push({ id: 'doc', label: T.product.tabs.docs })
    return out
  }, [product, applications, T])

  const [tab, setTab] = useState(tabs[0].id)
  const line = pdfLine(product, T.product.pages)

  return (
    <div className="mb-16">
      <div
        role="tablist"
        aria-label={T.product.tabs.desc}
        className="mb-8 flex gap-1 overflow-x-auto border-b border-hairline"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={cx(
              '-mb-px whitespace-nowrap border-b-[3px] px-4 py-3.5 text-[15px] font-semibold transition-colors md:px-5',
              tab === t.id
                ? 'border-ktd-600 text-ktd-600'
                : 'border-transparent text-ink-500 hover:text-ink-700'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-[900px]" id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === 'mota' &&
          (product.descFull?.length ? (
            <div className="flex flex-col gap-4">
              {product.descFull.map((para, i) => (
                <p key={i} className="text-[17px] leading-[1.75] text-ink-700">
                  {para}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-[17px] leading-[1.75] text-ink-700">
              {product.desc} {T.product.descFallback(product.series)}
            </p>
          ))}

        {tab === 'spec' && product.specs?.length && (
          <div className="table-scroll">
            <table className="w-full min-w-[520px] border-collapse overflow-hidden rounded-md border border-hairline">
              <caption className="sr-only">Thông số kỹ thuật {product.name}</caption>
              <tbody>
                {product.specs.map(([k, v], i) => (
                  <tr key={k} className={i % 2 ? 'bg-ktd-50' : 'bg-white'}>
                    <th
                      scope="row"
                      className="w-[280px] border-b border-hairline px-5 py-3.5 text-left text-sm font-semibold text-ink-500"
                    >
                      {k}
                    </th>
                    <td className="border-b border-hairline px-5 py-3.5 text-[15px] text-ink-900">
                      {v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'app' && (
          <ul className="flex flex-wrap gap-2.5">
            {applications.map((a) => (
              <li
                key={a}
                className="rounded-md border border-ktd-100 bg-ktd-50 px-4 py-2.5 text-[15px] text-ktd-700"
              >
                {a}
              </li>
            ))}
          </ul>
        )}

        {tab === 'doc' && (
          <div className="flex flex-col gap-3">
            {product.docPdf && (
              <a
                href={product.docPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="flex max-w-[560px] flex-wrap items-center gap-4 rounded-[10px] bg-ink-100 px-5 py-5 transition-colors hover:bg-ktd-50 md:px-6"
              >
                <span className="text-[32px]" aria-hidden="true">📄</span>
                <span className="min-w-[160px] flex-1">
                  <span className="block font-display text-base font-semibold text-ink-900">
                    {T.product.docTitle(product.name)}
                  </span>
                  <span className="mt-1 block text-[13px] text-ink-500">
                    PDF · <span className="part-no">{product.part}</span>
                  </span>
                </span>
                <span className="btn-primary">{T.product.download}</span>
              </a>
            )}

            {!product.docPdf && product.pdf && (
              <div className="flex max-w-[560px] flex-wrap items-center gap-4 rounded-[10px] bg-ink-100 px-5 py-5 md:px-6">
                <span className="text-[32px]" aria-hidden="true">📄</span>
                <span className="min-w-[160px] flex-1">
                  <span className="block font-display text-base font-semibold text-ink-900">
                    {T.product.catalogTitle(product.series)}
                  </span>
                  <span className="mt-1 block font-mono text-[13px] text-ink-500">{line}</span>
                </span>
              </div>
            )}

            {product.docUrl && (
              <a
                href={product.docUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] font-semibold text-ktd-600 hover:text-ktd-700"
              >
                Xem thông tin sản phẩm trên trang hãng →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
