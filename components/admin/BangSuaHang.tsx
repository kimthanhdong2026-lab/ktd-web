'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { hoanTacHang, luuHang, taiAnh, taiLogoHang, type DuLieuHang } from '@/app/admin/actions'
import { urlAnh } from '@/lib/noi-dung/anh'
import { cx } from '@/lib/utils'

export interface HangDangSua extends DuLieuHang {
  slug: string
  logo: string
  logo_goc: string
  banner: string
}

const NHOM = [
  { id: 'hang.dau', so: 1, ten: 'Phần đầu trang hãng', moTa: 'Logo, banner, xuất xứ, đoạn giới thiệu.' },
  { id: 'hang.khoi', so: 2, ten: 'Ba khối nội dung', moTa: 'Dòng sản phẩm · Điểm nổi bật · Ứng dụng tiêu biểu.' },
  { id: 'hang.the', so: 3, ten: 'Thẻ ở trang Thương hiệu', moTa: 'Câu ngắn trên thẻ, cũng là mô tả trên Google.' },
]

/**
 * Bảng sửa một hãng. Ba nhóm ô ứng với ba khung trên màn hình; bấm khung nào
 * thì bảng cuộn tới nhóm đó. Lưu là lên web ngay; Hoàn tác quay về bản trước.
 */
