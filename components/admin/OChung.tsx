'use client'

import { cx } from '@/lib/utils'

/** Các ô dùng chung cho mọi bảng sửa của trang quản trị. */

export function Chu({ nhan, goiY, children }: { nhan: string; goiY?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-medium text-ink-700">{nhan}</span>
      {children}
      {goiY && <span className="mt-1 block text-[12px] text-ink-500">{goiY}</span>}
    </label>
  )
}

/** Hai ô VI | EN cạnh nhau. */
export function ChuVE({
  nhan,
  vi,
  en,
  dat,
  dong,
  goiY,
}: {
  nhan: string
  vi: string
  en: string
  dat: (vi: string, en: string) => void
  dong?: number
  goiY?: string
}) {
  const Tag = dong ? 'textarea' : 'input'
  const them = dong ? { rows: dong } : {}
  return (
    <Chu nhan={nhan} goiY={goiY}>
      <div className="grid grid-cols-2 gap-3">
        <Tag className="o-nhap" value={vi} onChange={(e) => dat(e.target.value, en)} {...them} />
        <Tag className="o-nhap" value={en} onChange={(e) => dat(vi, e.target.value)} placeholder="English" {...them} />
      </div>
    </Chu>
  )
}

const NUT = 'rounded border border-hairline px-1.5 py-0.5 text-[12px] text-ink-600 hover:bg-surface disabled:opacity-30'

export function NutDong({ len, i, toiThieu = 0, chuyen, xoa }: { len: number; i: number; toiThieu?: number; chuyen: (i: number, d: -1 | 1) => void; xoa: (i: number) => void }) {
  return (
    <span className="flex gap-1">
      <button type="button" className={NUT} onClick={() => chuyen(i, -1)} disabled={i === 0} title="Lên">↑</button>
      <button type="button" className={NUT} onClick={() => chuyen(i, 1)} disabled={i === len - 1} title="Xuống">↓</button>
      <button type="button" className={NUT} onClick={() => xoa(i)} disabled={len <= toiThieu} title="Xóa">✕</button>
    </span>
  )
}

/** Danh sách dòng VI | EN: thêm, bớt, đổi thứ tự. */
export function DanhSach({
  nhan,
  vi,
  en,
  dat,
  dong,
  goiY,
}: {
  nhan: string
  vi: string[]
  en: string[]
  dat: (vi: string[], en: string[]) => void
  /** Số dòng của ô (ô nhiều dòng cho đoạn văn). */
  dong?: number
  goiY?: string
}) {
  const n = Math.max(vi.length, en.length)
  const doi = (i: number, ngon: 'vi' | 'en', chu: string) => {
    const v = [...vi], e = [...en]
    ;(ngon === 'vi' ? v : e)[i] = chu
    dat(v, e)
  }
  const chuyen = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= n) return
    const v = [...vi], e = [...en]
    ;[v[i], v[j]] = [v[j], v[i]]
    ;[e[i], e[j]] = [e[j], e[i]]
    dat(v, e)
  }
  const xoa = (i: number) => dat(vi.filter((_, j) => j !== i), en.filter((_, j) => j !== i))
  const Tag = dong ? 'textarea' : 'input'
  const them = dong ? { rows: dong } : {}
  return (
    <div>
      <span className="mb-1 block text-[13px] font-medium text-ink-700">
        {nhan} <span className="font-normal text-ink-500">({n})</span>
      </span>
      <div className="flex flex-col gap-2">
        {Array.from({ length: n }, (_, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-start gap-2">
            <Tag className="o-nhap" value={vi[i] ?? ''} onChange={(e) => doi(i, 'vi', e.target.value)} {...them} />
            <Tag className="o-nhap" value={en[i] ?? ''} onChange={(e) => doi(i, 'en', e.target.value)} placeholder="English" {...them} />
            <span className="pt-2"><NutDong len={n} i={i} chuyen={chuyen} xoa={xoa} /></span>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => dat([...vi, ''], [...en, ''])} className="mt-2 text-[13px] font-semibold text-ktd-600 hover:underline">
        + Thêm dòng
      </button>
      {goiY && <span className="mt-1 block text-[12px] text-ink-500">{goiY}</span>}
    </div>
  )
}

export interface NhomO {
  id: string
  so: number
  ten: string
  moTa?: string
}

export function TieuDeNhom({ n, dang }: { n: NhomO; dang?: string }) {
  return (
    <div
      id={`nhom-${n.id}`}
      className={cx(
        'mb-3 mt-6 flex items-start gap-2.5 border-t border-hairline pt-4 first:mt-0 first:border-0 first:pt-0',
        dang === n.id && 'rounded-md bg-ktd-50 p-3'
      )}
    >
      <span className="flex h-6 min-w-6 items-center justify-center rounded bg-ktd-600 px-1.5 text-[12px] font-bold text-white">{n.so}</span>
      <div>
        <p className="font-display text-[15px] font-bold text-ink-900">{n.ten}</p>
        {n.moTa && <p className="text-[12px] text-ink-500">{n.moTa}</p>}
      </div>
    </div>
  )
}

/** Khung chung của bảng sửa bên phải: đầu, thân cuộn, chân với Lưu / Hoàn tác. */
export function KhungBang({
  tieuDe,
  phu,
  dong,
  thongBao,
  dangLuu,
  daSua,
  luu,
  hoanTac,
  soBanTruoc,
  them,
  children,
}: {
  tieuDe: string
  phu?: string
  dong: () => void
  thongBao: { loai: 'ok' | 'loi'; chu: string } | null
  dangLuu: boolean
  daSua: boolean
  luu: () => void
  hoanTac?: () => void
  soBanTruoc?: number
  /** Nút phụ ở chân (ví dụ Xóa). */
  them?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <aside className="fixed bottom-0 right-0 top-12 z-50 flex w-full max-w-[600px] flex-col border-l border-hairline bg-white shadow-2xl">
      <header className="flex items-start gap-3 border-b border-hairline px-5 py-4">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[17px] font-bold leading-tight text-ink-900">{tieuDe}</h2>
          {phu && <p className="mt-0.5 text-[13px] text-ink-500">{phu}</p>}
        </div>
        <button type="button" onClick={dong} aria-label="Đóng" className="rounded p-1 text-ink-500 hover:bg-surface hover:text-ink-900">✕</button>
      </header>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p className="mb-4 grid grid-cols-2 gap-3 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
          <span>Tiếng Việt</span>
          <span>Tiếng Anh — trống thì web hiện tiếng Việt</span>
        </p>
        {children}
      </div>
      <footer className="border-t border-hairline px-5 py-3">
        {thongBao && (
          <p className={cx('mb-2 rounded-md px-3 py-2 text-[13px]', thongBao.loai === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>{thongBao.chu}</p>
        )}
        <div className="flex items-center gap-2">
          <button type="button" onClick={luu} disabled={dangLuu || !daSua} className="btn-primary min-h-[40px] px-5">
            {dangLuu ? 'Đang lưu…' : 'Lưu — lên web ngay'}
          </button>
          {hoanTac && (
            <button type="button" onClick={hoanTac} disabled={dangLuu || !soBanTruoc} className="btn-secondary min-h-[40px] px-4">
              ↶ Hoàn tác{soBanTruoc ? ` (${soBanTruoc})` : ''}
            </button>
          )}
          <span className="ml-auto">{them}</span>
        </div>
      </footer>
    </aside>
  )
}
