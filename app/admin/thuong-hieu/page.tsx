import { DanhSachHang, type HangTomTat } from '@/components/admin/DanhSachHang'
import { FormThemHang } from '@/components/admin/FormThemHang'
import { rest, restCoThe } from '@/lib/db'

export const metadata = { title: 'Thương hiệu' }

export default async function AdminThuongHieu() {
  const [hangs, dem] = await Promise.all([
    restCoThe<Omit<HangTomTat, 'soSanPham'>[]>(
      'brands?select=slug,name,origin_vi,logo,logo_goc,visible&order=sort_order',
      'brands?select=slug,name,origin_vi,logo,visible&order=sort_order',
      { revalidate: 0 }
    ),
    rest<{ brand_slug: string }[]>('products?select=brand_slug', { revalidate: 0 }),
  ])
  const so = new Map<string, number>()
  for (const p of dem) so.set(p.brand_slug, (so.get(p.brand_slug) ?? 0) + 1)

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-bold text-ktd-600">Thương hiệu</h1>
          <p className="text-[13px] text-ink-600">
            {hangs.length} hãng. Thứ tự ở đây là thứ tự trên dải logo trang chủ, menu và trang Thương hiệu.
          </p>
        </div>
        <a href="/thuong-hieu" target="_blank" rel="noopener" className="text-[13px] font-semibold text-ktd-600 hover:underline">
          Xem trang Thương hiệu trên web ↗
        </a>
      </div>
      <DanhSachHang hangs={hangs.map((h) => ({ ...h, soSanPham: so.get(h.slug) ?? 0 }))} />
      <div className="mt-6">
        <FormThemHang />
      </div>
    </main>
  )
}
