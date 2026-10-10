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
 * Nhận yêu cầu báo giá / yêu cầu tìm hàng và gửi email cho KTD.
 *
 * Trước đợt "Sửa web 5" form chỉ hiện màn hình "đã gửi" mà không gửi đi đâu.
 * Từ nay khách chỉ thấy "đã gửi" khi Resend xác nhận đã nhận thư; mọi trường
 * hợp khác form báo thất bại kèm số điện thoại để khách không bị bỏ rơi.
 *
 * Biến môi trường (đặt ở Vercel, KHÔNG có tiền tố NEXT_PUBLIC_):
 *   RESEND_API_KEY              khoá của tài khoản Resend
 *   RFQ_INBOX                   hộp thư nhận, mặc định sales@kimthanhdong.com
 *   RFQ_FROM                    địa chỉ gửi, phải thuộc tên miền đã xác minh ở Resend
 *   SUPABASE_SERVICE_ROLE_KEY   để đọc tệp đính kèm từ bucket riêng tư
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

/** Chỉ nhận đúng dạng đường dẫn mà /api/rfq/upload cấp ra. */
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

function buildHtml(code: string, p: RfqPayload, items: RfqItem[], files: RfqFile[]) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 14px 6px 0;color:#5a636d;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#111418"><b>${esc(value)}</b></td></tr>`

  const itemRows = items
    .map(
      (it, i) =>
        `<tr><td style="padding:7px 10px;border:1px solid #d4d9de">${i + 1}</td><td style="padding:7px 10px;border:1px solid #d4d9de">${esc(it.name || it.part)}</td><td style="padding:7px 10px;border:1px solid #d4d9de;font-family:Consolas,monospace">${esc(it.part)}</td><td style="padding:7px 10px;border:1px solid #d4d9de">${esc(it.brand || '')}</td><td style="padding:7px 10px;border:1px solid #d4d9de;text-align:right"><b>${it.qty}</b></td></tr>`
    )
    .join('')

  const loai = p.kind === 'find' ? 'Yêu cầu tìm hàng' : 'Yêu cầu báo giá'

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
<p style="margin:0;color:#5a636d">${files.length ? `Tệp đính kèm: ${files.map((f) => esc(f.name)).join(', ')}` : 'Không có tệp đính kèm.'}</p>
<p style="margin:14px 0 0;color:#5a636d;font-size:12.5px">Bấm Trả lời (Reply) để gửi thẳng cho khách tại ${esc(p.email)}.</p>
</div>`
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

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.error('[rfq] Thiếu RESEND_API_KEY — yêu cầu của khách KHÔNG được gửi đi.')
    return fail('not-configured', 503)
  }

  let attachments: { filename: string; content: string }[] = []
  if (files.length) {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!base || !key) return fail('not-configured', 503)
    try {
      attachments = await Promise.all(files.map((f) => loadAttachment(base, key, f)))
    } catch (e) {
      console.error('[rfq]', e)
      return fail('upload-failed', 502)
    }
  }

  const code = makeCode()
  const loai = p.kind === 'find' ? 'Yêu cầu tìm hàng' : 'Yêu cầu báo giá'

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [INBOX],
      reply_to: p.email,
      subject: `[${code}] ${loai} — ${p.company}`,
      html: buildHtml(code, p, items, files),
      attachments: attachments.length ? attachments : undefined,
    }),
    cache: 'no-store',
  })

  if (!res.ok) {
    console.error('[rfq] Resend từ chối:', res.status, await res.text())
    return fail('send-failed', 502)
  }

  return NextResponse.json({ ok: true, code })
}
