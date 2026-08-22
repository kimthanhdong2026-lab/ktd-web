/**
 * Sinh file SQL nạp dữ liệu hiện có lên Supabase.
 *
 * Đọc thẳng lib/ktd-data.ts nên không bao giờ lệch với những gì trang đang
 * hiển thị. Chạy:  npx tsx scripts/gen-seed-sql.ts
 *
 * Kết quả ghi ra supabase/migrations/0004_seed.sql — dán vào SQL Editor của
 * Supabase là xong, không cần khoá service_role.
 *
 * Toàn bộ dùng INSERT ... ON CONFLICT DO UPDATE nên chạy lại nhiều lần vẫn
 * đúng, và chạy lại sau khi sửa dữ liệu trong lib/ktd-data.ts sẽ đồng bộ chứ
 * không tạo bản ghi trùng.
 */
import { writeFileSync } from 'node:fs'
import { BRANDS, CATEGORIES, PRODUCTS, productSlug } from '../lib/ktd-data'
import { FEATURED_CATEGORIES } from '../lib/constants'

/** Chuỗi cho SQL. Nhân đôi dấu nháy đơn, NULL nếu rỗng. */
const s = (v: string | undefined | null): string =>
  v === undefined || v === null || v === '' ? 'null' : `'${v.replace(/'/g, "''")}'`

/**
 * Mảng text[] cho Postgres.
 *
 * Hai tầng thoát ký tự khác nhau, dễ nhầm:
 *  - Trong literal mảng: \ và " phải thêm dấu chéo ngược.
 *  - Trong chuỗi SQL bọc ngoài: dấu nháy đơn phải nhân đôi.
 * Thiếu tầng thứ hai thì chỉ cần một mô tả có dấu nháy là hỏng cả file.
 */
const arr = (v: readonly string[] | undefined): string => {
  if (!v || v.length === 0) return `'{}'`
  const items = v.map((x) => `"${x.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`)
  const literal = `{${items.join(',')}}` // tầng 1: literal mảng
  return `'${literal.replace(/'/g, "''")}'` // tầng 2: chuỗi SQL
}

/** jsonb, nhân đôi dấu nháy đơn sau khi stringify. */
const json = (v: unknown): string =>
  v === undefined || v === null ? 'null' : `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`

const bool = (v: boolean | undefined): string => (v ? 'true' : 'false')
const num = (v: number | undefined): string => (v === undefined ? 'null' : String(v))

const out: string[] = []
const say = (line = '') => out.push(line)

say('-- =============================================================================')
say('-- Dữ liệu mồi — SINH TỰ ĐỘNG, ĐỪNG SỬA TAY.')
say('-- Nguồn: lib/ktd-data.ts · Sinh lại bằng: npx tsx scripts/gen-seed-sql.ts')
say('--')
say('-- Chạy sau 0001_schema.sql. Chạy lại nhiều lần vẫn an toàn: mọi câu lệnh đều')
say('-- là INSERT ... ON CONFLICT DO UPDATE nên đồng bộ chứ không nhân bản.')
say('--')
say('-- Cột tiếng Anh để trống — chờ bước song ngữ.')
say('-- =============================================================================')
say()

// ---------------------------------------------------------------- thương hiệu
say(`-- ${BRANDS.length} thương hiệu, sort_order giữ đúng thứ tự ưu tiên ở trang chủ`)
say('insert into brands (slug, name, origin_vi, desc_vi, logo, sort_order) values')
say(
  BRANDS.map((b, i) => {
    // Bảng chỉ lưu đường dẫn trong bucket; /assets/brands/norm/x.webp -> brands/x.webp
    const logo = b.logo ? b.logo.replace(/^.*\//, 'brands/') : undefined
    return `  (${s(b.slug)}, ${s(b.name)}, ${s(b.origin)}, ${s(b.desc)}, ${s(logo)}, ${i + 1})`
  }).join(',\n')
)
say('on conflict (slug) do update set')
say('  name = excluded.name, origin_vi = excluded.origin_vi,')
say('  desc_vi = excluded.desc_vi, logo = excluded.logo, sort_order = excluded.sort_order;')
say()

// ------------------------------------------------------------------- danh mục
say(`-- ${CATEGORIES.length} danh mục; featured = nhóm hiện ở bộ lọc rút gọn và cột footer`)
say('insert into categories (slug, name_vi, sub_vi, featured, sort_order) values')
say(
  CATEGORIES.map(
    (c, i) =>
      `  (${s(c.slug)}, ${s(c.name)}, ${s(c.sub)}, ${bool(
        FEATURED_CATEGORIES.includes(c.slug)
      )}, ${i + 1})`
  ).join(',\n')
)
say('on conflict (slug) do update set')
say('  name_vi = excluded.name_vi, sub_vi = excluded.sub_vi,')
say('  featured = excluded.featured, sort_order = excluded.sort_order;')
say()

// -------------------------------------------------------------------- sản phẩm
say(`-- ${PRODUCTS.length} sản phẩm`)
say('insert into products (')
say('  part, slug, brand_slug, category_slug, name_vi, sub_vi, series, origin_vi,')
say('  desc_vi, desc_full_vi, applications_vi, specs_vi, images, doc_pdf, doc_url,')
say('  catalog, keywords, featured, tag, priority')
say(') values')
say(
  PRODUCTS.map((p) => {
    // specs từ [[nhãn, giá trị]] sang [{label, value}] để giữ thứ tự và đọc được
    const specs = (p.specs ?? []).map(([label, value]) => ({ label, value }))
    // Ảnh: /products/x.webp -> products/x.webp (đường dẫn trong bucket)
    const images = (p.images ?? []).map((src) => src.replace(/^\/+/, ''))
    const docPdf = p.docPdf ? p.docPdf.replace(/^\/+/, '') : undefined
    return [
      '  (',
      [
        s(p.part),
        s(productSlug(p)),
        s(p.brand),
        s(p.category),
        s(p.name),
        s(p.sub),
        s(p.series),
        s(p.origin),
        s(p.desc),
        arr(p.descFull),
        arr(p.applications),
        json(specs),
        arr(images),
        s(docPdf),
        s(p.docUrl),
        json(p.pdf ?? null),
        arr(p.kw),
        bool(p.featured),
        s(p.tag),
        num(undefined), // priority: đội vận hành điền sau qua cột ƯU TIÊN trong Excel
      ].join(', '),
      ')',
    ].join('')
  }).join(',\n')
)
say('on conflict (part) do update set')
say('  slug = excluded.slug, brand_slug = excluded.brand_slug,')
say('  category_slug = excluded.category_slug, name_vi = excluded.name_vi,')
say('  sub_vi = excluded.sub_vi, series = excluded.series, origin_vi = excluded.origin_vi,')
say('  desc_vi = excluded.desc_vi, desc_full_vi = excluded.desc_full_vi,')
say('  applications_vi = excluded.applications_vi, specs_vi = excluded.specs_vi,')
say('  images = excluded.images, doc_pdf = excluded.doc_pdf, doc_url = excluded.doc_url,')
say('  catalog = excluded.catalog, keywords = excluded.keywords,')
say('  featured = excluded.featured, tag = excluded.tag;')
say()

const path = 'supabase/migrations/0004_seed.sql'
writeFileSync(path, out.join('\n'), 'utf8')
console.log(
  `${path}: ${BRANDS.length} thương hiệu, ${CATEGORIES.length} danh mục, ${PRODUCTS.length} sản phẩm`
)
