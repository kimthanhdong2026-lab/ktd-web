import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard'
import type { Brand, Category, Product } from '@/lib/ktd-data'

interface Props {
  items: Product[]
  brands: Brand[]
  categories: Category[]
  /** Số sản phẩm mỗi hãng trong toàn bộ tập khớp, không chỉ trang đang xem. */
  countByBrand: Record<string, number>
  /** Chọn đúng một hãng thì gom theo danh mục thay vì theo hãng. */
  singleBrand: boolean
  total: number
  show: number
  nextHref: string | null
}

/**
 * Kết quả tìm, gom nhóm và dựng sẵn ở máy chủ.
 *
 * Tách khỏi ProductBrowser vì phần này không cần chạy ở trình duyệt: nó chỉ đọc
 * dữ liệu rồi in ra. Nhờ vậy danh sách sản phẩm không phải gửi kèm xuống máy
 * khách dưới dạng dữ liệu, chỉ gửi HTML đã dựng.
 */
export function ProductGroups({
  items,
  brands,
  categories,
  countByBrand,
  singleBrand,
  total,
  show,
  nextHref,
}: Props) {
  const source = singleBrand ? categories : brands
  const groups = source
    .map((entry) => ({
      key: entry.slug,
      name: entry.name,
      items: items.filter((p) => (singleBrand ? p.category : p.brand) === entry.slug),
    }))
    .filter((g) => g.items.length > 0)

  return (
    <>
      {groups.map((g) => (
        <section key={g.key} className="mb-12">
          <div className="mb-6 flex items-baseline justify-between gap-4 border-b-2 border-ktd-50 pb-3">
            <h2 className="font-display text-[22px] font-bold uppercase text-ktd-800 md:text-[26px]">
              {g.name}
            </h2>
            <span className="flex-shrink-0 text-sm text-ink-500">{g.items.length} sản phẩm</span>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-5">
            {g.items.map((p) => (
              <ProductCard key={p.part} product={p} />
            ))}
          </div>
          {!singleBrand && (countByBrand[g.key] ?? 0) > g.items.length && (
            <div className="mt-5">
              <Link
                href={`/san-pham?brand=${g.key}`}
                className="text-sm font-semibold text-ktd-600 hover:text-ktd-700"
              >
                Xem tất cả sản phẩm {g.name} →
              </Link>
            </div>
          )}
        </section>
      ))}

      {nextHref && (
        <div className="mt-4 text-center">
          <Link href={nextHref} scroll={false} className="btn-secondary px-10">
            Tải thêm sản phẩm
          </Link>
        </div>
      )}

      {!nextHref && total > show && (
        <p className="mt-4 text-center text-sm text-ink-500">
          Đang hiện {show} trong {total} sản phẩm. Dùng bộ lọc để thu hẹp kết quả.
        </p>
      )}
    </>
  )
}
