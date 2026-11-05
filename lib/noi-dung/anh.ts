/**
 * URL ảnh từ đường dẫn lưu trong nội dung — chạy được cả ở trình duyệt (form
 * admin hiện ảnh xem trước) lẫn máy chủ.
 *   '/sectors/1.webp'          -> file trong public/, giữ nguyên
 *   'site/linh-vuc/abc.webp'   -> kho Supabase, bucket ktd
 */
export const urlAnh = (p: string | null | undefined): string | undefined =>
  !p ? undefined
  : p.startsWith('/') || p.startsWith('http') ? p
  : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ktd/${p.replace(/^\/+/, '')}`
