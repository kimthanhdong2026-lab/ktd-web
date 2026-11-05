'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { hoanTacSanPham, luuSanPham, xoaSanPham, type DuLieuSanPham } from '@/app/admin/actions'
import { Chu, ChuVE, DanhSach, KhungBang, NutDong, TieuDeNhom } from '@/components/admin/OChung'
import { TaiAnh, TaiPdf } from '@/components/admin/TaiTep'
import { NHOM_SAN_PHAM } from '@/lib/admin/nhom-san-pham'
import { urlAnh } from '@/lib/noi-dung/anh'

export interface SanPhamDangSua extends DuLieuSanPham {
  part: string
  slug: string
}


/**
 * Bảng sửa một sản phẩm. Bốn nhóm ô ứng với bốn khung trên màn hình.
 */
export function BangSuaSanPham({
  sp,
  nhom,
  soBanTruoc,
  hangs,
  nhoms,
}: {
  sp: SanPhamDangSua
  nhom: string
  soBanTruoc: number
  hangs: { slug: string; name: string }[]
  nhoms: { slug: string; name_vi: string; parent_slug: string | null }[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [s, setS] = useState<SanPhamDangSua>(sp)
  const [daSua, setDaSua] = useState(false)
  const [dangLuu, batDau] = useTransition()
  const [thongBao, setThongBao] = useState<{ loai: 'ok' | 'loi'; chu: string } | null>(null)

  useEffect(() => {
    document.getElementById(`nhom-${nhom}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [nhom])

  const dat = (phan: Partial<SanPhamDangSua>) => {
    setS((x) => ({ ...x, ...phan }))
    setDaSua(true)
  }
  const luu = () =>
    batDau(async () => {
      const r = await luuSanPham(s.part, s)
      setThongBao(r.ok ? { loai: 'ok', chu: r.thongBao ?? 'Đã lưu.' } : { loai: 'loi', chu: r.loi })
      if (r.ok) { setDaSua(false); router.refresh() }
    })
  const hoanTac = () =>
    batDau(async () => {
      const r = await hoanTacSanPham(s.part)
      setThongBao(r.ok ? { loai: 'ok', chu: r.thongBao ?? 'Đã hoàn tác.' } : { loai: 'loi', chu: r.loi })
      if (r.ok) router.refresh()
    })
  const xoa = () => {
    if (!window.confirm(`Xóa hẳn sản phẩm ${s.part} — ${s.name_vi}?\nKhông hoàn tác được.`)) return
    batDau(async () => {
      const r = await xoaSanPham(s.part)
      if (r.ok) router.push('/admin/san-pham')
      else setThongBao({ loai: 'loi', chu: r.loi })
    })
  }

  // Nhóm nhỏ xếp theo nhóm chính để ô chọn dễ nhìn
  const chinh = nhoms.filter((n) => !n.parent_slug)
  const conCua = (p: string) => nhoms.filter((n) => n.parent_slug === p)

  // Ảnh
  const anhDoi = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= s.images.length) return
    const m = [...s.images]
    ;[m[i], m[j]] = [m[j], m[i]]
    dat({ images: m })
  }
  // Thông số
  const specDoi = (i: number, ngon: 'vi' | 'en', k: 'label' | 'value', v: string) => {
    const vi = s.specs_vi.map((x) => ({ ...x })), en = s.specs_en.map((x) => ({ ...x }))
    while (en.length < vi.length) en.push({ label: '', value: '' })
    ;(ngon === 'vi' ? vi : en)[i][k] = v
    dat({ specs_vi: vi, specs_en: en })
  }
  const specChuyen = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= s.specs_vi.length) return
    const vi = [...s.specs_vi], en = [...s.specs_en]
    while (en.length < vi.length) en.push({ label: '', value: '' })
    ;[vi[i], vi[j]] = [vi[j], vi[i]]
    ;[en[i], en[j]] = [en[j], en[i]]
    dat({ specs_vi: vi, specs_en: en })
  }
  const specXoa = (i: number) => dat({ specs_vi: s.specs_vi.filter((_, j) => j !== i), specs_en: s.specs_en.filter((_, j) => j !== i) })

  return (
    <KhungBang
      tieuDe={`${s.name_vi || '(chưa có tên)'} · ${s.part}`}
      phu={`/san-pham/${s.slug}`}
      dong={() => router.push(pathname, { scroll: false })}
      thongBao={thongBao}
      dangLuu={dangLuu}
      daSua={daSua}
      luu={luu}
      hoanTac={hoanTac}
      soBanTruoc={soBanTruoc}
      them={
        <button type="button" onClick={xoa} disabled={dangLuu} className="text-[13px] text-ink-500 hover:text-red-700">
          Xóa sản phẩm
        </button>
      }
    >
      {/* ---------------------------------------------------------- 1. Ảnh */}
      <TieuDeNhom n={NHOM_SAN_PHAM[0]} dang={nhom} />
      <div className="flex flex-col gap-2">
        {s.images.map((a, i) => (
          <div key={a + i} className="flex items-center gap-3 rounded-lg border border-hairline bg-surface/60 p-2">
            <span className="flex h-14 w-[74px] flex-none items-center justify-center overflow-hidden rounded bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={urlAnh(a)} alt="" className="h-full w-full object-contain" />
            </span>
            <span className="flex-1 text-[12px] text-ink-500">{i === 0 ? 'Ảnh đại diện' : `Ảnh ${i + 1}`}</span>
            <NutDong len={s.images.length} i={i} chuyen={anhDoi} xoa={(j) => dat({ images: s.images.filter((_, k) => k !== j) })} />
          </div>
        ))}
        {s.images.length < 5 && (
          <TaiAnh
            nhan={s.images.length ? 'Thêm ảnh' : 'Chưa có ảnh — thêm ảnh'}
            thuMuc={`products/${s.brand_slug}`}
            khung={{ rong: 1000, cao: 750, kieu: 'contain' }}
            giaTri=""
            onDoi={(d) => dat({ images: [...s.images, d] })}
          />
        )}
      </div>

      {/* ---------------------------------------------------------- 2. Thông tin chính */}
      <TieuDeNhom n={NHOM_SAN_PHAM[1]} dang={nhom} />
      <div className="flex flex-col gap-4">
        <ChuVE nhan="Tên sản phẩm" vi={s.name_vi} en={s.name_en} dat={(vi, en) => dat({ name_vi: vi, name_en: en })} />
        <div className="grid grid-cols-2 gap-3">
          <Chu nhan="Mã hàng (không đổi được)">
            <input className="o-nhap" value={s.part} disabled />
          </Chu>
          <Chu nhan="Dòng sản phẩm (series)">
            <input className="o-nhap" value={s.series} onChange={(e) => dat({ series: e.target.value })} />
          </Chu>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Chu nhan="Hãng">
            <select className="o-nhap" value={s.brand_slug} onChange={(e) => dat({ brand_slug: e.target.value })}>
              {hangs.map((h) => <option key={h.slug} value={h.slug}>{h.name}</option>)}
            </select>
          </Chu>
          <Chu nhan="Nhóm nhỏ">
            <select className="o-nhap" value={s.category_slug} onChange={(e) => dat({ category_slug: e.target.value })}>
              {chinh.map((c) => (
                <optgroup key={c.slug} label={c.name_vi}>
                  {conCua(c.slug).map((n) => <option key={n.slug} value={n.slug}>{n.name_vi}</option>)}
                </optgroup>
              ))}
            </select>
          </Chu>
        </div>
        <ChuVE nhan="Xuất xứ" vi={s.origin_vi} en={s.origin_en} dat={(vi, en) => dat({ origin_vi: vi, origin_en: en })} />
        <ChuVE
          nhan="Câu mô tả ngắn (thẻ sản phẩm và Google)"
          vi={s.desc_vi}
          en={s.desc_en}
          dong={3}
          goiY={`${s.desc_vi.length} ký tự — nên 80–160`}
          dat={(vi, en) => dat({ desc_vi: vi, desc_en: en })}
        />
        <DanhSach nhan="Điểm nổi bật" vi={s.highlights_vi} en={s.highlights_en} dat={(vi, en) => dat({ highlights_vi: vi, highlights_en: en })} />
      </div>

      {/* ---------------------------------------------------------- 3. Các tab */}
      <TieuDeNhom n={NHOM_SAN_PHAM[2]} dang={nhom} />
      <div className="flex flex-col gap-5">
        <DanhSach nhan="Mô tả đầy đủ (mỗi dòng một đoạn)" vi={s.desc_full_vi} en={s.desc_full_en} dong={3} dat={(vi, en) => dat({ desc_full_vi: vi, desc_full_en: en })} />

        <div>
          <span className="mb-1 block text-[13px] font-medium text-ink-700">
            Thông số kỹ thuật <span className="font-normal text-ink-500">({s.specs_vi.length} dòng · mỗi dòng: nhãn và giá trị)</span>
          </span>
          <div className="flex flex-col gap-2">
            {s.specs_vi.map((r, i) => (
              <div key={i} className="rounded-lg border border-hairline bg-surface/60 p-2">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-ink-500">Dòng {i + 1}</span>
                  <NutDong len={s.specs_vi.length} i={i} chuyen={specChuyen} xoa={specXoa} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input className="o-nhap" placeholder="Nhãn" value={r.label} onChange={(e) => specDoi(i, 'vi', 'label', e.target.value)} />
                  <input className="o-nhap" placeholder="Label" value={s.specs_en[i]?.label ?? ''} onChange={(e) => specDoi(i, 'en', 'label', e.target.value)} />
                  <input className="o-nhap" placeholder="Giá trị" value={r.value} onChange={(e) => specDoi(i, 'vi', 'value', e.target.value)} />
                  <input className="o-nhap" placeholder="Value" value={s.specs_en[i]?.value ?? ''} onChange={(e) => specDoi(i, 'en', 'value', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => dat({ specs_vi: [...s.specs_vi, { label: '', value: '' }], specs_en: [...s.specs_en, { label: '', value: '' }] })}
            className="mt-2 text-[13px] font-semibold text-ktd-600 hover:underline"
          >
            + Thêm dòng
          </button>
        </div>

        <DanhSach nhan="Ứng dụng" vi={s.applications_vi} en={s.applications_en} dat={(vi, en) => dat({ applications_vi: vi, applications_en: en })} />
        <TaiPdf nhan="Tài liệu kỹ thuật (PDF)" thuMuc={`catalogs/${s.brand_slug}`} tenFile={s.slug} giaTri={s.doc_pdf} onDoi={(d) => dat({ doc_pdf: d })} />
        <Chu nhan="Trang sản phẩm trên web của hãng">
          <input className="o-nhap" value={s.doc_url} onChange={(e) => dat({ doc_url: e.target.value })} placeholder="https://" />
        </Chu>
      </div>

      {/* ---------------------------------------------------------- 4. Hiển thị */}
      <TieuDeNhom n={NHOM_SAN_PHAM[3]} dang={nhom} />
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-5">
          <label className="inline-flex items-center gap-2 text-[14px]">
            <input type="checkbox" className="h-4 w-4 accent-ktd-600" checked={s.visible} onChange={(e) => dat({ visible: e.target.checked })} />
            Hiện trên web
          </label>
          <label className="inline-flex items-center gap-2 text-[14px]">
            <input type="checkbox" className="h-4 w-4 accent-ktd-600" checked={s.featured} onChange={(e) => dat({ featured: e.target.checked })} />
            Sản phẩm được quan tâm (gợi ý ở Tin tức)
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Chu nhan="Nhãn trên thẻ">
            <select className="o-nhap" value={s.tag} onChange={(e) => dat({ tag: e.target.value })}>
              <option value="">Không</option>
              <option value="Mới">Mới</option>
              <option value="Bán chạy">Bán chạy</option>
            </select>
          </Chu>
          <Chu nhan="Ưu tiên (số nhỏ hiện trước)">
            <input className="o-nhap" value={s.priority} onChange={(e) => dat({ priority: e.target.value })} placeholder="Trống = cuối" />
          </Chu>
        </div>
        <Chu nhan="Từ khóa tìm kiếm (ngăn bằng dấu phẩy)" goiY="Tên dân dã, mã biến thể, cách gọi ngoài xưởng… không cần dấu.">
          <textarea rows={2} className="o-nhap" value={s.keywords.join(', ')} onChange={(e) => dat({ keywords: e.target.value.split(',') })} />
        </Chu>
        <Chu nhan="Trạng thái bản tiếng Anh">
          <select className="o-nhap" value={s.en_status} onChange={(e) => dat({ en_status: e.target.value })}>
            <option value="trống">Trống — web hiện tiếng Việt</option>
            <option value="từ hãng">Từ hãng</option>
            <option value="máy dịch">Máy dịch, chờ rà</option>
            <option value="đã duyệt">Đã duyệt</option>
          </select>
        </Chu>
      </div>
    </KhungBang>
  )
}
