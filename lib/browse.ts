/**
 * Hằng số cho trang Sản phẩm, dùng chung giữa máy chủ và trình duyệt.
 *
 * Phải nằm ở file riêng, KHÔNG để trong ProductBrowser.tsx: file đó đánh dấu
 * 'use client', và khi component máy chủ nhập hằng số từ một file client thì
 * Next thay bằng tham chiếu chứ không đưa giá trị thật — hằng số thành
 * undefined mà không hề báo lỗi.
 */

/** Số sản phẩm mỗi lần tải. */
export const PAGE_SIZE = 24

/** Quá mức này thì nên lọc chứ không nên tải thêm. */
export const MAX_SHOW = 240
