import { KhungSua } from '@/components/admin/KhungSua'
import { XemTruoc } from '@/components/admin/XemTruoc'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { TrangChu } from '@/components/home/TrangChu'
import { LangProvider } from '@/components/LangProvider'
import { StoreProvider } from '@/components/StoreProvider'
import { bangSuaCho, nhanKhoi } from '@/lib/admin/bang-sua'
import { getBrands } from '@/lib/db'
import { ghiDeCho, lienHe } from '@/lib/noi-dung'
import { timKhoi } from '@/lib/noi-dung/khoi'

export const metadata = { title: 'Trang chủ' }

/**
 * Màn hình quản trị trang chủ: chính trang chủ (cùng mã với web), mỗi khối có
 * khung đánh số và nút Sửa. Bấm Sửa mở bảng bên phải; Lưu xong trang dựng lại
 * nên admin thấy ngay kết quả, đúng như khách sẽ thấy.
 */
export default async function AdminTrangChu({ searchParams }: { searchParams: { khoi?: string } }) {
  const khoa = searchParams.khoi && timKhoi(searchParams.khoi) ? searchParams.khoi : undefined
  const lang = 'vi' as const
  const [ghiDe, lh, brands, bang] = await Promise.all([ghiDeCho(lang, true), lienHe(lang, true), getBrands(lang), bangSuaCho(khoa)])

  return (
    <LangProvider lang={lang} ghiDe={ghiDe}>
      <StoreProvider>
        <div className={khoa ? 'px-4 py-4 lg:mr-[600px]' : 'mx-auto max-w-[1600px] px-4 py-4'}>
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-600">
            <span className="font-display text-[18px] font-bold text-ktd-600">Trang chủ</span>
            <span>Dưới đây là trang chủ đúng như khách thấy. Bấm nút <b>Sửa</b> ở góc mỗi khối.</span>
          </div>
          <XemTruoc thuNho={Boolean(khoa)}>
            <div className="overflow-hidden rounded-xl border border-hairline bg-white shadow-sm">
              <KhungSua {...nhanKhoi('chung.thanh-dau-trang')} dangSua={khoa} nhanNgoai>
                <Header brands={brands} lienHe={lh} />
              </KhungSua>
              <TrangChu
                lang={lang}
                moi
                khung={(k, node) => (
                  <KhungSua key={k} {...nhanKhoi(k)} dangSua={khoa}>
                    {node}
                  </KhungSua>
                )}
              />
              <KhungSua {...nhanKhoi('chung.chan-trang')} phu={[nhanKhoi('chung.lien-he')]} dangSua={khoa}>
                <Footer lang={lang} />
              </KhungSua>
            </div>
          </XemTruoc>
        </div>
        {bang}
      </StoreProvider>
    </LangProvider>
  )
}
