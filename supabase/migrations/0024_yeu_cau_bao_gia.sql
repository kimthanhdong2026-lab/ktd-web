-- =============================================================================
-- Hộp thư yêu cầu báo giá trong trang quản trị
--
-- Trước đây form "Báo giá" / "Tìm hàng" chỉ gửi một email qua Resend; web
-- không lưu gì. Chưa có tài khoản Resend thì khách thấy "chưa gửi được".
-- Từ nay mỗi yêu cầu được LƯU vào bảng này trước, rồi mới gửi email (nếu đã
-- bật). Admin xem, đánh dấu đã xử lý và tải tệp đính kèm ở /admin/bao-gia.
--
--   ma            mã yêu cầu khách thấy trên màn hình, ví dụ RFQ-261106-4821
--   loai          'quote' (báo giá) hoặc 'find' (tìm hàng)
--   san_pham      [{part, name, brand, qty}]  — danh sách khách chọn trên web
--   tep           [{path, name}]  — tệp trong bucket riêng tư "rfq"
--   email_da_gui  đã gửi được email về hộp thư công ty chưa
--   trang_thai    'moi' hoặc 'da-xu-ly' — admin bấm trong trang quản trị
--
-- Chạy lại bao nhiêu lần cũng được.
-- =============================================================================

create table if not exists yeu_cau_bao_gia (
  ma             text primary key check (length(ma) <= 40),
  tao_luc        timestamptz not null default now(),
  loai           text not null default 'quote' check (loai in ('quote', 'find')),
  ngon_ngu       text not null default 'vi' check (ngon_ngu in ('vi', 'en')),
  ten            text not null check (length(ten) <= 120),
  cong_ty        text not null check (length(cong_ty) <= 200),
  dien_thoai     text not null check (length(dien_thoai) <= 40),
  email          text not null check (length(email) <= 200),
  ghi_chu        text not null default '' check (length(ghi_chu) <= 4000),
  san_pham       jsonb not null default '[]'::jsonb,
  tep            jsonb not null default '[]'::jsonb,
  email_da_gui   boolean not null default false,
  email_loi      text,
  trang_thai     text not null default 'moi' check (trang_thai in ('moi', 'da-xu-ly')),
  ghi_chu_noi_bo text not null default '',
  xu_ly_luc      timestamptz
);

create index if not exists yeu_cau_bao_gia_tao_luc_idx on yeu_cau_bao_gia (tao_luc desc);

alter table yeu_cau_bao_gia enable row level security;

-- Khách (chưa đăng nhập) chỉ được THÊM một dòng qua /api/rfq; không đọc, không sửa.
drop policy if exists "khach gui" on yeu_cau_bao_gia;
create policy "khach gui" on yeu_cau_bao_gia for insert to anon with check (true);

-- Admin (đã đăng nhập) xem, đánh dấu, xóa.
drop policy if exists "admin xu ly" on yeu_cau_bao_gia;
create policy "admin xu ly" on yeu_cau_bao_gia for all to authenticated using (true) with check (true);

-- Bucket riêng tư "rfq" (migration 0018): trước đây chỉ service_role đọc ghi.
-- Giờ trình duyệt của khách ghi thẳng một tệp vào thư mục "yyyy-mm/" với tên
-- do máy đặt; admin đã đăng nhập đọc và xóa. Vẫn không ai liệt kê hay đọc
-- được khi chưa đăng nhập. Giới hạn 3 MB và kiểu tệp vẫn do bucket chặn.
drop policy if exists "rfq khach gui"  on storage.objects;
drop policy if exists "rfq admin doc"  on storage.objects;
drop policy if exists "rfq admin xoa"  on storage.objects;
create policy "rfq khach gui" on storage.objects for insert to anon
  with check (bucket_id = 'rfq' and name ~ '^\d{4}-\d{2}/[0-9a-f-]{36}\.[a-z0-9]{2,5}$');
create policy "rfq admin doc" on storage.objects for select to authenticated using (bucket_id = 'rfq');
create policy "rfq admin xoa" on storage.objects for delete to authenticated using (bucket_id = 'rfq');

-- Kiểm nhanh sau khi chạy — phải ra 0 (bảng trống, chưa có yêu cầu nào):
--   select count(*) from yeu_cau_bao_gia;
