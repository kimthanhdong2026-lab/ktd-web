'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { cacSheetExcel, kiemExcel, napExcel, type SheetTomTat } from '@/app/admin/nhap-excel/actions'
import type { KetQuaKiem } from '@/lib/admin/doc-excel'
import { cx } from '@/lib/utils'

/**
 * Nhập sản phẩm từ file Excel mẫu — ba bước: chọn file, kiểm thử, nạp.
 * Kiểm thử báo lỗi theo từng dòng Excel; còn lỗi thì không nạp được.
 */
export function NhapExcel() {
  const [tep, setTep] = useState<File | null>(null)
  const [sheets, setSheets] = useState<SheetTomTat[]>([])
  const [chon, setChon] = useState<string[]>([])
  const [kq, setKq] = useState<KetQuaKiem[] | null>(null)
  const [xoaKhongCoTrongFile, setXoa] = useState(false)
  const [anMoi, setAnMoi] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const [xong, setXong] = useState<string | null>(null)
  const [buoc, setBuoc] = useState<string | null>(null)
  const [dang, batDau] = useTransition()

  const goi = (f: File, them: Record<string, string> = {}) => {
    const fd = new FormData()
    fd.set('tep', f)
    fd.set('sheets', JSON.stringify(chon))
    for (const [k, v] of Object.entries(them)) fd.set(k, v)
    return fd
  }

  const chonFile = async (f?: File) => {
    if (!f) return
    setLoi(null); setXong(null); setKq(null); setSheets([]); setTep(null)
    if (f.size > 4 * 1024 * 1024) return setLoi('File quá 4 MB. Lưu lại dạng .xlsx không kèm ảnh/macro rồi thử lại.')
    setBuoc('Đang đọc file…')
    const fd = new FormData()
    fd.set('tep', f)
    const s = await cacSheetExcel(fd)
    setBuoc(null)
    if (!s.ok) return setLoi(s.loi)
    setTep(f)
    setSheets(s.sheets)
    setChon(s.sheets.filter((x) => x.soDong > 0 && x.hang).map((x) => x.ten))
  }

  const kiem = () =>
    batDau(async () => {
      if (!tep) return
      setLoi(null); setXong(null)
      const r = await kiemExcel(goi(tep))
      if (!r.ok) return setLoi(r.loi)
      setKq(r.ketQua)
    })

  const nap = () =>
    batDau(async () => {
      if (!tep) return
      setLoi(null)
      const r = await napExcel(goi(tep, { xoa: xoaKhongCoTrongFile ? '1' : '0', anMoi: anMoi ? '1' : '0' }))
      if (!r.ok) return setLoi(r.loi)
      setXong(r.thongBao)
      setKq(null); setTep(null); setSheets([])
    })

  const tongLoi = kq?.reduce((s, k) => s + k.dong.filter((d) => d.loi.length).length, 0) ?? 0
  const tongDong = kq?.reduce((s, k) => s + k.dong.length, 0) ?? 0

  return (
    <div className="flex flex-col gap-5">
      {/* ------------------------------------------------ bước 1 */}
      <section className="rounded-xl border border-hairline bg-white p-5">
        <h2 className="mb-1 font-display text-[16px] font-bold text-ink-900">1. Chọn file Excel</h2>
        <p className="mb-3 text-[13px] text-ink-600">
          Theo mẫu <b>MAU-NHAP-SAN-PHAM-KTD</b> (.xlsx hoặc .xlsm). Mỗi hãng một sheet, tên sheet là tên hãng. Chỉ nạp phần chữ — ảnh tải ở trang sửa từng sản phẩm.
        </p>
        <label className="btn-secondary min-h-[40px] cursor-pointer px-4 text-[14px]">
          {buoc ?? (tep ? `Đã chọn: ${tep.name} — chọn file khác…` : 'Chọn file…')}
          <input type="file" accept=".xlsx,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12" className="sr-only" disabled={!!buoc} onChange={(e) => chonFile(e.target.files?.[0])} />
        </label>
        {sheets.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-[13px] font-medium text-ink-700">Nạp những sheet nào?</p>
            <div className="flex flex-wrap gap-2">
              {sheets.map((s) => {
                const duoc = s.soDong > 0 && !!s.hang
                return (
                  <label key={s.ten} className={cx('inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-[13px]', duoc ? 'border-hairline bg-surface/60' : 'border-dashed border-ink-300 text-ink-500')}>
                    <input type="checkbox" className="h-4 w-4 accent-ktd-600" disabled={!duoc} checked={chon.includes(s.ten)} onChange={(e) => setChon(e.target.checked ? [...chon, s.ten] : chon.filter((x) => x !== s.ten))} />
                    <span className="font-semibold">{s.ten}</span>
                    <span className="text-ink-500">{s.soDong ? `${s.soDong} dòng · hãng ${s.hang ?? '?'}` : 'không phải sheet sản phẩm'}</span>
                  </label>
                )
              })}
            </div>
            <button type="button" onClick={kiem} disabled={dang || !chon.length} className="btn-primary mt-4 min-h-[40px] px-5">
              {dang && !kq ? 'Đang kiểm…' : '2. Kiểm thử (chưa ghi gì)'}
            </button>
          </div>
        )}
      </section>

      {/* ------------------------------------------------ bước 2 */}
      {kq && (
        <section className="rounded-xl border border-hairline bg-white p-5">
          <h2 className="mb-1 font-display text-[16px] font-bold text-ink-900">2. Kết quả kiểm thử</h2>
          <p className={cx('mb-3 text-[13px]', tongLoi ? 'text-red-700' : 'text-green-700')}>
            {tongDong} sản phẩm · {tongLoi ? `${tongLoi} dòng có LỖI — sửa trong Excel rồi chọn file lại` : 'không có lỗi, nạp được'}
          </p>
          {kq.map((k) => {
            const them = k.dong.filter((d) => d.trangThai === 'THÊM MỚI').length
            return (
              <div key={k.sheet} className="mb-4">
                <p className="mb-1 text-[14px] font-semibold text-ink-900">
                  {k.sheet} → hãng <span className="font-mono">{k.hang}</span>: {them} thêm mới · {k.dong.length - them} ghi đè
                  {k.khongCoTrongFile.length > 0 && <span className="ml-2 font-normal text-ink-500">· {k.khongCoTrongFile.length} mã đang có trên web nhưng không có trong file: {k.khongCoTrongFile.slice(0, 8).join(', ')}{k.khongCoTrongFile.length > 8 ? '…' : ''}</span>}
                </p>
                <div className="max-h-[420px] overflow-auto rounded-lg border border-hairline">
                  <table className="w-full border-collapse text-[13px]">
                    <thead className="sticky top-0 bg-surface text-left text-[11px] uppercase tracking-wider text-ink-500">
                      <tr>
                        <th className="px-2 py-1.5">Dòng</th><th className="px-2 py-1.5">Mã</th><th className="px-2 py-1.5">Tên</th><th className="px-2 py-1.5">Trạng thái</th><th className="px-2 py-1.5">Lỗi</th><th className="px-2 py-1.5">Cảnh báo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {k.dong.map((d) => (
                        <tr key={d.dong} className={cx('border-t border-hairline', d.loi.length > 0 && 'bg-red-50')}>
                          <td className="px-2 py-1.5 text-ink-500">{d.dong}</td>
                          <td className="px-2 py-1.5 font-mono">{d.part}</td>
                          <td className="px-2 py-1.5">{d.ten}</td>
                          <td className="px-2 py-1.5 whitespace-nowrap">{d.trangThai}</td>
                          <td className="px-2 py-1.5 text-red-700">{d.loi.join('; ')}</td>
                          <td className="px-2 py-1.5 text-ink-500">{d.canh.join('; ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}

          <div className="mt-4 flex flex-col gap-2 border-t border-hairline pt-4">
            <label className="inline-flex items-center gap-2 text-[14px]">
              <input type="checkbox" className="h-4 w-4 accent-ktd-600" checked={anMoi} onChange={(e) => setAnMoi(e.target.checked)} />
              Sản phẩm mới ở trạng thái ẩn (bật lên sau khi thêm ảnh)
            </label>
            <label className="inline-flex items-center gap-2 text-[14px]">
              <input type="checkbox" className="h-4 w-4 accent-ktd-600" checked={xoaKhongCoTrongFile} onChange={(e) => setXoa(e.target.checked)} />
              Xóa sản phẩm của hãng đang có trên web mà không có trong file
            </label>
            <div className="mt-2">
              <button type="button" onClick={nap} disabled={dang || tongLoi > 0} className="btn-primary min-h-[40px] px-5">
                {dang ? 'Đang nạp…' : `3. Nạp ${tongDong} sản phẩm — lên web ngay`}
              </button>
            </div>
            <p className="text-[12px] text-ink-500">Sản phẩm ghi đè giữ nguyên ảnh, PDF và đường dẫn; bản trước được cất để Hoàn tác ở trang sửa từng sản phẩm. Tiếng Anh để trống — web hiện tiếng Việt cho tới khi admin dịch.</p>
          </div>
        </section>
      )}

      {loi && <p className="rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-700">{loi}</p>}
      {xong && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-[13px] text-green-700">
          {xong} <Link href="/admin/san-pham" className="font-semibold underline">Xem danh sách sản phẩm →</Link>
        </p>
      )}
    </div>
  )
}
