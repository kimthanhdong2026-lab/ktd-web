import Link from 'next/link'
import { notFound } from 'next/navigation'
import { XuLyBaoGia } from '@/components/admin/XuLyBaoGia'
import { COT_YEU_CAU, gioVN, tenLoai, type YeuCauBaoGia } from '@/lib/admin/bao-gia'
import { RFQ_BUCKET } from '@/lib/rfq'
import { supabaseServer } from '@/lib/supabase/server'
import { cx } from '@/lib/utils'

export const metadata = { title: 'Yêu cầu báo giá' }

export default async function AdminChiTietBaoGia({ params }: { params: { ma: string } }) {
  const sb = supabaseServer()
  const { data } = await sb.from('yeu_cau_bao_gia').select(COT_YEU_CAU).eq('ma', params.ma).maybeSingle()
  if (!data) notFound()
  const y = data as YeuCauBaoGia

  // Link tải tệp có hạn 1 giờ, cấp bằng phiên đăng nhập của admin (policy "rfq admin doc").
  const tep = await Promise.all(
    y.tep.map(async (t) => {
      const { data: ky } = await sb.storage.from(RFQ_BUCKET).createSignedUrl(t.path, 3600)
      return { ...t, url: ky?.signedUrl }
    })
  )
  const chuDe = encodeURIComponent(`[${y.ma}] ${y.loai === 'find' ? 'Phản hồi yêu cầu tìm hàng' : 'Báo giá'} — Kim Thành Đông`)
  const O = ({ nhan, children }: { nhan: string; children: React.ReactNode }) => (
    <div className="grid grid-cols-[130px_1fr] gap-2 border-b border-hairline py-2 text-[14px] last:border-0">
      <span className="text-ink-500">{nhan}</span>
      <span className="text-ink-900">{children}</span>
    </div>
  )

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-600">
        <Link href="/admin/bao-gia" className="font-semibold text-ktd-600 hover:underline">← Yêu cầu báo giá</Link>
        <span className="font-display text-[18px] font-bold text-ktd-600">{y.ma}</span>
        <span className={cx('rounded px-2 py-0.5 text-[12px] font-semibold', y.loai === 'find' ? 'bg-amber-100 text-amber-800' : 'bg-ktd-50 text-ktd-600')}>{tenLoai(y.loai)}</span>
        <span>gửi lúc {gioVN(y.tao_luc)} · khách xem web {y.ngon_ngu === 'en' ? 'tiếng Anh' : 'tiếng Việt'}</span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-5">
          <section className="rounded-xl border border-hairline bg-white p-5">
            <h2 className="mb-2 font-display text-[16px] font-bold text-ink-900">Khách hàng</h2>
            <O nhan="Họ và tên">{y.ten}</O>
            <O nhan="Công ty">{y.cong_ty}</O>
            <O nhan="Điện thoại"><a href={`tel:${y.dien_thoai.replace(/\s/g, '')}`} className="font-semibold text-ktd-600 hover:underline">{y.dien_thoai}</a></O>
            <O nhan="Email"><a href={`mailto:${y.email}?subject=${chuDe}`} className="font-semibold text-ktd-600 hover:underline">{y.email}</a></O>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={`mailto:${y.email}?subject=${chuDe}`} className="btn-primary min-h-[38px] px-4 text-[14px]">Trả lời khách qua email</a>
              <a href={`https://zalo.me/${y.dien_thoai.replace(/\D/g, '')}`} target="_blank" rel="noopener" className="btn-secondary min-h-[38px] px-4 text-[14px]">Nhắn Zalo</a>
            </div>
          </section>

          <section className="rounded-xl border border-hairline bg-white p-5">
            <h2 className="mb-2 font-display text-[16px] font-bold text-ink-900">
              Sản phẩm khách chọn <span className="font-normal text-ink-500">({y.san_pham.length})</span>
            </h2>
            {y.san_pham.length ? (
              <table className="w-full border-collapse text-[14px]">
                <thead>
                  <tr className="text-left text-[12px] uppercase tracking-wider text-ink-500">
                    <th className="py-1.5 pr-3 font-semibold">#</th>
                    <th className="py-1.5 pr-3 font-semibold">Tên sản phẩm</th>
                    <th className="py-1.5 pr-3 font-semibold">Mã hàng</th>
                    <th className="py-1.5 pr-3 font-semibold">Hãng</th>
                    <th className="py-1.5 text-right font-semibold">SL</th>
                  </tr>
                </thead>
                <tbody>
                  {y.san_pham.map((sp, i) => (
                    <tr key={`${sp.part}-${i}`} className="border-t border-hairline">
                      <td className="py-2 pr-3 text-ink-500">{i + 1}</td>
                      <td className="py-2 pr-3 text-ink-900">{sp.name || sp.part}</td>
                      <td className="py-2 pr-3 font-mono text-[13px]">
                        <Link href={`/admin/san-pham?q=${encodeURIComponent(sp.part)}`} className="text-ktd-600 hover:underline">{sp.part}</Link>
                      </td>
                      <td className="py-2 pr-3 text-ink-700">{sp.brand}</td>
                      <td className="py-2 text-right font-semibold">{sp.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-[14px] text-ink-500">Khách không chọn sản phẩm trên web — xem ghi chú bên dưới.</p>
            )}
          </section>

          <section className="rounded-xl border border-hairline bg-white p-5">
            <h2 className="mb-2 font-display text-[16px] font-bold text-ink-900">{y.loai === 'find' ? 'Sản phẩm cần tìm' : 'Ghi chú của khách'}</h2>
            <p className="whitespace-pre-wrap rounded-md bg-surface px-4 py-3 text-[14px] leading-relaxed text-ink-900">{y.ghi_chu || '(không có)'}</p>
          </section>

          <section className="rounded-xl border border-hairline bg-white p-5">
            <h2 className="mb-2 font-display text-[16px] font-bold text-ink-900">
              Tệp đính kèm <span className="font-normal text-ink-500">({tep.length})</span>
            </h2>
            {tep.length ? (
              <ul className="flex flex-col gap-1.5 text-[14px]">
                {tep.map((t) => (
                  <li key={t.path}>
                    {t.url ? (
                      <a href={t.url} target="_blank" rel="noopener" className="font-semibold text-ktd-600 hover:underline">⬇ {t.name}</a>
                    ) : (
                      <span className="text-ink-500">{t.name} — không đọc được tệp (đã bị xóa khỏi kho?)</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[14px] text-ink-500">Không có tệp.</p>
            )}
          </section>

          <p className="text-[13px] text-ink-500">
            Email báo về hộp thư công ty: {y.email_da_gui ? <span className="text-green-700">đã gửi</span> : <span>chưa gửi{y.email_loi ? ` — ${y.email_loi}` : ''}</span>}
            {y.xu_ly_luc && <> · Đánh dấu xử lý lúc {gioVN(y.xu_ly_luc)}</>}
          </p>
        </div>

        <XuLyBaoGia ma={y.ma} trangThai={y.trang_thai} ghiChu={y.ghi_chu_noi_bo} />
      </div>
    </main>
  )
}
