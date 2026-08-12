'use client'

import Link from 'next/link'
import { COMPANY_PHONE, COMPANY_EMAIL, OFFICES } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="bg-ktd-dark text-ktd-light-blue">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-9 border-b border-ktd-navy">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white rounded px-2 py-1">
                <span className="text-ktd-dark font-bold text-xs">KTĐ</span>
              </div>
              <div className="flex gap-2">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener"
                  className="w-8 h-8 rounded bg-ktd-navy/50 hover:bg-ktd-navy flex items-center justify-center font-bold transition-colors"
                >
                  f
                </a>
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener"
                  className="w-8 h-8 rounded bg-ktd-navy/50 hover:bg-ktd-navy flex items-center justify-center transition-colors"
                >
                  ▶
                </a>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-ktd-navy/80 mb-2 max-w-xs">
              Đối tác thiết bị công nghiệp & giải pháp kỹ thuật. Công nghệ toàn cầu. Kỹ thuật bản địa. Giao hàng nhanh toàn quốc.
            </p>
            <p className="text-xs font-semibold letter-spacing-widest text-ktd-navy/60">
              CHẤT LƯỢNG — UY TÍN — NHANH CHÓNG
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-ktd-navy/80 hover:text-ktd-light-blue">Trang chủ</Link></li>
              <li><Link href="/gioi-thieu" className="text-ktd-navy/80 hover:text-ktd-light-blue">Giới thiệu</Link></li>
              <li><Link href="/san-pham" className="text-ktd-navy/80 hover:text-ktd-light-blue">Sản phẩm</Link></li>
              <li><Link href="/tin-tuc" className="text-ktd-navy/80 hover:text-ktd-light-blue">Tin tức</Link></li>
              <li><Link href="/lien-he" className="text-ktd-navy/80 hover:text-ktd-light-blue">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm">Danh mục</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/san-pham?cat=cat-got" className="text-ktd-navy/80 hover:text-ktd-light-blue">Dụng cụ cắt gọt</Link></li>
              <li><Link href="/san-pham?cat=an-toan" className="text-ktd-navy/80 hover:text-ktd-light-blue">Dụng cụ an toàn</Link></li>
              <li><Link href="/san-pham?cat=nang-ha" className="text-ktd-navy/80 hover:text-ktd-light-blue">Thiết bị nâng hạ</Link></li>
              <li><Link href="/san-pham?cat=hoa-chat" className="text-ktd-navy/80 hover:text-ktd-light-blue">Hóa chất công nghiệp</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm">Liên hệ</h3>
            <ul className="space-y-2 text-sm text-ktd-navy/80">
              <li>☎ {COMPANY_PHONE}</li>
              <li>✉ {COMPANY_EMAIL}</li>
              <li className="leading-relaxed">
                Trụ sở: {OFFICES[0].address_vi}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-wrap gap-6 justify-between items-center">
          <div className="text-xs text-ktd-navy/60">
            © 2026 Công ty TNHH Kim Thành Đông. Bản quyền được bảo lưu.
          </div>
          <div className="flex gap-4 text-xs text-ktd-navy/60">
            <span>Vũng Tàu</span>
            <span>·</span>
            <span>TP.HCM</span>
            <span>·</span>
            <span>Hà Nội</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
