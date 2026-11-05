import { NextResponse } from 'next/server'
import {
  EMAIL_RE,
  RFQ_BUCKET,
  RFQ_FILE_TYPES,
  RFQ_MAX_FILES,
  RFQ_MAX_FILE_BYTES,
  RFQ_MAX_QTY,
  fileExt,
  type RfqError,
  type RfqFile,
  type RfqItem,
  type RfqPayload,
} from '@/lib/rfq'

/**
 * Nhận yêu cầu báo giá / yêu cầu tìm hàng.
 *
 * Thứ tự: LƯU vào bảng yeu_cau_bao_gia (admin xem ở /admin/bao-gia) → gửi
 * email về hộp thư công ty nếu đã bật Resend. Khách thấy "đã gửi" khi lưu
 * được; email chỉ là kênh báo thêm. Trước đây (đợt "Sửa web 5") chỉ có email,
 * chưa bật Resend là khách bị báo thất bại.
 *
 * Biến môi trường (đặt ở Vercel, KHÔNG có tiền tố NEXT_PUBLIC_):
 *   RESEND_API_KEY              khoá của tài khoản Resend — thiếu thì không gửi email
 *   RFQ_INBOX                   hộp thư nhận, mặc định sales@kimthanhdong.com
 *   RFQ_FROM                    địa chỉ gửi, phải thuộc tên miền đã xác minh ở Resend
 *   SUPABASE_SERVICE_ROLE_KEY   (tuỳ chọn) có thì tệp đính kèm được gắn vào email;
 *                               không có thì email chỉ ghi tên tệp, admin tải ở trang quản trị
 */

export const runtime = 'nodejs'
export const maxDuration = 30

const INBOX = process.env.RFQ_INBOX || 'sales@kimthanhdong.com'
const FROM = process.env.RFQ_FROM || 'Website Kim Thành Đông <website@kimthanhdong.com>'

const fail = (error: RfqError, status: number) => NextResponse.json({ ok: false, error }, { status })

