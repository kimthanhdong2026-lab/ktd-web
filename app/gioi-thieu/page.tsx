import Link from 'next/link'
import { CRITERIA, TIMELINE } from '@/lib/constants'

export const metadata = {
  title: 'Giới thiệu | Kim Thành Đông',
  description: 'Đồng hành cùng công nghiệp Việt Nam từ 2011. 21 thương hiệu quốc tế, kỹ sư tư vấn, giao hàng nhanh.',
}

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-white py-16 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold font-vietnam text-ktd-blue mb-4">
            Đồng hành cùng công nghiệp Việt Nam từ 2011
          </h1>
        </div>
      </section>

      {/* Company History */}
      <section className="py-20 px-8 max-w-4xl mx-auto">
        <p className="text-xl text-ktd-dark/80 mb-6 leading-relaxed">
          Công ty TNHH Kim Thành Đông thành lập năm 2011, đến nay đã hơn 13 năm cung cấp thiết bị công nghiệp, vật tư máy móc và giải pháp kỹ thuật cho các nhà máy thuộc nhiều ngành: chế tạo máy, điện tử, ô tô, hàng không, đóng tàu, hóa chất và năng lượng.
        </p>
        <p className="text-lg text-ktd-dark/70 leading-relaxed">
          Là nhà phân phối và nhà cung cấp giải pháp kỹ thuật — không phải nhà sản xuất — KTĐ mang công nghệ toàn cầu về gần hơn với kỹ sư và nhà máy Việt Nam, kèm dịch vụ hỗ trợ kỹ thuật bản địa và giao hàng nhanh.
        </p>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 px-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-ktd-light rounded-xl p-8">
            <h3 className="text-2xl font-bold font-vietnam text-ktd-blue mb-4">Tầm nhìn</h3>
            <p className="text-ktd-dark/80 leading-relaxed">
              Trở thành đối tác cung ứng thiết bị công nghiệp và giải pháp kỹ thuật hàng đầu, được tin tưởng bởi các nhà máy trong và ngoài nước tại Việt Nam.
            </p>
          </div>

          <div className="bg-ktd-light rounded-xl p-8">
            <h3 className="text-2xl font-bold font-vietnam text-ktd-blue mb-4">Sứ mệnh</h3>
            <p className="text-ktd-dark/80 leading-relaxed">
              Cung cấp sản phẩm chính hãng, giải pháp kỹ thuật tối ưu và dịch vụ nhanh chóng, giúp khách hàng nâng cao hiệu quả sản xuất và tiết kiệm chi phí.
            </p>
          </div>
        </div>
      </section>

      {/* Core Criteria */}
      <section className="py-20 px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold font-vietnam text-ktd-dark mb-12">5 tiêu chí hoạt động</h2>
        <div className="grid grid-cols-5 gap-4">
          {CRITERIA.map((item) => (
            <div key={item.n} className="bg-white border border-ktd-light/80 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-ktd-light-blue mb-3">{item.n}</div>
              <p className="text-sm text-ktd-dark/80 leading-snug">{item.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-8 bg-ktd-light">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold font-vietnam text-ktd-dark mb-12">Chặng đường phát triển</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {TIMELINE.map((item) => (
              <div key={item.year} className="flex-shrink-0 w-56 border-l-4 border-ktd-blue pl-6 py-2">
                <div className="text-2xl font-bold font-vietnam text-ktd-blue mb-2">{item.year}</div>
                <p className="text-sm text-ktd-dark/80 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-ktd-blue py-8 px-8 text-center text-white flex items-center justify-center gap-6 flex-wrap">
        <div className="flex-1 min-w-xs">
          <h3 className="text-lg font-bold font-vietnam mb-1">
            Quý khách liên hệ với chúng tôi — hotline{' '}
            <a href="tel:0914897227" className="underline hover:opacity-80">
              0914 897 227
            </a>
          </h3>
        </div>
        <Link
          href="/lien-he"
          className="bg-white text-ktd-blue px-8 py-3 rounded font-semibold hover:bg-ktd-light transition-colors whitespace-nowrap"
        >
          Liên hệ ngay
        </Link>
      </section>
    </main>
  )
}
