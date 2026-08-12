'use client'

import { useState } from 'react'
import { useStore } from '@/components/StoreProvider'
import { pdfLine, productSectors, type Product } from '@/lib/ktd-data'
import { cx } from '@/lib/utils'

const TABS = [
  { id: 'mota', label: 'MÔ TẢ' },
  { id: 'spec', label: 'THÔNG SỐ KỸ THUẬT' },
  { id: 'app', label: 'ỨNG DỤNG' },
  { id: 'doc', label: 'TÀI LIỆU' },
] as const

type TabId = (typeof TABS)[number]['id']

export function ProductTabs({ product }: { product: Product }) {
  const [tab, setTab] = useState<TabId>('mota')
  const { showToast } = useStore()
  const sectors = productSectors(product)

  const downloadCatalog = () =>
    showToast(`Đang tải Catalog ${product.pdf.name} (${product.pdf.size})…`)

  return (
    <div className="mb-16">
      <div
        role="tablist"
        aria-label="Thông tin sản phẩm"
        className="mb-8 flex gap-1 overflow-x-auto border-b border-hairline"
      >
        {TABS.map((t) => (
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
        {tab === 'mota' && (
          <p className="text-[17px] leading-[1.75] text-ink-700">
            {product.desc} Sản phẩm được phân phối chính hãng bởi Kim Thành Đông, kèm hỗ trợ kỹ thuật
            và catalog đầy đủ của cả dòng {product.series}. Toàn bộ các mã còn lại trong series được
            cung cấp qua file catalog PDF đính kèm.
          </p>
        )}

        {tab === 'spec' && (
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
            {sectors.map((s) => (
              <li
                key={s}
                className="rounded-md border border-ktd-100 bg-ktd-50 px-4 py-2.5 text-[15px] text-ktd-700"
              >
                {s}
              </li>
            ))}
          </ul>
        )}

        {tab === 'doc' && (
          <div className="flex max-w-[560px] flex-wrap items-center gap-4 rounded-[10px] bg-ink-100 px-5 py-5 md:px-6">
            <span className="text-[32px]" aria-hidden="true">📄</span>
            <div className="min-w-[160px] flex-1">
              <p className="font-display text-base font-semibold text-ink-900">
                Catalog {product.series} Series
              </p>
              <p className="mt-1 font-mono text-[13px] text-ink-500">{pdfLine(product)}</p>
            </div>
            <button type="button" onClick={downloadCatalog} className="btn-primary">
              Tải về
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
