import { dict, type Locale } from '@/lib/i18n'

/**
 * Khối "Vì sao chọn Kim Thành Đông?" ở trang chủ.
 *
 * Bốn lý do nằm trong bốn hình LỤC GIÁC — mục TC16 của "Sửa web 5": "thay
 * khung bằng hình tròn hoặc lục giác vì trang này đang quá nhiều khung chữ
 * nhật và vuông". Bản trước là bốn thẻ chữ nhật bo góc.
 *
 * Lục giác nằm NGANG — cạnh phẳng ở trên và dưới, hai đỉnh nhọn chĩa sang
 * trái phải, như ô tổ ong. KTD yêu cầu xoay sang hướng này ngày 10/10/2026
 * (kèm ảnh mẫu); bản đầu để đỉnh nhọn hướng lên.
 *
 * Hướng này hẹp dần về hai bên, nên chữ chỉ chiếm 64% bề ngang ở giữa: ở đó
 * lục giác còn đủ cao cho một tiêu đề hai dòng và bốn dòng chữ mà không dòng
 * nào chạm cạnh vát.
 *
 * Bốn cột chỉ bật từ 1280px. Hẹp hơn thì mỗi lục giác không đủ 280px bề ngang
 * và chữ bị bóp, nên xếp hai cột.
 */
export function WhyChoose({ lang }: { lang: Locale }) {
  const t = dict(lang)

  return (
    <section className="bg-surface py-14 md:py-24">
      <div className="container-ktd">
        <h2 className="mb-10 text-center font-display text-h2 text-ktd-600 md:mb-12">
          {t.why.heading}
        </h2>

        <ul className="mx-auto grid max-w-[640px] justify-items-center gap-x-5 gap-y-7 sm:grid-cols-2 xl:max-w-none xl:grid-cols-4">
          {t.why.items.map((w) => (
            <li key={w.title} className="w-full max-w-[320px]">
              {/* Tỉ lệ 1,1547 : 1 là lục giác ĐỀU nằm ngang. clip-path cắt theo
                  sáu đỉnh; nền và chữ dùng đúng bộ màu của chân trang. */}
              <div
                className="flex aspect-[1.1547/1] flex-col items-center justify-center bg-ktd-800 px-[18%] text-center transition-transform duration-200 hover:-translate-y-1"
                style={{ clipPath: 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)' }}
              >
                <h3 className="mb-2 font-display text-[17px] font-bold leading-snug text-white [text-wrap:balance]">
                  {w.title}
                </h3>
                <p className="text-[14px] font-medium leading-[1.55] text-ktd-100 [text-wrap:balance]">
                  {w.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
