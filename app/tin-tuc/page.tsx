import type { Metadata } from 'next'
import { NewsList } from '@/components/news/NewsList'

export const metadata: Metadata = {
  title: 'Tin tức & Giải pháp',
  description:
    'Kiến thức kỹ thuật, giải pháp ứng dụng và tin công ty từ Kim Thành Đông — hướng dẫn chọn thiết bị và kinh nghiệm triển khai tại nhà máy.',
  alternates: { canonical: '/tin-tuc' },
}

export default function NewsPage() {
  return (
    <div className="container-ktd pb-16 pt-10 md:pb-24">
      <h1 className="mb-6 font-display text-h1 text-ink-900">Tin tức &amp; Giải pháp</h1>
      <NewsList />
    </div>
  )
}
