import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BangSuaSanPham, type SanPhamDangSua } from '@/components/admin/BangSuaSanPham'
import { NHOM_SAN_PHAM } from '@/lib/admin/nhom-san-pham'
import { KhungSua } from '@/components/admin/KhungSua'
import { XemTruoc } from '@/components/admin/XemTruoc'
import { LangProvider } from '@/components/LangProvider'
import { TrangSanPham } from '@/components/products/TrangSanPham'
import { StoreProvider } from '@/components/StoreProvider'
import { getProductBySlug, getRelatedProducts } from '@/lib/db'
import { ghiDeCho, tuDien } from '@/lib/noi-dung'
import { supabaseServer } from '@/lib/supabase/server'
import { soBanTruoc } from '../../actions'

export const metadata = { title: 'Sửa sản phẩm' }

/**
 * Màn hình sửa một sản phẩm: trang chi tiết đúng như trên web với bốn khung
 * (ảnh, thông tin chính, các tab, hiển thị). Bấm khung nào thì bảng bên phải
 * cuộn tới nhóm ô tương ứng.
 */
export default async function AdminSuaSanPham({ params, searchParams }: { params: { slug: string }; searchParams: { khoi?: string } }) {
  const lang = 'vi' as const
  const sb = supabaseServer()
  const { data: dong } = await sb.from('products').select('*').eq('slug', params.slug).maybeSingle()
  if (!dong) notFound()
  const nhom = searchParams.khoi && NHOM_SAN_PHAM.some((n) => n.id === searchParams.khoi) ? searchParams.khoi : undefined

  const [product, t, ghiDe, { data: hangs }, { data: nhoms }] = await Promise.all([
    getProductBySlug(params.slug, lang, { moi: true }),
    tuDien(lang, true),
    ghiDeCho(lang, true),
    sb.from('brands').select('slug,name').order('sort_order'),
    sb.from('categories').select('slug,name_vi,parent_slug').order('sort_order'),
  ])
  if (!product) notFound()
  const related = await getRelatedProducts(product.brand, product.part, 4, lang)

  const s = (k: string) => (typeof dong[k] === 'string' ? (dong[k] as string) : '')
  const m = (k: string) => (Array.isArray(dong[k]) ? (dong[k] as string[]) : [])
  const specs = (k: string) => (Array.isArray(dong[k]) ? (dong[k] as { label: string; value: string }[]) : [])
  const sp: SanPhamDangSua = {
    part: dong.part, slug: dong.slug, brand_slug: s('brand_slug'), category_slug: s('category_slug'),
    name_vi: s('name_vi'), name_en: s('name_en'), series: s('series'), origin_vi: s('origin_vi'), origin_en: s('origin_en'),
    desc_vi: s('desc_vi'), desc_en: s('desc_en'),
    highlights_vi: m('highlights_vi'), highlights_en: m('highlights_en'),
    desc_full_vi: m('desc_full_vi'), desc_full_en: m('desc_full_en'),
    applications_vi: m('applications_vi'), applications_en: m('applications_en'),
    specs_vi: specs('specs_vi'), specs_en: specs('specs_en'),
    images: m('images'), doc_pdf: s('doc_pdf'), doc_url: s('doc_url'), keywords: m('keywords'),
    visible: Boolean(dong.visible), featured: Boolean(dong.featured), tag: s('tag'),
    priority: dong.priority == null ? '' : String(dong.priority), en_status: s('en_status') || 'trống',
  }

  const tenNhom = (nhoms ?? []).find((n) => n.slug === sp.category_slug)?.name_vi ?? sp.category_slug
  const khoi = (id: string) => {
    const n = NHOM_SAN_PHAM.find((x) => x.id === id)!
    return { khoa: n.id, so: n.so, ten: n.ten }
  }

  return (
    <LangProvider lang={lang} ghiDe={ghiDe}>
      <StoreProvider>
        <div className={nhom ? 'px-4 py-4 lg:mr-[600px]' : 'mx-auto max-w-[1600px] px-4 py-4'}>
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-600">
            <Link href="/admin/san-pham" className="font-semibold text-ktd-600 hover:underline">← Sản phẩm</Link>
            <span className="font-display text-[18px] font-bold text-ktd-600">{sp.name_vi}</span>
            <span className="font-mono">{sp.part}</span>
            {!sp.visible && <span className="rounded bg-amber-100 px-2 py-0.5 text-[12px] font-semibold text-amber-800">Đang ẩn</span>}
            <a href={`/san-pham/${sp.slug}`} target="_blank" rel="noopener" className="ml-auto font-semibold text-ktd-600 hover:underline">Xem trên web ↗</a>
          </div>
          <XemTruoc thuNho={Boolean(nhom)}>
            <div className="mb-4">
              <KhungSua {...khoi('sp.hien')} dangSua={nhom} nhanNgoai>
                <div className="flex flex-wrap gap-x-6 gap-y-1 bg-white px-5 py-3 text-[14px] text-ink-700">
                  <span>Trạng thái: <b>{sp.visible ? 'Đang hiện trên web' : 'Đang ẩn'}</b></span>
                  <span>Nhóm: <b>{tenNhom}</b></span>
                  <span>Ưu tiên: <b>{sp.priority || 'cuối'}</b></span>
                  <span>Nhãn: <b>{sp.tag || 'không'}</b></span>
                  <span>Tiếng Anh: <b>{sp.en_status}</b></span>
                  <span>Từ khóa: <b>{sp.keywords.length}</b></span>
                </div>
              </KhungSua>
            </div>
            <div className="overflow-hidden rounded-xl border border-hairline bg-white shadow-sm">
              <TrangSanPham
                product={product}
                related={related}
                lang={lang}
                t={t}
                khung={(k, node) => (
                  <KhungSua key={k} {...khoi(k)} dangSua={nhom} nhanNgoai={k !== 'sp.anh'}>
                    {node}
                  </KhungSua>
                )}
              />
            </div>
          </XemTruoc>
        </div>
        {nhom && (
          <BangSuaSanPham key={sp.part} sp={sp} nhom={nhom} soBanTruoc={await soBanTruoc(`sp.${sp.part}`)} hangs={hangs ?? []} nhoms={nhoms ?? []} />
        )}
      </StoreProvider>
    </LangProvider>
  )
}
