import Image from 'next/image'
import Link from 'next/link'
import { getCategories } from '@/lib/db'
import { DEFAULT_LOCALE, dict, href, type Locale } from '@/lib/i18n'

/**
 * Danh mục sản phẩm dạng ô lớn — 12 nhóm chính, mỗi ô dẫn tới trang Sản phẩm đã
 * lọc sẵn theo nhóm đó nên bấm chỗ nào trong ô cũng đi đúng chỗ.
 *
 * Bố cục theo đoạn 13 của "Sửa web 4": ảnh ở trên, tên nhóm và dòng chữ nhỏ đẩy
 * xuống dưới ảnh.
 *
 * Ảnh do scripts/build-category-images.mjs dựng ra ở
 * public/assets/categories/{slug}.webp, đặt tên theo slug nhóm chính.
 */
export async function CategoryTiles({ lang = DEFAULT_LOCALE }: { lang?: Locale }) {
  const t = dict(lang)
  // Chỉ ô của NHÓM CHÍNH. Từ khi danh mục có hai cấp, getCategories trả về cả
  // 41 nhóm nhỏ — để nguyên thì trang chủ bày ra 53 ô, không ai đọc nổi.
  const categories = (await getCategories(lang)).filter((c) => !c.parent)

  return (
    // Nền trắng — KTD yêu cầu ngày 10/10/2026. Khối thương hiệu ngay phía trên
    // đã chuyển sang xám nhạt (TC07), để nguyên xám ở đây thì hai khối dính
    // thành một dải. Từ đây xuống các khối đổi nền xen kẽ: trắng, xám, trắng, xám.
    <section className="bg-white py-14 md:py-24">
      <div className="container-ktd">
        <h2 className="mb-10 text-center font-display text-h2 text-ktd-600 md:mb-14">
          {t.categories.heading}
        </h2>

        {/* 12 nhóm chính: lưới 4 cột cho đúng 3 hàng đầy. Lưới 5 cột của bản cũ
            hợp với 15 nhóm, nhưng với 12 nhóm sẽ thành 5+5+2, hàng cuối trống
            hai phần ba. */}
        <ul className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {categories.map((c) => (
            <li key={c.slug}>
              {/* Bo góc lớn thay cho khung chữ nhật — đoạn 16: "trang chủ đang
                  chủ yếu là khung chữ nhật". Giữ dạng thẻ chứ không cắt thành
                  lục giác, vì tên nhóm dài tới hai dòng và hình lục giác sẽ cắt
                  mất chữ ở hai góc. */}
              <Link
                href={href(`/san-pham?category=${c.slug}`, lang)}
                className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-hairline bg-white transition duration-200 hover:-translate-y-0.5 hover:border-ktd-600 hover:shadow-md"
              >
                {/* Ảnh VUÔNG, giữ trọn khung ảnh gốc — góp ý "sửa nhỏ 15-10-2026":
                    chữ che mất sản phẩm. Bản trước cắt ảnh về 4:3 rồi phủ thêm
                    dải mờ trắng ở đáy, mất cả chân sản phẩm lẫn phần sát chữ. */}
                <div className="relative aspect-square w-full overflow-hidden bg-white">
                  <Image
                    src={`/assets/categories/${c.slug}.webp`}
                    alt=""
                    width={640}
                    height={640}
                    sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 300px"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </div>
                {/* Không còn dải đệm nào giữa ảnh và chữ — góp ý 20/10/2026: dải mờ lật
                    ngược đặt dưới ảnh trông như "một đoạn đệm màu khác". Ảnh
                    vuông dừng gọn ở mép, chữ bắt đầu ngay trên nền trắng. */}
                <div className="flex flex-1 flex-col p-5 pt-4 md:p-6 md:pt-5">
                  <span className="mb-1.5 block font-display text-[17px] font-semibold leading-snug text-ink-900 md:text-[19px]">
                    {c.name}
                  </span>
                  {/* Đồng nhất màu chữ với cả trang — đoạn 15. */}
                  <span className="block text-[14px] leading-relaxed text-ink-600">{c.sub}</span>

                  <span
                    className="mt-auto flex h-7 w-7 items-center justify-center self-end rounded-full border border-ink-300 text-[13px] text-ktd-600 transition-colors group-hover:border-ktd-600 group-hover:bg-ktd-600 group-hover:text-white"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
