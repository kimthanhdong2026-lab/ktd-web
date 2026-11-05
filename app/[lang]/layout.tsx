import type { Metadata } from 'next'
import '../globals.css'
import { fontClass } from '@/lib/fonts'

import { StoreProvider } from '@/components/StoreProvider'
import { Header } from '@/components/Header'
import { getBrands } from '@/lib/db'
import { Footer } from '@/components/Footer'
import { FloatingCTA } from '@/components/FloatingCTA'
import { Toast } from '@/components/Toast'
import { SearchOverlay } from '@/components/SearchOverlay'
import { RFQModal } from '@/components/RFQModal'
import { LangProvider } from '@/components/LangProvider'
import { COMPANY_EMAIL, COMPANY_NAME, COMPANY_PHONE, OFFICES } from '@/lib/constants'
import { DEFAULT_LOCALE, LOCALES, dict, href, isLocale, type Locale } from '@/lib/i18n'
import { ghiDeCho, lienHe } from '@/lib/noi-dung'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kimthanhdong.vn'

/** Dựng sẵn cả hai ngôn ngữ lúc build. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  const t = dict(lang)
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.siteTitle, template: `%s | ${t.company.legalName}` },
    description: t.meta.siteDesc,
    alternates: {
      canonical: href('/', lang),
      // Google cần biết hai bản này là cùng một trang ở hai ngôn ngữ, nếu
      // không nó coi bản tiếng Anh là nội dung trùng lặp.
      languages: { 'vi-VN': '/', 'en-US': '/en' },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'vi' ? 'vi_VN' : 'en_US',
      siteName: COMPANY_NAME,
      title: t.meta.siteTitle,
      description: t.meta.siteDesc,
    },
    robots: { index: true, follow: true },
  }
}

/** Spec D4 — Organization + WebSite/SearchAction, site-wide. */
const organizationSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: COMPANY_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/assets/ktd-logo.webp`,
      email: COMPANY_EMAIL,
      telephone: COMPANY_PHONE,
      foundingDate: '2011',
      address: OFFICES.map((o) => ({
        '@type': 'PostalAddress',
        name: o.name,
        streetAddress: o.addr,
        addressCountry: 'VN',
      })),
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: COMPANY_NAME,
      inLanguage: ['vi-VN', 'en-US'],
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/san-pham?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  // Danh sách hãng cho menu xổ ở thanh điều hướng (đoạn 3 của "Sửa web 4").
  // Lấy ở layout để mọi trang đều có, không phải truyền qua từng trang.
  // Phần admin đã sửa (bảng noi_dung) đè lên từ điển; thông tin liên hệ cho
  // thanh đầu trang. Cả hai đều có mặc định nên bảng rỗng vẫn chạy.
  const [brands, ghiDe, lh] = await Promise.all([getBrands(lang), ghiDeCho(lang), lienHe(lang)])

  return (
    <html lang={lang} className={fontClass}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <LangProvider lang={lang} ghiDe={ghiDe}>
          <StoreProvider>
            <Header brands={brands} lienHe={lh} />
            <main id="main">{children}</main>
            <Footer lang={lang} />
            <FloatingCTA />
            <Toast />
            <SearchOverlay />
            <RFQModal />
          </StoreProvider>
        </LangProvider>
      </body>
    </html>
  )
}
