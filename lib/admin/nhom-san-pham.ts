/**
 * Bốn nhóm ô của bảng sửa sản phẩm — cũng là bốn khung trên màn hình quản trị.
 * Để ở file thuần (không 'use client') vì cả trang máy chủ lẫn bảng sửa đều dùng.
 */
export const NHOM_SAN_PHAM = [
  { id: 'sp.anh', so: 1, ten: 'Ảnh sản phẩm', moTa: 'Tối đa 5 ảnh; ảnh đầu là ảnh đại diện trên thẻ.' },
  { id: 'sp.dau', so: 2, ten: 'Thông tin chính', moTa: 'Tên, hãng, nhóm, xuất xứ, câu mô tả ngắn, điểm nổi bật.' },
  { id: 'sp.tab', so: 3, ten: 'Mô tả · Thông số · Ứng dụng · Tài liệu', moTa: 'Nội dung bốn tab bên dưới.' },
  { id: 'sp.hien', so: 4, ten: 'Hiển thị & tìm kiếm', moTa: 'Ẩn/hiện, thứ tự ưu tiên, nhãn, từ khóa, trạng thái tiếng Anh.' },
] as const

export type MaNhomSanPham = (typeof NHOM_SAN_PHAM)[number]['id']
