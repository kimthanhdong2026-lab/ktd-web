import { Suspense } from 'react'
import Link from 'next/link'
import { CATEGORY_ICONS } from '@/lib/constants'
import { ProductCard } from '@/components/ProductCard'
import { Product, Brand, Category } from '@/lib/types'

interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

// Mock data - replace with Supabase fetch
const mockProducts = Array.from({ length: 26 }, (_, i) => ({
  id: i + 1,
  part_number: `PART-${String(i + 1).padStart(5, '0')}`,
  slug: `san-pham-${i + 1}`,
  name_vi: `Sản phẩm công nghiệp ${i + 1}`,
  name_en: `Industrial Product ${i + 1}`,
  brand_id: (i % 5) + 1,
  category_id: (i % 9) + 1,
  series_name: `Series A`,
  origin: 'Quốc tế',
  short_desc_vi: 'Mô tả ngắn sản phẩm',
  is_featured: i < 6,
  sort_order: i,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
})) as Product[]

const mockBrands = [
  { id: 1, slug: 'martor', name_vi: 'Martor', name_en: 'Martor', origin: 'Đức', sort_order: 0 },
  { id: 2, slug: 'morrisflex', name_vi: 'Morrisflex', name_en: 'Morrisflex', origin: 'Quốc tế', sort_order: 1 },
  { id: 3, slug: 'ata', name_vi: 'ATA', name_en: 'ATA', origin: 'Quốc tế', sort_order: 2 },
  { id: 4, slug: 'tecna', name_vi: 'Tecna', name_en: 'Tecna', origin: 'Ý', sort_order: 3 },
  { id: 5, slug: 'helical', name_vi: 'Helical', name_en: 'Helical', origin: 'Mỹ', sort_order: 4 },
] as Brand[]

const mockCategories = [
  { id: 1, slug: 'cat-got', name_vi: 'Dụng cụ cắt gọt', name_en: 'Cutting Tools', sort_order: 0 },
  { id: 2, slug: 'khi-nen', name_vi: 'Dụng cụ khí nén', name_en: 'Pneumatic Tools', sort_order: 1 },
  { id: 3, slug: 'an-toan', name_vi: 'Dụng cụ an toàn', name_en: 'Safety Tools', sort_order: 2 },
  { id: 4, slug: 'do-kiem', name_vi: 'Thiết bị đo & kiểm tra', name_en: 'Measuring Equipment', sort_order: 3 },
  { id: 5, slug: 'nang-ha', name_vi: 'Thiết bị nâng hạ', name_en: 'Lifting Equipment', sort_order: 4 },
  { id: 6, slug: 'kep-ga', name_vi: 'Kẹp, gá & khuôn mẫu', name_en: 'Clamps & Fixtures', sort_order: 5 },
  { id: 7, slug: 'danh-dau', name_vi: 'Đánh dấu & truy xuất', name_en: 'Marking Tools', sort_order: 6 },
  { id: 8, slug: 'hoa-chat', name_vi: 'Hóa chất & bôi trơn', name_en: 'Chemicals & Lubricants', sort_order: 7 },
  { id: 9, slug: 'siet-luc', name_vi: 'Siết lực & taro', name_en: 'Torque & Threading', sort_order: 8 },
] as Category[]

