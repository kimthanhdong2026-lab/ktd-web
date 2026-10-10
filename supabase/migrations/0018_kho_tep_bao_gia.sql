-- =============================================================================
-- Kho tệp đính kèm của form báo giá — mục BG04 của "Sửa web 5"
--
-- Khách được đính tối đa 5 tệp, mỗi tệp 3 MB (Word, Excel, PDF, ảnh) khi gửi
-- yêu cầu báo giá hoặc yêu cầu tìm hàng.
--
-- VÌ SAO CẦN MỘT BUCKET RIÊNG
--   Bucket "ktd" là công khai: ai có đường dẫn cũng đọc được. Bản vẽ, bảng kê
--   vật tư, ảnh chụp trong xưởng của khách thì không được như thế.
--   Bucket "rfq" là RIÊNG TƯ và không có policy nào: chỉ service_role đọc ghi
--   được. Trình duyệt của khách ghi vào bằng đường dẫn ký dùng một lần do
--   /api/rfq/upload cấp; /api/rfq đọc ra để đính vào email gửi KTD.
--
-- Giới hạn dung lượng và kiểu tệp đặt ngay ở bucket, nên kể cả khi có người
-- sửa mã phía trình duyệt thì Supabase vẫn từ chối.
--
-- Chạy được nhiều lần, không hỏng dữ liệu đã có.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'rfq',
  'rfq',
  false,
  3145728,  -- 3 MB mỗi tệp
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id) do update
set public             = excluded.public,
    file_size_limit    = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Cố ý KHÔNG tạo policy nào cho bucket này: không có policy nghĩa là anon và
-- authenticated không đọc, không liệt kê, không ghi trực tiếp được.

-- Kiểm nhanh sau khi chạy:
--   select id, public, file_size_limit from storage.buckets where id = 'rfq';
-- Phải ra một dòng: rfq | false | 3145728
