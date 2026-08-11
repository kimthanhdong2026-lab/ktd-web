import Link from 'next/link'

const mockNews = [
  {
    id: 1,
    slug: 'tin-1',
    title_vi: 'Giới thiệu sản phẩm mới từ Martor',
    category_vi: 'Tin công ty',
    excerpt_vi: 'Kim Thành Đông vừa công bố loạt sản phẩm mới nhập khẩu từ Martor...',
    published_at: '2026-08-10',
  },
  {
    id: 2,
    slug: 'tin-2',
    title_vi: 'Hướng dẫn chọn đúng dao an toàn',
    category_vi: 'Kiến thức kỹ thuật',
    excerpt_vi: 'Cách chọn dao an toàn phù hợp cho từng ứng dụng công nghiệp...',
    published_at: '2026-08-08',
  },
  {
    id: 3,
    slug: 'tin-3',
    title_vi: 'Tối ưu hóa hiệu quả sản xuất với giải pháp KTĐ',
    category_vi: 'Giải pháp ứng dụng',
    excerpt_vi: 'Nhà máy chế tạo máy ở Bình Dương giảm chi phí 30%...',
    published_at: '2026-08-05',
  },
]

export const metadata = {
  title: 'Tin tức & Giải pháp | Kim Thành Đông',
  description: 'Cập nhật tin tức, kiến thức kỹ thuật, giải pháp ứng dụng từ Kim Thành Đông.',
}

export default function NewsPage() {
  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold font-vietnam text-ktd-dark mb-4">Tin tức & Giải pháp</h1>

      <div className="flex gap-3 mb-12">
        {['Tất cả', 'Kiến thức kỹ thuật', 'Giải pháp ứng dụng', 'Tin công ty'].map((cat) => (
          <button
            key={cat}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
              cat === 'Tất cả'
                ? 'bg-ktd-blue text-white'
                : 'bg-white border border-ktd-light/80 text-ktd-dark hover:border-ktd-blue'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockNews.map((article) => (
          <Link key={article.id} href={`/tin-tuc/${article.slug}`}>
            <div className="border border-ktd-light/80 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
              <div className="aspect-video bg-ktd-light"></div>
              <div className="p-6 flex flex-col flex-1">
                <div className="text-xs font-bold uppercase text-ktd-blue mb-3 tracking-widest">
                  {article.category_vi}
                </div>
                <h3 className="text-lg font-bold font-vietnam text-ktd-dark mb-3 line-clamp-2 leading-tight">
                  {article.title_vi}
                </h3>
                <p className="text-sm text-ktd-dark/70 mb-4 flex-1 leading-relaxed">
                  {article.excerpt_vi}
                </p>
                <div className="text-xs text-ktd-dark/60">
                  {new Date(article.published_at).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
