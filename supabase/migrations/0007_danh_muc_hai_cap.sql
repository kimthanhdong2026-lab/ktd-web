-- =============================================================================
-- Danh mục hai cấp, cột ẩn/hiện, và nội dung trang thương hiệu
--
-- Gộp ba việc vào một file vì cả ba đều phải xong trước khi nạp dữ liệu mới,
-- và vì thêm cột lúc bảng còn 35 sản phẩm thì rẻ hơn lúc đã có 1000.
--
-- 1. DANH MỤC HAI CẤP
--    Trước: 15 nhóm phẳng, sản phẩm gắn thẳng vào nhóm.
--    Sau:   12 nhóm chính, mỗi nhóm có các nhóm nhỏ — tổng 41 nhóm nhỏ.
--           Sản phẩm gắn vào NHÓM NHỎ.
--    Quan hệ cha–con nằm ngay trong bảng categories qua cột parent_slug:
--    parent_slug IS NULL nghĩa là nhóm chính.
--
-- 2. ẨN THAY VÌ XOÁ
--    "Xoá có nghĩa là chọn ẩn để khách không còn thấy khi không còn phân phối"
--    — yêu cầu của Ban Giám đốc. Xoá thật sẽ mất lịch sử và làm hỏng các báo
--    giá đã gửi, nên cả ba bảng đều có cột visible.
--
--    Ẩn một hãng KHÔNG đi ẩn từng sản phẩm của hãng. Mỗi sản phẩm giữ cột
--    visible riêng, website tự lọc bỏ những gì thuộc hãng đang ẩn. Nhờ vậy khi
--    hiện hãng trở lại, các sản phẩm đã cố ý ẩn lẻ vẫn ẩn. Xem view
--    products_hien_thi ở cuối file.
--
-- 3. NỘI DUNG TRANG THƯƠNG HIỆU
--    19 trang, mỗi trang có banner, đoạn giới thiệu và ba danh sách gạch đầu
--    dòng. Không có sẵn cột thì màn hình quản trị sau này không sửa được.
--
-- Chạy được nhiều lần, không hỏng dữ liệu đã có.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Danh mục hai cấp
-- -----------------------------------------------------------------------------

alter table categories
  add column if not exists parent_slug text;

-- Khoá ngoại tự tham chiếu. on delete restrict để không ai xoá được một nhóm
-- chính khi dưới nó còn nhóm nhỏ — phải ẩn hoặc dọn con trước.
alter table categories
  drop constraint if exists categories_parent_fkey;

alter table categories
  add constraint categories_parent_fkey
  foreign key (parent_slug) references categories(slug)
  on update cascade on delete restrict;

comment on column categories.parent_slug is
  'NULL = nhom chinh. Co gia tri = nhom nho, tro toi slug cua nhom chinh.';

-- Chỉ cho sâu đúng hai cấp: cha của một nhóm phải là nhóm gốc.
-- Viết bằng trigger chứ không bằng CHECK vì CHECK không truy vấn được bảng khác.
create or replace function ktd_chan_ba_cap()
  returns trigger
  language plpgsql
as $ktd$
declare
  ong text;
begin
  if new.parent_slug is null then
    return new;
  end if;

  if new.parent_slug = new.slug then
    raise exception 'Nhom "%" khong the la cha cua chinh no.', new.slug;
  end if;

  select parent_slug into ong from categories where slug = new.parent_slug;
  if ong is not null then
    raise exception
      'Danh muc chi sau hai cap. Nhom "%" da la nhom nho cua "%", khong the lam cha.',
      new.parent_slug, ong;
  end if;

  return new;
end;
$ktd$;

drop trigger if exists categories_chan_ba_cap on categories;

create trigger categories_chan_ba_cap
  before insert or update of parent_slug on categories
  for each row execute function ktd_chan_ba_cap();

create index if not exists categories_parent_idx
  on categories (parent_slug, sort_order)
  where parent_slug is not null;

-- -----------------------------------------------------------------------------
-- 2. Ẩn thay vì xoá
-- -----------------------------------------------------------------------------

alter table brands     add column if not exists visible boolean not null default true;
alter table categories add column if not exists visible boolean not null default true;
alter table products   add column if not exists visible boolean not null default true;

