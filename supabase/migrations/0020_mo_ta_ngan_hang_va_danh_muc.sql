-- =============================================================================
-- Mô tả ngắn của 19 thương hiệu và 12 nhóm chính
--
-- Nguồn: file "MAU-NHAP-SAN-PHAM-KTD_Vr0211" team gửi, hai sheet "MTN - Brand"
-- và "MTN - Danh muc". Team chốt ở file câu hỏi vòng 2: A2 đồng ý (26/10),
-- A3 rút gọn câu danh mục còn 50–61 ký tự (28/10). Kèm hai ảnh chụp
-- trong file trao đổi: một ảnh trỏ vào chữ nhỏ dưới tên nhóm ở các ô danh mục
-- trang chủ, một ảnh trỏ vào đoạn chữ trên thẻ ở trang danh sách thương hiệu.
--
--   categories.sub_vi  — dòng chữ nhỏ dưới tên nhóm chính (ô danh mục trang chủ)
--   brands.desc_vi     — câu giới thiệu ngắn của hãng. Thẻ ở trang danh sách
--                        thương hiệu hiện câu này thay cho 3 dòng đầu của đoạn
--                        giới thiệu dài, và trang riêng của hãng dùng nó làm
--                        mô tả cho Google (thay cho mục TH09).
--
-- PHẢI chạy cùng lúc với bản mã cho thẻ đọc desc thay cho intro: chạy SQL
-- trước thì thẻ chưa đổi; đẩy mã trước thì thẻ hiện câu ngắn CŨ của hãng.
--
-- Bản tiếng Anh do bên kỹ thuật dịch, thuật ngữ theo lib/i18n/glossary.ts.
-- Nên có người của KTD rà lại.
--
-- Chỉ đổi chữ hiển thị. Chạy lại bao nhiêu lần cũng được.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Chữ nhỏ dưới tên 12 nhóm chính — ghép theo slug, vì tên nhóm có thể còn đổi.
-- -----------------------------------------------------------------------------
update categories c
set sub_vi = v.vi,
    sub_en = v.en
from (values
  ('an-toan',
   'Dao cắt an toàn, lưỡi dao và phụ kiện cắt công nghiệp.',
   'Safety cutters, blades and industrial cutting accessories.'),
  ('cat-got-cnc',
   'Mũi khoan, dao phay và dụng cụ cắt CNC, composite.',
   'Drills, end mills and CNC and composite cutting tools.'),
  ('mai-hoan-thien',
   'Máy mài khí nén, mũi mài hợp kim, đá mài và vật tư nhám.',
   'Pneumatic grinders, carbide burrs, grinding points and abrasives.'),
  ('vat-mep',
   'Máy vát mép, máy bo cạnh và dao cắt kim loại chuyên dụng.',
   'Chamfering machines, edge rounding machines and metal cutters.'),
  ('ve-sinh-khuon',
   'Máy giũa, dụng cụ đánh bóng và hóa chất bảo dưỡng khuôn.',
   'Filing machines, polishing tools and mould maintenance chemicals.'),
  ('do-can-chinh',
   'Đầu dò 3D, dụng cụ đo cạnh và xác định gốc tọa độ CNC.',
   '3D probes, edge finders and CNC zero-point setting tools.'),
  ('kep-khuon-phoi',
   'Hệ thống kẹp khuôn, kẹp phôi và phụ kiện gá kẹp công nghiệp.',
   'Mould and workpiece clamping systems and workholding accessories.'),
  ('siet-cong-nghiep',
   'Máy siết vít, tua vít lực và thiết bị kiểm soát mô-men xoắn.',
   'Screwdrivers, torque screwdrivers and torque control equipment.'),
  ('danh-dau',
   'Máy khắc chấm, khắc laser và thiết bị đánh dấu công nghiệp.',
   'Dot peen markers, laser markers and industrial marking equipment.'),
  ('do-kiem-may-han',
   'Thiết bị đo lực điện cực, đo dòng hàn và kiểm tra hàn.',
   'Electrode force meters, weld current meters and weld testers.'),
  ('phuc-hoi-be-mat',
   'Thiết bị phủ cứng, chống mài mòn và phục hồi bề mặt kim loại.',
   'Hard-facing, wear protection and metal surface restoration equipment.'),
  ('khop-noi',
   'Khớp nối nhanh, đầu nối khí nén, nước và làm mát khuôn.',
   'Quick couplings and connectors for air, water and mould cooling.')
) as v(slug, vi, en)
where c.slug = v.slug
  and c.parent_slug is null;

-- -----------------------------------------------------------------------------
-- 2. Câu giới thiệu ngắn của 19 thương hiệu
-- -----------------------------------------------------------------------------
update brands b
set desc_vi = v.vi,
    desc_en = v.en
