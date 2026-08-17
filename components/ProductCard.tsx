'use client'

import Link from 'next/link'
import { useStore } from './StoreProvider'
import { brandName, categoryName, productSlug, type Product } from '@/lib/ktd-data'

interface ProductCardProps {
  product: Product
  /** "compact" drops the description + buttons, for the related-products rail. */
  variant?: 'full' | 'compact'
}

/**
 * Spec B5.2 — the single most important component.
 * The whole card links to the PDP via an overlay link; the "Thêm báo giá"
 * button sits above it so adding to the basket never navigates away.
 * Never renders price, WLL/load, or availability.
 */
export function ProductCard({ product, variant = 'full' }: ProductCardProps) {
  const { addToCart } = useStore()
  const href = `/san-pham/${productSlug(product)}`
  const crumb = `${brandName(product.brand)} › ${categoryName(product.category)}`

  return (
    <article className="group card relative flex flex-col overflow-hidden hover:border-[#cdd6de] hover:shadow-md">
      <div className="placeholder-hatch relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-ink-100">
        {product.tag && (
          <span
            className={`absolute left-3 top-3 z-[2] rounded-sm px-2.5 py-1 text-[11px] font-semibold text-white ${
              product.tag === 'Mới' ? 'bg-ktd-800' : 'bg-ktd-600'
            }`}
          >
            {product.tag}
          </span>
        )}
        <span className="relative rounded-sm border border-ink-300 bg-white px-2.5 py-1 font-mono text-xs text-ink-500">
          {product.part}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-[18px]">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
          {crumb}
        </p>

        <h3 className="mb-2 font-display text-[17px] font-semibold leading-tight text-ink-900 md:text-lg">
          <Link href={href} className="text-ink-900 after:absolute after:inset-0 hover:text-ktd-700">
            {product.name}
          </Link>
        </h3>

        <p className="part-no mb-2.5 text-[15px] text-ktd-600">{product.part}</p>

        {variant === 'full' && (
          <>
            <p className="mb-4 line-clamp-2 text-[13px] leading-relaxed text-ink-500">
              {product.desc}
            </p>

            <div className="relative z-10 mt-auto flex gap-2">
              <button
                type="button"
                onClick={() => addToCart(product.part)}
                className="min-h-[44px] flex-1 rounded-[7px] bg-ktd-600 px-2 text-[13px] font-semibold text-white transition-colors hover:bg-ktd-700"
              >
                + Thêm báo giá
              </button>
              <Link
                href={href}
                className="flex min-h-[44px] items-center rounded-[7px] border-[1.5px] border-ktd-600 px-3.5 text-[13px] font-semibold text-ktd-600 transition-colors hover:bg-ktd-50"
                aria-label={`Xem chi tiết ${product.name}`}
              >
                Chi tiết →
              </Link>
            </div>
          </>
        )}
      </div>
    </article>
  )
}
