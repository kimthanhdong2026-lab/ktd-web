import Link from 'next/link'
import { COT_YEU_CAU, gioVN, tenLoai, tomTat, type YeuCauBaoGia } from '@/lib/admin/bao-gia'
import { supabaseServer } from '@/lib/supabase/server'
import { cx } from '@/lib/utils'

export const metadata = { title: 'Yêu cầu báo giá' }

const MOI_TRANG = 50
type Loc = 'moi' | 'da-xu-ly' | 'tat-ca'

export default async function AdminBaoGia({ searchParams }: { searchParams: { loc?: string; q?: string; trang?: string } }) {
  const sb = supabaseServer()
  const loc: Loc = searchParams.loc === 'da-xu-ly' || searchParams.loc === 'tat-ca' ? searchParams.loc : 'moi'
  const q = (searchParams.q ?? '').trim().slice(0, 80)
  const trang = Math.max(1, Number(searchParams.trang) || 1)
  const off = (trang - 1) * MOI_TRANG

  let truyVan = sb.from('yeu_cau_bao_gia').select(COT_YEU_CAU, { count: 'exact' })
  if (loc !== 'tat-ca') truyVan = truyVan.eq('trang_thai', loc)
  if (q) {
    const sach = q.replace(/[,()*%]/g, ' ').trim()
    truyVan = truyVan.or(`ma.ilike.%${sach}%,ten.ilike.%${sach}%,cong_ty.ilike.%${sach}%,dien_thoai.ilike.%${sach}%,email.ilike.%${sach}%`)
  }
  const [{ data, count, error }, { count: soMoi }] = await Promise.all([
    truyVan.order('tao_luc', { ascending: false }).range(off, off + MOI_TRANG - 1),
    sb.from('yeu_cau_bao_gia').select('ma', { count: 'exact', head: true }).eq('trang_thai', 'moi'),
  ])
  const coBang = !error || !/does not exist|42P01/.test(error.message)
  const ds = (data ?? []) as YeuCauBaoGia[]
  const tong = count ?? 0
  const soTrang = Math.max(1, Math.ceil(tong / MOI_TRANG))
  const link = (l: Loc, t = 1) => `/admin/bao-gia?loc=${l}&q=${encodeURIComponent(q)}&trang=${t}`
  const chuaBatEmail = ds.some((y) => !y.email_da_gui && y.email_loi?.startsWith('Chưa bật'))

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-bold text-ktd-600">Yêu cầu báo giá</h1>
          <p className="text-[13px] text-ink-600">
            Mọi yêu cầu khách gửi từ nút "Báo giá" và "Gửi yêu cầu tìm hàng" trên web đều nằm ở đây. {soMoi ? <b className="text-quote">{soMoi} yêu cầu mới</b> : 'Không có yêu cầu mới.'}
          </p>
        </div>
      </div>

      {!coBang && (
        <p className="mb-3 rounded-md bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
          Bảng yêu cầu báo giá chưa được tạo trong cơ sở dữ liệu (file SQL 0024). Chạy file đó rồi tải lại trang.
        </p>
      )}
      {chuaBatEmail && (
        <p className="mb-3 rounded-md bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
          Web chưa bật gửi email (chưa có tài khoản Resend) nên yêu cầu mới <b>chỉ hiện ở trang này</b>, không có email báo. Nhớ vào xem mỗi ngày.
        </p>
      )}

      <div className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-hairline bg-white p-4">
        <div className="flex gap-1 rounded-md bg-surface p-1 text-[13px] font-semibold">
          {([['moi', 'Mới'], ['da-xu-ly', 'Đã xử lý'], ['tat-ca', 'Tất cả']] as [Loc, string][]).map(([l, ten]) => (
            <Link key={l} href={link(l)} className={cx('rounded px-3 py-1.5', loc === l ? 'bg-white text-ktd-600 shadow-sm' : 'text-ink-600 hover:text-ink-900')}>
              {ten}
            </Link>
          ))}
        </div>
        <form method="get" className="flex flex-1 items-end gap-3">
          <input type="hidden" name="loc" value={loc} />
          <label className="block min-w-[260px] flex-1">
            <span className="mb-1 block text-[13px] font-medium text-ink-700">Tìm theo mã, tên, công ty, điện thoại, email</span>
            <input name="q" defaultValue={q} className="o-nhap" placeholder="Ví dụ: RFQ-2611 hoặc 0914" />
          </label>
          <button type="submit" className="btn-primary min-h-[40px] px-5">Tìm</button>
          {q && <Link href={link(loc)} className="text-[13px] text-ink-500 hover:underline">Xóa lọc</Link>}
        </form>
      </div>

      <p className="mb-2 text-[13px] text-ink-600">{tong} yêu cầu{q ? ' phù hợp' : ''} · trang {trang}/{soTrang}</p>
      <table className="w-full border-collapse overflow-hidden rounded-xl border border-hairline bg-white text-[14px]">
        <thead>
          <tr className="bg-surface text-left text-[12px] uppercase tracking-wider text-ink-500">
            <th className="px-3 py-2.5 font-semibold">Lúc gửi</th>
            <th className="px-3 py-2.5 font-semibold">Mã</th>
            <th className="px-3 py-2.5 font-semibold">Loại</th>
            <th className="px-3 py-2.5 font-semibold">Khách</th>
            <th className="px-3 py-2.5 font-semibold">Liên hệ</th>
            <th className="px-3 py-2.5 font-semibold">Nội dung</th>
            <th className="px-3 py-2.5 font-semibold">Email báo</th>
            <th className="px-3 py-2.5"></th>
          </tr>
        </thead>
        <tbody>
          {ds.map((y, i) => (
            <tr key={y.ma} className={cx(i % 2 ? 'bg-surface/50' : '', y.trang_thai === 'moi' && 'font-medium')}>
              <td className="whitespace-nowrap px-3 py-2 text-ink-700">{gioVN(y.tao_luc)}</td>
              <td className="whitespace-nowrap px-3 py-2 font-mono text-[13px] text-ink-700">{y.ma}</td>
              <td className="px-3 py-2">
                <span className={cx('rounded px-2 py-0.5 text-[12px] font-semibold', y.loai === 'find' ? 'bg-amber-100 text-amber-800' : 'bg-ktd-50 text-ktd-600')}>{tenLoai(y.loai)}</span>
              </td>
              <td className="px-3 py-2 text-ink-900">
                {y.ten}
                <span className="block text-[13px] font-normal text-ink-600">{y.cong_ty}</span>
              </td>
              <td className="px-3 py-2 text-[13px] font-normal text-ink-700">
                {y.dien_thoai}
                <span className="block">{y.email}</span>
              </td>
              <td className="px-3 py-2 text-[13px] font-normal text-ink-700">{tomTat(y)}</td>
              <td className="px-3 py-2 text-[13px] font-normal">
                {y.email_da_gui ? <span className="text-green-700">Đã gửi</span> : <span className="text-ink-500" title={y.email_loi ?? ''}>Chưa</span>}
              </td>
              <td className="px-3 py-2 text-right">
                <Link href={`/admin/bao-gia/${y.ma}`} className="whitespace-nowrap font-semibold text-ktd-600 hover:underline">
                  {y.trang_thai === 'moi' ? 'Xem →' : 'Xem lại →'}
                </Link>
              </td>
            </tr>
          ))}
          {!ds.length && (
            <tr>
              <td colSpan={8} className="px-3 py-8 text-center text-ink-500">
                {loc === 'moi' ? 'Không có yêu cầu mới.' : 'Chưa có yêu cầu nào.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {soTrang > 1 && (
        <p className="mt-3 flex gap-3 text-[13px]">
          {trang > 1 && <Link href={link(loc, trang - 1)} className="font-semibold text-ktd-600 hover:underline">← Trang trước</Link>}
          {trang < soTrang && <Link href={link(loc, trang + 1)} className="font-semibold text-ktd-600 hover:underline">Trang sau →</Link>}
        </p>
      )}
    </main>
  )
}
