-- =============================================================================
-- Kim Thành Đông — lược đồ dữ liệu sản phẩm
-- Chạy được nhiều lần, không hỏng dữ liệu đã có.
--
-- Hai quyết định cần nhớ khi đọc file này:
--
-- 1. Mọi trường hiển thị cho khách đều có sẵn cặp _vi / _en ngay từ đầu, dù
--    hiện chỉ điền tiếng Việt. Thêm cột vào bảng rỗng thì dễ; thêm vào bảng
--    đã có nghìn bản ghi kèm dữ liệu thật thì tốn công và dễ sai.
--
-- 2. Cột slug được lưu chứ không suy ra từ tên lúc chạy. Khi đội vận hành sửa
--    tên sản phẩm, đường dẫn phải giữ nguyên — nếu không Google đang index
--    1000 trang sẽ mất hết.
-- =============================================================================

create extension if not exists unaccent;
create extension if not exists pg_trgm;

-- -----------------------------------------------------------------------------
-- Chuẩn hoá chuỗi để tìm kiếm không dấu
--
-- unaccent() gốc là STABLE nên Postgres không cho dùng trong generated column
-- hay index. Bọc lại thành IMMUTABLE bằng cách chỉ rõ tên từ điển.
-- Bỏ dấu xong vẫn phải xử lý riêng chữ đ: một số bản unaccent không đổi đ->d,
-- mà khách gõ "dao" để tìm "dao", gõ "dong" để tìm "Đông".
-- -----------------------------------------------------------------------------
create or replace function ktd_norm(input text)
  returns text
  language sql
  immutable
  strict
  parallel safe
as $ktd$
  select public.unaccent(
    'public.unaccent',
    translate(lower(input), 'đĐ', 'dd')
  )
$ktd$;

comment on function ktd_norm(text) is
  'Chuyen ve chu thuong, doi d gach ngang thanh d roi bo dau. Dung cho moi cot tim kiem.';

-- -----------------------------------------------------------------------------
-- Tự cập nhật updated_at
-- -----------------------------------------------------------------------------
create or replace function ktd_touch_updated_at()
  returns trigger
  language plpgsql
as $ktd$
begin
  new.updated_at := now();
  return new;
end;
$ktd$;

