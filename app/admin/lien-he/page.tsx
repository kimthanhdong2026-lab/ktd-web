import { KhungSua } from '@/components/admin/KhungSua'
import { XemTruoc } from '@/components/admin/XemTruoc'
import { TrangLienHe } from '@/components/contact/TrangLienHe'
import { LangProvider } from '@/components/LangProvider'
import { StoreProvider } from '@/components/StoreProvider'
import { bangSuaCho, nhanKhoi } from '@/lib/admin/bang-sua'
import { ghiDeCho } from '@/lib/noi-dung'

export const metadata = { title: 'Liên hệ' }

export default async function AdminLienHe({ searchParams }: { searchParams: { khoi?: string } }) {
  const khoa = searchParams.khoi === 'chung.lien-he' ? searchParams.khoi : undefined
  const lang = 'vi' as const
  const [ghiDe, bang] = await Promise.all([ghiDeCho(lang, true), bangSuaCho(khoa)])

  return (
    <LangProvider lang={lang} ghiDe={ghiDe}>
      <StoreProvider>
        <div className={khoa ? 'px-4 py-4 lg:mr-[600px]' : 'mx-auto max-w-[1600px] px-4 py-4'}>
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-600">
            <span className="font-display text-[18px] font-bold text-ktd-600">Liên hệ</span>
            <span>Số điện thoại, email, địa chỉ, giờ làm việc — dùng chung cho đầu trang, chân trang và trang này.</span>
            <a href="/lien-he" target="_blank" rel="noopener" className="ml-auto font-semibold text-ktd-600 hover:underline">Xem trên web ↗</a>
          </div>
          <XemTruoc thuNho={Boolean(khoa)}>
            <div className="overflow-hidden rounded-xl border border-hairline bg-white shadow-sm">
              <TrangLienHe
                lang={lang}
                moi
                khung={(k, node) => (
                  <KhungSua key={k} {...nhanKhoi(k)} dangSua={khoa} nhanNgoai>
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
