# Vận hành — những việc không được quên

## ⚠️ Cơ sở dữ liệu bị tạm dừng sau 7 ngày không dùng

Gói **miễn phí** của Supabase tự tạm dừng dự án khi **7 ngày liên tục không có
truy vấn nào**. Dự án bị dừng nghĩa là **toàn bộ website sập** — mọi trang đều
đọc dữ liệu từ đó.

Nguy hiểm nhất là dịp nghỉ Tết hoặc nghỉ lễ dài: không ai vào web, không ai
nhớ, 7 ngày trôi qua, trang chết mà không ai biết.

### Đã tự động hoá — không cần ai nhớ

`.github/workflows/health-check.yml` chạy **2 ngày một lần**, gọi một truy vấn
thật lên cơ sở dữ liệu. Chạy trên máy chủ của GitHub nên không phụ thuộc vào
máy ai hay ai có online hay không.

Chạy 2 ngày chứ không phải 3, vì lịch của GitHub Actions có thể bị hoãn vài giờ
khi hệ thống bận — cần biên an toàn so với mốc 7 ngày.

### ❗ Nhưng chính cái tự động này cũng có thể chết

**GitHub tự TẮT workflow theo lịch nếu kho mã không có commit nào trong 60
ngày.** Sau một thời gian dài không ai đụng vào mã nguồn, phải vào tab
**Actions** trên GitHub bấm bật lại.

→ **Việc phải nhớ, mỗi 2 tháng một lần:** mở
`github.com/kimthanhdong2026-lab/ktd-web/actions`, xem workflow "Giữ cơ sở dữ
liệu thức" còn chạy không. Nếu thấy chữ *"This workflow was disabled"* thì bấm
**Enable workflow**.

### Kiểm tay bất cứ lúc nào

```bash
npm run health
```

Chạy trước khi nghỉ dài ngày cho chắc. Bản thân lần kiểm này cũng đánh thức cơ
sở dữ liệu.

### Nếu lỡ để dự án bị dừng

Không mất dữ liệu. Vào [supabase.com](https://supabase.com), mở dự án
**KTD-WEB**, bấm **Restore project**. Mất khoảng 1–2 phút rồi website chạy lại.

---

## Các lệnh kiểm tra khác

| Lệnh | Kiểm gì |
|---|---|
| `npm run health` | Cơ sở dữ liệu còn thức, website còn sống |
| `npm run db:verify` | 11 điểm: số bản ghi, tìm kiếm, kho ảnh, phân quyền |
| `npm run i18n:check` | Trang tiếng Anh còn sót chữ tiếng Việt không |
| `npm run db:check` | Cú pháp các file SQL trong `supabase/migrations/` |
| `npm run db:upload` | Đẩy ảnh, logo, PDF từ `public/` lên kho Supabase |

---

## Khoá và biến môi trường

`.env.local` nằm ngoài git, chứa cả **khoá toàn quyền** `SUPABASE_SERVICE_ROLE_KEY`.
Không đưa khoá này lên Vercel — Vercel chỉ cần hai biến `NEXT_PUBLIC_*`.

Chi tiết ở [supabase/README.md](supabase/README.md).