-- -----------------------------------------------------------------------------
-- Thương hiệu
-- -----------------------------------------------------------------------------
create table if not exists brands (
  slug        text primary key,
  name        text not null,
  origin_vi   text not null,
  origin_en   text,
  desc_vi     text not null default '',
  desc_en     text,
  logo        text,                              -- đường dẫn trong bucket; rỗng thì trang hiện tên chữ
  sort_order  integer not null default 999,      -- thứ tự ưu tiên hiện ở trang chủ
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Danh mục
-- -----------------------------------------------------------------------------
create table if not exists categories (
  slug        text primary key,
  name_vi     text not null,
  name_en     text,
  sub_vi      text not null default '',          -- dòng chữ nhỏ dưới tên nhóm
  sub_en      text,
  featured    boolean not null default false,    -- có nằm trong bộ lọc rút gọn và cột footer không
  sort_order  integer not null default 999,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Sản phẩm
-- -----------------------------------------------------------------------------
create table if not exists products (
  id              uuid primary key default gen_random_uuid(),
  part            text not null unique,          -- mã hàng; khoá nghiệp vụ khi nhập lại từ Excel
  slug            text not null unique,          -- đường dẫn, lưu cứng để không đổi theo tên
  brand_slug      text not null references brands(slug)     on update cascade on delete restrict,
  category_slug   text not null references categories(slug) on update cascade on delete restrict,

  name_vi         text not null,
  name_en         text,
  sub_vi          text,                          -- nhóm con, hiện ở breadcrumb trang chi tiết
  sub_en          text,
  series          text,
  origin_vi       text,
  origin_en       text,

  desc_vi         text not null default '',      -- mô tả ngắn, hiện trên thẻ sản phẩm
  desc_en         text,
  desc_full_vi    text[] not null default '{}',  -- mô tả đầy đủ, mỗi phần tử là một đoạn
  desc_full_en    text[],
  applications_vi text[] not null default '{}',
  applications_en text[],

  -- [{"label": "...", "value": "..."}] — dùng mảng để giữ đúng thứ tự hãng công bố
  specs_vi        jsonb not null default '[]'::jsonb,
  specs_en        jsonb,

  images          text[] not null default '{}',  -- đường dẫn trong bucket, KHÔNG lưu URL đầy đủ
  doc_pdf         text,                          -- datasheet trong bucket
  doc_url         text,                          -- trang sản phẩm trên web của hãng
  catalog         jsonb,                         -- {name, size, pages} khi chỉ có catalog chung

  keywords        text[] not null default '{}',  -- gồm cả tên dân dã ngoài xưởng, không cần dấu
  featured        boolean not null default false,-- lên khối "Sản phẩm được quan tâm" ở trang chủ
  tag             text check (tag in ('Mới', 'Bán chạy')),
  priority        integer,                       -- thứ tự mặc định trang Sản phẩm; nhỏ hiện trước

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- Cột tìm kiếm dựng sẵn: gộp mọi thứ khách có thể gõ rồi chuẩn hoá một lần.
  -- Postgres tự tính lại mỗi khi bản ghi đổi nên không bao giờ lệch với dữ liệu.
  search_vi text generated always as (
    ktd_norm(
      coalesce(name_vi, '')  || ' ' ||
      coalesce(part, '')     || ' ' ||
      coalesce(series, '')   || ' ' ||
      coalesce(sub_vi, '')   || ' ' ||
      coalesce(desc_vi, '')  || ' ' ||
      array_to_string(coalesce(keywords, '{}'), ' ')
    )
  ) stored
);

-- -----------------------------------------------------------------------------
-- Chỉ mục
-- -----------------------------------------------------------------------------

-- Tìm gần đúng, chịu được gõ sai vài ký tự — thay cho Levenshtein đang chạy ở
-- trình duyệt. GIN + trigram phục vụ được cả ILIKE '%...%' lẫn similarity().
create index if not exists products_search_vi_trgm
  on products using gin (search_vi gin_trgm_ops);

-- Lọc theo hãng và theo nhóm là hai thao tác phổ biến nhất ở trang Sản phẩm.
create index if not exists products_brand_idx    on products (brand_slug);
create index if not exists products_category_idx on products (category_slug);

-- Sắp xếp mặc định: ưu tiên nhỏ hiện trước, chưa điền thì xuống cuối.
create index if not exists products_priority_idx on products (priority nulls last, name_vi);

-- Khối "Sản phẩm được quan tâm" chỉ lấy vài bản ghi nên dùng chỉ mục có điều kiện.
create index if not exists products_featured_idx on products (featured) where featured;

-- -----------------------------------------------------------------------------
-- Trigger updated_at
-- -----------------------------------------------------------------------------
drop trigger if exists brands_touch     on brands;
drop trigger if exists categories_touch on categories;
drop trigger if exists products_touch   on products;

create trigger brands_touch
  before update on brands
  for each row execute function ktd_touch_updated_at();

create trigger categories_touch
  before update on categories
  for each row execute function ktd_touch_updated_at();

create trigger products_touch
  before update on products
  for each row execute function ktd_touch_updated_at();

-- -----------------------------------------------------------------------------
-- Phân quyền
--
-- Website chỉ đọc, và đọc bằng anon key — key này nằm công khai trong mã
-- nguồn gửi xuống trình duyệt, ai xem cũng thấy. Vì vậy phải bật RLS và chỉ
-- mở đúng quyền SELECT.
--
-- Mọi thao tác ghi đi qua service_role key (key này bỏ qua RLS), chỉ dùng
-- trong script nhập liệu chạy trên máy. TUYỆT ĐỐI không đặt service_role vào
-- biến môi trường có tiền tố NEXT_PUBLIC_ — làm vậy là công khai quyền ghi
-- toàn bộ cơ sở dữ liệu cho bất kỳ ai mở trang.
-- -----------------------------------------------------------------------------
alter table brands     enable row level security;
alter table categories enable row level security;
alter table products   enable row level security;

drop policy if exists "doc cong khai" on brands;
drop policy if exists "doc cong khai" on categories;
drop policy if exists "doc cong khai" on products;

create policy "doc cong khai" on brands     for select using (true);
create policy "doc cong khai" on categories for select using (true);
create policy "doc cong khai" on products   for select using (true);
