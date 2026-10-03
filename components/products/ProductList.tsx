import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard'
import type { Product } from '@/lib/ktd-data'
import { dict, href, type Locale } from '@/lib/i18n'
import { cx } from '@/lib/utils'

/**
 * Danh sách sản phẩm trang Sản phẩm: lưới phẳng, phân trang theo số.
 *
 * Bản cũ gom sản phẩm theo hãng, mỗi hãng một tiêu đề. Đoạn 28 của "Sửa web 4"
 * yêu cầu bỏ hẳn cách đó: "Bên phải liệt kê các sản phẩm một cách ngẫu nhiên,
 * không trình bầy lật lượt theo hãng như cái cũ. Sẽ phân trang 1,2,3…".
 *
 * Lý do thực tế: gom theo hãng chỉ hợp khi có 35 mã. Tới 1000 mã thì một hãng
 * như Martor chiếm trọn màn hình đầu và khách không bao giờ nhìn thấy hãng xếp
 * sau.
 */
export function ProductList({
  items,
  total,
  trang,
  soTrang,
  diaChiTrang,
  lang,
}: {
  items: Product[]
  total: number
  trang: number
  soTrang: number
  /** Dựng địa chỉ của một trang bất kỳ, giữ nguyên bộ lọc đang bật. */
  diaChiTrang: (n: number) => string
  lang: Locale
}) {
  const t = dict(lang)

  if (!items.length) {
    return (
      <p className="rounded-lg bg-surface px-5 py-20 text-center text-[16px] text-ink-600">
        {t.products.empty}
      </p>
    )
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.part} product={p} />
        ))}
      </div>

      {soTrang > 1 && (
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label={t.products.pagination}>
          <PageLink
            href={trang > 1 ? diaChiTrang(trang - 1) : undefined}
            nhan="←"
            moTa={t.products.prevPage}
          />
          {soDeHien(trang, soTrang).map((n, i) =>
            n === null ? (
              <span key={`cach-${i}`} className="px-1 text-ink-500">
                …
              </span>
            ) : (
              <PageLink
                key={n}
                href={n === trang ? undefined : diaChiTrang(n)}
                nhan={String(n)}
                dangO={n === trang}
                moTa={t.products.goToPage(n)}
              />
            )
          )}
          <PageLink
            href={trang < soTrang ? diaChiTrang(trang + 1) : undefined}
            nhan="→"
            moTa={t.products.nextPage}
          />
        </nav>
      )}

      <p className="mt-4 text-center text-[14px] text-ink-600">
        {t.products.pageOf(trang, soTrang, total)}
      </p>
    </>
  )
}

/**
 * Các số trang cần hiện: luôn có trang đầu, trang cuối, trang hiện tại và hai
 * trang kề. Chỗ đứt quãng trả về null để chỗ gọi vẽ dấu "…".
 *
 * Với 1000 sản phẩm sẽ có hơn 40 trang; liệt kê hết thì dải phân trang dài hơn
 * cả danh sách sản phẩm trên điện thoại.
 */
function soDeHien(trang: number, soTrang: number): (number | null)[] {
  if (soTrang <= 7) return Array.from({ length: soTrang }, (_, i) => i + 1)
  const giu = new Set([1, soTrang, trang, trang - 1, trang + 1])
  const ra: (number | null)[] = []
  let truoc = 0
  for (let n = 1; n <= soTrang; n++) {
    if (!giu.has(n)) continue
    if (truoc && n - truoc > 1) ra.push(null)
    ra.push(n)
    truoc = n
  }
  return ra
}

function PageLink({
  href: duong,
  nhan,
  dangO = false,
  moTa,
}: {
  href?: string
  nhan: string
  dangO?: boolean
  moTa: string
}) {
  const kieu = cx(
    'flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-[15px] font-semibold transition-colors',
    dangO
      ? 'border-ktd-600 bg-ktd-600 text-white'
      : duong
        ? 'border-hairline bg-white text-ink-700 hover:border-ktd-600 hover:text-ktd-600'
        : 'cursor-not-allowed border-hairline bg-white text-ink-300'
  )

  // Trang hiện tại và nút đã chạm biên không có đích đến, nên không dựng thẻ
  // liên kết — bấm vào không đi đâu mà vẫn báo cho trình đọc màn hình là bất khả.
  if (!duong) {
    return (
      <span className={kieu} aria-disabled="true" aria-label={moTa}>
        {nhan}
      </span>
    )
  }
  return (
    <Link href={duong} scroll={false} className={kieu} aria-label={moTa} aria-current={dangO ? 'page' : undefined}>
      {nhan}
    </Link>
  )
}
