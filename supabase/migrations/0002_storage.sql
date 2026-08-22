-- =============================================================================
-- Kho file: ảnh sản phẩm, logo hãng, datasheet PDF
--
-- Một bucket công khai duy nhất, chia thư mục bên trong:
--   products/<ma-hang>/1.webp   ảnh sản phẩm, tối đa 5 ảnh
--   brands/<slug>.webp          logo hãng đã chuẩn hoá về khung 320x128
--   docs/<ma-hang>.pdf          datasheet của hãng
--
-- Bảng products lưu đường dẫn tương đối (products/145001-12/1.webp), KHÔNG lưu
-- URL đầy đủ. Sau này đổi bucket, đổi tên miền hay chuyển sang CDN khác thì chỉ
-- sửa một hằng số trong mã nguồn, không phải cập nhật nghìn bản ghi.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ktd',
  'ktd',
  true,
  10485760,  -- 10 MB mỗi file; ảnh đã nén chỉ khoảng 100 KB nên đây là mức chặn nhầm lẫn
  array['image/webp', 'image/jpeg', 'image/png', 'application/pdf']
)
on conflict (id) do update
set public             = excluded.public,
    file_size_limit    = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Ai cũng đọc được. Ghi thì chỉ service_role, và role đó bỏ qua RLS nên không
-- cần policy cho insert/update/delete — không có policy nghĩa là không ai khác
-- ghi được.
drop policy if exists "ktd doc cong khai" on storage.objects;

create policy "ktd doc cong khai"
  on storage.objects
  for select
  using (bucket_id = 'ktd');
