'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { hoanTacHang, luuHang, type DuLieuHang } from '@/app/admin/actions'
import { Chu, ChuVE, DanhSach, KhungBang, TieuDeNhom } from '@/components/admin/OChung'
import { TaiAnh, TaiLogo } from '@/components/admin/TaiTep'

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

  const dat = (phan: Partial<HangDangSua>) => {
    setH((x) => ({ ...x, ...phan }))
    setDaSua(true)
  }
  const luu = () =>
    batDau(async () => {
      const r = await luuHang(h.slug, h)
      setThongBao(r.ok ? { loai: 'ok', chu: r.thongBao ?? 'Đã lưu.' } : { loai: 'loi', chu: r.loi })
      if (r.ok) { setDaSua(false); router.refresh() }
    })
  const hoanTac = () =>
    batDau(async () => {
      const r = await hoanTacHang(h.slug)
      setThongBao(r.ok ? { loai: 'ok', chu: r.thongBao ?? 'Đã hoàn tác.' } : { loai: 'loi', chu: r.loi })
      if (r.ok) router.refresh()
    })

  return (
    <KhungBang
      tieuDe={h.name}
      phu={`Trang hãng · /thuong-hieu/${h.slug}`}
      dong={() => router.push(pathname, { scroll: false })}
      thongBao={thongBao}
      dangLuu={dangLuu}
      daSua={daSua}
      luu={luu}
      hoanTac={hoanTac}
      soBanTruoc={soBanTruoc}
    >
      <TieuDeNhom n={NHOM[0]} dang={nhom} />
      <div className="flex flex-col gap-4">
        <Chu nhan="Tên hãng (hiện ở menu, thẻ, bộ lọc)">
          <input className="o-nhap" value={h.name} onChange={(e) => dat({ name: e.target.value })} />
        </Chu>
        <ChuVE nhan="Xuất xứ" vi={h.origin_vi} en={h.origin_en} dat={(vi, en) => dat({ origin_vi: vi, origin_en: en })} />
        <Chu nhan="Trang web của hãng">
          <input className="o-nhap" value={h.website} onChange={(e) => dat({ website: e.target.value })} placeholder="https://" />
        </Chu>
        <TaiLogo slug={h.slug} logo={h.logo} logoGoc={h.logo_goc} onDoi={(logo, goc) => dat({ logo, logo_goc: goc })} />
        <TaiAnh
          nhan="Banner (4:3, hiện bên phải phần đầu và trên thẻ)"
          thuMuc={`brands/banner-${h.slug}`}
          khung={{ rong: 1200, cao: 900, kieu: 'cover' }}
          giaTri={h.banner}
          onDoi={(banner) => dat({ banner })}
        />
        <ChuVE nhan="Đoạn giới thiệu" vi={h.intro_vi} en={h.intro_en} dong={6} dat={(vi, en) => dat({ intro_vi: vi, intro_en: en })} />
      </div>

      <TieuDeNhom n={NHOM[1]} dang={nhom} />
      <div className="flex flex-col gap-5">
        <DanhSach nhan="Dòng sản phẩm KTD cung cấp" vi={h.dong_sp_vi} en={h.dong_sp_en} dat={(vi, en) => dat({ dong_sp_vi: vi, dong_sp_en: en })} />
        <DanhSach nhan="Điểm nổi bật" vi={h.noi_bat_vi} en={h.noi_bat_en} dat={(vi, en) => dat({ noi_bat_vi: vi, noi_bat_en: en })} />
        <DanhSach nhan="Ứng dụng tiêu biểu" vi={h.ung_dung_vi} en={h.ung_dung_en} dat={(vi, en) => dat({ ung_dung_vi: vi, ung_dung_en: en })} />
      </div>

      <TieuDeNhom n={NHOM[2]} dang={nhom} />
      <ChuVE
        nhan="Câu ngắn trên thẻ (tối đa khoảng 160 ký tự)"
        vi={h.desc_vi}
        en={h.desc_en}
        dong={4}
        goiY={`${h.desc_vi.length} ký tự`}
        dat={(vi, en) => dat({ desc_vi: vi, desc_en: en })}
      />
    </KhungBang>
  )
}
