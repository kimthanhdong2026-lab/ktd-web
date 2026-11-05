import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BangSuaBaiViet, type BaiDangSua } from '@/components/admin/BangSuaBaiViet'
import { NHOM_BAI } from '@/lib/admin/nhom-bai-viet'
import { KhungSua } from '@/components/admin/KhungSua'
import { XemTruoc } from '@/components/admin/XemTruoc'
import { LangProvider } from '@/components/LangProvider'
import { TrangBaiViet } from '@/components/news/TrangBaiViet'
import { StoreProvider } from '@/components/StoreProvider'
import { getFeaturedProducts } from '@/lib/db'
import { ghiDeCho, tuDien } from '@/lib/noi-dung'
import { supabaseServer } from '@/lib/supabase/server'
import { layBai, type MaChuyenMuc } from '@/lib/tin-tuc'
import { soBanTruoc } from '../../actions'

export const metadata = { title: 'Sửa bài viết' }

export default async function AdminSuaBaiViet({ params, searchParams }: { params: { slug: string }; searchParams: { khoi?: string } }) {
  const lang = 'vi' as const
  const sb = supabaseServer()
  const { data: dong } = await sb.from('bai_viet').select('*').eq('slug', params.slug).maybeSingle()
  if (!dong) notFound()
  const nhom = searchParams.khoi && NHOM_BAI.some((n) => n.id === searchParams.khoi) ? searchParams.khoi : undefined
  const [bai, t, ghiDe, related] = await Promise.all([layBai(params.slug, lang, { moi: true }), tuDien(lang, true), ghiDeCho(lang, true), getFeaturedProducts(3, lang)])
  if (!bai) notFound()

  const s = (k: string) => (typeof dong[k] === 'string' ? (dong[k] as string) : '')
  const m = (k: string) => (Array.isArray(dong[k]) ? (dong[k] as string[]) : [])
  const bd: BaiDangSua = {
    slug: dong.slug, cat: (s('cat') || 'tin-tuc') as MaChuyenMuc, ngay: s('ngay').slice(0, 10),
    title_vi: s('title_vi'), title_en: s('title_en'), excerpt_vi: s('excerpt_vi'), excerpt_en: s('excerpt_en'),
    body_vi: m('body_vi'), body_en: m('body_en'), image: s('image'), visible: Boolean(dong.visible),
  }
  const khoi = (id: string) => {
    const n = NHOM_BAI.find((x) => x.id === id)!
    return { khoa: n.id, so: n.so, ten: n.ten }
  }

  return (
    <LangProvider lang={lang} ghiDe={ghiDe}>
      <StoreProvider>
        <div className={nhom ? 'px-4 py-4 lg:mr-[600px]' : 'mx-auto max-w-[1600px] px-4 py-4'}>
          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-600">
            <Link href="/admin/tin-tuc" className="font-semibold text-ktd-600 hover:underline">← Tin tức</Link>
            <span className="font-display text-[18px] font-bold text-ktd-600">{bd.title_vi}</span>
            {!bd.visible && <span className="rounded bg-amber-100 px-2 py-0.5 text-[12px] font-semibold text-amber-800">Đang ẩn</span>}
            <a href={`/tin-tuc/${bd.slug}`} target="_blank" rel="noopener" className="ml-auto font-semibold text-ktd-600 hover:underline">Xem trên web ↗</a>
          </div>
          <XemTruoc thuNho={Boolean(nhom)}>
            <div className="overflow-hidden rounded-xl border border-hairline bg-white shadow-sm">
              <TrangBaiViet
                bai={bai}
                related={related}
                lang={lang}
                t={t}
                khung={(k, node) => (
                  <KhungSua key={k} {...khoi(k)} dangSua={nhom} nhanNgoai>
                    {node}
                  </KhungSua>
                )}
              />
            </div>
          </XemTruoc>
        </div>
        {nhom && <BangSuaBaiViet key={bd.slug} bai={bd} nhom={nhom} soBanTruoc={await soBanTruoc(`bai.${bd.slug}`)} />}
      </StoreProvider>
    </LangProvider>
  )
}
