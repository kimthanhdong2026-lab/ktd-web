import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Thiết bị công nghiệp | Kim Thành Đông',
  description: '21 thương hiệu quốc tế chính hãng · Kỹ sư tư vấn kỹ thuật · Báo giá trong 24 giờ',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Thiết bị công nghiệp | Kim Thành Đông',
    description: '21 thương hiệu quốc tế chính hãng · Kỹ sư tư vấn kỹ thuật · Báo giá trong 24 giờ',
    type: 'website',
    locale: 'vi_VN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
