# Supabase — hướng dẫn dựng

Thư mục này chứa toàn bộ lược đồ cơ sở dữ liệu. Chạy bốn file theo đúng thứ tự
số là có một cơ sở dữ liệu sẵn sàng, đã nạp 19 thương hiệu, 15 danh mục và 35
sản phẩm hiện có.

## Anh cần làm gì

### 1. Tạo dự án

Vào [supabase.com](https://supabase.com) → **New project**.

| Mục | Chọn |
|---|---|
| Region | **Southeast Asia (Singapore)** — gần Việt Nam nhất, giảm độ trễ |
| Database password | Đặt mật khẩu mạnh và **lưu lại ngay**, Supabase không cho xem lại |
| Plan | Free là đủ cho giai đoạn này |

> Dự án cũ (`pdqymtuealxwwsrkpbid`, tạo 12/08) đã không còn tồn tại — tên miền
> không phân giải được nữa. Khoá trong `.env.local` là khoá của dự án đó, bỏ đi.

### 2. Chạy bốn file SQL

Vào **SQL Editor** → **New query**, dán từng file rồi bấm Run, theo thứ tự:

| File | Làm gì |
|---|---|
| `0001_schema.sql` | Bảng, chỉ mục, quyền đọc công khai |
| `0002_storage.sql` | Kho file `ktd` cho ảnh, logo, PDF |
| `0003_search.sql` | Hàm tìm kiếm chịu được gõ sai |
| `0004_seed.sql` | Nạp dữ liệu hiện có |

Mỗi file chạy lại nhiều lần đều an toàn, không tạo bản ghi trùng.

### 3. Gửi em ba thông tin

Vào **Project Settings → API**:

| Tên | Lấy ở đâu | Dùng làm gì |
|---|---|---|
| Project URL | Mục *Project URL* | Địa chỉ cơ sở dữ liệu |
| `anon` key | Mục *Project API keys* | Website đọc dữ liệu |
| `service_role` key | Cùng mục, bấm *Reveal* | Script nhập liệu ghi dữ liệu |

> **`service_role` là khoá toàn quyền.** Ai có nó đều xoá sạch được cơ sở dữ
> liệu. Chỉ đặt trong `.env.local` trên máy, không bao giờ commit, và **không
> bao giờ đặt tên biến bắt đầu bằng `NEXT_PUBLIC_`** — tiền tố đó khiến Next.js
> nhúng thẳng giá trị vào mã nguồn gửi xuống trình duyệt.

## Ghi chú kỹ thuật

**Cột song ngữ có sẵn từ đầu.** Mọi trường hiển thị cho khách đều có cặp
`_vi` / `_en`, hiện chỉ điền tiếng Việt. Thêm cột vào bảng rỗng thì dễ; thêm
vào bảng đã có nghìn bản ghi thật thì tốn công và dễ sai.

**`slug` được lưu, không suy ra từ tên.** Đội vận hành sửa tên sản phẩm thì
đường dẫn vẫn giữ nguyên — nếu không, Google đang index 1000 trang sẽ mất hết.

**Đường dẫn ảnh là tương đối** (`products/martor/secumax-145-1.webp`), không lưu
URL đầy đủ. Sau này đổi bucket hay chuyển CDN chỉ sửa một hằng số trong mã
nguồn, không phải cập nhật nghìn bản ghi.

**Tìm kiếm không dấu** dựa trên cột `search_vi` do Postgres tự tính, cộng chỉ
mục GIN trigram. Trang Sản phẩm dùng `ilike` (nhanh, lấy được tổng số để phân
trang); ô tìm kiếm nổi dùng hàm `search_products_fuzzy` để chịu được gõ sai —
việc trước đây phải tải toàn bộ kho hàng xuống trình duyệt mới làm được.

## Lệnh có sẵn

```bash
npm run db:check      # kiểm cú pháp SQL bằng bộ phân tích của Postgres (WASM)
npm run db:seed-sql   # sinh lại 0004_seed.sql từ lib/ktd-data.ts
```

`db:check` chỉ bắt lỗi cú pháp. Tên bảng, tên cột và quyền chỉ lộ ra khi chạy
thật — bốn file này **chưa từng chạy trên một Postgres thật**.
