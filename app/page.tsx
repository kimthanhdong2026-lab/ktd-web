'use client'

import { HomePage } from './page-home'
import { LayoutWrapper } from './layout-wrapper'

// Mock data
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
  brandName: ['Martor', 'Morrisflex', 'ATA', 'Tecna', 'Helical'][i % 5],
  categoryName: ['Dụng cụ cắt gọt', 'Dụng cụ khí nén', 'Dụng cụ an toàn', 'Thiết bị đo', 'Thiết bị nâng hạ', 'Kẹp & gá', 'Đánh dấu', 'Hóa chất', 'Siết lực'][i % 9],
}))

const mockBrands = [
  { id: 1, slug: 'martor', name_vi: 'Martor', name_en: 'Martor', origin: 'Đức', sort_order: 0 },
  { id: 2, slug: 'morrisflex', name_vi: 'Morrisflex', name_en: 'Morrisflex', origin: 'Quốc tế', sort_order: 1 },
  { id: 3, slug: 'ata', name_vi: 'ATA', name_en: 'ATA', origin: 'Quốc tế', sort_order: 2 },
  { id: 4, slug: 'tecna', name_vi: 'Tecna', name_en: 'Tecna', origin: 'Ý', sort_order: 3 },
  { id: 5, slug: 'helical', name_vi: 'Helical', name_en: 'Helical', origin: 'Mỹ', sort_order: 4 },
]

const mockCategories = [
  { id: 1, slug: 'cat-got', name_vi: 'Dụng cụ cắt gọt', name_en: 'Cutting Tools', sort_order: 0, icon: '🔧' },
  { id: 2, slug: 'khi-nen', name_vi: 'Dụng cụ khí nén', name_en: 'Pneumatic Tools', sort_order: 1, icon: '💨' },
  { id: 3, slug: 'an-toan', name_vi: 'Dụng cụ an toàn', name_en: 'Safety Tools', sort_order: 2, icon: '🛡️' },
  { id: 4, slug: 'do-kiem', name_vi: 'Thiết bị đo & kiểm tra', name_en: 'Measuring Equipment', sort_order: 3, icon: '📐' },
  { id: 5, slug: 'nang-ha', name_vi: 'Thiết bị nâng hạ', name_en: 'Lifting Equipment', sort_order: 4, icon: '🏗️' },
  { id: 6, slug: 'kep-ga', name_vi: 'Kẹp, gá & khuôn mẫu', name_en: 'Clamps & Fixtures', sort_order: 5, icon: '🗜️' },
  { id: 7, slug: 'danh-dau', name_vi: 'Đánh dấu & truy xuất', name_en: 'Marking Tools', sort_order: 6, icon: '🔖' },
  { id: 8, slug: 'hoa-chat', name_vi: 'Hóa chất & bôi trơn', name_en: 'Chemicals & Lubricants', sort_order: 7, icon: '🧪' },
  { id: 9, slug: 'siet-luc', name_vi: 'Siết lực & taro', name_en: 'Torque & Threading', sort_order: 8, icon: '⚙️' },
]

const mockNews = [
  { id: 1, slug: 'tin-1', title_vi: 'Giới thiệu sản phẩm mới từ Martor', category_vi: 'Tin công ty', excerpt_vi: 'KTĐ vừa công bố loạt sản phẩm mới từ Martor...', published_at: '2026-08-10' },
  { id: 2, slug: 'tin-2', title_vi: 'Hướng dẫn chọn đúng dao an toàn', category_vi: 'Kiến thức kỹ thuật', excerpt_vi: 'Cách chọn dao an toàn phù hợp...', published_at: '2026-08-08' },
  { id: 3, slug: 'tin-3', title_vi: 'Tối ưu hóa hiệu quả sản xuất', category_vi: 'Giải pháp ứng dụng', excerpt_vi: 'Nhà máy giảm chi phí 30%...', published_at: '2026-08-05' },
]

export default function Home() {
  return (
    <LayoutWrapper products={mockProducts} brands={mockBrands} categories={mockCategories}>
      <HomePage products={mockProducts} brands={mockBrands} categories={mockCategories} news={mockNews} />
    </LayoutWrapper>
  )
}