const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** RFQ-YYMMDD-NNNN theo giờ Việt Nam, ví dụ RFQ-261010-4821. */
function makeCode(): string {
  const d = new Date(Date.now() + 7 * 3600 * 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  const seq = String(Math.floor(Math.random() * 9000) + 1000)
  return `RFQ-${String(d.getUTCFullYear()).slice(2)}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}-${seq}`
}

function cleanItems(raw: unknown): RfqItem[] {
  if (!Array.isArray(raw)) return []
  return raw.slice(0, 200).flatMap((x) => {
    const part = text(x?.part, 80)
    const qty = Math.floor(Number(x?.qty))
    if (!part || !Number.isFinite(qty) || qty < 1) return []
    return [{ part, name: text(x?.name, 200), brand: text(x?.brand, 80), qty: Math.min(qty, RFQ_MAX_QTY) }]
  })
}

/** Chỉ nhận đúng dạng đường dẫn mà trình duyệt tạo khi tải tệp lên (xem RFQModal). */
const PATH_RE = /^\d{4}-\d{2}\/[0-9a-f-]{36}\.[a-z0-9]{2,5}$/

function cleanFiles(raw: unknown): RfqFile[] | null {
  if (raw === undefined) return []
  if (!Array.isArray(raw) || raw.length > RFQ_MAX_FILES) return null
  const out: RfqFile[] = []
  for (const x of raw) {
    const path = text(x?.path, 120)
    const name = text(x?.name, 200)
    if (!PATH_RE.test(path) || !RFQ_FILE_TYPES[fileExt(path)] || !name) return null
    out.push({ path, name })
  }
  return out
}

async function loadAttachment(base: string, key: string, f: RfqFile) {
  const res = await fetch(`${base}/storage/v1/object/${RFQ_BUCKET}/${f.path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`không đọc được tệp ${f.path}: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.byteLength > RFQ_MAX_FILE_BYTES) throw new Error(`tệp ${f.path} vượt giới hạn`)
  return { filename: f.name, content: buf.toString('base64') }
}

function buildHtml(code: string, p: RfqPayload, items: RfqItem[], files: RfqFile[], coDinhKem: boolean, linkAdmin: string) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 14px 6px 0;color:#5a636d;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#111418"><b>${esc(value)}</b></td></tr>`

  const itemRows = items
    .map(
      (it, i) =>
        `<tr><td style="padding:7px 10px;border:1px solid #d4d9de">${i + 1}</td><td style="padding:7px 10px;border:1px solid #d4d9de">${esc(it.name || it.part)}</td><td style="padding:7px 10px;border:1px solid #d4d9de;font-family:Consolas,monospace">${esc(it.part)}</td><td style="padding:7px 10px;border:1px solid #d4d9de">${esc(it.brand || '')}</td><td style="padding:7px 10px;border:1px solid #d4d9de;text-align:right"><b>${it.qty}</b></td></tr>`
    )
    .join('')

  const loai = p.kind === 'find' ? 'Yêu cầu tìm hàng' : 'Yêu cầu báo giá'
  const tep = !files.length
    ? 'Không có tệp đính kèm.'
    : coDinhKem
      ? `Tệp đính kèm: ${files.map((f) => esc(f.name)).join(', ')}`
      : `Khách gửi kèm ${files.length} tệp (${files.map((f) => esc(f.name)).join(', ')}) — tải ở trang quản trị.`

  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#111418;max-width:720px">
<h2 style="margin:0 0 4px;color:#005E96;font-size:19px">${loai} từ website</h2>
<p style="margin:0 0 16px;color:#5a636d">Mã yêu cầu: <b style="color:#111418">${code}</b> · Ngôn ngữ khách đang xem: ${p.lang === 'en' ? 'tiếng Anh' : 'tiếng Việt'}</p>
<table style="border-collapse:collapse;margin-bottom:18px">
${row('Họ và tên', p.name)}${row('Công ty', p.company)}${row('Điện thoại', p.phone)}${row('Email', p.email)}
</table>
${
  items.length
    ? `<p style="margin:0 0 6px"><b>Danh sách sản phẩm (${items.length})</b></p>
<table style="border-collapse:collapse;margin-bottom:18px;font-size:13.5px">
<tr style="background:#005E96;color:#fff"><th style="padding:7px 10px;text-align:left">#</th><th style="padding:7px 10px;text-align:left">Tên sản phẩm</th><th style="padding:7px 10px;text-align:left">Mã hàng</th><th style="padding:7px 10px;text-align:left">Hãng</th><th style="padding:7px 10px;text-align:right">SL</th></tr>
${itemRows}</table>`
    : `<p style="margin:0 0 18px;color:#5a636d">Khách không chọn sản phẩm nào trên website — xem phần ghi chú.</p>`
}
<p style="margin:0 0 6px"><b>Ghi chú của khách</b></p>
<p style="margin:0 0 18px;padding:12px 14px;background:#f3f5f7;border-radius:6px;white-space:pre-wrap">${p.note ? esc(p.note) : '(không có)'}</p>
<p style="margin:0;color:#5a636d">${tep}</p>
<p style="margin:14px 0 0;color:#5a636d;font-size:12.5px">Bấm Trả lời (Reply) để gửi thẳng cho khách tại ${esc(p.email)}. Xem và đánh dấu đã xử lý: <a href="${esc(linkAdmin)}">${esc(linkAdmin)}</a></p>
</div>`
}

/** Ghi một dòng vào bảng yeu_cau_bao_gia. Trả về lỗi dạng chữ, hoặc '' nếu xong. */
async function luuYeuCau(code: string, p: RfqPayload, items: RfqItem[], files: RfqFile[]): Promise<string> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!base || !key) return 'thiếu cấu hình Supabase'
  const res = await fetch(`${base}/rest/v1/yeu_cau_bao_gia`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({
      ma: code,
      loai: p.kind,
      ngon_ngu: p.lang,
      ten: p.name,
      cong_ty: p.company,
      dien_thoai: p.phone,
      email: p.email,
      ghi_chu: p.note,
      san_pham: items,
      tep: files,
    }),
    cache: 'no-store',
  })
  return res.ok ? '' : `${res.status} ${await res.text()}`
}

async function ghiKetQuaEmail(code: string, daGui: boolean, loi: string | null) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  // Chỉ service_role mới sửa được dòng đã ghi (anon chỉ được thêm). Không có thì thôi.
  if (!base || !key) return
  await fetch(`${base}/rest/v1/yeu_cau_bao_gia?ma=eq.${encodeURIComponent(code)}`, {
    method: 'PATCH',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ email_da_gui: daGui, email_loi: loi }),
    cache: 'no-store',
  }).catch(() => undefined)
}

export async function POST(request: Request) {
  let raw: Partial<RfqPayload>
  try {
    raw = await request.json()
  } catch {
    return fail('invalid', 400)
  }

  // Ô bẫy có chữ nghĩa là máy gửi rác. Trả "thành công" để nó không dò tiếp.
  if (text(raw.website, 200)) return NextResponse.json({ ok: true, code: makeCode() })

  const p: RfqPayload = {
    kind: raw.kind === 'find' ? 'find' : 'quote',
    lang: raw.lang === 'en' ? 'en' : 'vi',
    name: text(raw.name, 120),
    company: text(raw.company, 200),
    phone: text(raw.phone, 40),
    email: text(raw.email, 200),
    note: text(raw.note, 4000),
    items: [],
    files: [],
  }
  const items = cleanItems(raw.items)
  const files = cleanFiles(raw.files)
  if (files === null) return fail('file-count', 400)

  // Bốn trường bắt buộc theo BG05: tên, công ty, điện thoại, email.
  if (!p.name || !p.company || !p.phone || !EMAIL_RE.test(p.email)) return fail('invalid', 400)

  const code = makeCode()

  // 1. Lưu vào hộp thư trong trang quản trị.
  const loiLuu = await luuYeuCau(code, p, items, files)
  if (loiLuu) console.error('[rfq] Không lưu được yêu cầu:', loiLuu)

  // 2. Gửi email nếu đã bật Resend.
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    if (loiLuu) return fail('not-configured', 503)
    console.warn('[rfq] Chưa đặt RESEND_API_KEY — yêu cầu chỉ nằm ở /admin/bao-gia, không có email báo.')
    await ghiKetQuaEmail(code, false, 'Chưa bật gửi email (RESEND_API_KEY)')
    return NextResponse.json({ ok: true, code })
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  let attachments: { filename: string; content: string }[] = []
  if (files.length && base && serviceKey) {
    try {
      attachments = await Promise.all(files.map((f) => loadAttachment(base, serviceKey, f)))
    } catch (e) {
      // Tệp vẫn còn trong kho và xem được ở trang quản trị; email đi không kèm tệp.
      console.error('[rfq] Không đính kèm được tệp:', e)
      attachments = []
    }
  }

  const loai = p.kind === 'find' ? 'Yêu cầu tìm hàng' : 'Yêu cầu báo giá'
  const linkAdmin = `${new URL(request.url).origin}/admin/bao-gia/${code}`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [INBOX],
      reply_to: p.email,
      subject: `[${code}] ${loai} — ${p.company}`,
      html: buildHtml(code, p, items, files, attachments.length > 0, linkAdmin),
      attachments: attachments.length ? attachments : undefined,
    }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const chiTiet = await res.text()
    console.error('[rfq] Resend từ chối:', res.status, chiTiet)
    await ghiKetQuaEmail(code, false, `Resend ${res.status}: ${chiTiet.slice(0, 300)}`)
    // Đã lưu được thì khách vẫn coi là gửi xong; chỉ khi cả hai đều hỏng mới báo thất bại.
    return loiLuu ? fail('send-failed', 502) : NextResponse.json({ ok: true, code })
  }

  await ghiKetQuaEmail(code, true, null)
  return NextResponse.json({ ok: true, code })
}
