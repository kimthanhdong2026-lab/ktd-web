'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FloatingCTA } from '@/components/FloatingCTA'
import { SearchOverlay } from '@/components/SearchOverlay'
import { RFQModal } from '@/components/RFQModal'
import { Toast } from '@/components/Toast'
import { Product, Brand, Category } from '@/lib/types'

interface LayoutWrapperProps {
  children: React.ReactNode
  products: (Product & { brandName: string; categoryName: string })[]
  brands: Brand[]
  categories: Category[]
}

interface CartItem {
  partNumber: string
  name: string
  brand: string
  qty: number
}

export function LayoutWrapper({ children, products, brands, categories }: LayoutWrapperProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [rfqOpen, setRfqOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [toast, setToast] = useState<string | null>(null)

  const addToCart = (partNumber: string) => {
    const product = products.find((p) => p.part_number === partNumber)
    if (!product) return

    setCart((prev) => {
      const existing = prev.find((item) => item.partNumber === partNumber)
      if (existing) {
        return prev.map((item) =>
          item.partNumber === partNumber ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [
        ...prev,
        {
          partNumber,
          name: product.name_vi,
          brand: product.brandName,
          qty: 1,
        },
      ]
    })
    setToast(`✓ Đã thêm ${product.name_vi} vào yêu cầu báo giá`)
  }

  const removeFromCart = (partNumber: string) => {
    setCart((prev) => prev.filter((item) => item.partNumber !== partNumber))
  }

  const updateQty = (partNumber: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.partNumber === partNumber
            ? { ...item, qty: Math.max(1, item.qty + delta) }
            : item
        )
        .filter((item) => item.qty > 0)
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onSearchClick={() => setSearchOpen(true)}
        onRfqClick={() => setRfqOpen(true)}
        cartCount={cart.length}
      />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      {/* Modals & Overlays */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products}
        brands={brands}
        categories={categories}
      />

      <RFQModal
        isOpen={rfqOpen}
        onClose={() => setRfqOpen(false)}
        cart={cart}
        onRemoveFromCart={removeFromCart}
        onUpdateQty={updateQty}
        onProductsClick={() => {
          setRfqOpen(false)
          // TODO: navigate to products
        }}
      />

      {/* Floating CTA */}
      <FloatingCTA
        cartCount={cart.length}
        onRfqClick={() => setRfqOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  )
}
