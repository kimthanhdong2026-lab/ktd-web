import { DanhSachBaiViet } from '@/components/admin/DanhSachBaiViet'
import { FormThemBaiViet } from '@/components/admin/FormThemBaiViet'
import { rest } from '@/lib/db'
import { layBaiViet } from '@/lib/tin-tuc'

export const metadata = { title: 'Tin tức' }

export default async function AdminTinTuc() {
  // Bảng bai_viet đã có chưa (migration 0023)? Chưa thì chỉ xem, không sửa được.
  const coBang = await rest('bai_viet?select=slug&limit=1', { revalidate: 0 }).then(() => true).catch(() => false)
  const ds = await layBaiViet('vi', { moi: true, caAn: true })
  return (
    <main className="mx-auto max-w-[1100px] px-4 py-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-bold text-ktd-600">Tin tức & Kiến thức</h1>
          <p className="text-[13px] text-ink-600">{ds.length} bài. Ba bài mới nhất đang hiện hiện ở trang chủ.</p>
        </div>
        <a href="/tin-tuc" target="_blank" rel="noopener" className="text-[13px] font-semibold text-ktd-600 hover:underline">Xem trang Tin tức trên web ↗</a>
      </div>
      <DanhSachBaiViet ds={ds} coBang={coBang} />
      {coBang && (
        <div className="mt-6">
          <FormThemBaiViet />
        </div>
      )}
    </main>
  )
}
