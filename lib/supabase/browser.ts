'use client'

/**
 * Supabase trong trình duyệt, dùng cùng phiên đăng nhập (cookie) với máy chủ.
 *
 * Chỉ dùng để TẢI FILE THẲNG lên kho: Vercel chặn thân yêu cầu quá 4,5 MB nên
 * datasheet PDF và ảnh gốc của hãng không đi qua Server Action được; gửi thẳng
 * từ trình duyệt lên Supabase thì được tới 50 MB. Mọi việc ghi dữ liệu khác
 * vẫn đi qua Server Action.
 */
import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | undefined

export function supabaseBrowser() {
  client ??= createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  )
  return client
}

export type KetQuaTai = { ok: true; duong: string } | { ok: false; loi: string }

/** Tải một file lên bucket ktd tại đường dẫn cho trước (ghi đè nếu có). */
export async function taiLenKho(file: File, duong: string): Promise<KetQuaTai> {
  const { error } = await supabaseBrowser()
    .storage.from('ktd')
    .upload(duong, file, { upsert: true, contentType: file.type || undefined, cacheControl: '3600' })
  if (error) return { ok: false, loi: error.message }
  return { ok: true, duong }
}

/** Tên file tạm, duy nhất, giữ đuôi gốc. */
export const tenTam = (file: File) =>
  `tam/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}.${(file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '')}`
