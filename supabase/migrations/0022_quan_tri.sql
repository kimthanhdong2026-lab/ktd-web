-- =============================================================================
-- Trang quản trị (CMS) — bước 1: trang chủ, phần chung, trang Thương hiệu
--
-- Người dùng chốt 05/11/2026: một tài khoản admin (email + mật khẩu, Supabase
-- Auth), lưu là lên web ngay và có Hoàn tác, EN trống thì web hiện tiếng Việt.
--
-- Hai bảng mới:
--   noi_dung          mỗi KHỐI trên web một dòng (khoa = 'trang-chu.dau-trang',
--                     'chung.chan-trang'…). du_lieu là JSON {vi, en, chung}:
--                     vi/en chỉ chứa những ô admin đã sửa, theo đúng cấu trúc
--                     từ điển lib/i18n; chung là ảnh, đường dẫn, số — thứ
--                     không phụ thuộc ngôn ngữ. Thiếu ô nào thì web dùng chữ
--                     mặc định trong mã, nên bảng rỗng cũng không sao.
--   noi_dung_lich_su  bản trước mỗi lần lưu, để nút Hoàn tác.
--
-- Quyền: khách (anon) chỉ đọc như trước. Người đã đăng nhập (authenticated —
-- chính là tài khoản admin) được ghi noi_dung, brands, categories, products và
-- kho file ktd. Web ghi bằng phiên đăng nhập của admin, KHÔNG dùng khóa
-- service role trên máy chủ.
--
-- Hai cột mới:
--   categories.image  ảnh ô danh mục ở trang chủ (đường dẫn trong kho). Trống
--                     thì web dùng ảnh có sẵn public/assets/categories/<slug>.webp.
--   brands.logo_goc   logo giữ đúng tỉ lệ gốc, cho trang hãng và thẻ ở trang
--                     Thương hiệu. Cột logo cũ là bản đã đóng khung 320×128
--                     cho dải logo trang chủ. Trống thì dùng public/assets/brands/.
--
-- Chạy lại bao nhiêu lần cũng được. PHẢI chạy trước khi đẩy bản mã có /admin.
-- =============================================================================

create table if not exists noi_dung (
  khoa        text primary key,
  du_lieu     jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

create table if not exists noi_dung_lich_su (
  id        bigserial primary key,
  khoa      text not null,
  du_lieu   jsonb not null,
  luu_luc   timestamptz not null default now()
);

create index if not exists noi_dung_lich_su_khoa_idx on noi_dung_lich_su (khoa, luu_luc desc);

alter table categories add column if not exists image    text;
alter table brands     add column if not exists logo_goc text;

comment on column categories.image  is 'Anh o danh muc trang chu, duong dan trong kho ktd. Trong -> public/assets/categories/<slug>.webp';
comment on column brands.logo_goc   is 'Logo ti le goc cho trang hang. Trong -> public/assets/brands/<slug>.webp';

-- -----------------------------------------------------------------------------
-- Quyền đọc công khai, ghi khi đã đăng nhập
-- -----------------------------------------------------------------------------
alter table noi_dung         enable row level security;
alter table noi_dung_lich_su enable row level security;

drop policy if exists "doc cong khai" on noi_dung;
drop policy if exists "doc cong khai" on noi_dung_lich_su;
create policy "doc cong khai" on noi_dung         for select using (true);
create policy "doc cong khai" on noi_dung_lich_su for select using (true);

drop policy if exists "admin ghi" on noi_dung;
drop policy if exists "admin ghi" on noi_dung_lich_su;
drop policy if exists "admin ghi" on brands;
drop policy if exists "admin ghi" on categories;
drop policy if exists "admin ghi" on products;
create policy "admin ghi" on noi_dung         for all to authenticated using (true) with check (true);
create policy "admin ghi" on noi_dung_lich_su for all to authenticated using (true) with check (true);
create policy "admin ghi" on brands           for all to authenticated using (true) with check (true);
create policy "admin ghi" on categories       for all to authenticated using (true) with check (true);
create policy "admin ghi" on products         for all to authenticated using (true) with check (true);

-- Kho file: admin tải ảnh lên bucket ktd (ảnh danh mục, lĩnh vực, logo, banner).
drop policy if exists "ktd admin them"  on storage.objects;
drop policy if exists "ktd admin sua"   on storage.objects;
drop policy if exists "ktd admin xoa"   on storage.objects;
create policy "ktd admin them" on storage.objects for insert to authenticated with check (bucket_id = 'ktd');
create policy "ktd admin sua"  on storage.objects for update to authenticated using (bucket_id = 'ktd') with check (bucket_id = 'ktd');
create policy "ktd admin xoa"  on storage.objects for delete to authenticated using (bucket_id = 'ktd');

-- Kiểm nhanh sau khi chạy — phải ra 2 bảng và 5 policy "admin ghi":
--   select table_name from information_schema.tables where table_name like 'noi_dung%';
--   select tablename from pg_policies where policyname = 'admin ghi';
