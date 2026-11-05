'use server'

/**
 * Các hành động của trang quản trị. Mọi hàm đều hỏi lại Supabase "ai đang
 * đăng nhập" trước khi ghi; ghi bằng phiên của admin nên RLS giữ cửa.
 *
 * Sau mỗi lần ghi gọi lamTuoi(): xóa bộ đệm dữ liệu và dựng lại mọi trang,
 * nên thứ admin vừa lưu lên web ngay (quyết định 05/11: lưu là lên web).
 */
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import sharp from 'sharp'
import { THE_DU_LIEU } from '@/lib/db'
import { tachDuLieu, type GiaTriKhoi } from '@/lib/noi-dung'
import { timKhoi } from '@/lib/noi-dung/khoi'
import { nguoiDung, supabaseServer } from '@/lib/supabase/server'
import { slugify } from '@/lib/utils'

const BUCKET = 'ktd'
/** Giữ bao nhiêu bản trước cho mỗi khối. */
const SO_BAN_LUU = 20
/** Vercel giới hạn thân yêu cầu 4,5 MB; chừa lại một chút. */
const ANH_TOI_DA = 4 * 1024 * 1024

export type KetQua = { ok: true; thongBao?: string } | { ok: false; loi: string }

async function batBuocDangNhap() {
  const u = await nguoiDung()
  if (!u) throw new Error('Chưa đăng nhập')
  return u
}

function lamTuoi() {
  revalidateTag(THE_DU_LIEU)
  revalidatePath('/', 'layout')
}

const loiCua = (e: unknown) => (e instanceof Error ? e.message : String(e))

// ------------------------------------------------------------------ tài khoản

export async function dangNhap(_: unknown, formData: FormData): Promise<{ loi?: string }> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('matKhau') ?? '')
  const { error } = await supabaseServer().auth.signInWithPassword({ email, password })
  if (error) return { loi: 'Email hoặc mật khẩu không đúng.' }
  redirect('/admin/trang-chu')
}

export async function dangXuat() {
  await supabaseServer().auth.signOut()
  redirect('/admin/dang-nhap')
}

export async function doiMatKhau(_: unknown, formData: FormData): Promise<{ loi?: string; xong?: boolean }> {
  await batBuocDangNhap()
  const a = String(formData.get('matKhau') ?? '')
  const b = String(formData.get('matKhau2') ?? '')
  if (a.length < 8) return { loi: 'Mật khẩu cần ít nhất 8 ký tự.' }
  if (a !== b) return { loi: 'Hai lần gõ không khớp.' }
  const { error } = await supabaseServer().auth.updateUser({ password: a })
  if (error) return { loi: error.message }
  return { xong: true }
}

// ------------------------------------------------------------------ nội dung

/** Lưu một khối. Bản đang có được cất vào lịch sử để Hoàn tác. */
export async function luuKhoi(khoa: string, giaTri: GiaTriKhoi): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const khoi = timKhoi(khoa)
    if (!khoi) return { ok: false, loi: `Không có khối "${khoa}"` }
    const sb = supabaseServer()
    const duLieu = tachDuLieu(khoi, giaTri)

    // Lần đầu lưu, "bản trước" là chữ gốc trong mã — ghi {} để Hoàn tác về được đó.
    const { data: cu } = await sb.from('noi_dung').select('du_lieu').eq('khoa', khoa).maybeSingle()
    await sb.from('noi_dung_lich_su').insert({ khoa, du_lieu: cu?.du_lieu ?? {} })

    const { error } = await sb
      .from('noi_dung')
      .upsert({ khoa, du_lieu: duLieu, updated_at: new Date().toISOString() })
    if (error) return { ok: false, loi: error.message }

    // Chỉ giữ SO_BAN_LUU bản gần nhất
    const { data: thua } = await sb
      .from('noi_dung_lich_su')
      .select('id')
      .eq('khoa', khoa)
      .order('luu_luc', { ascending: false })
      .range(SO_BAN_LUU, SO_BAN_LUU + 500)
    if (thua?.length) await sb.from('noi_dung_lich_su').delete().in('id', thua.map((x) => x.id))

    lamTuoi()
    return { ok: true, thongBao: 'Đã lưu, web đã cập nhật.' }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

