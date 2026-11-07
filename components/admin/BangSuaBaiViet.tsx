'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { hoanTacBaiViet, luuBaiViet, xoaBaiViet, type DuLieuBaiViet } from '@/app/admin/tin-tuc/actions'
import { Chu, ChuVE, DanhSach, KhungBang, TieuDeNhom } from '@/components/admin/OChung'
import { TaiAnh } from '@/components/admin/TaiTep'
import { NHOM_BAI } from '@/lib/admin/nhom-bai-viet'
import { NEWS_CATEGORIES } from '@/lib/ktd-data'
import type { MaChuyenMuc } from '@/lib/tin-tuc'

export interface BaiDangSua extends DuLieuBaiViet {
  slug: string
}


export function BangSuaBaiViet({ bai, nhom, soBanTruoc }: { bai: BaiDangSua; nhom: string; soBanTruoc: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const [b, setB] = useState(bai)
  const [daSua, setDaSua] = useState(false)
  const [dangLuu, batDau] = useTransition()
  const [thongBao, setThongBao] = useState<{ loai: 'ok' | 'loi'; chu: string } | null>(null)

  useEffect(() => {
    document.getElementById(`nhom-${nhom}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [nhom])

  const dat = (phan: Partial<BaiDangSua>) => {
    setB((x) => ({ ...x, ...phan }))
    setDaSua(true)
  }
  const luu = () =>
    batDau(async () => {
      const r = await luuBaiViet(b.slug, b)
      setThongBao(r.ok ? { loai: 'ok', chu: r.thongBao ?? 'Đã lưu.' } : { loai: 'loi', chu: r.loi })
      if (r.ok) { setDaSua(false); router.refresh() }
    })
  const hoanTac = () =>
    batDau(async () => {
      const r = await hoanTacBaiViet(b.slug)
      setThongBao(r.ok ? { loai: 'ok', chu: r.thongBao ?? 'Đã hoàn tác.' } : { loai: 'loi', chu: r.loi })
      if (r.ok) router.refresh()
    })
  const xoa = () => {
    if (!window.confirm(`Xóa bài "${b.title_vi}"?\nKhông hoàn tác được.`)) return
    batDau(async () => {
      const r = await xoaBaiViet(b.slug)
      if (r.ok) router.push('/admin/tin-tuc')
      else setThongBao({ loai: 'loi', chu: r.loi })
    })
  }

  return (
    <KhungBang
      tieuDe={b.title_vi || '(chưa có tiêu đề)'}
      phu={`/tin-tuc/${b.slug}`}
      dong={() => router.push(pathname, { scroll: false })}
      thongBao={thongBao}
      dangLuu={dangLuu}
      daSua={daSua}
      luu={luu}
      hoanTac={hoanTac}
      soBanTruoc={soBanTruoc}
      them={<button type="button" onClick={xoa} disabled={dangLuu} className="text-[13px] text-ink-500 hover:text-red-700">Xóa bài</button>}
    >
      <TieuDeNhom n={NHOM_BAI[0]} dang={nhom} />
      <div className="flex flex-col gap-4">
        <ChuVE nhan="Tiêu đề" vi={b.title_vi} en={b.title_en} dong={2} dat={(vi, en) => dat({ title_vi: vi, title_en: en })} />
        <div className="grid grid-cols-2 gap-3">
          <Chu nhan="Chuyên mục">
            <select className="o-nhap" value={b.cat} onChange={(e) => dat({ cat: e.target.value as MaChuyenMuc })}>
              <option value="kien-thuc">{NEWS_CATEGORIES[0]}</option>
              <option value="tin-tuc">{NEWS_CATEGORIES[1]}</option>
            </select>
          </Chu>
          <Chu nhan="Ngày đăng">
            <input type="date" className="o-nhap" value={b.ngay} onChange={(e) => dat({ ngay: e.target.value })} />
          </Chu>
        </div>
        <TaiAnh nhan="Ảnh bài (16:9)" thuMuc="site/tin-tuc" khung={{ rong: 1600, cao: 900, kieu: 'cover' }} giaTri={b.image} onDoi={(image) => dat({ image })} />
        <label className="inline-flex items-center gap-2 text-[14px]">
          <input type="checkbox" className="h-4 w-4 accent-ktd-600" checked={b.visible} onChange={(e) => dat({ visible: e.target.checked })} />
          Hiện trên web
        </label>
      </div>

      <TieuDeNhom n={NHOM_BAI[1]} dang={nhom} />
      <div className="flex flex-col gap-4">
        <ChuVE nhan="Tóm tắt (hiện ở thẻ và đầu bài)" vi={b.excerpt_vi} en={b.excerpt_en} dong={3} dat={(vi, en) => dat({ excerpt_vi: vi, excerpt_en: en })} />
        <DanhSach nhan="Thân bài (mỗi dòng một đoạn)" vi={b.body_vi} en={b.body_en} dong={5} dat={(vi, en) => dat({ body_vi: vi, body_en: en })}
          goiY={'Đầu dòng gõ "## " = tiêu đề mục, "### " = tiêu đề nhỏ, "- " = gạch đầu dòng, "| ô | ô |" = một hàng bảng, ![](link ảnh) = ảnh. **chữ** = in đậm.'} />
      </div>
    </KhungBang>
  )
}
