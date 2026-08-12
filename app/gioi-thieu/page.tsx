import type { Metadata } from 'next'
import Link from 'next/link'
import { ABOUT_CRITERIA, ABOUT_TIMELINE, COMPANY_HOTLINE, COMPANY_HOTLINE_TEL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Giới thiệu — Đồng hành cùng công nghiệp Việt Nam từ 2011',
  description:
    'Công ty TNHH Kim Thành Đông thành lập 2011, hơn 13 năm cung cấp thiết bị công nghiệp, vật tư máy móc và giải pháp kỹ thuật cho nhà máy tại Việt Nam.',
  alternates: { canonical: '/gioi-thieu' },
}

export default function AboutPage() {
  return (
    <>
      <section className="bg-white px-5 py-8 md:py-10">
        <div className="container-ktd text-center">
          <h1 className="font-display text-h1 leading-tight text-ktd-600">
            Đồng hành cùng công nghiệp Việt Nam từ 2011
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-5 py-12 md:py-20">
        <p className="mb-6 text-[19px] leading-[1.75] text-ink-700">
          Công ty TNHH Kim Thành Đông thành lập năm 2011, đến nay đã hơn 13 năm cung cấp thiết bị
          công nghiệp, vật tư máy móc và giải pháp kỹ thuật cho các nhà máy thuộc nhiều ngành: chế
          tạo máy, điện tử, ô tô, hàng không, đóng tàu, hóa chất và năng lượng.
        </p>
        <p className="text-[17px] leading-[1.75] text-ink-500">
          Là nhà phân phối và nhà cung cấp giải pháp kỹ thuật — không phải nhà sản xuất — KTĐ mang
          công nghệ toàn cầu về gần hơn với kỹ sư và nhà máy Việt Nam, kèm dịch vụ hỗ trợ kỹ thuật
          bản địa và giao hàng nhanh.
        </p>
      </section>

      <section className="container-ktd pb-16 md:pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-ktd-50 p-8 md:p-10">
            <h2 className="mb-4 font-display text-2xl font-bold text-ktd-600">Tầm nhìn</h2>
            <p className="text-base leading-relaxed text-ink-700">
              Trở thành đối tác cung ứng thiết bị công nghiệp và giải pháp kỹ thuật hàng đầu, được
              tin tưởng bởi các nhà máy trong và ngoài nước tại Việt Nam.
            </p>
          </div>
          <div className="rounded-lg bg-ktd-50 p-8 md:p-10">
            <h2 className="mb-4 font-display text-2xl font-bold text-ktd-600">Sứ mệnh</h2>
            <p className="text-base leading-relaxed text-ink-700">
              Cung cấp sản phẩm chính hãng, giải pháp kỹ thuật tối ưu và dịch vụ nhanh chóng, giúp
              khách hàng nâng cao hiệu quả sản xuất và tiết kiệm chi phí.
            </p>
          </div>
        </div>
      </section>

      <section className="container-ktd pb-16 md:pb-20">
        <h2 className="mb-8 font-display text-[26px] font-bold text-ink-900 md:text-3xl">
          5 tiêu chí hoạt động
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ABOUT_CRITERIA.map((c) => (
            <li key={c.n} className="rounded-xl border border-hairline bg-white p-5 md:p-6">
              <span className="mb-3 block font-display text-[28px] font-bold text-ktd-100">
                {c.n}
              </span>
              <span className="block text-[15px] leading-relaxed text-ink-700">{c.t}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-ktd pb-16 md:pb-20">
        <h2 className="mb-8 font-display text-[26px] font-bold text-ink-900 md:text-3xl">
          Chặng đường phát triển
        </h2>
        <ol className="flex gap-4 overflow-x-auto pb-3">
          {ABOUT_TIMELINE.map((t) => (
            <li key={t.year} className="w-[220px] flex-none border-t-[3px] border-ktd-600 pt-4">
              <span className="mb-2 block font-display text-[22px] font-bold text-ktd-600">
                {t.year}
              </span>
              <span className="block text-[15px] leading-relaxed text-ink-700">{t.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-wrap items-center justify-center gap-6 bg-ktd-600 px-5 py-6">
        <h2 className="font-display text-xl font-bold text-white">
          Quý khách liên hệ với chúng tôi — hotline{' '}
          <a href={`tel:${COMPANY_HOTLINE_TEL}`} className="border-b border-white/45 text-white">
            {COMPANY_HOTLINE}
          </a>
        </h2>
        <Link href="/lien-he" className="btn bg-white text-ktd-600 hover:bg-ktd-50">
          Liên hệ ngay
        </Link>
      </section>
    </>
  )
}
