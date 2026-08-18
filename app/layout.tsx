import type { Metadata } from 'next'
import { Be_Vietnam_Pro, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { BRANDS } from '@/lib/ktd-data'
import { StoreProvider } from '@/components/StoreProvider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FloatingCTA } from '@/components/FloatingCTA'
import { Toast } from '@/components/Toast'
import { SearchOverlay } from '@/components/SearchOverlay'
import { RFQModal } from '@/components/RFQModal'
import {
  COMPANY_EMAIL,
  COMPANY_NAME,
  COMPANY_PHONE,
  OFFICES,
} from '@/lib/constants'

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Kim Thành Đông — Thiết bị công nghiệp & Giải pháp kỹ thuật | ${BRANDS.length} thương hiệu chính hãng`,
    template: '%s | Kim Thành Đông',
  },
  description:
    'Nhà phân phối thiết bị công nghiệp chính hãng từ 2011. Morrisflex, Martor, Helical, ATA, Tecna… Kho Hà Nội – HCM – Vũng Tàu. Báo giá sớm nhất.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: COMPANY_NAME,
    title: 'Kim Thành Đông — Thiết bị công nghiệp & Giải pháp kỹ thuật',
    description:
      `${BRANDS.length} thương hiệu quốc tế chính hãng · Kỹ sư tư vấn kỹ thuật · Báo giá sớm nhất.`,
  },
  robots: { index: true, follow: true },
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
      inLanguage: 'vi-VN',
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/san-pham?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <StoreProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <FloatingCTA />
          <Toast />
          <SearchOverlay />
          <RFQModal />
        </StoreProvider>
      </body>
    </html>
  )
}
