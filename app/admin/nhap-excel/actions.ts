'use server'

/**
 * Nhập sản phẩm từ file Excel mẫu, ngay trong trang quản trị.
 *
 * Trình duyệt gửi file trong mỗi lần gọi (kho ktd chỉ nhận ảnh và PDF, mà file
 * Excel cũng chỉ vài MB): cacSheetExcel (xem có sheet nào) → kiemExcel (chạy
 * thử, báo lỗi từng dòng) → napExcel (ghi). Không giữ trạng thái trên máy chủ.
 */
import { revalidatePath, revalidateTag } from 'next/cache'
import { cacSheet, hangCuaSheet, kiemSheet, type KetQuaKiem, type NguCanh } from '@/lib/admin/doc-excel'
import { THE_DU_LIEU } from '@/lib/db'
import { nguoiDung, supabaseServer } from '@/lib/supabase/server'

/** Vercel chặn thân yêu cầu quá 4,5 MB. */
const TOI_DA = 4 * 1024 * 1024
const loiCua = (e: unknown) => (e instanceof Error ? e.message : String(e))

async function batBuocDangNhap() {
  const u = await nguoiDung()
  if (!u) throw new Error('Chưa đăng nhập')
}

async function docFile(fd: FormData): Promise<ArrayBuffer> {
  const tep = fd.get('tep')
  if (!(tep instanceof File) || !tep.size) throw new Error('Chưa chọn file.')
  if (tep.size > TOI_DA) throw new Error('File quá 4 MB. Lưu lại dạng .xlsx không kèm ảnh/macro rồi thử lại.')
  return tep.arrayBuffer()
}

const docSheets = (fd: FormData): string[] => {
  try {
    const v = JSON.parse(String(fd.get('sheets') ?? '[]'))
    return Array.isArray(v) ? v.map(String) : []
  } catch {
    return []
  }
}

async function nguCanh(): Promise<NguCanh> {
  const sb = supabaseServer()
  const [{ data: cats }, { data: sps }, { data: hangs }] = await Promise.all([
    sb.from('categories').select('slug,name_vi,parent_slug'),
    sb.from('products').select('part,slug,brand_slug'),
    sb.from('brands').select('slug,name'),
  ])
  const nhomNho = new Map<string, string>()
  for (const c of cats ?? []) if (c.parent_slug) nhomNho.set(c.name_vi.trim().toLowerCase(), c.slug)
  const web = new Map<string, { slug: string; brand_slug: string }>()
  for (const p of sps ?? []) web.set(p.part, { slug: p.slug, brand_slug: p.brand_slug })
  const hang = new Map<string, string>()
  for (const h of hangs ?? []) {
    hang.set(h.slug.toLowerCase(), h.slug)
    hang.set(h.name.trim().toLowerCase(), h.slug)
    // "ATA Air Tools" -> "ata"
    hang.set(h.name.trim().toLowerCase().split(/\s+/)[0], h.slug)
  }
  // Sheet "Rocklinizer" là hãng Rocklin
  if (hang.has('rocklin')) hang.set('rocklinizer', hang.get('rocklin')!)
  return { nhomNho, web, hang }
}

export interface SheetTomTat {
  ten: string
  soDong: number
  hang: string | null
}

