import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BangSuaHang, type HangDangSua } from '@/components/admin/BangSuaHang'
import { KhungSua } from '@/components/admin/KhungSua'
import { XemTruoc } from '@/components/admin/XemTruoc'
import { TheHang } from '@/components/brands/TheHang'
import { TrangHang } from '@/components/brands/TrangHang'
import { LangProvider } from '@/components/LangProvider'
import { StoreProvider } from '@/components/StoreProvider'
import { browseProducts, getBrandCategories, getBrandPage, restCoThe } from '@/lib/db'
import { ghiDeCho, tuDien } from '@/lib/noi-dung'
import { soBanTruoc } from '../../actions'

export const metadata = { title: 'Sửa trang hãng' }

const NHOM_HOP_LE = ['hang.dau', 'hang.khoi', 'hang.the']

/**
 * Màn hình sửa một hãng: trang hãng đúng như trên web, ba khung đánh số
 * (phần đầu, ba khối nội dung, thẻ ở trang danh sách). Bấm khung nào thì bảng
 * bên phải cuộn tới nhóm ô tương ứng.
 */
export default async function AdminSuaHang({ params, searchParams }: { params: { slug: string }; searchParams: { khoi?: string } }) {
  const lang = 'vi' as const
  const b = await getBrandPage(params.slug, lang, { moi: true, caAn: true })
  if (!b) notFound()
  const nhom = searchParams.khoi && NHOM_HOP_LE.includes(searchParams.khoi) ? searchParams.khoi : undefined

  const [t, ghiDe, nhoms, kq] = await Promise.all([
    tuDien(lang, true),
    ghiDeCho(lang, true),
    getBrandCategories(b.slug, lang),
    browseProducts({ q: '', brands: [b.slug], categories: [], limit: 200, lang }),
  ])

  let bang: React.ReactNode = null
  if (nhom) {
    const cot = 'slug,name,origin_vi,origin_en,website,desc_vi,desc_en,intro_vi,intro_en,dong_sp_vi,dong_sp_en,noi_bat_vi,noi_bat_en,ung_dung_vi,ung_dung_en,logo,banner'
    const [dong] = await restCoThe<Array<Record<string, unknown>>>(
      `brands?select=${cot},logo_goc&slug=eq.${encodeURIComponent(b.slug)}`,
      `brands?select=${cot}&slug=eq.${encodeURIComponent(b.slug)}`,
      { revalidate: 0 }
    )
    const s = (k: string) => (typeof dong[k] === 'string' ? (dong[k] as string) : '')
    const m = (k: string) => (Array.isArray(dong[k]) ? (dong[k] as string[]) : [])
    const hang: HangDangSua = {
      slug: b.slug, name: s('name'), origin_vi: s('origin_vi'), origin_en: s('origin_en'), website: s('website'),
      desc_vi: s('desc_vi'), desc_en: s('desc_en'), intro_vi: s('intro_vi'), intro_en: s('intro_en'),
      dong_sp_vi: m('dong_sp_vi'), dong_sp_en: m('dong_sp_en'), noi_bat_vi: m('noi_bat_vi'), noi_bat_en: m('noi_bat_en'),
      ung_dung_vi: m('ung_dung_vi'), ung_dung_en: m('ung_dung_en'), logo: s('logo'), logo_goc: s('logo_goc'), banner: s('banner'),
    }
    bang = <BangSuaHang key={b.slug} hang={hang} nhom={nhom} soBanTruoc={await soBanTruoc(`hang.${b.slug}`)} />
  }

  return (
    <LangProvider lang={lang} ghiDe={ghiDe}>
      <StoreProvider>
        <div className={nhom ? 'px-4 py-4 lg:mr-[600px]' : 'mx-auto max-w-[1600px] px-4 py-4'}>
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-600">
            <Link href="/admin/thuong-hieu" className="font-semibold text-ktd-600 hover:underline">← Thương hiệu</Link>
            <span className="font-display text-[18px] font-bold text-ktd-600">{b.name}</span>
            <span>Trang hãng đúng như khách thấy. Bấm nút <b>Sửa</b> ở góc mỗi phần.</span>
            <a href={`/thuong-hieu/${b.slug}`} target="_blank" rel="noopener" className="ml-auto font-semibold text-ktd-600 hover:underline">Xem trên web ↗</a>
          </div>
          <XemTruoc thuNho={Boolean(nhom)}>
            <div className="mb-4 max-w-[420px]">
              <KhungSua khoa="hang.the" so={3} ten="Thẻ ở trang Thương hiệu" dangSua={nhom}>
                <div className="bg-surface p-5 pt-14">
                  <TheHang b={b} t={t} lang={lang} />
                </div>
              </KhungSua>
            </div>
            <div className="overflow-hidden rounded-xl border border-hairline bg-white shadow-sm">
              <TrangHang
                b={b}
                lang={lang}
                t={t}
                sanPham={{ nhoms, dangChon: undefined, tuKhoa: '', items: kq.items, total: kq.total }}
                khung={(k, node) => (
                  <KhungSua key={k} khoa={k} so={k === 'hang.dau' ? 1 : 2} ten={k === 'hang.dau' ? 'Phần đầu trang hãng' : 'Ba khối nội dung'} dangSua={nhom}>
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
