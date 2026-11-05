import { existsSync } from 'node:fs'
import { join } from 'node:path'
import type { ReactNode } from 'react'
import { BrandShowcase } from '@/components/home/BrandShowcase'
import { CategoryTiles } from '@/components/home/CategoryTiles'
import { Hero } from '@/components/home/Hero'
import { NewsBlock } from '@/components/home/NewsBlock'
import { SectorMarquee } from '@/components/home/SectorMarquee'
import { WhyChoose } from '@/components/home/WhyChoose'
import { getBrands } from '@/lib/db'
import type { Locale } from '@/lib/i18n'
import { duongAnh, layChung, layChungO, tuDien } from '@/lib/noi-dung'
import { layBaiViet } from '@/lib/tin-tuc'

/**
 * Bọc một khối: trang chủ thật để nguyên, màn hình quản trị bọc thêm khung
 * "Sửa". Nhận mã khối (trùng với `khoa` trong lib/noi-dung/khoi.ts).
 */
export type Khung = (khoa: string, node: ReactNode) => ReactNode

/**
 * Toàn bộ các khối của trang chủ, theo đúng thứ tự trên web.
 *
 * Dùng ở hai nơi: trang chủ thật và màn hình quản trị /admin/trang-chu — cùng
 * một mã nên hai bên luôn giống nhau từng khối. `moi` = đọc thẳng cơ sở dữ
 * liệu, không qua bộ đệm (màn hình quản trị phải thấy ngay thứ vừa lưu).
 */
export async function TrangChu({
  lang,
  moi = false,
  khung = (_, node) => node,
}: {
  lang: Locale
  moi?: boolean
  khung?: Khung
}) {
  const [t, brands, soNam, soKhach, chungLinhVuc, news] = await Promise.all([
    tuDien(lang, moi),
    getBrands(lang),
    layChungO('trang-chu.dau-trang', 'soNam', moi),
    layChungO('trang-chu.dau-trang', 'soKhach', moi),
    layChung('trang-chu.linh-vuc', moi),
    layBaiViet(lang, { moi }),
  ])

  // Ảnh thẻ lĩnh vực: admin tải lên thì dùng ảnh trên kho; không thì ảnh
  // public/sectors/N.webp, kiểm tra lúc dựng — chưa có file thì ô nền kẻ nhạt.
  const anhTaiLen = (chungLinhVuc['sectors.cards'] as Array<Record<string, unknown>> | undefined) ?? []
  const anhLinhVuc = (i: number): string | null => {
    const a = anhTaiLen[i]?.anh
    if (typeof a === 'string' && a && !a.startsWith('/')) return duongAnh(a) ?? null
    const rel = typeof a === 'string' && a.startsWith('/') ? a : `/sectors/${i + 1}.webp`
    return existsSync(join(process.cwd(), 'public', rel)) ? rel : null
  }
  const cards = t.sectors.cards.map((s, i) => ({ name: s.name, desc: s.desc, image: anhLinhVuc(i) }))

  return (
    <>
      {/* ---------- 1. Dải đầu trang ---------- */}
      {khung('trang-chu.dau-trang', <Hero t={t} lang={lang} soHang={brands.length} soNam={soNam} soKhach={soKhach} />)}

      {/* ---------- 2. Thương hiệu ---------- */}
      {khung('trang-chu.thuong-hieu', <BrandShowcase brands={brands} lang={lang} />)}

      {/* ---------- 3. Danh mục ---------- */}
      {khung('trang-chu.danh-muc', <CategoryTiles lang={lang} t={t} />)}

      {/* ---------- 4. Lĩnh vực ---------- */}
      {khung('trang-chu.linh-vuc', <SectorMarquee heading={t.sectors.heading} cards={cards} />)}

      {/* Khối "Sản phẩm được quan tâm" đã bỏ khỏi trang chủ theo quyết định
          của Ban Giám đốc ngày 03/10/2026. Cột `featured` trong cơ sở dữ liệu
          và hàm getFeaturedProducts vẫn giữ — trang Tin tức đang dùng để gợi ý
          sản phẩm liên quan. */}

      {/* ---------- 5. Vì sao chọn KTD ---------- */}
      {khung('trang-chu.vi-sao', <WhyChoose t={t} />)}

      {/* ---------- 6. Tin tức ---------- */}
      {khung('trang-chu.tin-tuc', <NewsBlock t={t} lang={lang} news={news} />)}
    </>
  )
}