export function BangSuaHang({ hang, nhom, soBanTruoc }: { hang: HangDangSua; nhom: string; soBanTruoc: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const [h, setH] = useState<HangDangSua>(hang)
  const [daSua, setDaSua] = useState(false)
  const [dangLuu, batDau] = useTransition()
  const [thongBao, setThongBao] = useState<{ loai: 'ok' | 'loi'; chu: string } | null>(null)

  useEffect(() => {
    document.getElementById(`nhom-${nhom}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [nhom])

  const dat = <K extends keyof HangDangSua>(k: K, v: HangDangSua[K]) => {
    setH((x) => ({ ...x, [k]: v }))
    setDaSua(true)
  }
  const dong = () => router.push(pathname, { scroll: false })
  const luu = () =>
    batDau(async () => {
      const r = await luuHang(h.slug, h)
      setThongBao(r.ok ? { loai: 'ok', chu: r.thongBao ?? 'Đã lưu.' } : { loai: 'loi', chu: r.loi })
      if (r.ok) {
        setDaSua(false)
        router.refresh()
      }
    })
  const quayVe = () =>
    batDau(async () => {
      const r = await hoanTacHang(h.slug)
      setThongBao(r.ok ? { loai: 'ok', chu: r.thongBao ?? 'Đã hoàn tác.' } : { loai: 'loi', chu: r.loi })
      if (r.ok) router.refresh()
    })

  return (
    <aside className="fixed bottom-0 right-0 top-12 z-50 flex w-full max-w-[600px] flex-col border-l border-hairline bg-white shadow-2xl">
      <header className="flex items-start gap-3 border-b border-hairline px-5 py-4">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[17px] font-bold leading-tight text-ink-900">{h.name}</h2>
          <p className="mt-0.5 text-[13px] text-ink-500">Trang hãng · /thuong-hieu/{h.slug}</p>
        </div>
        <button type="button" onClick={dong} aria-label="Đóng" className="rounded p-1 text-ink-500 hover:bg-surface hover:text-ink-900">✕</button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p className="mb-4 grid grid-cols-2 gap-3 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
          <span>Tiếng Việt</span>
          <span>Tiếng Anh — trống thì web hiện tiếng Việt</span>
        </p>

        <TieuDeNhom n={NHOM[0]} dang={nhom} />
        <div className="flex flex-col gap-4">
          <Chu nhan="Tên hãng (hiện ở menu, thẻ, bộ lọc)">
            <input className="o-nhap" value={h.name} onChange={(e) => dat('name', e.target.value)} />
          </Chu>
          <Chu nhan="Xuất xứ">
            <div className="grid grid-cols-2 gap-3">
              <input className="o-nhap" value={h.origin_vi} onChange={(e) => dat('origin_vi', e.target.value)} />
              <input className="o-nhap" value={h.origin_en} onChange={(e) => dat('origin_en', e.target.value)} placeholder="English" />
            </div>
          </Chu>
          <Chu nhan="Trang web của hãng">
            <input className="o-nhap" value={h.website} onChange={(e) => dat('website', e.target.value)} placeholder="https://" />
          </Chu>
          <Logo slug={h.slug} logoGoc={h.logo_goc} logo={h.logo} dat={(l, g) => { dat('logo', l); dat('logo_goc', g) }} />
          <Banner slug={h.slug} banner={h.banner} dat={(b) => dat('banner', b)} />
          <Chu nhan="Đoạn giới thiệu">
            <div className="grid grid-cols-2 gap-3">
              <textarea rows={6} className="o-nhap" value={h.intro_vi} onChange={(e) => dat('intro_vi', e.target.value)} />
              <textarea rows={6} className="o-nhap" value={h.intro_en} onChange={(e) => dat('intro_en', e.target.value)} placeholder="English" />
            </div>
          </Chu>
        </div>

        <TieuDeNhom n={NHOM[1]} dang={nhom} />
        <div className="flex flex-col gap-5">
          <DanhSach nhan="Dòng sản phẩm KTD cung cấp" vi={h.dong_sp_vi} en={h.dong_sp_en} dat={(vi, en) => { dat('dong_sp_vi', vi); dat('dong_sp_en', en) }} />
          <DanhSach nhan="Điểm nổi bật" vi={h.noi_bat_vi} en={h.noi_bat_en} dat={(vi, en) => { dat('noi_bat_vi', vi); dat('noi_bat_en', en) }} />
          <DanhSach nhan="Ứng dụng tiêu biểu" vi={h.ung_dung_vi} en={h.ung_dung_en} dat={(vi, en) => { dat('ung_dung_vi', vi); dat('ung_dung_en', en) }} />
        </div>

        <TieuDeNhom n={NHOM[2]} dang={nhom} />
        <Chu nhan="Câu ngắn trên thẻ (tối đa khoảng 160 ký tự)">
          <div className="grid grid-cols-2 gap-3">
            <textarea rows={4} className="o-nhap" value={h.desc_vi} onChange={(e) => dat('desc_vi', e.target.value)} />
            <textarea rows={4} className="o-nhap" value={h.desc_en} onChange={(e) => dat('desc_en', e.target.value)} placeholder="English" />
          </div>
          <span className="mt-1 block text-[12px] text-ink-500">{h.desc_vi.length} ký tự</span>
        </Chu>
      </div>

      <footer className="border-t border-hairline px-5 py-3">
        {thongBao && (
          <p className={cx('mb-2 rounded-md px-3 py-2 text-[13px]', thongBao.loai === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>{thongBao.chu}</p>
        )}
        <div className="flex items-center gap-2">
          <button type="button" onClick={luu} disabled={dangLuu || !daSua} className="btn-primary min-h-[40px] px-5">
            {dangLuu ? 'Đang lưu…' : 'Lưu — lên web ngay'}
          </button>
          <button type="button" onClick={quayVe} disabled={dangLuu || soBanTruoc === 0} className="btn-secondary min-h-[40px] px-4">
            ↶ Hoàn tác{soBanTruoc ? ` (${soBanTruoc})` : ''}
          </button>
        </div>
      </footer>
    </aside>
  )
}

function TieuDeNhom({ n, dang }: { n: (typeof NHOM)[number]; dang: string }) {
  return (
    <div id={`nhom-${n.id}`} className={cx('mb-3 mt-6 flex items-start gap-2.5 border-t border-hairline pt-4 first:mt-0 first:border-0 first:pt-0', dang === n.id && 'rounded-md bg-ktd-50 p-3')}>
      <span className="flex h-6 min-w-6 items-center justify-center rounded bg-ktd-600 px-1.5 text-[12px] font-bold text-white">{n.so}</span>
      <div>
        <p className="font-display text-[15px] font-bold text-ink-900">{n.ten}</p>
        <p className="text-[12px] text-ink-500">{n.moTa}</p>
      </div>
    </div>
  )
}

function Chu({ nhan, children }: { nhan: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-medium text-ink-700">{nhan}</span>
      {children}
    </label>
  )
}

function DanhSach({ nhan, vi, en, dat }: { nhan: string; vi: string[]; en: string[]; dat: (vi: string[], en: string[]) => void }) {
  const n = Math.max(vi.length, en.length)
  const doi = (i: number, ngon: 'vi' | 'en', chu: string) => {
    const v = [...vi], e = [...en]
    ;(ngon === 'vi' ? v : e)[i] = chu
    dat(v, e)
  }
  const nut = 'rounded border border-hairline px-1.5 py-0.5 text-[12px] text-ink-600 hover:bg-surface disabled:opacity-30'
  return (
    <div>
      <span className="mb-1 block text-[13px] font-medium text-ink-700">{nhan}</span>
      <div className="flex flex-col gap-2">
        {Array.from({ length: n }, (_, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
            <input className="o-nhap" value={vi[i] ?? ''} onChange={(e) => doi(i, 'vi', e.target.value)} />
            <input className="o-nhap" value={en[i] ?? ''} onChange={(e) => doi(i, 'en', e.target.value)} placeholder="English" />
            <span className="flex gap-1">
              <button type="button" className={nut} disabled={i === 0} onClick={() => { const v = [...vi], e = [...en]; [v[i - 1], v[i]] = [v[i], v[i - 1]]; [e[i - 1], e[i]] = [e[i], e[i - 1]]; dat(v, e) }}>↑</button>
              <button type="button" className={nut} disabled={i === n - 1} onClick={() => { const v = [...vi], e = [...en]; [v[i + 1], v[i]] = [v[i], v[i + 1]]; [e[i + 1], e[i]] = [e[i], e[i + 1]]; dat(v, e) }}>↓</button>
              <button type="button" className={nut} onClick={() => dat(vi.filter((_, j) => j !== i), en.filter((_, j) => j !== i))}>✕</button>
            </span>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => dat([...vi, ''], [...en, ''])} className="mt-2 text-[13px] font-semibold text-ktd-600 hover:underline">+ Thêm dòng</button>
    </div>
  )
}

function Logo({ slug, logo, logoGoc, dat }: { slug: string; logo: string; logoGoc: string; dat: (logo: string, goc: string) => void }) {
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const chon = async (f?: File) => {
    if (!f) return
    setDangTai(true); setLoi(null)
    const fd = new FormData()
    fd.set('tep', f); fd.set('slug', slug)
    const r = await taiLogoHang(fd)
    setDangTai(false)
    if (r.ok) dat(r.logo, r.logo_goc)
    else setLoi(r.loi)
  }
  return (
    <div>
      <span className="mb-1 block text-[13px] font-medium text-ink-700">Logo</span>
      <div className="flex items-center gap-3">
        <span className="flex h-16 w-32 flex-none items-center justify-center overflow-hidden rounded-md border border-hairline bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={urlAnh(logoGoc) ?? `/assets/brands/${slug}.webp`} alt="" className="max-h-12 w-auto max-w-[120px] object-contain" />
        </span>
        <span className="flex h-16 w-20 flex-none items-center justify-center overflow-hidden rounded-md border border-hairline bg-white" title="Bản cho dải logo trang chủ (320×128)">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {logo && <img src={urlAnh(logo)} alt="" className="h-full w-full object-contain" />}
        </span>
        <label className="btn-secondary min-h-[36px] cursor-pointer px-3 text-[13px]">
          {dangTai ? 'Đang tải…' : 'Chọn logo…'}
          <input type="file" accept="image/*" className="sr-only" disabled={dangTai} onChange={(e) => chon(e.target.files?.[0])} />
        </label>
      </div>
      <span className="mt-1 block text-[12px] text-ink-500">Một ảnh cho ra hai bản: tỉ lệ gốc cho trang hãng, và bản đóng khung cho dải logo trang chủ.</span>
      {loi && <p className="mt-1 text-[12px] text-red-700">{loi}</p>}
    </div>
  )
}

function Banner({ slug, banner, dat }: { slug: string; banner: string; dat: (b: string) => void }) {
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  const chon = async (f?: File) => {
    if (!f) return
    setDangTai(true); setLoi(null)
    const fd = new FormData()
    fd.set('tep', f); fd.set('thuMuc', `brands/banner-${slug}`)
    fd.set('khung', JSON.stringify({ rong: 1200, cao: 900, kieu: 'cover' }))
    const r = await taiAnh(fd)
    setDangTai(false)
    if (r.ok) dat(r.duong)
    else setLoi(r.loi)
  }
  return (
    <div>
      <span className="mb-1 block text-[13px] font-medium text-ink-700">Banner (4:3, hiện bên phải phần đầu và trên thẻ)</span>
      <div className="flex items-center gap-3">
        <span className="placeholder-hatch flex h-[72px] w-24 flex-none items-center justify-center overflow-hidden rounded-md border border-hairline bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {banner ? <img src={urlAnh(banner)} alt="" className="h-full w-full object-cover" /> : <span className="text-[11px] text-ink-500">Chưa có</span>}
        </span>
        <label className="btn-secondary min-h-[36px] cursor-pointer px-3 text-[13px]">
          {dangTai ? 'Đang tải…' : 'Chọn ảnh…'}
          <input type="file" accept="image/*" className="sr-only" disabled={dangTai} onChange={(e) => chon(e.target.files?.[0])} />
        </label>
        <span className="text-[12px] text-ink-500">Tự thu về 1200×900</span>
      </div>
      {loi && <p className="mt-1 text-[12px] text-red-700">{loi}</p>}
    </div>
  )
}
