import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { RFQ_BUCKET, RFQ_FILE_TYPES, RFQ_MAX_FILE_BYTES, fileExt, type RfqError } from '@/lib/rfq'

/**
 * Cấp đường dẫn tải lên dùng một lần cho một tệp đính kèm.
 *
 * Tệp KHÔNG đi qua hàm này. Vercel chặn mọi yêu cầu lớn hơn 4,5 MB, mà khách
 * được đính tới 5 tệp × 3 MB, nên trình duyệt đẩy thẳng từng tệp lên Supabase
 * Storage bằng đường dẫn đã ký ở đây. /api/rfq sau đó chỉ nhận đường dẫn.
 *
 * Bucket là riêng tư: đường dẫn ký chỉ cho GHI đúng một tệp, không cho đọc.
 * Giới hạn dung lượng và kiểu tệp còn được chính bucket chặn thêm một lần
 * (migration 0018), nên sửa mã phía trình duyệt cũng không lách được.
 */

export const runtime = 'nodejs'

const fail = (error: RfqError, status: number) => NextResponse.json({ ok: false, error }, { status })

export async function POST(request: Request) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!base || !key) return fail('not-configured', 503)

  let body: { name?: unknown; size?: unknown }
  try {
    body = await request.json()
  } catch {
    return fail('invalid', 400)
  }

  const name = typeof body.name === 'string' ? body.name.slice(0, 200) : ''
  const size = typeof body.size === 'number' ? body.size : -1
  const ext = fileExt(name)
  if (!name || !RFQ_FILE_TYPES[ext]) return fail('file-type', 400)
  if (size <= 0 || size > RFQ_MAX_FILE_BYTES) return fail('file-size', 400)

  // Tên trong kho do máy đặt. Tên khách đặt có thể chứa dấu, khoảng trắng hay
  // "../" — giữ nó trong email là đủ, không cần đưa vào đường dẫn.
  const d = new Date()
  const path = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}/${randomUUID()}.${ext}`

  const res = await fetch(`${base}/storage/v1/object/upload/sign/${RFQ_BUCKET}/${path}`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: '{}',
    cache: 'no-store',
  })
  if (!res.ok) {
    console.error('[rfq/upload] Supabase từ chối ký:', res.status, await res.text())
    return fail('upload-failed', 502)
  }

  const signed = (await res.json()) as { url?: string }
  if (!signed.url) return fail('upload-failed', 502)

  return NextResponse.json({
    ok: true,
    path,
    uploadUrl: `${base}/storage/v1${signed.url}`,
    contentType: RFQ_FILE_TYPES[ext],
  })
}
