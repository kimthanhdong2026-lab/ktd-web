import { DanhSachSanPham, type SanPhamTomTat } from '@/components/admin/DanhSachSanPham'
import { FormThemSanPham } from '@/components/admin/FormThemSanPham'
import { supabaseServer } from '@/lib/supabase/server'

export const metadata = { title: 'Sản phẩm' }

const MOI_TRANG = 50

export default async function AdminSanPham({ searchParams }: { searchParams: { q?: string; hang?: string; trang?: string } }) {
  const sb = supabaseServer()
  const q = (searchParams.q ?? '').trim().slice(0, 80)
  const hang = (searchParams.hang ?? '').trim()
  const trang = Math.max(1, Number(searchParams.trang) || 1)
  const off = (trang - 1) * MOI_TRANG

  let truyVan = sb
    .from('products')
    .select('part,slug,name_vi,brand_slug,category_slug,images,visible,en_status,updated_at', { count: 'exact' })
  if (q) {
    // Bỏ các ký tự có nghĩa trong cú pháp lọc của PostgREST
    const sach = q.replace(/[,()*%]/g, ' ').trim()
    truyVan = truyVan.or(`part.ilike.%${sach}%,name_vi.ilike.%${sach}%,slug.ilike.%${sach}%`)
  }
  if (hang) truyVan = truyVan.eq('brand_slug', hang)
  const [{ data: ds, count }, { data: hangs }, { data: nhoms }] = await Promise.all([
    truyVan.order('updated_at', { ascending: false }).range(off, off + MOI_TRANG - 1),
    sb.from('brands').select('slug,name').order('sort_order'),
    sb.from('categories').select('slug,name_vi,parent_slug').order('sort_order'),
  ])

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-bold text-ktd-600">Sản phẩm</h1>
          <p className="text-[13px] text-ink-600">Bấm "Sửa" để mở trang sản phẩm đúng như khách thấy, có khung sửa từng phần.</p>
        </div>
        <a href="/san-pham" target="_blank" rel="noopener" className="text-[13px] font-semibold text-ktd-600 hover:underline">Xem trang Sản phẩm trên web ↗</a>
      </div>
      <DanhSachSanPham
        ds={(ds ?? []) as SanPhamTomTat[]}
        hangs={hangs ?? []}
        nhoms={Object.fromEntries((nhoms ?? []).map((n) => [n.slug, n.name_vi]))}
        q={q}
        hang={hang}
        trang={trang}
        tong={count ?? 0}
        moiTrang={MOI_TRANG}
      />
      <div className="mt-6">
        <FormThemSanPham hangs={hangs ?? []} nhoms={nhoms ?? []} />
      </div>
    </main>
  )
}
