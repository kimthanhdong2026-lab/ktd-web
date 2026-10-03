import Link from 'next/link'
import Image from 'next/image'
import {
  COMPANY_EMAIL,
  COMPANY_HOTLINE,
  COMPANY_HOTLINE_TEL,
  COMPANY_NAME,
  COMPANY_HOTLINE_2,
  COMPANY_HOTLINE_2_TEL,
  COMPANY_PHONE,
  COMPANY_PHONE_TEL,
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
                className="inline-flex items-center justify-center rounded-md bg-white px-3.5 py-2 transition-transform hover:scale-105"
              >
                <Image
                  src={SHOPEE.logo}
                  alt="Shopee"
                  width={114}
                  height={128}
                  className="h-[38px] w-auto"
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
                    className="flex h-[42px] w-[42px] items-center justify-center rounded-md bg-[#123a56] font-display text-[19px] font-bold text-ktd-100 transition-colors hover:bg-[#1c4d70]"
                  >
                    {m.icon}
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

          <div>
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
                <a href={`tel:${COMPANY_HOTLINE_TEL}`} className="text-[#8fb3cf] hover:text-white">
                  ☎ {COMPANY_HOTLINE}
                </a>
              </li>
              <li>
                <a href={`tel:${COMPANY_PHONE_TEL}`} className="text-[#8fb3cf] hover:text-white">
                  ☎ {COMPANY_PHONE}
                </a>
              </li>
              <li>
                <a href={`tel:${COMPANY_HOTLINE_2_TEL}`} className="text-[#8fb3cf] hover:text-white">
                  ☎ {COMPANY_HOTLINE_2}
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
