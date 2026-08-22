import Link from 'next/link'
import { CATEGORIES } from '@/lib/ktd-data'
import { CATEGORIES_HEADING } from '@/lib/constants'

/**
 * Danh mục sản phẩm dạng ô lớn — 15 nhóm, mỗi ô dẫn tới trang Sản phẩm đã lọc
 * sẵn theo nhóm đó nên bấm chỗ nào trong ô cũng đi đúng chỗ.
 *
 * Ô để nền trắng trên nền xanh rất nhạt của mục, không dùng ảnh nền: theo yêu
 * cầu của team, phần này phải nhạt và đồng bộ với nền chung của website.
 */
export function CategoryTiles() {
  return (
    <section className="bg-ktd-50 py-14 md:py-24">
      <div className="container-ktd">
        <h2 className="mb-10 text-center font-display text-h2 text-ktd-logo md:mb-14">
          {CATEGORIES_HEADING}
        </h2>

        {/* 15 nhóm chia hết cho 5 và cho 3 nên không bao giờ có hàng lẻ. */}
        <ul className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/san-pham?category=${c.slug}`}
                className="group flex h-full min-h-[150px] flex-col rounded-xl border border-hairline bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-ktd-600 hover:shadow-md md:p-5"
              >
                <span className="mb-1.5 block font-display text-[17px] font-semibold leading-snug text-ink-900 md:text-[19px]">
                  {c.name}
                </span>
                <span className="block text-[13px] leading-relaxed text-ink-500">{c.sub}</span>

                <span
                  className="mt-auto flex h-7 w-7 items-center justify-center self-end rounded-full border border-ink-300 text-[13px] text-ktd-600 transition-colors group-hover:border-ktd-600 group-hover:bg-ktd-600 group-hover:text-white"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
