import { BangSuaDanhMuc, type NhomDangSua } from '@/components/admin/BangSuaDanhMuc'
import { DanhSachDanhMuc, type NhomTomTat } from '@/components/admin/DanhSachDanhMuc'
import { FormThemDanhMuc } from '@/components/admin/FormThemDanhMuc'
import { supabaseServer } from '@/lib/supabase/server'
import { soBanTruoc } from '../actions'

export const metadata = { title: 'Danh mục' }

export default async function AdminDanhMuc({ searchParams }: { searchParams: { khoi?: string } }) {
  const sb = supabaseServer()
  const [{ data: nhoms }, { data: sp }] = await Promise.all([
    sb.from('categories').select('slug,name_vi,name_en,sub_vi,sub_en,image,parent_slug,visible,featured,sort_order').order('sort_order'),
    sb.from('products').select('category_slug'),
  ])
  const dem = new Map<string, number>()
  for (const p of sp ?? []) dem.set(p.category_slug, (dem.get(p.category_slug) ?? 0) + 1)
  const ds: NhomTomTat[] = (nhoms ?? []).map((n) => ({ ...n, soSanPham: dem.get(n.slug) ?? 0 }))
  const chinh = ds.filter((n) => !n.parent_slug).map((n) => ({ slug: n.slug, name_vi: n.name_vi }))

  const dang = searchParams.khoi ? (nhoms ?? []).find((n) => n.slug === searchParams.khoi) : undefined
  let bang: React.ReactNode = null
  if (dang) {
    const nhom: NhomDangSua = {
      slug: dang.slug, name_vi: dang.name_vi, name_en: dang.name_en ?? '', sub_vi: dang.sub_vi ?? '', sub_en: dang.sub_en ?? '',
      image: dang.image ?? '', parent_slug: dang.parent_slug, soSanPham: dem.get(dang.slug) ?? 0,
    }
    bang = <BangSuaDanhMuc key={dang.slug} nhom={nhom} chinh={chinh} soBanTruoc={await soBanTruoc(`dm.${dang.slug}`)} />
  }

  return (
    <>
      <main className={dang ? 'px-4 py-6 lg:mr-[600px]' : 'mx-auto max-w-[1100px] px-4 py-6'}>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-[22px] font-bold text-ktd-600">Danh mục</h1>
            <p className="text-[13px] text-ink-600">
              {chinh.length} nhóm chính (ô ở trang chủ) · {ds.length - chinh.length} nhóm nhỏ (bộ lọc, trang hãng). Thứ tự ở đây là thứ tự trên web.
            </p>
          </div>
          <a href="/san-pham" target="_blank" rel="noopener" className="text-[13px] font-semibold text-ktd-600 hover:underline">Xem bộ lọc trên web ↗</a>
        </div>
        <DanhSachDanhMuc nhoms={ds} dangSua={dang?.slug} />
        <div className="mt-6">
          <FormThemDanhMuc chinh={chinh} />
        </div>
      </main>
      {bang}
    </>
  )
}
