import { ProductCard } from '@/components/ProductCard'
import { PRODUCTS } from '@/lib/ktd-data'

/**
 * Bỏ bộ tab Tất cả / Mới / Bán chạy theo yêu cầu: gắn nhãn "mới" hay
 * "bán chạy" đòi hỏi phải cập nhật thường xuyên mà không mang lại giá trị
 * tương xứng. Chỉ hiển thị các sản phẩm được đánh dấu nổi bật.
 */
export function FeaturedProducts() {
  const products = PRODUCTS.filter((p) => p.featured).slice(0, 8)

  return (
    <section className="bg-white py-14 md:py-24">
      <div className="container-ktd">
        <h2 className="mb-9 font-display text-h2 text-ink-900">Sản phẩm được quan tâm</h2>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-[22px]">
          {products.map((p) => (
            <ProductCard key={p.part} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
