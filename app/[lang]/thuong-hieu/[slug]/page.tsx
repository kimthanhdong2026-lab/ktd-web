import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TrangHang } from '@/components/brands/TrangHang'
import { browseProducts, getBrandCategories, getBrandPage, getBrandPages } from '@/lib/db'
import { DEFAULT_LOCALE, LOCALES, dict, href, isLocale, type Locale } from '@/lib/i18n'
import { tuDien } from '@/lib/noi-dung'

interface PageProps {
  params: { slug: string; lang: string }
  searchParams?: { nhom?: string; q?: string }
}

export async function generateStaticParams() {
  const brands = await getBrandPages()
  return LOCALES.flatMap((lang) => brands.map((b) => ({ lang, slug: b.slug })))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  const b = await getBrandPage(params.slug, lang)
  if (!b) return {}
  return {
    title: `${b.name} — ${dict(lang).brandPage.from(b.origin)}`,
    // Câu ngắn team viết cho hãng làm mô tả trên Google (A2 vòng 2, thay TH09).
    description: (b.desc || b.intro).slice(0, 160),
    alternates: {
      canonical: href(`/thuong-hieu/${params.slug}`, lang),
      languages: {
        'vi-VN': `/thuong-hieu/${params.slug}`,
        'en-US': `/en/thuong-hieu/${params.slug}`,
      },
    },
  }
}

/**
 * Trang riêng của hãng. Phần vẽ nằm ở components/brands/TrangHang.tsx — cùng
 * một mã với màn hình quản trị /admin/thuong-hieu/<slug>.
 */
export default async function BrandPage({ params, searchParams }: PageProps) {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE
  const b = await getBrandPage(params.slug, lang)
  if (!b) notFound()
  const t = await tuDien(lang)

  // Chỉ những nhóm hãng này thực sự có hàng — yêu cầu của Mr Nam. Quan hệ
  // hãng ↔ nhóm không ai khai báo, nó rơi ra từ việc gắn sản phẩm.
  const nhoms = await getBrandCategories(b.slug, lang)
  const dangChon =
    searchParams?.nhom && nhoms.some((n) => n.slug === searchParams.nhom) ? searchParams.nhom : undefined

  // Từ khoá khách gõ ở ô tìm trong trang hãng — mục TH08 của "Sửa web 5".
  const tuKhoa = (searchParams?.q ?? '').trim().slice(0, 100)

  // Chưa chọn nhóm nào thì hiện toàn bộ sản phẩm của hãng.
  const kq = await browseProducts({ q: tuKhoa, brands: [b.slug], categories: dangChon ? [dangChon] : [], limit: 200, lang })

  return <TrangHang b={b} lang={lang} t={t} sanPham={{ nhoms, dangChon, tuKhoa, items: kq.items, total: kq.total }} />
}