export const metadata = {
  title: 'Tìm đúng thiết bị bạn cần | Kim Thành Đông',
  description: '26 sản phẩm từ 21 thương hiệu quốc tế. Tìm kiếm, lọc theo danh mục, thương hiệu.',
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const brandFilter = searchParams.brand as string | undefined
  const categoryFilter = searchParams.category as string | undefined
  const query = searchParams.q as string | undefined

  // Filter products
  let filtered = mockProducts
  if (brandFilter) {
    const brand = mockBrands.find((b) => b.slug === brandFilter)
    filtered = filtered.filter((p) => p.brand_id === brand?.id)
  }
  if (categoryFilter) {
    const category = mockCategories.find((c) => c.slug === categoryFilter)
    filtered = filtered.filter((p) => p.category_id === category?.id)
  }
  if (query) {
    const q = query.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name_vi.toLowerCase().includes(q) ||
        p.part_number.toLowerCase().includes(q)
    )
  }

  // Enrich products
  const enrichedProducts = filtered.map((p) => ({
    ...p,
    brandName: mockBrands.find((b) => b.id === p.brand_id)?.name_vi || 'Unknown',
    categoryName: mockCategories.find((c) => c.id === p.category_id)?.name_vi || 'Unknown',
  }))

  // Group by brand if single category, else by category
  const grouped = new Map<number, typeof enrichedProducts>()
  enrichedProducts.forEach((p) => {
    const key = categoryFilter ? p.brand_id : p.category_id
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(p)
  })

  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-vietnam text-ktd-dark mb-3">
          Tìm đúng thiết bị bạn cần
        </h1>
        <p className="text-lg text-ktd-dark/70 max-w-3xl">
          26 sản phẩm từ 21 thương hiệu chính hãng. Lọc theo thương hiệu, danh mục, hoặc tìm bằng tiếng Việt lẫn tiếng Anh.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-ktd-light border border-ktd-light/80 rounded-lg px-6 py-4 mb-8 flex items-center gap-4">
        <span className="text-2xl">🔍</span>
        <input
          type="text"
          placeholder="Tìm mã hàng, tên sản phẩm, thương hiệu…"
          defaultValue={query || ''}
          className="flex-1 bg-transparent outline-none text-lg text-ktd-dark placeholder:text-ktd-dark/40"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-ktd-dark font-vietnam">BỘ LỌC</h3>
            <Link href="/san-pham" className="text-sm text-ktd-dark/60 hover:text-ktd-dark underline">
              Xóa hết
            </Link>
          </div>

          {/* Brand Filter */}
          <div className="mb-8">
            <div className="text-xs font-bold uppercase text-ktd-dark mb-4 tracking-widest">▸ THƯƠNG HIỆU</div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {mockBrands.map((brand) => {
                const count = mockProducts.filter((p) => p.brand_id === brand.id).length
                const isActive = brandFilter === brand.slug
                return (
                  <Link key={brand.id} href={`/san-pham?brand=${brand.slug}`}>
                    <label className={`flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-ktd-light ${
                      isActive ? 'bg-ktd-light/60' : ''
                    }`}>
                      <input
                        type="checkbox"
                        checked={isActive}
                        readOnly
                        className="w-4 h-4 accent-ktd-blue"
                      />
                      <span className="flex-1 text-sm text-ktd-dark">{brand.name_vi}</span>
                      <span className="text-xs text-ktd-dark/60">{count}</span>
                    </label>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="text-xs font-bold uppercase text-ktd-dark mb-4 tracking-widest">▸ DANH MỤC</div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mockCategories.map((cat) => {
                const count = mockProducts.filter((p) => p.category_id === cat.id).length
                const isActive = categoryFilter === cat.slug
                return (
                  <Link key={cat.id} href={`/san-pham?category=${cat.slug}`}>
                    <label className={`flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-ktd-light ${
                      isActive ? 'bg-ktd-light/60' : ''
                    }`}>
                      <input
                        type="checkbox"
                        checked={isActive}
                        readOnly
                        className="w-4 h-4 accent-ktd-blue"
                      />
                      <span className="flex-1 text-sm text-ktd-dark">{cat.name_vi}</span>
                      <span className="text-xs text-ktd-dark/60">{count}</span>
                    </label>
                  </Link>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div className="text-lg text-ktd-dark">
              <span className="font-bold">{enrichedProducts.length}</span> sản phẩm phù hợp
            </div>
            <select className="border border-ktd-light/80 rounded px-3 py-2 text-sm text-ktd-dark bg-white">
              <option>Mặc định</option>
              <option>Thương hiệu A–Z</option>
              <option>Tên A–Z</option>
              <option>Mới nhất</option>
            </select>
          </div>

          {enrichedProducts.length === 0 ? (
            <div className="bg-ktd-light rounded-lg p-12 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-ktd-dark mb-2">Không tìm thấy sản phẩm phù hợp</h3>
              <p className="text-ktd-dark/70 mb-6">
                Thử bỏ bớt bộ lọc, hoặc để kỹ sư của chúng tôi tìm giúp bạn.
              </p>
              <button className="bg-ktd-red text-white rounded px-6 py-2 font-semibold hover:bg-red-700">
                Nhờ kỹ sư tìm giúp
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {Array.from(grouped.entries()).map(([groupKey, items]) => {
                const groupName = categoryFilter
                  ? mockBrands.find((b) => b.id === groupKey)?.name_vi
                  : mockCategories.find((c) => c.id === groupKey)?.name_vi
                const groupIcon = !categoryFilter ? CATEGORY_ICONS[mockCategories.find((c) => c.id === groupKey)?.slug || ''] : undefined

                return (
                  <div key={groupKey}>
                    <div className="flex items-baseline gap-4 border-b-2 border-ktd-light pb-3 mb-6">
                      <h3 className="text-2xl font-bold font-vietnam text-ktd-navy uppercase">
                        {groupIcon && <span className="mr-2">{groupIcon}</span>}
                        {groupName}
                      </h3>
                      <span className="text-sm text-ktd-dark/60 ml-auto">{items.length} sản phẩm</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {items.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          variant="listing"
                          onAddToCart={() => {
                            /* TODO: connect to cart */
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
