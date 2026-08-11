import Link from 'next/link'
import { HERO_STATS, WHY_ITEMS_VI, SECTORS_WITH_DESC, CATEGORY_ICONS } from '@/lib/constants'
import { ProductCard } from '@/components/ProductCard'
import { Product, Brand, Category } from '@/lib/types'

interface HomePageProps {
  products: (Product & { brandName: string; categoryName: string })[]
  brands: Brand[]
  categories: Category[]
  news: any[]
}

export function HomePage({ products, brands, categories, news }: HomePageProps) {
  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 8)
  const newsItems = news.slice(0, 3)

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen bg-ktd-dark text-white flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-ktd-dark via-ktd-dark to-ktd-navy opacity-80"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-ktd-dark/90 via-transparent to-ktd-navy/50"></div>

        <div className="relative max-w-7xl mx-auto px-8 w-full py-20">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-ktd-light-blue/10 border border-ktd-light-blue/20 rounded-full px-4 py-2 mb-8">
              <span className="text-sm font-semibold uppercase tracking-widest text-ktd-light-blue">
                CÔNG NGHỆ TOÀN CẦU · KỸ THUẬT BẢN ĐỊA · GIAO HÀNG NHANH
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-6xl font-bold font-vietnam mb-6 leading-tight">
              Thiết bị công nghiệp<br />
              cho nhà máy Việt Nam
            </h1>

            {/* Subheading */}
            <p className="text-xl text-ktd-light-blue mb-8 max-w-2xl leading-relaxed">
              21 thương hiệu quốc tế chính hãng · Kỹ sư tư vấn kỹ thuật · Báo giá trong 24 giờ.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 mb-12">
              <Link
                href="/san-pham"
                className="bg-ktd-blue text-white rounded-lg px-8 py-4 font-semibold hover:bg-blue-700 transition-colors"
              >
                Xem sản phẩm
              </Link>
              <button
                onClick={() => {/* TODO: open RFQ modal */}}
                className="bg-ktd-red text-white rounded-lg px-8 py-4 font-semibold hover:bg-red-700 transition-colors shadow-lg"
              >
                Yêu cầu báo giá
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-12 pt-8 border-t border-ktd-light-blue/20">
              {HERO_STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl font-bold font-vietnam mb-2">{stat.num}</div>
                  <div className="text-sm uppercase tracking-widest text-ktd-navy/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ktd-navy/60 text-xs tracking-widest animate-bounce">
          ↓ CUỘN XUỐNG
        </div>
      </section>

      {/* Brands Strip */}
      <section className="bg-white py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase text-ktd-blue mb-3 tracking-widest">PHÂN PHỐI CHÍNH HÃNG</div>
            <h2 className="text-4xl font-bold font-vietnam text-ktd-dark">21 thương hiệu quốc tế chúng tôi phân phối</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/san-pham?brand=${brand.slug}`}
                className="group bg-white border border-ktd-light/80 rounded-lg p-4 hover:border-ktd-blue hover:shadow-lg transition-all"
              >
                <div className="aspect-square bg-ktd-light rounded flex items-center justify-center mb-3 group-hover:bg-ktd-light/60 transition-colors">
                  <span className="text-xs text-ktd-dark/30 font-mono">LOGO</span>
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm text-ktd-dark mb-1">{brand.name_vi}</div>
                  <div className="text-xs text-ktd-dark/60">{brand.origin}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/san-pham"
              className="text-ktd-blue font-semibold hover:underline"
            >
              Xem tất cả sản phẩm theo thương hiệu →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-ktd-light py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold font-vietnam text-ktd-dark mb-12 text-center">
            Bạn đang cần loại thiết bị nào?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/san-pham?category=${cat.slug}`}
                className="group bg-white border border-ktd-light/80 rounded-lg p-6 hover:shadow-lg hover:border-ktd-blue transition-all text-left"
              >
                <div className="w-12 h-12 rounded-lg bg-ktd-light flex items-center justify-center text-2xl mb-4 group-hover:bg-ktd-light/60">
                  {CATEGORY_ICONS[cat.slug]}
                </div>
                <h3 className="font-bold text-lg text-ktd-dark mb-2 font-vietnam">{cat.name_vi}</h3>
                <p className="text-sm text-ktd-dark/70">
                  {products.filter((p) => p.category_id === cat.id).length} sản phẩm
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="bg-ktd-dark py-16 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto mb-8">
          <div className="text-xs font-bold uppercase text-ktd-navy/60 mb-3 tracking-widest">LĨNH VỰC PHỤC VỤ</div>
          <h2 className="text-4xl font-bold font-vietnam text-white mb-6 max-w-3xl">
            Đồng hành cùng 8 ngành công nghiệp trọng điểm
          </h2>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-3">
          {SECTORS_WITH_DESC.map((sector) => (
            <div
              key={sector.name}
              className="flex-shrink-0 w-80 bg-ktd-navy rounded-xl p-6 border border-ktd-navy/50"
            >
              <h3 className="text-lg font-bold text-white font-vietnam mb-3">{sector.name}</h3>
              <p className="text-sm text-ktd-light-blue leading-relaxed">{sector.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <h2 className="text-4xl font-bold font-vietnam text-ktd-dark">Sản phẩm được quan tâm nhất</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="home"
                onAddToCart={() => {
                  /* TODO */
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why KTD */}
      <section className="bg-ktd-light py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold font-vietnam text-ktd-dark mb-12 text-center">
            Vì sao chọn Kim Thành Đông
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_ITEMS_VI.map((item) => (
              <div key={item.title} className="bg-white rounded-lg p-8">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-ktd-dark mb-3 font-vietnam">{item.title}</h3>
                <p className="text-sm text-ktd-dark/70 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="bg-white py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <h2 className="text-4xl font-bold font-vietnam text-ktd-dark">Tin tức & Giải pháp</h2>
            <Link href="/tin-tuc" className="text-ktd-blue font-semibold hover:underline">
              Xem tất cả tin tức →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsItems.map((article) => (
              <Link key={article.id} href={`/tin-tuc/${article.slug}`}>
                <div className="border border-ktd-light/80 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                  <div className="aspect-video bg-ktd-light"></div>
                  <div className="p-6">
                    <div className="text-xs font-bold uppercase text-ktd-blue mb-2 tracking-widest">{article.category_vi}</div>
                    <h3 className="text-lg font-bold text-ktd-dark mb-3 line-clamp-2 font-vietnam">{article.title_vi}</h3>
                    <p className="text-sm text-ktd-dark/70">
                      {article.published_at ? new Date(article.published_at).toLocaleDateString('vi-VN') : ''}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-ktd-blue py-16 px-8 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold font-vietnam mb-4">Không tìm thấy sản phẩm bạn cần?</h2>
          <p className="text-lg text-ktd-light-blue mb-8">
            Gửi yêu cầu — kỹ sư của chúng tôi phản hồi trong vòng 24 giờ làm việc.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => {/* TODO: open RFQ */}}
              className="bg-ktd-red text-white rounded-lg px-8 py-3 font-semibold hover:bg-red-700"
            >
              Yêu cầu báo giá
            </button>
            <a
              href="https://zalo.me/0914897227"
              target="_blank"
              rel="noopener"
              className="bg-white text-ktd-blue rounded-lg px-8 py-3 font-semibold hover:bg-ktd-light"
            >
              Chat Zalo
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
