/**
 * Tra mã nước ISO từ tên nước xuất xứ, để lấy đúng lá cờ.
 *
 * Xuất xứ trong cơ sở dữ liệu là chữ do người nhập gõ ("Đức", "Germany"), không
 * phải mã nước, nên phải có bảng tra. Bảng nhận cả tên tiếng Việt lẫn tiếng Anh
 * vì cùng một hãng hiện ra hai tên khác nhau tuỳ trang đang xem.
 *
 * VÌ SAO KHÔNG DÙNG EMOJI CỜ: Windows không kèm glyph cờ. Trình duyệt gặp emoji
 * cờ Đức sẽ hiện ra hai chữ "DE" — mà phần lớn khách của KTĐ dùng Windows. Nên
 * cờ phải là file ảnh thật trong public/assets/co/.
 */

/** Tên nước (đã bỏ dấu cách thừa, đã về chữ thường) → mã ISO 3166-1 alpha-2. */
const MA_NUOC: Record<string, string> = {
  // Đức
  'đức': 'de',
  'germany': 'de',
  // Hoa Kỳ
  'hoa kỳ': 'us',
  'mỹ': 'us',
  'usa': 'us',
  'united states': 'us',
  // Ý
  'ý': 'it',
  'italy': 'it',
  // Ireland
  'ireland': 'ie',
  'ai-len': 'ie',
  // Anh
  'anh': 'gb',
  'vương quốc anh': 'gb',
  'united kingdom': 'gb',
  'uk': 'gb',
  // Hà Lan
  'hà lan': 'nl',
  'netherlands': 'nl',
  // Pháp
  'pháp': 'fr',
  'france': 'fr',
  // Thổ Nhĩ Kỳ
  'thổ nhĩ kỳ': 'tr',
  'turkey': 'tr',
  'türkiye': 'tr',
  // Thụy Điển
  'thụy điển': 'se',
  'sweden': 'se',
  // Đài Loan
  'đài loan': 'tw',
  'taiwan': 'tw',
}

/**
 * Trả về mã nước, hoặc null nếu không tra được.
 *
 * Trả null chứ không trả cờ mặc định: một lá cờ sai nước còn tệ hơn là không có
 * cờ nào. Gọi xong thì nhớ xử lý trường hợp null.
 */
export function maQuocKy(tenNuoc: string | null | undefined): string | null {
  if (!tenNuoc) return null
  return MA_NUOC[tenNuoc.trim().toLowerCase()] ?? null
}