/** Quay về bản trước gần nhất của một khối. Gọi nhiều lần thì lùi dần. */
export async function hoanTac(khoa: string): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const sb = supabaseServer()
    const { data: truoc } = await sb
      .from('noi_dung_lich_su')
      .select('id,du_lieu,luu_luc')
      .eq('khoa', khoa)
      .order('luu_luc', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!truoc) return { ok: false, loi: 'Không còn bản trước để quay về.' }
    const { error } = await sb
      .from('noi_dung')
      .upsert({ khoa, du_lieu: truoc.du_lieu, updated_at: new Date().toISOString() })
    if (error) return { ok: false, loi: error.message }
    await sb.from('noi_dung_lich_su').delete().eq('id', truoc.id)
    lamTuoi()
    return { ok: true, thongBao: `Đã quay về bản lưu lúc ${await gioVN(truoc.luu_luc)}.` }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

/** Số bản trước đang giữ của một khối — để nút Hoàn tác biết còn lùi được không. */
export async function soBanTruoc(khoa: string): Promise<number> {
  const { count } = await supabaseServer()
    .from('noi_dung_lich_su')
    .select('id', { count: 'exact', head: true })
    .eq('khoa', khoa)
  return count ?? 0
}

export async function gioVN(iso: string): Promise<string> {
  return new Date(iso).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
}

// ------------------------------------------------------------------ ảnh

export type KetQuaAnh = { ok: true; duong: string } | { ok: false; loi: string }

/**
 * Nhận một ảnh từ form, thu về khung yêu cầu, đổi sang webp, đẩy lên kho.
 * Tên file có dấu thời gian để trình duyệt và CDN không giữ bản cũ.
 *
 * formData: tep (File), thuMuc ('site/linh-vuc'), khung (JSON {rong, cao, kieu}) tùy chọn.
 */