comment on column brands.visible is
  'false = an khoi website, du lieu van con nguyen. Khong bao gio xoa that.';
comment on column categories.visible is
  'false = an khoi website, du lieu van con nguyen.';
comment on column products.visible is
  'false = an khoi website. An ca hang thi khong sua cot nay — xem products_hien_thi.';

-- Lọc theo visible là việc chạy ở gần như mọi truy vấn, nên dùng chỉ mục có
-- điều kiện: chỉ đánh chỉ mục những dòng đang ẩn, vì đó luôn là thiểu số.
create index if not exists brands_an_idx     on brands (slug)     where not visible;
create index if not exists categories_an_idx on categories (slug) where not visible;
create index if not exists products_an_idx   on products (id)     where not visible;

-- View gom đủ ba tầng ẩn. Website chỉ cần đọc view này là đúng, không phải nhớ
-- quy tắc "ẩn hãng thì sản phẩm cũng biến mất" ở từng chỗ gọi.
create or replace view products_hien_thi as
  select p.*
  from products p
  join brands b on b.slug = p.brand_slug
  join categories c on c.slug = p.category_slug
  -- Nhóm nhỏ bị ẩn, hoặc nhóm chính của nó bị ẩn, thì sản phẩm cũng biến mất.
  left join categories cc on cc.slug = c.parent_slug
  where p.visible
    and b.visible
    and c.visible
    and (cc.slug is null or cc.visible);

comment on view products_hien_thi is
  'San pham thuc su hien tren website: chinh no, hang, nhom nho va nhom chinh deu phai dang hien.';

-- -----------------------------------------------------------------------------
-- 3. Thứ tự sắp xếp do người vận hành kéo thả
-- -----------------------------------------------------------------------------
-- sort_order đã có sẵn từ 0001. Thêm chỉ mục để sắp xếp trong từng nhánh.
create index if not exists categories_thu_tu_idx
  on categories (coalesce(parent_slug, ''), sort_order, name_vi);

-- -----------------------------------------------------------------------------
-- 4. Nội dung trang thương hiệu
--
-- Cặp _vi/_en ngay từ đầu, kể cả khi chưa điền tiếng Anh — thêm cột vào bảng
-- 19 dòng thì dễ, thêm sau khi đã có nội dung thật thì tốn công và dễ sai.
-- -----------------------------------------------------------------------------

alter table brands add column if not exists website     text;  -- trang chính thức của hãng
alter table brands add column if not exists banner      text;  -- đường dẫn ảnh trong bucket
alter table brands add column if not exists intro_vi    text;
alter table brands add column if not exists intro_en    text;

-- Ba danh sách gạch đầu dòng của mỗi trang thương hiệu.
alter table brands add column if not exists dong_sp_vi  text[] not null default '{}';
alter table brands add column if not exists dong_sp_en  text[];
alter table brands add column if not exists noi_bat_vi  text[] not null default '{}';
alter table brands add column if not exists noi_bat_en  text[];
alter table brands add column if not exists ung_dung_vi text[] not null default '{}';
alter table brands add column if not exists ung_dung_en text[];

alter table brands add column if not exists en_status text not null default 'trống';

alter table brands drop constraint if exists brands_en_status_check;
alter table brands
  add constraint brands_en_status_check
  check (en_status in ('trống', 'từ hãng', 'máy dịch', 'đã duyệt'));

comment on column brands.dong_sp_vi  is 'Dong san pham KTD cung cap — 3 gach dau dong.';
comment on column brands.noi_bat_vi  is 'Diem noi bat — 3 gach dau dong.';
comment on column brands.ung_dung_vi is 'Ung dung tieu bieu — 3 gach dau dong.';

-- -----------------------------------------------------------------------------
-- 5. Phân quyền cho view
--
-- View không tự thừa kế RLS của bảng gốc theo cách người ta hay tưởng. Ở đây
-- view chỉ đọc và chỉ lọc bớt dòng, nên mở quyền select cho anon là đủ và an
-- toàn — đúng bằng những gì bảng products đã cho phép.
-- -----------------------------------------------------------------------------
alter view products_hien_thi set (security_invoker = on);

grant select on products_hien_thi to anon, authenticated;
