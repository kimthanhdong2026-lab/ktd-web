'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { hoanTac, luuDanhMuc, luuKhoi, taiAnh, type DongDanhMuc } from '@/app/admin/actions'
import type { GiaTriKhoi, GiaTriO, Muc, OChu, ODanhSach } from '@/lib/noi-dung'
import { urlAnh } from '@/lib/noi-dung/anh'
import { timKhoi, type Truong } from '@/lib/noi-dung/khoi'
import { cx } from '@/lib/utils'

/**
 * Bảng sửa một khối, nằm bên phải màn hình quản trị.
 *
 * Mỗi ô chữ có hai cột VI | EN (quyết định 05/11: admin tự dịch rồi dán vào;
 * EN trống thì web hiện tiếng Việt). Bấm Lưu là lên web ngay; Hoàn tác quay
 * về bản trước.
 *
 * Bảng khối (ô nào, kiểu gì) nhập thẳng từ lib/noi-dung/khoi.ts; giá trị
 * hiện tại do trang máy chủ đưa xuống.
 */
export function BangSua({
  khoa,
  giaTri,
  luuLuc,
  soBanTruoc,
  danhMuc,
}: {
  khoa: string
  giaTri: GiaTriKhoi
  luuLuc?: string
  soBanTruoc: number
  /** Chỉ khối Danh mục: các ô danh mục chính để sửa tên, câu nhỏ, ảnh. */
  danhMuc?: DongDanhMuc[]
}) {
  const khoi = timKhoi(khoa)
  const router = useRouter()
  const pathname = usePathname()
  const [gt, setGt] = useState<GiaTriKhoi>(giaTri)
  const [dm, setDm] = useState<DongDanhMuc[]>(danhMuc ?? [])
  const [thongBao, setThongBao] = useState<{ loai: 'ok' | 'loi'; chu: string } | null>(null)
  const [dangLuu, batDau] = useTransition()
  const [daSua, setDaSua] = useState(false)

  if (!khoi) return null
  const dong = () => router.push(pathname, { scroll: false })
  const dat = (duong: string, v: GiaTriO) => {
    setGt((g) => ({ ...g, [duong]: v }))
    setDaSua(true)
  }

  const luu = () =>
    batDau(async () => {
      const r = await luuKhoi(khoa, gt)
      if (r.ok && danhMuc) {
        const r2 = await luuDanhMuc(dm)
        if (!r2.ok) return setThongBao({ loai: 'loi', chu: r2.loi })
      }
      setThongBao(r.ok ? { loai: 'ok', chu: r.thongBao ?? 'Đã lưu.' } : { loai: 'loi', chu: r.loi })
      if (r.ok) {
        setDaSua(false)
        router.refresh()
      }
    })

  const quayVe = () =>
    batDau(async () => {
      const r = await hoanTac(khoa)
      setThongBao(r.ok ? { loai: 'ok', chu: r.thongBao ?? 'Đã hoàn tác.' } : { loai: 'loi', chu: r.loi })
      if (r.ok) router.refresh()
    })

  return (
    <aside className="fixed bottom-0 right-0 top-12 z-50 flex w-full max-w-[600px] flex-col border-l border-hairline bg-white shadow-2xl">
      <header className="flex items-start gap-3 border-b border-hairline px-5 py-4">
        <span className="flex h-7 min-w-7 items-center justify-center rounded bg-ktd-600 px-1.5 font-display text-[14px] font-bold text-white">
          {khoi.so}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[17px] font-bold leading-tight text-ink-900">{khoi.ten}</h2>
          {khoi.moTa && <p className="mt-0.5 text-[13px] text-ink-500">{khoi.moTa}</p>}
        </div>
        <button type="button" onClick={dong} aria-label="Đóng" className="rounded p-1 text-ink-500 hover:bg-surface hover:text-ink-900">
          ✕
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p className="mb-4 grid grid-cols-[1fr_1fr] gap-3 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
          <span>Tiếng Việt</span>
          <span>Tiếng Anh — trống thì web hiện tiếng Việt</span>
        </p>
        <div className="flex flex-col gap-5">
          {khoi.truong.map((tr) => (
            <O key={tr.duong} tr={tr} khoa={khoa} v={gt[tr.duong]} dat={(v) => dat(tr.duong, v)} />
          ))}
          {danhMuc && (
            <BangDanhMuc dm={dm} setDm={(d) => { setDm(d); setDaSua(true) }} />
          )}
        </div>
      </div>

      <footer className="border-t border-hairline px-5 py-3">
        {thongBao && (
          <p className={cx('mb-2 rounded-md px-3 py-2 text-[13px]', thongBao.loai === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>
            {thongBao.chu}
          </p>
        )}
        <div className="flex items-center gap-2">
          <button type="button" onClick={luu} disabled={dangLuu || !daSua} className="btn-primary min-h-[40px] px-5">
            {dangLuu ? 'Đang lưu…' : 'Lưu — lên web ngay'}
          </button>
          <button type="button" onClick={quayVe} disabled={dangLuu || soBanTruoc === 0} className="btn-secondary min-h-[40px] px-4" title={soBanTruoc ? `Còn ${soBanTruoc} bản trước` : 'Chưa có bản trước'}>
            ↶ Hoàn tác{soBanTruoc ? ` (${soBanTruoc})` : ''}
          </button>
          <span className="ml-auto text-[12px] text-ink-500">{luuLuc ? `Lưu lúc ${gio(luuLuc)}` : 'Chưa sửa lần nào'}</span>
        </div>
      </footer>
    </aside>
  )
}

const gio = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })

