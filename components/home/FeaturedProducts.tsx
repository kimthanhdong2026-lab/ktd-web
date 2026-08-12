'use client'

import { useState } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { PRODUCTS } from '@/lib/ktd-data'
import { cx } from '@/lib/utils'

const TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'new', label: 'Mới' },
  { id: 'best', label: 'Bán chạy' },
] as const

type TabId = (typeof TABS)[number]['id']

export function FeaturedProducts() {
  const [tab, setTab] = useState<TabId>('all')

  const products = (
    tab === 'new'
      ? PRODUCTS.filter((p) => p.tag === 'Mới')
      : tab === 'best'
        ? PRODUCTS.filter((p) => p.tag === 'Bán chạy')
        : PRODUCTS.filter((p) => p.featured)
  ).slice(0, 8)

  return (
    <section className="bg-white py-14 md:py-24">
      <div className="container-ktd">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-h2 text-ink-900">Sản phẩm được quan tâm nhất</h2>
          <div className="flex gap-1 rounded-[10px] bg-ink-100 p-1" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cx(
                  'rounded-[7px] px-4 py-2.5 text-sm font-semibold transition-colors md:px-5',
                  tab === t.id ? 'bg-white text-ktd-600 shadow-sm' : 'text-ink-500 hover:text-ink-700'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-[22px]">
          {products.map((p) => (
            <ProductCard key={p.part} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
