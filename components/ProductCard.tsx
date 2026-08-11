'use client'

import Link from 'next/link'
import { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product & {
    brandName: string
    categoryName: string
  }
  variant?: 'home' | 'listing' | 'related'
  onAddToCart?: (partNumber: string) => void
}

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  'Mới': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Bán chạy': { bg: 'bg-ktd-red/10', text: 'text-ktd-red' },
}

export function ProductCard({ product, variant = 'listing', onAddToCart }: ProductCardProps) {
  const badge = product.is_featured ? { label: 'Bán chạy', color: BADGE_COLORS['Bán chạy'] } : null

  if (variant === 'related') {
    return (
      <Link href={`/san-pham/${product.slug}`}>
        <div className="bg-white border border-ktd-light/80 rounded-lg overflow-hidden hover:shadow-lg hover:border-ktd-light/50 transition-all cursor-pointer">
          <div className="aspect-video bg-ktd-light flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-ktd-light via-ktd-light to-ktd-light/80 opacity-60"></div>
            <span className="relative text-ktd-dark/30 text-sm font-mono">[ ẢNH ]</span>
          </div>
          <div className="p-4">
            <div className="text-sm font-semibold text-ktd-dark leading-tight mb-2 line-clamp-2">
              {product.name_vi}
            </div>
            <div className="font-mono text-sm text-ktd-blue">{product.part_number}</div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/san-pham/${product.slug}`}>
      <div className="bg-white border border-ktd-light/80 rounded-lg overflow-hidden hover:shadow-lg hover:border-ktd-light/50 transition-all cursor-pointer flex flex-col h-full">
        {/* Image */}
        <div className="aspect-video bg-ktd-light flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-ktd-light via-ktd-light to-ktd-light/80 opacity-60"></div>
          {badge && (
            <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded z-10 ${badge.color.bg} ${badge.color.text}`}>
              {badge.label}
            </span>
          )}
          <span className="relative text-ktd-dark/30 text-sm font-mono">[ ẢNH ]</span>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <div className="text-xs font-semibold uppercase text-ktd-dark/60 mb-2">
            {product.categoryName}
          </div>
          <div className="text-base font-semibold text-ktd-dark mb-2 line-clamp-2 leading-tight">
            {product.name_vi}
          </div>
          <div className="font-mono text-sm text-ktd-blue mb-3">{product.part_number}</div>
          <div className="text-sm text-ktd-dark/70 line-clamp-2 mb-4 flex-1 leading-relaxed">
            {product.short_desc_vi}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={(e) => {
                e.preventDefault()
                onAddToCart?.(product.part_number)
              }}
              className="flex-1 bg-ktd-red text-white rounded px-3 py-2 text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              + Thêm báo giá
            </button>
            <button
              onClick={(e) => e.preventDefault()}
              className="bg-white border-2 border-ktd-blue text-ktd-blue rounded px-3 py-2 text-sm font-semibold hover:bg-blue-50 transition-colors"
            >
              Chi tiết →
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