// ---------------------------------------------------------------- từng ô

function O({ tr, khoa, v, dat }: { tr: Truong; khoa: string; v: GiaTriO | undefined; dat: (v: GiaTriO) => void }) {
  if (tr.kieu === 'nhom') return <ONhom tr={tr} khoa={khoa} v={(v as Muc[]) ?? []} dat={dat} />
  if (tr.kieu === 'anh') return <OAnh tr={tr} khoa={khoa} v={(v as string) ?? ''} dat={dat} />
  if (tr.chung)
    return (
      <Nhan tr={tr}>
        <input className="o-nhap" value={(v as string) ?? ''} onChange={(e) => dat(e.target.value)} />
      </Nhan>
    )
  if (tr.kieu === 'danh-sach') return <ODanhSachUI tr={tr} v={(v as ODanhSach) ?? { vi: [], en: [] }} dat={dat} />
  const o = (v as OChu) ?? { vi: '', en: '' }
  const Tag = tr.kieu === 'textarea' ? 'textarea' : 'input'
  const them = tr.kieu === 'textarea' ? { rows: 3 } : {}
  return (
    <Nhan tr={tr}>
      <div className="grid grid-cols-2 gap-3">
        <Tag className="o-nhap" value={o.vi} onChange={(e) => dat({ ...o, vi: e.target.value })} {...them} />
        <Tag className="o-nhap" value={o.en} onChange={(e) => dat({ ...o, en: e.target.value })} placeholder="English" {...them} />
      </div>
    </Nhan>
  )
}

function Nhan({ tr, children }: { tr: Truong; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-medium text-ink-700">{tr.nhan}</span>
      {children}
      {tr.goiY && <span className="mt-1 block text-[12px] text-ink-500">{tr.goiY}</span>}
    </label>
  )
}