export async function cacSheetExcel(fd: FormData): Promise<{ ok: true; sheets: SheetTomTat[] } | { ok: false; loi: string }> {
  try {
    await batBuocDangNhap()
    const [buf, ctx] = await Promise.all([docFile(fd), nguCanh()])
    const sheets = cacSheet(buf).map((s) => ({ ...s, hang: s.soDong ? hangCuaSheet(buf, s.ten, ctx) : null }))
    return { ok: true, sheets }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

export async function kiemExcel(fd: FormData): Promise<{ ok: true; ketQua: KetQuaKiem[] } | { ok: false; loi: string }> {
  try {
    await batBuocDangNhap()
    const [buf, ctx] = await Promise.all([docFile(fd), nguCanh()])
    const ketQua: KetQuaKiem[] = []
    for (const s of docSheets(fd)) {
      const hang = hangCuaSheet(buf, s, ctx)
      if (!hang) return { ok: false, loi: `Không biết sheet "${s}" là của hãng nào. Đặt tên sheet theo tên hãng.` }
      ketQua.push(kiemSheet(buf, s, hang, ctx))
    }
    return { ok: true, ketQua }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

const COT_SAN_PHAM =
  'brand_slug,category_slug,name_vi,name_en,series,origin_vi,origin_en,desc_vi,desc_en,' +
  'highlights_vi,highlights_en,desc_full_vi,desc_full_en,applications_vi,applications_en,' +
  'specs_vi,specs_en,images,doc_pdf,doc_url,keywords,visible,featured,tag,priority,en_status'

export interface TuyChonNap {
  /** Xóa sản phẩm của hãng đang có trên web mà không có trong file (B5). */
  xoaKhongCoTrongFile: boolean
  /** Sản phẩm mới ở trạng thái ẩn cho tới khi có ảnh. */
  anMoi: boolean
}

export async function napExcel(
  fd: FormData
): Promise<{ ok: true; thongBao: string; them: number; ghiDe: number; xoa: number } | { ok: false; loi: string }> {
  try {
    await batBuocDangNhap()
    const tuyChon: TuyChonNap = { xoaKhongCoTrongFile: fd.get('xoa') === '1', anMoi: fd.get('anMoi') === '1' }
    const [buf, ctx] = await Promise.all([docFile(fd), nguCanh()])
    const sb = supabaseServer()
    let them = 0, ghiDe = 0, xoa = 0
    for (const s of docSheets(fd)) {
      const hang = hangCuaSheet(buf, s, ctx)
      if (!hang) return { ok: false, loi: `Không biết sheet "${s}" là của hãng nào.` }
      const kq = kiemSheet(buf, s, hang, ctx)
      const coLoi = kq.dong.filter((d) => d.loi.length)
      if (coLoi.length) return { ok: false, loi: `Sheet ${s} còn ${coLoi.length} dòng lỗi — sửa trong Excel rồi tải lại.` }

      const moi = kq.dong.filter((d) => d.trangThai === 'THÊM MỚI')
      const cu = kq.dong.filter((d) => d.trangThai !== 'THÊM MỚI')

      // Bản đang có → lịch sử, để Hoàn tác từng sản phẩm ở trang sửa
      const banCu = new Map<string, Record<string, unknown>>()
      if (cu.length) {
        const { data: ds } = await sb.from('products').select(`part,${COT_SAN_PHAM}`).in('part', cu.map((d) => d.part))
        if (ds?.length) {
          for (const r of ds as Record<string, unknown>[]) banCu.set(String(r.part), r)
          await sb.from('noi_dung_lich_su').insert(
            ds.map((r) => {
              const { part, ...du_lieu } = r as Record<string, unknown>
              return { khoa: `sp.${part}`, du_lieu }
            })
          )
        }
      }
      const luc = new Date().toISOString()
      if (moi.length) {
        const { error } = await sb
          .from('products')
          .insert(moi.map((d) => ({ ...d.ban, en_status: 'trống', visible: !tuyChon.anMoi, updated_at: luc })))
        if (error) return { ok: false, loi: `Thêm mới (${s}): ${error.message}` }
        them += moi.length
      }
      for (const d of cu) {
        const ban: Record<string, unknown> = { ...d.ban, updated_at: luc }
        const truoc = banCu.get(d.part)
        if (d.trangThai === 'GHI ĐÈ (đổi hãng)') {
          Object.assign(ban, { images: [], catalog: null, doc_pdf: null, featured: false, tag: null, sub_vi: null, sub_en: null })
        } else {
          delete ban.slug // giữ đường dẫn cũ (B3)
          // Câu ngắn trên thẻ do người viết tay: file không có cột MÔ TẢ NGẮN thì giữ.
          if (!d.coMoTaNgan && truoc && String(truoc.desc_vi ?? '').trim()) delete ban.desc_vi
        }
        // Phần tiếng Việt nào đổi thì bản tiếng Anh của phần đó không còn khớp —
        // xóa để web hiện tiếng Việt, admin dịch lại ở trang sửa. Phần không đổi giữ EN.
        if (truoc) {
          // File không có khối EN thì không đụng vào bản EN đang có (chỉ xóa khi VI đổi, bên dưới)
          if (ban.applications_en == null) delete ban.applications_en
          if (ban.desc_full_en == null) delete ban.desc_full_en
          const doi = (k: string) => JSON.stringify(truoc[k] ?? null) !== JSON.stringify((ban[k] as unknown) ?? null)
          if (doi('highlights_vi')) ban.highlights_en = null
          if (doi('desc_full_vi') && !ban.desc_full_en) ban.desc_full_en = null
          if (doi('applications_vi') && !ban.applications_en) ban.applications_en = null
          if (doi('specs_vi')) ban.specs_en = null
          if (doi('name_vi')) ban.name_en = null
          if (ban.desc_vi !== undefined && doi('desc_vi')) ban.desc_en = null
        }
        const { error } = await sb.from('products').update(ban).eq('part', d.part)
        if (error) return { ok: false, loi: `Ghi đè ${d.part}: ${error.message}` }
        ghiDe++
      }
      if (tuyChon.xoaKhongCoTrongFile && kq.khongCoTrongFile.length) {
        const { error } = await sb.from('products').delete().in('part', kq.khongCoTrongFile).eq('brand_slug', hang)
        if (error) return { ok: false, loi: `Xóa (${s}): ${error.message}` }
        xoa += kq.khongCoTrongFile.length
      }
    }
    revalidateTag(THE_DU_LIEU)
    revalidatePath('/', 'layout')
    return { ok: true, thongBao: `Đã nạp: ${them} thêm mới, ${ghiDe} ghi đè, ${xoa} xóa. Web đã cập nhật.`, them, ghiDe, xoa }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}
