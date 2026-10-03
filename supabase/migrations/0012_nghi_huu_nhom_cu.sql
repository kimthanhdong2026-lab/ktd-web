-- =============================================================================
-- Nghỉ hưu ba nhóm cũ, và chốt lại trạng thái hiện của danh mục
--
-- Ba nhóm dưới đây thuộc cấu trúc 15 nhóm phẳng cũ. Nội dung của chúng đã gộp
-- vào nhóm khác nên không còn sản phẩm nào trỏ tới, nhưng bản ghi vẫn nằm đó và
-- vẫn hiện trong bộ lọc dưới dạng nhóm chính rỗng.
--
-- Ẩn chứ không xoá: đường dẫn cũ còn trong lịch sử trình duyệt của khách và có
-- thể còn trong chỉ mục Google. Giữ bản ghi thì sau này khai báo chuyển hướng
-- vẫn tra được tên nhóm.
--
--   composite        -> đã gộp vào cat-got-cnc
--   nang-ha          -> đã gộp vào siet-cong-nghiep
--   siet-luc-cam-tay -> đã gộp vào siet-cong-nghiep
-- =============================================================================

update categories
set visible = false
where slug in ('composite', 'nang-ha', 'siet-luc-cam-tay');

-- -----------------------------------------------------------------------------
-- Bật hiện toàn bộ danh mục của cấu trúc mới
--
-- VÌ SAO CẦN CÂU NÀY: bản đầu của 0008 nạp danh mục ở trạng thái ẩn. Khi 0010
-- gắn 35 sản phẩm vào các nhóm nhỏ đang ẩn, hàm lọc của 0011 loại sạch chúng
-- và trang Sản phẩm trên bản thật hiện 0 sản phẩm trong vài phút ngày
-- 03/10/2026. 0008 nay đã sửa để nạp ở trạng thái hiện; câu dưới đây dành cho
-- những cơ sở dữ liệu đã lỡ chạy bản cũ.
--
-- Chỉ đụng tới các nhóm của cấu trúc mới, không bật lại ba nhóm vừa nghỉ hưu
-- ở trên.
-- -----------------------------------------------------------------------------
update categories
set visible = true
where (parent_slug is not null or slug in (
        'an-toan', 'cat-got-cnc', 'mai-hoan-thien', 'vat-mep', 've-sinh-khuon',
        'do-can-chinh', 'kep-khuon-phoi', 'siet-cong-nghiep', 'danh-dau',
        'do-kiem-may-han', 'phuc-hoi-be-mat', 'khop-noi'
      ))
  and not visible;

-- -----------------------------------------------------------------------------
-- Chốt bất biến: không sản phẩm đang hiện nào được trỏ vào danh mục đang ẩn
--
-- Đây chính là điều kiện bị vi phạm hôm sập trang. Không ép được bằng ràng buộc
-- FOREIGN KEY vì nó nói về giá trị của cột ở bảng khác, nên dùng trigger.
--
-- Trigger chặn ngay lúc GHI, nên không bao giờ tạo ra được trạng thái mà sản
-- phẩm còn hiện nhưng danh mục của nó đã ẩn.
-- -----------------------------------------------------------------------------
create or replace function ktd_chan_san_pham_lac()
  returns trigger
  language plpgsql
as $ktd$
declare
  nhom_an text;
begin
  select c.slug into nhom_an
  from categories c
  where c.slug = new.category_slug
    and new.visible
    and not c.visible;

  if nhom_an is not null then
    raise exception
      'San pham "%" dang hien nhung nhom "%" cua no dang an. An san pham truoc, hoac hien nhom len.',
      new.part, nhom_an;
  end if;

  return new;
end;
$ktd$;

drop trigger if exists products_chan_lac on products;

create trigger products_chan_lac
  before insert or update of category_slug, visible on products
  for each row execute function ktd_chan_san_pham_lac();

-- Kiểm nhanh sau khi chạy:
--   select count(*) from products_hien_thi;   -- phải ra 35
--   select count(*) from categories where visible and parent_slug is null;  -- phải ra 12
