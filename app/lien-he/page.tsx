import { OFFICES } from '@/lib/constants'

export const metadata = {
  title: 'Liên hệ | Kim Thành Đông',
  description: '4 văn phòng tại Vũng Tàu, TP.HCM, Hà Nội, Đà Nẵng. Hotline 24/7. Giao hàng toàn quốc.',
}

export default function ContactPage() {
  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold font-vietnam text-ktd-dark mb-12">Liên hệ Kim Thành Đông</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Offices & Contact Info */}
        <div>
          <div className="space-y-3 mb-8">
            {OFFICES.map((office) => (
              <div
                key={office.id}
                className="bg-white border border-ktd-light/80 rounded-lg p-6 hover:shadow-lg hover:border-ktd-blue transition-all cursor-pointer"
              >
                <h3 className="font-bold text-ktd-blue mb-2">{office.name_vi}</h3>
                <p className="text-sm text-ktd-dark/80 leading-relaxed">{office.address_vi}</p>
              </div>
            ))}
          </div>

          <div className="bg-ktd-light rounded-lg p-6">
            <div className="space-y-3 text-sm text-ktd-dark/80">
              <div className="flex items-start gap-3">
                <span className="text-lg">☎</span>
                <div>
                  <div className="font-semibold text-ktd-dark">Điện thoại</div>
                  <div>02543 627760</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">💬</span>
                <div>
                  <div className="font-semibold text-ktd-dark">Hotline 1 (Zalo)</div>
                  <div>0914 897 227</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">💬</span>
                <div>
                  <div className="font-semibold text-ktd-dark">Hotline 2 (Zalo & WhatsApp)</div>
                  <div>0974 516 416</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">✉</span>
                <div>
                  <div className="font-semibold text-ktd-dark">Email</div>
                  <div>sales@kimthanhdong.com</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🌐</span>
                <div>
                  <div className="font-semibold text-ktd-dark">Website</div>
                  <div>kimthanhdong.vn</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Map Placeholder */}
        <div className="sticky top-28">
          <div className="aspect-video bg-ktd-light rounded-lg border border-ktd-light/80 flex flex-col items-center justify-center">
            <div className="text-5xl mb-4">📍</div>
            <div className="text-center">
              <div className="font-bold text-lg text-ktd-dark mb-2 font-vietnam">Trụ sở chính — Vũng Tàu</div>
              <div className="font-mono text-xs text-ktd-dark/60">[ BẢN ĐỒ NHÚNG ]</div>
              <p className="text-sm text-ktd-dark/70 mt-4 px-4">
                Sẽ được tích hợp Mapbox trong Phase 2
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-ktd-blue text-white rounded-lg p-8">
          <h3 className="text-2xl font-bold font-vietnam mb-4">Gọi hotline</h3>
          <p className="text-ktd-light-blue mb-6">
            Gặp kỹ sư ngay, 24/7, sẵn sàng tư vấn.
          </p>
          <a
            href="tel:0914897227"
            className="inline-block bg-white text-ktd-blue px-8 py-3 rounded font-semibold hover:bg-ktd-light transition-colors"
          >
            ☎ 0914 897 227
          </a>
        </div>

        <div className="bg-ktd-dark text-white rounded-lg p-8">
          <h3 className="text-2xl font-bold font-vietnam mb-4">Chat Zalo</h3>
          <p className="text-ktd-light-blue mb-6">
            Nhanh, tiện lợi, hỗ trợ 24/7.
          </p>
          <a
            href="https://zalo.me/0914897227"
            target="_blank"
            rel="noopener"
            className="inline-block bg-white text-ktd-dark px-8 py-3 rounded font-semibold hover:bg-ktd-light transition-colors"
          >
            💬 Chat Zalo
          </a>
        </div>
      </section>
    </main>
  )
}
