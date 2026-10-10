import Link from 'next/link'
import Image from 'next/image'
import {
  COMPANY_EMAIL,
  COMPANY_NAME,
  PHONES,
  MANG_XA_HOI,
  OFFICES,
  SHOPEE,
} from '@/lib/constants'
import { getCategories } from '@/lib/db'
import { DEFAULT_LOCALE, dict, href, type Locale } from '@/lib/i18n'

export async function Footer({ lang = DEFAULT_LOCALE }: { lang?: Locale }) {
  const t = dict(lang)
  const path = (p: string) => href(p, lang)
  const categories = (await getCategories(lang)).filter((c) => c.featured)

  const NAV = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.about, href: '/gioi-thieu' },
    { label: t.nav.products, href: '/san-pham' },
    // Thêm theo mục TC19 của "Sửa web 5".
    { label: t.brandPage.navLabel, href: '/thuong-hieu' },
    { label: t.nav.news, href: '/tin-tuc' },
    { label: t.nav.contact, href: '/lien-he' },
  ]

  return (
    <footer className="bg-ktd-800 px-0 pb-6 pt-12 text-ktd-100">
      <div className="container-ktd">
        {/* Bốn cột chia đều; trước đây 1.4/1/1/1.2 nên khoảng cách nhìn lệch. */}
        <div className="grid gap-10 border-b border-[#1c4d70] pb-9 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3.5">
              {/* Gian hàng Shopee thay cho logo KTĐ — đoạn 24 của "Sửa web 4".
                  Tên công ty vẫn còn ở dòng giới thiệu ngay bên dưới và ở dòng
                  bản quyền cuối trang, nên không mất nhận diện. */}
              <a
                href={SHOPEE.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Shopee"
                title="Shopee"
                className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-md bg-white transition-transform hover:scale-105"
              >
                {/* Ô Shopee cùng cỡ 42px với ba ô mạng xã hội — mục TC18 của
                    "Sửa web 5". Trước đây ô này cao 54px, lệch hẳn với hàng. */}
                <Image
                  src={SHOPEE.logo}
                  alt="Shopee"
                  width={114}
                  height={128}
                  className="h-[30px] w-auto"
                />
              </a>
              {/* Biểu tượng to lên 34 -> 42px cho dễ thấy (đoạn 24), và thêm
                  LinkedIn để sau này gắn link (đoạn 39).

                  Ba liên kết hiện trỏ về trang chủ của từng mạng, chưa phải
                  trang của KTĐ — Ban Giám đốc biết và chọn để nguyên, sẽ cấp
                  đường dẫn sau. Khai ở lib/constants.ts để lúc đó sửa một chỗ. */}
              <div className="flex gap-2.5">
                {MANG_XA_HOI.map((m) => (
                  <a
                    key={m.ten}
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={m.ten}
                    title={m.ten}
                    className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-md bg-white transition-transform hover:scale-105"
                  >
                    {/* Nền trắng như ô Shopee, biểu tượng giữ màu gốc của từng
                        mạng — mục TC18 của "Sửa web 5". */}
                    <SocialIcon ten={m.ten} />
                  </a>
                ))}
              </div>
            </div>
            {/* Nới bề rộng và bật text-wrap:pretty để câu không rớt một chữ
                cuối xuống dòng riêng. */}
            <p className="max-w-[366px] text-sm leading-relaxed text-[#8fb3cf] [text-wrap:pretty]">
              {t.footer.intro}
            </p>
          </div>

          {/* Đẩy cột sang phải cho cân với hai cột bên cạnh — mục TC19. */}
          <div className="lg:pl-12">
            <h2 className="mb-4 font-display text-sm font-semibold text-white">{t.footer.links}</h2>
            <ul className="flex flex-col gap-2.5 text-sm">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={path(item.href)} className="text-[#8fb3cf] hover:text-white">
                    {item.label.charAt(0) + item.label.slice(1).toLowerCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-display text-sm font-semibold text-white">{t.footer.categories}</h2>
            <ul className="flex flex-col gap-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={path(`/san-pham?category=${c.slug}`)} className="text-[#8fb3cf] hover:text-white">
                    {c.name}
                  </Link>
                </li>
              ))}
              {/* Footer chỉ liệt kê 4 nhóm tiêu biểu; dòng này dẫn tới đủ 15 nhóm. */}
              <li className="pt-1">
                <Link href={path('/san-pham')} className="font-semibold text-white hover:underline">
                  {t.footer.viewAllCategories}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-display text-sm font-semibold text-white">{t.footer.contact}</h2>
            <ul className="flex flex-col gap-2.5 text-sm text-[#8fb3cf]">
              <li>
                <a href={`tel:${PHONES.hotline.tel}`} className="text-[#8fb3cf] hover:text-white">
                  ☎ {PHONES.hotline[lang]}
                </a>
              </li>
              <li>
                <a href={`tel:${PHONES.phone.tel}`} className="text-[#8fb3cf] hover:text-white">
                  ☎ {PHONES.phone[lang]}
                </a>
              </li>
              <li>
                <a href={`tel:${PHONES.hotline2.tel}`} className="text-[#8fb3cf] hover:text-white">
                  ☎ {PHONES.hotline2[lang]}
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY_EMAIL}`} className="text-[#8fb3cf] hover:text-white">
                  ✉ {COMPANY_EMAIL}
                </a>
              </li>
              <li className="leading-relaxed">
                {t.contact.offices[0]}: {t.company.addresses[1]}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6">
          <p className="text-[13px] text-[#8fb3cf]">
            {t.footer.rights(new Date().getFullYear(), t.company.legalName)}
          </p>
        </div>
      </div>
    </footer>
  )
}

/**
 * Biểu tượng mạng xã hội bằng SVG, tô đúng màu nhận diện của từng mạng.
 *
 * Bản trước dùng ký tự chữ ("f", "▶", "in") tô một màu — không giữ được màu
 * gốc mà mục TC18 yêu cầu.
 */
function SocialIcon({ ten }: { ten: string }) {
  if (ten === 'Facebook')
    return (
      <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" aria-hidden="true">
        <path
          fill="#1877F2"
          d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.03 4.39 11.02 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07Z"
        />
      </svg>
    )
  if (ten === 'YouTube')
    return (
      <svg viewBox="0 0 24 24" className="h-[28px] w-[28px]" aria-hidden="true">
        <path
          fill="#FF0000"
          d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.09 0 12 0 12s0 3.91.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.91 24 12 24 12s0-3.91-.5-5.8Z"
        />
        <path fill="#fff" d="m9.55 15.57 6.27-3.57-6.27-3.57v7.14Z" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" className="h-[24px] w-[24px]" aria-hidden="true">
      <path
        fill="#0A66C2"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"
      />
    </svg>
  )
}
