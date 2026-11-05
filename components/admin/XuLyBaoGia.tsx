'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { doiTrangThaiYeuCau, luuGhiChuNoiBo, xoaYeuCau } from '@/app/admin/bao-gia/actions'
import { cx } from '@/lib/utils'

/** Cột phải của trang chi tiết: trạng thái, ghi chú nội bộ, xóa. */
export function XuLyBaoGia({ ma, trangThai, ghiChu }: { ma: string; trangThai: 'moi' | 'da-xu-ly'; ghiChu: string }) {
  const router = useRouter()
  const [gc, setGc] = useState(ghiChu)
  const [dangLuu, batDau] = useTransition()
  const [thongBao, setThongBao] = useState<{ loai: 'ok' | 'loi'; chu: string } | null>(null)
  const baoCao = (r: { ok: true; thongBao?: string } | { ok: false; loi: string }) => {
    setThongBao(r.ok ? { loai: 'ok', chu: r.thongBao ?? 'Xong.' } : { loai: 'loi', chu: r.loi })
    if (r.ok) router.refresh()
  }
  const daXuLy = trangThai === 'da-xu-ly'

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-hairline bg-white p-4">
      <div>
        <span className="mb-1 block text-[13px] font-medium text-ink-700">Trạng thái</span>
        <span className={cx('inline-block rounded px-2.5 py-1 text-[13px] font-semibold', daXuLy ? 'bg-green-50 text-green-700' : 'bg-amber-100 text-amber-800')}>
          {daXuLy ? 'Đã xử lý' : 'Mới — chưa xử lý'}
        </span>
      </div>
      <button
        type="button"
        disabled={dangLuu}
        onClick={() => batDau(async () => baoCao(await doiTrangThaiYeuCau(ma, daXuLy ? 'moi' : 'da-xu-ly')))}
        className={daXuLy ? 'btn-secondary min-h-[40px] px-4' : 'btn-primary min-h-[40px] px-4'}
      >
        {dangLuu ? 'Đang lưu…' : daXuLy ? 'Chuyển lại thành Mới' : '✓ Đánh dấu đã xử lý'}
      </button>
      <label className="block">
        <span className="mb-1 block text-[13px] font-medium text-ink-700">Ghi chú nội bộ (khách không thấy)</span>
        <textarea value={gc} onChange={(e) => setGc(e.target.value)} rows={5} className="o-nhap" placeholder="Đã gọi khách, đã gửi báo giá số…" />
      </label>
      <button type="button" disabled={dangLuu || gc === ghiChu} onClick={() => batDau(async () => baoCao(await luuGhiChuNoiBo(ma, gc)))} className="btn-secondary min-h-[40px] px-4">
        Lưu ghi chú
      </button>
      {thongBao && (
        <p className={cx('rounded-md px-3 py-2 text-[13px]', thongBao.loai === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>{thongBao.chu}</p>
      )}
      <button
        type="button"
        disabled={dangLuu}
        onClick={() => {
          if (!window.confirm(`Xóa yêu cầu ${ma} cùng tệp đính kèm?\nKhông hoàn tác được.`)) return
          batDau(async () => {
            const r = await xoaYeuCau(ma)
            if (r.ok) router.push('/admin/bao-gia')
            else baoCao(r)
          })
        }}
        className="self-start text-[13px] text-ink-500 hover:text-red-700"
      >
        Xóa yêu cầu
      </button>
    </div>
  )
}
