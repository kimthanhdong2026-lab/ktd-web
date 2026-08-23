-- =============================================================================
-- Trạng thái bản tiếng Anh của từng sản phẩm
--
-- Website sẽ có hai nguồn tiếng Anh khác hẳn nhau về thẩm quyền:
--
--   từ hãng   Văn bản do chính nhà sản xuất viết, tách ra từ mô tả gốc. Đây là
--             bản chuẩn nhất, script dịch tự động KHÔNG được đụng vào.
--   máy dịch  Bản do máy dịch, chờ người rà lại.
--   đã duyệt  Người đã đọc và xác nhận.
--   trống     Chưa có gì; trang tiếng Anh tạm hiện tiếng Việt.
--
-- Không có cột này thì vài tháng sau không ai biết dòng nào đã được người xem
-- qua, và không ai dám chạy lại script dịch vì sợ đè lên bản đã duyệt.
-- =============================================================================

alter table products
  add column if not exists en_status text not null default 'trống';

alter table products
  drop constraint if exists products_en_status_check;

alter table products
  add constraint products_en_status_check
  check (en_status in ('trống', 'từ hãng', 'máy dịch', 'đã duyệt'));

comment on column products.en_status is
  'trong | tu hang | may dich | da duyet — xem 0006_en_status.sql';

-- Chỉ mục có điều kiện: việc cần tra là "còn dòng nào chưa duyệt", chứ không
-- bao giờ cần liệt kê những dòng đã xong.
create index if not exists products_en_status_idx
  on products (en_status)
  where en_status <> 'đã duyệt';
