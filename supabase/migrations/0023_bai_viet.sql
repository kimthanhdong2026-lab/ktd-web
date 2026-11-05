-- =============================================================================
-- Bài viết (mục Tin tức & Kiến thức) — để admin tự đăng bài trong trang quản trị
--
-- Trước đây ba bài mẫu nằm cứng trong lib/ktd-data.ts. Bảng này thay thế; ba
-- bài mẫu được chép vào ngay dưới đây để web không mất gì. Chưa chạy file
-- này thì web vẫn dùng ba bài trong mã (lib/tin-tuc.ts tự lùi về).
--
--   cat       'kien-thuc' (Kiến thức kỹ thuật) hoặc 'tin-tuc' (Tin tức)
--   ngay      ngày đăng; web hiện dd/mm/yyyy và xếp mới nhất lên đầu
--   body_vi   thân bài, mỗi phần tử một đoạn; trống thì web hiện câu giữ chỗ
--   image     ảnh 16:9 trong kho ktd (site/tin-tuc/…); trống thì ô nền kẻ
--
-- Chạy lại bao nhiêu lần cũng được.
-- =============================================================================

create table if not exists bai_viet (
  slug        text primary key,
  cat         text not null default 'tin-tuc' check (cat in ('kien-thuc', 'tin-tuc')),
  ngay        date not null default current_date,
  title_vi    text not null,
  title_en    text,
  excerpt_vi  text not null default '',
  excerpt_en  text,
  body_vi     text[] not null default '{}',
  body_en     text[],
  image       text,
  visible     boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists bai_viet_ngay_idx on bai_viet (ngay desc) where visible;

alter table bai_viet enable row level security;
drop policy if exists "doc cong khai" on bai_viet;
drop policy if exists "admin ghi" on bai_viet;
create policy "doc cong khai" on bai_viet for select using (true);
create policy "admin ghi" on bai_viet for all to authenticated using (true) with check (true);

-- Ba bài mẫu đang có trên web (lib/ktd-data.ts NEWS). Đã có thì không đụng.
insert into bai_viet (slug, cat, ngay, title_vi, title_en, excerpt_vi, excerpt_en) values
  ('tungsten-carbide', 'kien-thuc', '2026-07-28',
   'Tungsten Carbide: vì sao mũi mài hợp kim bền hơn thép gió',
   'Tungsten carbide: why carbide burrs outlast high-speed steel',
   'Cấu trúc hạt cacbua vonfram và chất kết dính cobalt quyết định tuổi thọ và tốc độ bóc tách vật liệu.',
   'Tungsten carbide grain structure and the cobalt binder are what determine tool life and material removal rate.'),
  ('chon-dao-phay', 'kien-thuc', '2026-07-21',
   'Hướng dẫn chọn dao phay ngón theo vật liệu phôi',
   'Choosing an end mill to match the workpiece material',
   'Số me, lớp phủ và biên dạng — ba yếu tố cần cân nhắc khi phay nhôm, thép tôi hay composite.',
   'Flute count, coating and geometry — the three things to weigh up when milling aluminium, hardened steel or composites.'),
  ('mta-2025', 'tin-tuc', '2026-07-10',
   'Kim Thành Đông tại triển lãm MTA Vietnam 2025',
   'Kim Thanh Dong at MTA Vietnam 2025',
   'KTD giới thiệu danh mục dụng cụ an toàn Martor và pa lăng cân bằng Tecna tới khách hàng công nghiệp.',
   'KTD presented the Martor safety cutter range and Tecna load balancers to industrial customers.')
on conflict (slug) do nothing;

-- Kiểm nhanh sau khi chạy — phải ra 3:
--   select count(*) from bai_viet;
