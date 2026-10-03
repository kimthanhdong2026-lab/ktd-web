import type { Metadata } from 'next'
import { Be_Vietnam_Pro, Inter, JetBrains_Mono } from 'next/font/google'
import '../globals.css'

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

// Spec B2: three families, only the weights actually used, font-display: swap.
const display = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const body = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-mono',
  display: 'swap',
})

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
  const brands = await getBrands(lang)

  return (
    <html lang={lang} className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <LangProvider lang={lang}>
          <StoreProvider>
            <Header brands={brands} />
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
