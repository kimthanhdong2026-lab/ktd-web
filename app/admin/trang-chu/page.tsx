import { BangSua } from '@/components/admin/BangSua'
import { KhungSua } from '@/components/admin/KhungSua'
import { XemTruoc } from '@/components/admin/XemTruoc'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { TrangChu } from '@/components/home/TrangChu'
import { LangProvider } from '@/components/LangProvider'
import { StoreProvider } from '@/components/StoreProvider'
import { getBrands, restCoThe } from '@/lib/db'
import { ghiDeCho, giaTriKhoi, lienHe, luuLuc } from '@/lib/noi-dung'
import { timKhoi } from '@/lib/noi-dung/khoi'
import { soBanTruoc, type DongDanhMuc } from '../actions'

export const metadata = { title: 'Trang chủ' }

/**
 * Màn hình quản trị trang chủ: chính trang chủ (cùng mã với web), mỗi khối có
 * khung đánh số và nút Sửa. Bấm Sửa mở bảng bên phải; Lưu xong trang dựng lại
 * nên admin thấy ngay kết quả, đúng như khách sẽ thấy.
 */
export default async function AdminTrangChu({ searchParams }: { searchParams: { khoi?: string } }) {
  const khoa = searchParams.khoi && timKhoi(searchParams.khoi) ? searchParams.khoi : undefined
  const lang = 'vi' as const
  const [ghiDe, lh, brands] = await Promise.all([ghiDeCho(lang, true), lienHe(lang, true), getBrands(lang)])

  const nhan = (k: string) => {
    const kh = timKhoi(k)!
    return { khoa: kh.khoa, so: kh.so, ten: kh.ten }
  }

  // Dữ liệu cho bảng sửa của khối đang mở
  let bang: React.ReactNode = null
  if (khoa) {
    const khoi = timKhoi(khoa)!
    const [giaTri, luc, soBan] = await Promise.all([giaTriKhoi(khoi, true), luuLuc(khoa), soBanTruoc(khoa)])
    let danhMuc: DongDanhMuc[] | undefined
    if (khoa === 'trang-chu.danh-muc') {
      const rows = await restCoThe<Array<{ slug: string; name_vi: string; name_en: string | null; sub_vi: string; sub_en: string | null; image?: string | null }>>(
        'categories?select=slug,name_vi,name_en,sub_vi,sub_en,image&parent_slug=is.null&visible=eq.true&order=sort_order',
        'categories?select=slug,name_vi,name_en,sub_vi,sub_en&parent_slug=is.null&visible=eq.true&order=sort_order',
        { revalidate: 0 }
      )
      danhMuc = rows.map((r) => ({ slug: r.slug, name_vi: r.name_vi, name_en: r.name_en ?? '', sub_vi: r.sub_vi, sub_en: r.sub_en ?? '', image: r.image ?? '' }))
    }
    bang = <BangSua key={khoa} khoa={khoa} giaTri={giaTri} luuLuc={luc} soBanTruoc={soBan} danhMuc={danhMuc} />
  }

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
              <KhungSua {...nhan('chung.thanh-dau-trang')} dangSua={khoa} nhanNgoai>
                <Header brands={brands} lienHe={lh} />
              </KhungSua>
              <TrangChu
                lang={lang}
                moi
                khung={(k, node) => (
                  <KhungSua key={k} {...nhan(k)} dangSua={khoa}>
                    {node}
                  </KhungSua>
                )}
              />
              <KhungSua {...nhan('chung.chan-trang')} phu={[nhan('chung.lien-he')]} dangSua={khoa}>
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
