import Link from 'next/link'

const mockArticle = {
  id: 1,
  slug: 'tin-1',
  title_vi: 'Giới thiệu sản phẩm mới từ Martor',
  category_vi: 'Tin công ty',
  excerpt_vi: 'Kim Thành Đông vừa công bố loạt sản phẩm mới nhập khẩu từ Martor, nhà sản xuất dao an toàn hàng đầu thế giới.',
  content_vi: `Kim Thành Đông vừa công bố loạt sản phẩm mới nhập khẩu từ Martor, nhà sản xuất dao an toàn hàng đầu thế giới. Các sản phẩm này được thiết kế đặc biệt cho công nghiệp Việt Nam, kèm hỗ trợ kỹ thuật địa phương.

Trong tháng 8/2026, KTĐ sẽ khai trương hai điểm phân phối mới tại Hà Nội và Đà Nẵng, mở rộng mạng lưới hỗ trợ khách hàng.

Các sản phẩm mới bao gồm:
- Dao an toàn SECUPRO series
- Dao rút lưỡi SECUNORM
- Dao giấu lưỡi SECUMAX

Tất cả đều được chứng nhận GS (Gütesiegel Sicherheit) và tuân thủ tiêu chuẩn ANSI Z535.

Khách hàng quan tâm vui lòng liên hệ ngay để nhận báo giá đặc biệt.`,
  published_at: '2026-08-10',
}

const relatedProducts = [
  { part: 'PART-00001', name: 'SECUPRO MARTEGO' },
  { part: 'PART-00002', name: 'SECUNORM 380' },
  { part: 'PART-00003', name: 'SECUMAX 150' },
]

export const metadata = {
  title: `${mockArticle.title_vi} | Kim Thành Đông`,
  description: mockArticle.excerpt_vi,
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  return (
    <main className="max-w-3xl mx-auto px-8 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-ktd-dark/70 mb-8 flex gap-2">
        <Link href="/" className="hover:text-ktd-blue">Trang chủ</Link>
        <span>/</span>
        <Link href="/tin-tuc" className="hover:text-ktd-blue">Tin tức</Link>
      </div>

      {/* Meta */}
      <div className="text-xs font-bold uppercase text-ktd-blue mb-4 tracking-widest">
        {mockArticle.category_vi}
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold font-vietnam text-ktd-dark mb-3 leading-tight">
        {mockArticle.title_vi}
      </h1>

      {/* Date */}
      <div className="text-sm text-ktd-dark/60 mb-8">
        {new Date(mockArticle.published_at).toLocaleDateString('vi-VN')}
      </div>

      {/* Featured Image */}
      <div className="aspect-video bg-ktd-light rounded-lg mb-12 border border-ktd-light/80"></div>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-12">
        {mockArticle.content_vi.split('\n\n').map((para, idx) => (
          <p key={idx} className="text-lg text-ktd-dark/80 leading-relaxed mb-6">
            {para}
          </p>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-ktd-light/80 pt-8 mb-8">
        {/* Related Products */}
        <h3 className="text-2xl font-bold font-vietnam text-ktd-dark mb-6">Sản phẩm liên quan</h3>
        <div className="grid grid-cols-3 gap-4">
          {relatedProducts.map((product) => (
            <Link key={product.part} href={`/san-pham/${product.part.toLowerCase()}`}>
              <div className="border border-ktd-light/80 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="font-bold text-sm text-ktd-dark mb-2 line-clamp-2">
                  {product.name}
                </div>
                <div className="font-mono text-xs text-ktd-blue">
                  {product.part}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button className="bg-ktd-red text-white rounded-lg px-8 py-3 font-semibold hover:bg-red-700 transition-colors shadow-lg">
        Yêu cầu báo giá
      </button>
    </main>
  )
}
