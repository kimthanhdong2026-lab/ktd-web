'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { hoanTacDanhMuc, luuMotDanhMuc, xoaDanhMuc, type DuLieuMotDanhMuc } from '@/app/admin/actions'
import { Chu, ChuVE, KhungBang } from '@/components/admin/OChung'
import { TaiAnh } from '@/components/admin/TaiTep'

export interface NhomDangSua extends DuLieuMotDanhMuc {
  slug: string
  soSanPham: number
}

/** Bảng sửa một nhóm. Nhóm chính có thêm câu nhỏ và ảnh (ô ở trang chủ); nhóm nhỏ chọn được nhóm chính chứa nó. */
export function BangSuaDanhMuc({ nhom, chinh, soBanTruoc }: { nhom: NhomDangSua; chinh: { slug: string; name_vi: string }[]; soBanTruoc: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const [n, setN] = useState(nhom)
  const [daSua, setDaSua] = useState(false)
  const [dangLuu, batDau] = useTransition()
  const [thongBao, setThongBao] = useState<{ loai: 'ok' | 'loi'; chu: string } | null>(null)
  const laChinh = !nhom.parent_slug

  const dat = (phan: Partial<NhomDangSua>) => {
    setN((x) => ({ ...x, ...phan }))
    setDaSua(true)
  }
  const luu = () =>
    batDau(async () => {
      const r = await luuMotDanhMuc(n.slug, n)
      setThongBao(r.ok ? { loai: 'ok', chu: r.thongBao ?? 'Đã lưu.' } : { loai: 'loi', chu: r.loi })
      if (r.ok) { setDaSua(false); router.refresh() }
    })
  const hoanTac = () =>
    batDau(async () => {
      const r = await hoanTacDanhMuc(n.slug)
      setThongBao(r.ok ? { loai: 'ok', chu: r.thongBao ?? 'Đã hoàn tác.' } : { loai: 'loi', chu: r.loi })
      if (r.ok) router.refresh()
    })
  const xoa = () => {
    if (!window.confirm(`Xóa nhóm "${n.name_vi}"?`)) return
    batDau(async () => {
      const r = await xoaDanhMuc(n.slug)
      if (r.ok) router.push(pathname)
      else setThongBao({ loai: 'loi', chu: r.loi })
    })
  }

  return (
    <KhungBang
      tieuDe={n.name_vi}
      phu={laChinh ? 'Nhóm chính — một ô ở trang chủ, một mục trong bộ lọc' : 'Nhóm nhỏ — hiện trong bộ lọc và ở trang hãng'}
      dong={() => router.push(pathname, { scroll: false })}
      thongBao={thongBao}
      dangLuu={dangLuu}
      daSua={daSua}
      luu={luu}
      hoanTac={hoanTac}
      soBanTruoc={soBanTruoc}
      them={
        <button type="button" onClick={xoa} disabled={dangLuu || n.soSanPham > 0} title={n.soSanPham ? 'Còn sản phẩm, chưa xóa được' : ''} className="text-[13px] text-ink-500 hover:text-red-700 disabled:opacity-40">
          Xóa nhóm
        </button>
      }
    >
      <div className="flex flex-col gap-4">
        <ChuVE nhan="Tên nhóm" vi={n.name_vi} en={n.name_en} dat={(vi, en) => dat({ name_vi: vi, name_en: en })} />
        {laChinh ? (
          <>
            <ChuVE nhan="Câu nhỏ dưới tên (ô ở trang chủ)" vi={n.sub_vi} en={n.sub_en} dong={2} goiY="Nên dưới 65 ký tự để ô giữ gọn." dat={(vi, en) => dat({ sub_vi: vi, sub_en: en })} />
            <TaiAnh
              nhan="Ảnh ô ở trang chủ (vuông)"
              thuMuc="site/danh-muc"
              khung={{ rong: 640, cao: 640, kieu: 'contain' }}
              giaTri={n.image}
              macDinh={`/assets/categories/${n.slug}.webp`}
              onDoi={(image) => dat({ image })}
            />
          </>
        ) : (
          <Chu nhan="Thuộc nhóm chính">
            <select className="o-nhap" value={n.parent_slug ?? ''} onChange={(e) => dat({ parent_slug: e.target.value || null })}>
              {chinh.map((c) => <option key={c.slug} value={c.slug}>{c.name_vi}</option>)}
            </select>
          </Chu>
        )}
        <p className="text-[12px] text-ink-500">Đường dẫn: /san-pham?category={n.slug} · {n.soSanPham} sản phẩm</p>
      </div>
    </KhungBang>
  )
}