export async function taiAnh(formData: FormData): Promise<KetQuaAnh> {
  try {
    await batBuocDangNhap()
    const tep = formData.get('tep')
    if (!(tep instanceof File) || !tep.size) return { ok: false, loi: 'Chưa chọn ảnh.' }
    if (tep.size > ANH_TOI_DA) return { ok: false, loi: 'Ảnh nặng quá 4 MB. Thu nhỏ rồi tải lại.' }
    const thuMuc = String(formData.get('thuMuc') ?? 'site/khac').replace(/[^a-z0-9/_-]/gi, '').replace(/^\/+|\/+$/g, '')
    const khungRaw = formData.get('khung')
    const khung = khungRaw ? (JSON.parse(String(khungRaw)) as { rong: number; cao: number; kieu?: string }) : null

    let img = sharp(Buffer.from(await tep.arrayBuffer())).rotate()
    img = khung
      ? img.resize({ width: khung.rong, height: khung.cao, fit: khung.kieu === 'contain' ? 'contain' : 'cover', background: '#ffffff' })
      : img.resize({ width: 1600, withoutEnlargement: true })
    const buf = await img.flatten({ background: '#ffffff' }).webp({ quality: 86 }).toBuffer()

    const duong = `${thuMuc}/${Date.now().toString(36)}.webp`
    const { error } = await supabaseServer().storage.from(BUCKET).upload(duong, buf, { contentType: 'image/webp', upsert: true })
    if (error) return { ok: false, loi: error.message }
    return { ok: true, duong }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

export interface KhungAnh {
  rong: number
  cao: number
  kieu?: 'cover' | 'contain'
}

const urlKho = (duong: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${duong}`

/**
 * Trình duyệt đã đẩy file gốc lên kho (tam/…). Máy chủ tải về, thu về khung,
 * đổi webp, cất vào thư mục đích và xóa file tạm. Cách này không vướng giới
 * hạn 4,5 MB thân yêu cầu của Vercel.
 */
export async function xuLyAnh(tam: string, thuMuc: string, khung?: KhungAnh | null): Promise<KetQuaAnh> {
  try {
    await batBuocDangNhap()
    if (!tam.startsWith('tam/')) return { ok: false, loi: 'Đường dẫn tạm không hợp lệ.' }
    const kho = supabaseServer().storage.from(BUCKET)
    const res = await fetch(urlKho(tam), { cache: 'no-store' })
    if (!res.ok) return { ok: false, loi: `Không đọc được file tạm (${res.status}).` }
    const goc = Buffer.from(await res.arrayBuffer())
    let img = sharp(goc, { limitInputPixels: false }).rotate()
    img = khung
      ? img.resize({ width: khung.rong, height: khung.cao, fit: khung.kieu === 'contain' ? 'contain' : 'cover', background: '#ffffff' })
      : img.resize({ width: 1600, withoutEnlargement: true })
    const buf = await img.flatten({ background: '#ffffff' }).webp({ quality: 86 }).toBuffer()
    const sach = thuMuc.replace(/[^a-z0-9/_-]/gi, '').replace(/^\/+|\/+$/g, '')
    const duong = `${sach}/${Date.now().toString(36)}.webp`
    const { error } = await kho.upload(duong, buf, { contentType: 'image/webp', upsert: true })
    if (error) return { ok: false, loi: error.message }
    await kho.remove([tam])
    return { ok: true, duong }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

/** Logo hãng từ file tạm: hai bản như taiLogoHang. */
export async function xuLyLogo(tam: string, slug: string): Promise<{ ok: true; logo: string; logo_goc: string } | { ok: false; loi: string }> {
  try {
    await batBuocDangNhap()
    if (!tam.startsWith('tam/')) return { ok: false, loi: 'Đường dẫn tạm không hợp lệ.' }
    const res = await fetch(urlKho(tam), { cache: 'no-store' })
    if (!res.ok) return { ok: false, loi: `Không đọc được file tạm (${res.status}).` }
    const fd = new FormData()
    fd.set('tep', new File([await res.arrayBuffer()], 'logo'))
    fd.set('slug', slug)
    const r = await taiLogoHang(fd, true)
    if (r.ok) await supabaseServer().storage.from(BUCKET).remove([tam])
    return r
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

// ------------------------------------------------------------------ danh mục

export interface DongDanhMuc {
  slug: string
  name_vi: string
  name_en: string
  sub_vi: string
  sub_en: string
  /** Đường dẫn trong kho; '' = dùng ảnh có sẵn trong public/. */
  image: string
}

/** Tên, câu nhỏ, ảnh của các ô danh mục ở trang chủ. */
export async function luuDanhMuc(dong: DongDanhMuc[]): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const sb = supabaseServer()
    for (const d of dong) {
      const { error } = await sb
        .from('categories')
        .update({
          name_vi: d.name_vi.trim(),
          name_en: d.name_en.trim() || d.name_vi.trim(),
          sub_vi: d.sub_vi.trim(),
          sub_en: d.sub_en.trim() || d.sub_vi.trim(),
          image: d.image.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('slug', d.slug)
      if (error) return { ok: false, loi: `${d.slug}: ${error.message}` }
    }
    lamTuoi()
    return { ok: true, thongBao: 'Đã lưu danh mục.' }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

export interface DuLieuMotDanhMuc {
  name_vi: string
  name_en: string
  sub_vi: string
  sub_en: string
  image: string
  parent_slug: string | null
}

const COT_DANH_MUC = 'name_vi,name_en,sub_vi,sub_en,image,parent_slug,featured,visible'

/** Sửa một nhóm (chính hoặc nhỏ). */
export async function luuMotDanhMuc(slug: string, d: DuLieuMotDanhMuc): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    if (!d.name_vi.trim()) return { ok: false, loi: 'Cần tên nhóm.' }
    const sb = supabaseServer()
    const { data: cu } = await sb.from('categories').select(COT_DANH_MUC).eq('slug', slug).maybeSingle()
    if (cu) await sb.from('noi_dung_lich_su').insert({ khoa: `dm.${slug}`, du_lieu: cu })
    const { error } = await sb
      .from('categories')
      .update({
        name_vi: d.name_vi.trim(),
        name_en: d.name_en.trim() || d.name_vi.trim(),
        sub_vi: d.sub_vi.trim(),
        sub_en: d.sub_en.trim() || d.sub_vi.trim(),
        image: d.image.trim() || null,
        parent_slug: d.parent_slug || null,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug)
    if (error) return { ok: false, loi: error.message }
    lamTuoi()
    return { ok: true, thongBao: 'Đã lưu, web đã cập nhật.' }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

export async function hoanTacDanhMuc(slug: string): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const sb = supabaseServer()
    const { data: truoc } = await sb
      .from('noi_dung_lich_su')
      .select('id,du_lieu,luu_luc')
      .eq('khoa', `dm.${slug}`)
      .order('luu_luc', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!truoc) return { ok: false, loi: 'Không còn bản trước để quay về.' }
    const { error } = await sb.from('categories').update({ ...truoc.du_lieu, updated_at: new Date().toISOString() }).eq('slug', slug)
    if (error) return { ok: false, loi: error.message }
    await sb.from('noi_dung_lich_su').delete().eq('id', truoc.id)
    lamTuoi()
    return { ok: true, thongBao: `Đã quay về bản lưu lúc ${await gioVN(truoc.luu_luc)}.` }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

/** Bật/tắt một cờ của nhóm: visible (hiện trên web) hoặc featured (cột Danh mục ở chân trang và bộ lọc rút gọn). */
export async function batTatDanhMuc(slug: string, co: 'visible' | 'featured', giaTri: boolean): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const { error } = await supabaseServer().from('categories').update({ [co]: giaTri }).eq('slug', slug)
    if (error) return { ok: false, loi: error.message }
    lamTuoi()
    return { ok: true }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

/** Thứ tự trong một nhánh (các nhóm chính, hoặc các nhóm nhỏ của một nhóm chính). */
export async function sapXepDanhMuc(slugs: string[]): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const sb = supabaseServer()
    for (let i = 0; i < slugs.length; i++) {
      const { error } = await sb.from('categories').update({ sort_order: i + 1 }).eq('slug', slugs[i])
      if (error) return { ok: false, loi: error.message }
    }
    lamTuoi()
    return { ok: true }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

export async function themDanhMuc(_: unknown, formData: FormData): Promise<{ loi?: string; xong?: string }> {
  try {
    await batBuocDangNhap()
    const name = String(formData.get('name') ?? '').trim()
    const parent = String(formData.get('parent') ?? '').trim() || null
    if (!name) return { loi: 'Cần tên nhóm.' }
    const sb = supabaseServer()
    const slug = slugify(name)
    const { data: trung } = await sb.from('categories').select('slug').eq('slug', slug).maybeSingle()
    if (trung) return { loi: `Đã có nhóm với đường dẫn "${slug}".` }
    const nhanh = sb.from('categories').select('sort_order')
    const { data: cuoi } = await (parent === null ? nhanh.is('parent_slug', null) : nhanh.eq('parent_slug', parent))
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle()
    const { error } = await sb.from('categories').insert({
      slug, name_vi: name, name_en: name, sub_vi: '', parent_slug: parent, visible: false, featured: false,
      sort_order: (cuoi?.sort_order ?? 0) + 1,
    })
    if (error) return { loi: error.message }
    lamTuoi()
    return { xong: slug }
  } catch (e) {
    return { loi: loiCua(e) }
  }
}

/** Xóa một nhóm — chỉ khi không còn sản phẩm và không còn nhóm con. */
export async function xoaDanhMuc(slug: string): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const sb = supabaseServer()
    const { count: sp } = await sb.from('products').select('part', { count: 'exact', head: true }).eq('category_slug', slug)
    if (sp) return { ok: false, loi: `Nhóm còn ${sp} sản phẩm. Chuyển sản phẩm sang nhóm khác trước.` }
    const { count: con } = await sb.from('categories').select('slug', { count: 'exact', head: true }).eq('parent_slug', slug)
    if (con) return { ok: false, loi: `Nhóm còn ${con} nhóm nhỏ bên trong.` }
    const { error } = await sb.from('categories').delete().eq('slug', slug)
    if (error) return { ok: false, loi: error.message }
    lamTuoi()
    return { ok: true }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

// ------------------------------------------------------------------ thương hiệu

export interface DuLieuHang {
  name: string
  origin_vi: string
  origin_en: string
  website: string
  desc_vi: string
  desc_en: string
  intro_vi: string
  intro_en: string
  dong_sp_vi: string[]
  dong_sp_en: string[]
  noi_bat_vi: string[]
  noi_bat_en: string[]
  ung_dung_vi: string[]
  ung_dung_en: string[]
  /** Đường dẫn trong kho, '' = giữ nguyên. */
  logo?: string
  logo_goc?: string
  banner?: string
}

/** Các cột admin sửa được của một hãng — cũng là những gì Hoàn tác khôi phục. */
const COT_HANG =
  'name,origin_vi,origin_en,website,desc_vi,desc_en,intro_vi,intro_en,' +
  'dong_sp_vi,dong_sp_en,noi_bat_vi,noi_bat_en,ung_dung_vi,ung_dung_en,logo,logo_goc,banner'

/** Quay về bản trước của một hãng. */
export async function hoanTacHang(slug: string): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const sb = supabaseServer()
    const { data: truoc } = await sb
      .from('noi_dung_lich_su')
      .select('id,du_lieu,luu_luc')
      .eq('khoa', `hang.${slug}`)
      .order('luu_luc', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!truoc) return { ok: false, loi: 'Không còn bản trước để quay về.' }
    const { error } = await sb.from('brands').update({ ...truoc.du_lieu, updated_at: new Date().toISOString() }).eq('slug', slug)
    if (error) return { ok: false, loi: error.message }
    await sb.from('noi_dung_lich_su').delete().eq('id', truoc.id)
    lamTuoi()
    return { ok: true, thongBao: `Đã quay về bản lưu lúc ${await gioVN(truoc.luu_luc)}.` }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

const danhSach = (vi: string[], en: string[]) => {
  const v = vi.map((x) => x.trim()).filter(Boolean)
  return { vi: v, en: v.map((x, i) => (en[i] ?? '').trim() || x) }
}

export async function luuHang(slug: string, d: DuLieuHang): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const dong = danhSach(d.dong_sp_vi, d.dong_sp_en)
    const noi = danhSach(d.noi_bat_vi, d.noi_bat_en)
    const ung = danhSach(d.ung_dung_vi, d.ung_dung_en)
    const ban: Record<string, unknown> = {
      name: d.name.trim(),
      origin_vi: d.origin_vi.trim(),
      origin_en: d.origin_en.trim() || d.origin_vi.trim(),
      website: d.website.trim() || null,
      desc_vi: d.desc_vi.trim(),
      desc_en: d.desc_en.trim() || d.desc_vi.trim(),
      intro_vi: d.intro_vi.trim(),
      intro_en: d.intro_en.trim() || d.intro_vi.trim(),
      dong_sp_vi: dong.vi, dong_sp_en: dong.en,
      noi_bat_vi: noi.vi, noi_bat_en: noi.en,
      ung_dung_vi: ung.vi, ung_dung_en: ung.en,
      updated_at: new Date().toISOString(),
    }
    if (d.logo) ban.logo = d.logo
    if (d.logo_goc) ban.logo_goc = d.logo_goc
    if (d.banner) ban.banner = d.banner
    const sb = supabaseServer()
    // Cất bản đang có để Hoàn tác — dùng chung bảng lịch sử với các khối nội dung.
    const { data: cu } = await sb.from('brands').select(COT_HANG).eq('slug', slug).maybeSingle()
    if (cu) await sb.from('noi_dung_lich_su').insert({ khoa: `hang.${slug}`, du_lieu: cu })
    const { error } = await sb.from('brands').update(ban).eq('slug', slug)
    if (error) return { ok: false, loi: error.message }
    lamTuoi()
    return { ok: true, thongBao: 'Đã lưu, web đã cập nhật.' }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

/**
 * Logo hãng: một ảnh tải lên cho ra hai bản như scripts/normalize-brand-logos.mjs —
 *   brands/<slug>-goc-<t>.webp  giữ tỉ lệ gốc, cắt viền trắng, cho trang hãng
 *   brands/<slug>-<t>.webp      đóng khung 320×128 cho dải logo trang chủ
 * Logo vốn là ô màu (góc trên trái không trắng) thì không cắt viền.
 */
export async function taiLogoHang(formData: FormData, boQuaGioiHan = false): Promise<{ ok: true; logo: string; logo_goc: string } | { ok: false; loi: string }> {
  try {
    await batBuocDangNhap()
    const tep = formData.get('tep')
    const slug = slugify(String(formData.get('slug') ?? ''))
    if (!(tep instanceof File) || !tep.size || !slug) return { ok: false, loi: 'Chưa chọn ảnh.' }
    if (!boQuaGioiHan && tep.size > ANH_TOI_DA) return { ok: false, loi: 'Ảnh nặng quá 4 MB.' }
    const goc = Buffer.from(await tep.arrayBuffer())

    const { data, info } = await sharp(goc).flatten({ background: '#fff' }).raw().toBuffer({ resolveWithObject: true })
    const oMau = ![data[0], data[1], data[2]].every((n) => n > 240) || info.channels < 3
    let nen = sharp(goc).flatten({ background: '#ffffff' })
    if (!oMau) nen = nen.trim({ threshold: 8 })
    const gocBuf = await nen.clone().resize({ width: 640, height: 320, fit: 'inside', withEnlargement: false } as never).webp({ quality: 92 }).toBuffer()
    const khungBuf = await nen.clone().resize({ width: 320, height: 128, fit: 'contain', background: '#ffffff' }).webp({ quality: 92 }).toBuffer()

    const t = Date.now().toString(36)
    const kho = supabaseServer().storage.from(BUCKET)
    const dLogoGoc = `brands/${slug}-goc-${t}.webp`
    const dLogo = `brands/${slug}-${t}.webp`
    const r1 = await kho.upload(dLogoGoc, gocBuf, { contentType: 'image/webp', upsert: true })
    const r2 = await kho.upload(dLogo, khungBuf, { contentType: 'image/webp', upsert: true })
    if (r1.error || r2.error) return { ok: false, loi: (r1.error ?? r2.error)!.message }
    return { ok: true, logo: dLogo, logo_goc: dLogoGoc }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

export async function anHienHang(slug: string, visible: boolean): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const { error } = await supabaseServer().from('brands').update({ visible }).eq('slug', slug)
    if (error) return { ok: false, loi: error.message }
    lamTuoi()
    return { ok: true }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

/** Đổi thứ tự: nhận danh sách slug theo thứ tự mới. */
export async function sapXepHang(slugs: string[]): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const sb = supabaseServer()
    for (let i = 0; i < slugs.length; i++) {
      const { error } = await sb.from('brands').update({ sort_order: i + 1 }).eq('slug', slugs[i])
      if (error) return { ok: false, loi: error.message }
    }
    lamTuoi()
    return { ok: true }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

// ------------------------------------------------------------------ sản phẩm

export interface DuLieuSanPham {
  brand_slug: string
  category_slug: string
  name_vi: string
  name_en: string
  series: string
  origin_vi: string
  origin_en: string
  desc_vi: string
  desc_en: string
  highlights_vi: string[]
  highlights_en: string[]
  desc_full_vi: string[]
  desc_full_en: string[]
  applications_vi: string[]
  applications_en: string[]
  specs_vi: { label: string; value: string }[]
  specs_en: { label: string; value: string }[]
  images: string[]
  doc_pdf: string
  doc_url: string
  keywords: string[]
  visible: boolean
  featured: boolean
  tag: string
  priority: string
  en_status: string
}

/** Các cột admin sửa được của một sản phẩm — cũng là những gì Hoàn tác khôi phục. */
const COT_SAN_PHAM =
  'brand_slug,category_slug,name_vi,name_en,series,origin_vi,origin_en,desc_vi,desc_en,' +
  'highlights_vi,highlights_en,desc_full_vi,desc_full_en,applications_vi,applications_en,' +
  'specs_vi,specs_en,images,doc_pdf,doc_url,keywords,visible,featured,tag,priority,en_status'

const TRANG_THAI_EN = ['trống', 'từ hãng', 'máy dịch', 'đã duyệt']

export async function luuSanPham(part: string, d: DuLieuSanPham): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const sb = supabaseServer()
    if (!d.name_vi.trim()) return { ok: false, loi: 'Cần tên sản phẩm.' }
    if (!d.brand_slug || !d.category_slug) return { ok: false, loi: 'Cần chọn hãng và nhóm.' }
    const hl = danhSach(d.highlights_vi, d.highlights_en)
    const full = danhSach(d.desc_full_vi, d.desc_full_en)
    const ud = danhSach(d.applications_vi, d.applications_en)
    const specsVi = d.specs_vi.map((s) => ({ label: s.label.trim(), value: s.value.trim() })).filter((s) => s.label || s.value)
    const specsEn = d.specs_vi
      .map((s, i) => ({ label: (d.specs_en[i]?.label ?? '').trim() || s.label.trim(), value: (d.specs_en[i]?.value ?? '').trim() || s.value.trim() }))
      .filter((_, i) => d.specs_vi[i].label.trim() || d.specs_vi[i].value.trim())
    const uuTien = d.priority.trim() === '' ? null : Number(d.priority)
    if (uuTien !== null && !Number.isFinite(uuTien)) return { ok: false, loi: 'Ưu tiên phải là số.' }
    const ban = {
      brand_slug: d.brand_slug,
      category_slug: d.category_slug,
      name_vi: d.name_vi.trim(),
      name_en: d.name_en.trim() || null,
      series: d.series.trim() || null,
      origin_vi: d.origin_vi.trim() || null,
      origin_en: d.origin_en.trim() || d.origin_vi.trim() || null,
      desc_vi: d.desc_vi.trim(),
      desc_en: d.desc_en.trim() || null,
      highlights_vi: hl.vi, highlights_en: hl.en,
      desc_full_vi: full.vi, desc_full_en: full.en,
      applications_vi: ud.vi, applications_en: ud.en,
      specs_vi: specsVi, specs_en: specsEn,
      images: d.images.filter(Boolean).slice(0, 5),
      doc_pdf: d.doc_pdf.trim() || null,
      doc_url: d.doc_url.trim() || null,
      keywords: d.keywords.map((k) => k.trim()).filter(Boolean),
      visible: d.visible,
      featured: d.featured,
      tag: d.tag === 'Mới' || d.tag === 'Bán chạy' ? d.tag : null,
      priority: uuTien,
      en_status: TRANG_THAI_EN.includes(d.en_status) ? d.en_status : 'trống',
      updated_at: new Date().toISOString(),
    }
    const { data: cu } = await sb.from('products').select(COT_SAN_PHAM).eq('part', part).maybeSingle()
    if (cu) await sb.from('noi_dung_lich_su').insert({ khoa: `sp.${part}`, du_lieu: cu })
    const { error } = await sb.from('products').update(ban).eq('part', part)
    if (error) return { ok: false, loi: error.message }
    lamTuoi()
    return { ok: true, thongBao: 'Đã lưu, web đã cập nhật.' }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

export async function hoanTacSanPham(part: string): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const sb = supabaseServer()
    const { data: truoc } = await sb
      .from('noi_dung_lich_su')
      .select('id,du_lieu,luu_luc')
      .eq('khoa', `sp.${part}`)
      .order('luu_luc', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!truoc) return { ok: false, loi: 'Không còn bản trước để quay về.' }
    const { error } = await sb.from('products').update({ ...truoc.du_lieu, updated_at: new Date().toISOString() }).eq('part', part)
    if (error) return { ok: false, loi: error.message }
    await sb.from('noi_dung_lich_su').delete().eq('id', truoc.id)
    lamTuoi()
    return { ok: true, thongBao: `Đã quay về bản lưu lúc ${await gioVN(truoc.luu_luc)}.` }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

/** Thêm sản phẩm mới: mã, tên, hãng, nhóm. Tạo xong vào thẳng trang sửa. */
export async function themSanPham(_: unknown, formData: FormData): Promise<{ loi?: string }> {
  try {
    await batBuocDangNhap()
    const part = String(formData.get('part') ?? '').trim()
    const name = String(formData.get('name') ?? '').trim()
    const brand = String(formData.get('brand') ?? '').trim()
    const cat = String(formData.get('category') ?? '').trim()
    if (!part || !name || !brand || !cat) return { loi: 'Cần đủ mã hàng, tên, hãng và nhóm.' }
    const sb = supabaseServer()
    const { data: trung } = await sb.from('products').select('slug').eq('part', part).maybeSingle()
    if (trung) return { loi: `Mã ${part} đã có trên web.` }
    let slug = slugify(`${name} ${part}`)
    const { data: coSlug } = await sb.from('products').select('part').eq('slug', slug).maybeSingle()
    if (coSlug) slug = `${slug}-${Date.now().toString(36)}`
    const { error } = await sb.from('products').insert({
      part, slug, name_vi: name, brand_slug: brand, category_slug: cat, desc_vi: '', visible: false,
    })
    if (error) return { loi: error.message }
    lamTuoi()
    redirect(`/admin/san-pham/${slug}`)
  } catch (e) {
    if (e && typeof e === 'object' && 'digest' in e) throw e
    return { loi: loiCua(e) }
  }
}

/** Xóa hẳn một sản phẩm (ảnh trên kho giữ nguyên). Trang gọi phải hỏi lại trước. */
export async function xoaSanPham(part: string): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const { error } = await supabaseServer().from('products').delete().eq('part', part)
    if (error) return { ok: false, loi: error.message }
    lamTuoi()
    return { ok: true }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

export async function anHienSanPham(part: string, visible: boolean): Promise<KetQua> {
  try {
    await batBuocDangNhap()
    const { error } = await supabaseServer().from('products').update({ visible }).eq('part', part)
    if (error) return { ok: false, loi: error.message }
    lamTuoi()
    return { ok: true }
  } catch (e) {
    return { ok: false, loi: loiCua(e) }
  }
}

export async function themHang(_: unknown, formData: FormData): Promise<{ loi?: string }> {
  try {
    await batBuocDangNhap()
    const name = String(formData.get('name') ?? '').trim()
    const origin = String(formData.get('origin') ?? '').trim()
    if (!name) return { loi: 'Cần tên hãng.' }
    const slug = slugify(name)
    const sb = supabaseServer()
    const { data: cuoi } = await sb.from('brands').select('sort_order').order('sort_order', { ascending: false }).limit(1).maybeSingle()
    const { error } = await sb.from('brands').insert({
      slug, name, origin_vi: origin, origin_en: origin, desc_vi: '', visible: false,
      sort_order: (cuoi?.sort_order ?? 0) + 1,
    })
    if (error) return { loi: error.message }
    lamTuoi()
    redirect(`/admin/thuong-hieu/${slug}`)
  } catch (e) {
    // redirect() ném lỗi đặc biệt để Next xử lý — phải ném tiếp
    if (e && typeof e === 'object' && 'digest' in e) throw e
    return { loi: loiCua(e) }
  }
}
