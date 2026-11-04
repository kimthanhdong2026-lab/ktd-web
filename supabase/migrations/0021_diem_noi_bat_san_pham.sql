-- =============================================================================
-- Mục "Điểm nổi bật" trên trang chi tiết sản phẩm
--
-- Team chốt ngày 05/11/2026: lô 1 (Martor) có mục "Điểm nổi bật", lấy từ cột
-- NỔI BẬT của file Excel (các gạch đầu dòng). Câu mô tả ngắn cho thẻ sản phẩm
-- và cho Google vẫn là desc_vi, do bên kỹ thuật viết riêng cho từng mã.
--
-- PHẢI chạy TRƯỚC khi đẩy bản mã đọc hai cột này: trang sản phẩm hỏi thẳng
-- tên cột, cột chưa có thì trang báo lỗi.
--
-- Chỉ thêm cột, không đụng dữ liệu cũ. Chạy lại bao nhiêu lần cũng được.
-- =============================================================================

alter table products add column if not exists highlights_vi text[] not null default '{}';
alter table products add column if not exists highlights_en text[];

comment on column products.highlights_vi is 'Diem noi bat — cac gach dau dong tu cot NOI BAT cua file Excel.';
comment on column products.highlights_en is 'Ban tieng Anh cua highlights_vi, cung so dong.';

-- Kiểm nhanh sau khi chạy — phải ra 2:
--   select count(*) from information_schema.columns
--   where table_name = 'products' and column_name like 'highlights_%';
