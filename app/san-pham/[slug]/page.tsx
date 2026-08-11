import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard'

interface PDPPageProps {
  params: { slug: string }
}

// Mock data
const mockProduct = {
  id: 1,
  part_number: 'PART-00001',
  slug: 'san-pham-1',
  name_vi: 'SECUPRO MARTEGO',
  name_en: 'SECUPRO MARTEGO',
  brand_id: 1,
  category_id: 3,
  series_name: 'SECUPRO',
  origin: 'Đức',
  short_desc_vi: 'Dao an toàn rút lưỡi tự động. An toàn – chắc chắn – linh hoạt – tiện dụng.',
  full_desc_vi: 'Dao an toàn rút lưỡi hoàn toàn tự động với cơ chế bảo vệ tiên tiến. Phù hợp cho mọi môi trường công nghiệp. Được tin tưởng bởi hàng nghìn nhà máy.',
  is_featured: true,
  specs_json: {
    'Cơ chế an toàn': 'Rút lưỡi hoàn toàn tự động',
    'Vật liệu tay cầm': 'Nhôm',
    'Độ sâu cắt': '20 mm',
    'Chứng nhận': 'GS Certified',
    'Thay lưỡi': 'Không cần dụng cụ',
  },
  applications_json: ['Gia công cơ khí', 'Công nghiệp thực phẩm'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const mockBrand = { id: 1, name_vi: 'Martor', slug: 'martor' }
const mockCategory = { id: 3, name_vi: 'Dụng cụ an toàn', slug: 'an-toan' }

const mockCatalog = {
  name: 'SECUPRO Series',
  size: '4.2 MB',
  pages: 18,
}

const mockRelated = [
  { ...mockProduct, id: 2, part_number: 'PART-00002', name_vi: 'SECUNORM 380' },
  { ...mockProduct, id: 3, part_number: 'PART-00003', name_vi: 'SECUMAX 150' },
  { ...mockProduct, id: 4, part_number: 'PART-00004', name_vi: 'SECUPRO XL' },
]

export const metadata = {
  title: 'SECUPRO MARTEGO | Kim Thành Đông',
  description: 'Dao an toàn rút lưỡi tự động. An toàn – chắc chắn – linh hoạt – tiện dụng. Báo giá trong 24 giờ.',
}

export default function PDPPage({ params }: PDPPageProps) {
  const views = ['Mặt trước', 'Mặt bên', 'Góc 45°', 'Chi tiết cơ cấu', 'Đang sử dụng']
  const [currentView] = views

  return (
    <main className="max-w-7xl mx-auto px-8 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-ktd-dark/70 mb-8 flex gap-2">
        <Link href="/" className="hover:text-ktd-blue">Trang chủ</Link>
        <span>/</span>
        <Link href="/san-pham" className="hover:text-ktd-blue">Sản phẩm</Link>
        <span>/</span>
        <Link href={`/san-pham?brand=${mockBrand.slug}`} className="hover:text-ktd-blue">
          {mockBrand.name_vi}
        </Link>
        <span>/</span>
        <span className="text-ktd-dark">{mockProduct.name_vi}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        {/* Gallery */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <div className="grid grid-cols-5 gap-2 mb-4">
              {views.map((view, idx) => (
                <button
                  key={view}
                  className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xs text-center px-1 transition-colors ${
                    idx === 0
                      ? 'border-ktd-blue bg-ktd-light/60'
                      : 'border-ktd-light/80 hover:border-ktd-blue'
                  }`}
                >
                  <span className="text-ktd-dark/30 text-xs leading-tight">{view}</span>
                </button>
              ))}
            </div>

            <div className="aspect-square bg-ktd-light rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-ktd-light via-ktd-light to-ktd-light/80 opacity-60"></div>
              <div className="text-center">
                <div className="font-mono text-sm text-ktd-dark/30 mb-2">{mockProduct.part_number}</div>
                <div className="font-mono text-xs text-ktd-dark/20">click để zoom</div>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2">
          <div className="text-xs font-bold uppercase text-ktd-dark/60 mb-3 tracking-widest">
            {mockCategory.name_vi}
          </div>

          {mockProduct.is_featured && (
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded mb-3">
              Bán chạy
            </span>
          )}

          <h1 className="text-3xl font-bold font-vietnam text-ktd-dark mb-6">
            {mockProduct.name_vi}
          </h1>

          {/* Key Info Table */}
          <div className="border-y border-ktd-light/80 py-4 mb-6">
            <div className="grid grid-cols-3 gap-8 text-sm">
              <div>
                <div className="text-ktd-dark/60 mb-1">Mã hàng</div>
                <div className="font-mono text-lg font-semibold text-ktd-blue">{mockProduct.part_number}</div>
              </div>
              <div>
                <div className="text-ktd-dark/60 mb-1">Thương hiệu</div>
                <div className="font-semibold text-ktd-dark">{mockBrand.name_vi}</div>
              </div>
              <div>
                <div className="text-ktd-dark/60 mb-1">Xuất xứ</div>
                <div className="text-ktd-dark">{mockProduct.origin}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg text-ktd-dark/80 mb-8 leading-relaxed">
            {mockProduct.full_desc_vi}
          </p>

          {/* CTA Buttons */}
          <div className="space-y-3 mb-8">
            <button className="w-full bg-ktd-red text-white rounded-lg py-4 font-semibold hover:bg-red-700 transition-colors shadow-lg">
              + THÊM VÀO YÊU CẦU BÁO GIÁ
            </button>
            <button className="w-full bg-white border-2 border-ktd-blue text-ktd-blue rounded-lg py-4 font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-3">
              <span>⬇</span>
              <div className="text-left">
                <div>Tải Catalog Series (PDF)</div>
                <div className="font-mono text-xs text-ktd-dark/60">{mockCatalog.size} • {mockCatalog.pages} trang</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-ktd-light/80 mb-8">
        <div className="flex gap-8">
          {[
            { label: 'MÔ TẢ', active: true },
            { label: 'THÔNG SỐ KỸ THUẬT', active: false },
            { label: 'ỨNG DỤNG', active: false },
            { label: 'TÀI LIỆU', active: false },
          ].map((tab) => (
            <button
              key={tab.label}
              className={`pb-4 px-2 font-semibold text-sm border-b-4 transition-colors ${
                tab.active
                  ? 'text-ktd-dark border-ktd-blue'
                  : 'text-ktd-dark/60 border-transparent hover:text-ktd-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-3xl mb-16">
        <p className="text-lg text-ktd-dark/80 leading-relaxed mb-6">
          {mockProduct.full_desc_vi}
        </p>
        <p className="text-base text-ktd-dark/70">
          Sản phẩm được phân phối chính hãng bởi Kim Thành Đông, kèm hỗ trợ kỹ thuật và catalog đầy đủ của cả dòng {mockProduct.series_name}. Toàn bộ các mã còn lại trong series được cung cấp qua file catalog PDF đính kèm.
        </p>
      </div>

      {/* Specs Table */}
      <div className="max-w-3xl mb-16">
        <h3 className="text-xl font-bold text-ktd-dark mb-6 font-vietnam">THÔNG SỐ KỸ THUẬT</h3>
        <table className="w-full border border-ktd-light/80 rounded-lg overflow-hidden">
          <tbody>
            {Object.entries(mockProduct.specs_json).map(([key, value]) => (
              <tr key={key} className="hover:bg-ktd-light/30">
                <th className="text-left px-6 py-3 font-semibold text-ktd-dark/70 bg-ktd-light/50 border-b border-ktd-light/80 w-1/3">
                  {key}
                </th>
                <td className="px-6 py-3 text-ktd-dark border-b border-ktd-light/80">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Related Products */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold font-vietnam text-ktd-dark mb-6">Sản phẩm cùng dòng</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {mockRelated.map((product) => (
            <ProductCard
              key={product.id}
              product={{ ...product, brandName: mockBrand.name_vi, categoryName: mockCategory.name_vi }}
              variant="related"
            />
          ))}
        </div>
      </div>

      {/* Engineer CTA */}
      <section className="bg-ktd-blue text-white rounded-xl p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold font-vietnam mb-3">Cần tư vấn kỹ thuật?</h3>
            <p className="text-ktd-light-blue mb-4">
              Kỹ sư giàu kinh nghiệm sẵn sàng hỗ trợ chọn đúng thông số.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="tel:0914897227"
                className="bg-white text-ktd-blue px-6 py-2 rounded font-semibold hover:bg-ktd-light transition-colors"
              >
                ☎ Hotline 0914 897 227
              </a>
              <a
                href="https://zalo.me/0914897227"
                target="_blank"
                rel="noopener"
                className="border border-white text-white px-6 py-2 rounded font-semibold hover:bg-white/10 transition-colors"
              >
                💬 Zalo
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold font-vietnam mb-3">Yêu cầu báo giá sỉ / lẻ</h3>
            <p className="text-ktd-light-blue mb-4">
              Nhận báo giá trong vòng 24 giờ làm việc.
            </p>
            <button className="bg-ktd-red text-white px-6 py-2 rounded font-semibold hover:bg-red-700 transition-colors">
              Gửi yêu cầu báo giá
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
