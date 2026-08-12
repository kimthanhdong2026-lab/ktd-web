'use client'

import { useStore } from '@/components/StoreProvider'
import { pdfLine, type Product } from '@/lib/ktd-data'

/**
 * Spec C3 must-have #4 — the series catalog download, the core difference
 * from the Mekong Sling reference. Wired to a real file once Sales finishes
 * scanning the series catalogs (spec E4 item 5).
 */
export function CatalogButton({ product }: { product: Product }) {
  const { showToast } = useStore()

  return (
    <button
      type="button"
      onClick={() => showToast(`Đang tải Catalog ${product.pdf.name} (${product.pdf.size})…`)}
      className="mb-6 flex w-full items-center gap-3.5 rounded-[10px] border-[1.5px] border-ktd-600 bg-white px-4 py-3.5 text-left font-semibold text-ktd-600 transition-colors hover:bg-ktd-50"
    >
      <span className="text-xl" aria-hidden="true">⬇</span>
      <span className="flex flex-col leading-snug">
        <span className="text-[15px]">Tải Catalog Series (PDF)</span>
        <span className="font-mono text-xs font-normal text-ink-500">{pdfLine(product)}</span>
      </span>
    </button>
  )
}
