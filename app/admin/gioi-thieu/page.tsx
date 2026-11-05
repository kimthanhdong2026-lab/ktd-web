import { TrangGioiThieu } from '@/components/about/TrangGioiThieu'
import { KhungSua } from '@/components/admin/KhungSua'
import { XemTruoc } from '@/components/admin/XemTruoc'
import { LangProvider } from '@/components/LangProvider'
import { StoreProvider } from '@/components/StoreProvider'
import { bangSuaCho, nhanKhoi } from '@/lib/admin/bang-sua'
import { ghiDeCho } from '@/lib/noi-dung'
import { timKhoi } from '@/lib/noi-dung/khoi'

export const metadata = { title: 'Giới thiệu' }

export default async function AdminGioiThieu({ searchParams }: { searchParams: { khoi?: string } }) {
  const khoa = searchParams.khoi && timKhoi(searchParams.khoi) ? searchParams.khoi : undefined
  const lang = 'vi' as const
  const [ghiDe, bang] = await Promise.all([ghiDeCho(lang, true), bangSuaCho(khoa)])

  return (
    <LangProvider lang={lang} ghiDe={ghiDe}>
      <StoreProvider>
        <div className={khoa ? 'px-4 py-4 lg:mr-[600px]' : 'mx-auto max-w-[1600px] px-4 py-4'}>
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-600">
            <span className="font-display text-[18px] font-bold text-ktd-600">Giới thiệu</span>
            <span>Trang Giới thiệu đúng như khách thấy. Bấm nút <b>Sửa</b> ở góc mỗi phần.</span>
            <a href="/gioi-thieu" target="_blank" rel="noopener" className="ml-auto font-semibold text-ktd-600 hover:underline">Xem trên web ↗</a>
          </div>
          <XemTruoc thuNho={Boolean(khoa)}>
            <div className="overflow-hidden rounded-xl border border-hairline bg-white shadow-sm">
              <TrangGioiThieu
                lang={lang}
                moi
                khung={(k, node) => (
                  <KhungSua key={k} {...nhanKhoi(k)} dangSua={khoa}>
                    {node}
                  </KhungSua>
                )}
              />
            </div>
          </XemTruoc>
        </div>
        {bang}
      </StoreProvider>
    </LangProvider>
  )
}