function ODanhSachUI({ tr, v, dat }: { tr: Truong; v: ODanhSach; dat: (v: GiaTriO) => void }) {
  const n = Math.max(v.vi.length, v.en.length)
  const doi = (i: number, ngon: 'vi' | 'en', chu: string) => {
    const vi = [...v.vi], en = [...v.en]
    ;(ngon === 'vi' ? vi : en)[i] = chu
    dat({ vi, en })
  }
  const xoa = (i: number) => dat({ vi: v.vi.filter((_, j) => j !== i), en: v.en.filter((_, j) => j !== i) })
  const them = () => dat({ vi: [...v.vi, ''], en: [...v.en, ''] })
  const chuyen = (i: number, d: -1 | 1) => {
    const vi = [...v.vi], en = [...v.en]
    const j = i + d
    if (j < 0 || j >= n) return
    ;[vi[i], vi[j]] = [vi[j], vi[i]]
    ;[en[i], en[j]] = [en[j], en[i]]
    dat({ vi, en })
  }
  return (
    <div>
      <span className="mb-1 block text-[13px] font-medium text-ink-700">{tr.nhan}</span>
      <div className="flex flex-col gap-2">
        {Array.from({ length: n }, (_, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
            <input className="o-nhap" value={v.vi[i] ?? ''} onChange={(e) => doi(i, 'vi', e.target.value)} />
            <input className="o-nhap" value={v.en[i] ?? ''} onChange={(e) => doi(i, 'en', e.target.value)} placeholder="English" />
            <NutDong len={n} i={i} toiThieu={tr.toiThieu ?? 0} chuyen={chuyen} xoa={xoa} />
          </div>
        ))}
      </div>
      {(tr.toiDa === undefined || n < tr.toiDa) && (
        <button type="button" onClick={them} className="mt-2 text-[13px] font-semibold text-ktd-600 hover:underline">
          + Thêm dòng
        </button>
      )}
    </div>
  )
}

function NutDong({ len, i, toiThieu, chuyen, xoa }: { len: number; i: number; toiThieu: number; chuyen: (i: number, d: -1 | 1) => void; xoa: (i: number) => void }) {
  const nut = 'rounded border border-hairline px-1.5 py-0.5 text-[12px] text-ink-600 hover:bg-surface disabled:opacity-30'
  return (
    <span className="flex gap-1">
      <button type="button" className={nut} onClick={() => chuyen(i, -1)} disabled={i === 0} title="Lên">↑</button>
      <button type="button" className={nut} onClick={() => chuyen(i, 1)} disabled={i === len - 1} title="Xuống">↓</button>
      <button type="button" className={nut} onClick={() => xoa(i)} disabled={len <= toiThieu} title="Xóa">✕</button>
    </span>
  )
}

function ONhom({ tr, khoa, v, dat }: { tr: Truong; khoa: string; v: Muc[]; dat: (v: GiaTriO) => void }) {
  const con = tr.con ?? []
  const doi = (i: number, duong: string, gia: OChu | string) => {
    const m = v.map((x, j) => (j === i ? { ...x, [duong]: gia } : x))
    dat(m)
  }
  const xoa = (i: number) => dat(v.filter((_, j) => j !== i))
  const chuyen = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= v.length) return
    const m = [...v]
    ;[m[i], m[j]] = [m[j], m[i]]
    dat(m)
  }
  const them = () => {
    const moi: Muc = {}
    for (const c of con) moi[c.duong] = c.chung ? '' : { vi: '', en: '' }
    dat([...v, moi])
  }
  return (
    <div>
      <span className="mb-2 block text-[13px] font-medium text-ink-700">
        {tr.nhan} <span className="font-normal text-ink-500">({v.length})</span>
      </span>
      <div className="flex flex-col gap-3">
        {v.map((m, i) => (
          <div key={i} className="rounded-lg border border-hairline bg-surface/60 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-ink-500">Thẻ {i + 1}</span>
              <NutDong len={v.length} i={i} toiThieu={tr.toiThieu ?? 0} chuyen={chuyen} xoa={xoa} />
            </div>
            <div className="flex flex-col gap-3">
              {con.map((c) =>
                c.kieu === 'anh' ? (
                  <OAnh key={c.duong} tr={c} khoa={khoa} v={(m[c.duong] as string) ?? ''} dat={(x) => doi(i, c.duong, x as string)} />
                ) : (
                  <O key={c.duong} tr={c} khoa={khoa} v={m[c.duong]} dat={(x) => doi(i, c.duong, x as OChu)} />
                )
              )}
            </div>
          </div>
        ))}
      </div>
      {(tr.toiDa === undefined || v.length < tr.toiDa) && (
        <button type="button" onClick={them} className="mt-2 text-[13px] font-semibold text-ktd-600 hover:underline">
          + Thêm thẻ
        </button>
      )}
    </div>
  )
}