from (values
  ('martor',
   'Chuyên cung cấp dao cắt an toàn, dao công nghiệp và lưỡi dao thay thế MARTOR, đáp ứng nhu cầu cắt trong sản xuất và đóng gói.',
   'MARTOR safety cutters, industrial knives and replacement blades for cutting tasks in manufacturing and packaging.'),
  ('karnasch',
   'Cung cấp dụng cụ cắt kim loại Karnasch gồm mũi khoan từ, mũi khoan hợp kim và dao phay chính xác cho gia công cơ khí.',
   'Karnasch metal cutting tools, including annular cutters, carbide drills and precision end mills for machining.'),
  ('hartner',
   'Nổi bật với các dòng mũi khoan, dao phay và dụng cụ cắt Hartner, đáp ứng yêu cầu gia công kim loại chính xác và hiệu suất cao.',
   'Hartner drills, end mills and cutting tools for precise, high-performance metal machining.'),
  ('helical',
   'Chuyên về dao phay ngón carbide Helical Solutions hiệu suất cao, tối ưu khả năng gia công CNC trên nhiều loại vật liệu kim loại.',
   'High-performance Helical Solutions carbide end mills, optimised for CNC machining across a wide range of metals.'),
  ('corehog',
   'Cung cấp dao phay và dụng cụ cắt CoreHog chuyên dụng cho gia công vật liệu composite, vật liệu tổ ong và ứng dụng kỹ thuật.',
   'CoreHog routers and cutting tools built for composites, honeycomb materials and engineering applications.'),
  ('ata',
   'Chuyên cung cấp máy mài khí nén, máy đánh bóng ATA và dụng cụ xử lý bề mặt, phục vụ gia công cơ khí công nghiệp.',
   'ATA pneumatic grinders, polishers and surface treatment tools for industrial machining.'),
  ('morrisflex',
   'Nổi bật với các dòng mũi mài hợp kim carbide Morrisflex, hỗ trợ mài, tạo hình và xử lý bề mặt kim loại chính xác.',
   'Morrisflex carbide burrs for precise grinding, shaping and surface treatment of metal.'),
  ('garryson',
   'Cung cấp vật tư mài và đánh bóng Garryson gồm nhám công nghiệp, đá mài và dụng cụ hoàn thiện bề mặt kim loại.',
   'Garryson grinding and polishing consumables, including industrial abrasives, grinding points and metal finishing tools.'),
  ('bevel-tools',
   'Chuyên về máy vát mép, máy bo cạnh và dao cắt Beveltools, hỗ trợ xử lý mép kim loại nhanh chóng và chính xác.',
   'Beveltools chamfering machines, edge rounding machines and cutters for fast, accurate metal edge preparation.'),
  ('diprofil',
   'Cung cấp máy giũa, máy mài và dụng cụ đánh bóng Diprofil, chuyên dụng cho gia công tinh và hoàn thiện khuôn mẫu.',
   'Diprofil filing machines, grinders and polishing tools for fine machining and mould finishing.'),
  ('buchem',
   'Chuyên cung cấp hóa chất kỹ thuật Buchem gồm chất vệ sinh khuôn, chống gỉ và bảo dưỡng thiết bị trong sản xuất công nghiệp.',
   'Buchem technical chemicals, including mould cleaners, rust preventives and equipment maintenance products for industry.'),
  ('rocklinizer',
   'Cung cấp thiết bị phủ cứng bề mặt Rocklinizer bằng công nghệ tia lửa điện, hỗ trợ tăng khả năng chống mài mòn của chi tiết kim loại.',
   'Rocklinizer spark-deposition hard-facing equipment that increases the wear resistance of metal parts.'),
  ('tschorn',
   'Nổi bật với đầu dò 3D, thiết bị lấy gốc tọa độ và dụng cụ đo kiểm Tschorn, hỗ trợ thiết lập và gia công CNC chính xác.',
   'Tschorn 3D probes, zero-point setters and measuring tools for accurate CNC set-up and machining.'),
  ('lenzkes',
   'Chuyên cung cấp hệ thống kẹp khuôn, kẹp phôi Lenzkes và phụ kiện gá kẹp, đáp ứng nhu cầu cố định chi tiết trong gia công.',
   'Lenzkes mould clamping and workpiece clamping systems with workholding accessories for machining.'),
  ('fiam',
   'Cung cấp máy siết vít công nghiệp Fiam, hệ thống cấp vít tự động và giải pháp lắp ráp, hỗ trợ kiểm soát lực siết chính xác.',
   'Fiam industrial screwdrivers, automatic screw feeding systems and assembly solutions with precise torque control.'),
  ('sloky',
   'Chuyên cung cấp tua vít lực Sloky và dụng cụ kiểm soát mô-men xoắn, phục vụ lắp ráp và siết chặt chi tiết chính xác.',
   'Sloky torque screwdrivers and torque control tools for precise assembly and tightening.'),
  ('technomark',
   'Cung cấp máy khắc chấm, máy khắc laser Technomark và giải pháp đánh dấu công nghiệp, hỗ trợ nhận diện và truy xuất sản phẩm.',
   'Technomark dot peen and laser markers and industrial marking solutions for product identification and traceability.'),
  ('tecna',
   'Chuyên cung cấp máy hàn điểm TECNA, thiết bị hàn điện trở, bộ điều khiển hàn và bộ cân bằng tải cho sản xuất công nghiệp.',
   'TECNA spot welders, resistance welding equipment, weld controllers and load balancers for industrial production.'),
  ('rtc',
   'Cung cấp đầu nối nhanh RTC, khớp nối khuôn và phụ kiện kết nối đường nước, hỗ trợ tối ưu hệ thống làm mát khuôn công nghiệp.',
   'RTC quick couplings, mould couplings and water line connectors for efficient industrial mould cooling.')
) as v(slug, vi, en)
where b.slug = v.slug;

-- Kiểm nhanh sau khi chạy — phải ra 12 và 19:
--   select count(*) from categories where parent_slug is null and length(sub_vi) <= 65;
--   select count(*) from brands where desc_en is not null;