/** Ô ảnh: xem trước + chọn tệp. Tải xong mới lưu đường dẫn vào form; khối vẫn phải bấm Lưu. */
export function OAnh({ tr, khoa, v, dat, thuMuc }: { tr: Truong; khoa: string; v: string; dat: (v: GiaTriO) => void; thuMuc?: string }) {
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const chon = async (f: File | undefined) => {
    if (!f) return
    setDangTai(true)
    setLoi(null)
    const fd = new FormData()
    fd.set('tep', f)
    fd.set('thuMuc', thuMuc ?? `site/${khoa.replace(/^.*\./, '')}`)
    if (tr.khungAnh) fd.set('khung', JSON.stringify(tr.khungAnh))
    const r = await taiAnh(fd)
    setDangTai(false)
    if (r.ok) dat(r.duong)
    else setLoi(r.loi)
  }
  const src = urlAnh(v)
  return (
    <div>
      <span className="mb-1 block text-[13px] font-medium text-ink-700">{tr.nhan}</span>
      <div className="flex items-center gap-3">
        <span className="placeholder-hatch flex h-16 w-24 flex-none items-center justify-center overflow-hidden rounded-md border border-hairline bg-white">
          {src ? <img src={src} alt="" className="h-full w-full object-contain" /> : <span className="text-[11px] text-ink-500">Chưa có</span>}
        </span>
        <label className="btn-secondary min-h-[36px] cursor-pointer px-3 text-[13px]">
          {dangTai ? 'Đang tải…' : 'Chọn ảnh…'}
          <input type="file" accept="image/*" className="sr-only" disabled={dangTai} onChange={(e) => chon(e.target.files?.[0])} />
        </label>
        {tr.khungAnh && <span className="text-[12px] text-ink-500">Tự thu về {tr.khungAnh.rong}×{tr.khungAnh.cao}</span>}
      </div>
      {loi && <p className="mt-1 text-[12px] text-red-700">{loi}</p>}
    </div>
  )
}

/** Khối Danh mục: 12 ô danh mục chính, sửa tên, câu nhỏ, ảnh. */
function BangDanhMuc({ dm, setDm }: { dm: DongDanhMuc[]; setDm: (d: DongDanhMuc[]) => void }) {
  const doi = (slug: string, k: keyof DongDanhMuc, v: string) => setDm(dm.map((d) => (d.slug === slug ? { ...d, [k]: v } : d)))
  const trAnh: Truong = { duong: 'image', nhan: 'Ảnh ô (vuông)', kieu: 'anh', chung: true, khungAnh: { rong: 640, cao: 640, kieu: 'contain' } }
  return (
    <div className="border-t border-hairline pt-4">
      <p className="mb-3 text-[13px] font-semibold text-ink-900">Các ô danh mục ({dm.length})</p>
      <div className="flex flex-col gap-3">
        {dm.map((d, i) => (
          <div key={d.slug} className="rounded-lg border border-hairline bg-surface/60 p-3">
            <p className="mb-2 text-[12px] font-semibold text-ink-500">Ô {i + 1} · {d.slug}</p>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-3">
                <input className="o-nhap" value={d.name_vi} onChange={(e) => doi(d.slug, 'name_vi', e.target.value)} />
                <input className="o-nhap" value={d.name_en} onChange={(e) => doi(d.slug, 'name_en', e.target.value)} placeholder="English" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <textarea rows={2} className="o-nhap" value={d.sub_vi} onChange={(e) => doi(d.slug, 'sub_vi', e.target.value)} />
                <textarea rows={2} className="o-nhap" value={d.sub_en} onChange={(e) => doi(d.slug, 'sub_en', e.target.value)} placeholder="English" />
              </div>
              <OAnh tr={trAnh} khoa="trang-chu.danh-muc" v={d.image || `/assets/categories/${d.slug}.webp`} dat={(v) => doi(d.slug, 'image', v as string)} thuMuc="site/danh-muc" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
