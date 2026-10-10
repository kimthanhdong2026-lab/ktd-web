/**
 * Bảng thuật ngữ Việt – Anh cho ngành dụng cụ công nghiệp.
 *
 * VÌ SAO CẦN: dịch từng sản phẩm một, cùng một từ ở hai ngày khác nhau rất dễ
 * ra hai cách gọi — "safety knife" chỗ này, "safety cutter" chỗ kia. Với danh
 * mục nghìn mã thì đó là lỗi, không phải khác biệt văn phong.
 *
 * NGUỒN: phần lớn rút từ chính tài liệu song ngữ của các hãng — 15 sản phẩm
 * MARTOR có sẵn cặp Việt–Anh do hãng viết, nên cách gọi ở đây là cách hãng
 * dùng chứ không phải cách tự nghĩ ra.
 *
 * Dùng bởi scripts/translate-products.mjs làm ràng buộc cho bản dịch máy.
 */

/** Không bao giờ dịch: tên hãng, tên dòng máy, mã hàng. */
export const KEEP_AS_IS = [
  'MARTOR', 'SECUMAX', 'SECUNORM', 'SECUPRO', 'SCALPEL', 'TRAPEZOID',
  'GRAFIX', 'CLAPPEX', 'TRIMMEX', 'CUTTOGRAF', 'MDP',
  'Morrisflex', 'ATA Air Tools', 'Karnasch', 'Hartner', 'Helical Solutions',
  'Technomark', 'Lenzkes', 'TSChorn', 'Fiam', 'Tecna', 'Corehog', 'Bevel Tools',
  'ROCKLIN', 'MoldMender', 'Rocklinizer', 'Buchem', 'Diprofil', 'RTC', 'Sloky',
  // Cách viết chuẩn từ "Sửa web 5". Giữ cả cách cũ ở trên vì nội dung đã dịch
  // trước đó còn dùng.
  'Tschorn', 'CoreHog', 'Beveltools', 'Rocklin', 'Garryson',
  'Kim Thành Đông', 'Zalo', 'MTA Vietnam',
]

/** Thuật ngữ chuyên ngành. Bên trái tiếng Việt, bên phải cách hãng gọi. */
export const GLOSSARY: Record<string, string> = {
  // --- nhóm dụng cụ cắt an toàn (theo tài liệu MARTOR) ---
  'dao an toàn': 'safety cutter',
  'dao cắt an toàn': 'safety cutter',
  'lưỡi dao': 'blade',
  'lưỡi dao thay thế': 'replacement blade',
  'lưỡi ẩn': 'concealed blade',
  'lưỡi dao che chắn hoàn toàn': 'fully concealed blade',
  'lưỡi tự động thu hồi': 'automatic blade retraction',
  'độ sâu cắt tối đa': 'max. cutting depth',
  'quy cách đóng gói': 'pack size',
  'cơ chế an toàn': 'safety system',
  'dùng một lần': 'disposable',
  'rọc thùng': 'carton opening',
  'màng nhựa': 'plastic film',
  'dây đai nhựa': 'plastic strapping',
  'bao bì đóng gói': 'packaging materials',

  // --- mài và hoàn thiện bề mặt ---
  'mũi mài': 'carbide burr',
  'mũi mài hợp kim': 'carbide burr',
  'máy mài': 'grinder',
  'máy mài khí nén': 'pneumatic grinder',
  'máy chà nhám': 'sander',
  'đánh bóng': 'polishing',
  'hoàn thiện bề mặt': 'surface finishing',
  'dụng cụ khí nén': 'pneumatic tools',

  // --- cắt gọt ---
  'dụng cụ cắt gọt': 'cutting tools',
  'dao phay': 'end mill',
  'dao phay ngón': 'end mill',
  'mũi khoan': 'drill bit',
  'mũi khoét': 'counterbore',
  'ta rô': 'tap',
  'gia công cơ khí': 'machining',
  'cắt gọt chính xác': 'precision cutting',

  // --- gá kẹp và khuôn mẫu ---
  'gá kẹp': 'workholding',
  'kẹp khuôn': 'mould clamping',
  'kẹp phôi': 'workpiece clamping',
  'khuôn mẫu': 'moulds',
  'ép nhựa': 'plastic injection',
  'vệ sinh khuôn': 'mould cleaning',
  'bảo trì khuôn': 'mould maintenance',
  'phục hồi bề mặt': 'surface repair',
  'phủ carbide': 'carbide deposition',

  // --- đo kiểm ---
  'thiết bị đo': 'measuring equipment',
  'đo kiểm': 'measurement and inspection',
  'đầu dò 3D': '3D edge finder',
  'dò cạnh': 'edge finder',
  'căn chỉnh gia công': 'machine setting',

  // --- siết và lắp ráp ---
  'siết lắp ráp': 'assembly tightening',
  'tô vít lực': 'torque screwdriver',
  'tô vít công nghiệp': 'industrial screwdriver',
  'máy siết bu lông': 'nutrunner',
  'siết kiểm soát lực': 'torque-controlled tightening',
  'mô-men': 'torque',

  // --- nâng hạ, khớp nối, hàn ---
  'pa lăng cân bằng': 'load balancer',
  'nâng hạ': 'lifting and handling',
  'công thái học': 'ergonomics',
  'khớp nối nhanh': 'quick coupling',
  'hàn điện trở': 'resistance welding',
  'vát mép': 'bevelling',
  'bo cạnh': 'edge rounding',
  'chuẩn bị mép hàn': 'weld edge preparation',

  // --- đánh dấu ---
  'đánh dấu': 'marking',
  'truy xuất': 'traceability',
  'khắc chấm': 'dot peen marking',
  'khắc laser': 'laser marking',

  // --- thương mại ---
  'mã hàng': 'part number',
  'thương hiệu': 'brand',
  'danh mục': 'category',
  'dòng sản phẩm': 'product series',
  'xuất xứ': 'origin',
  'chính hãng': 'genuine',
  'báo giá': 'quotation',
  'yêu cầu báo giá': 'quote request',
  'tài liệu kỹ thuật': 'technical datasheet',
  'thông số kỹ thuật': 'specifications',
  'ứng dụng': 'applications',
  'nhà sản xuất': 'manufacturer',
  'nhà phân phối': 'distributor',
  'phân phối': 'distribution',

  // --- vật liệu ---
  'thép chất lượng cao': 'high-quality steel',
  'nhựa kỹ thuật': 'technical plastic',
  'hợp kim cacbua vonfram': 'tungsten carbide',
  'thép gió': 'high-speed steel',
  'composite': 'composite',
  'inox': 'stainless steel',
}

/** Văn bản mô tả bảng thuật ngữ, chèn vào lời nhắc khi dịch máy. */
export function glossaryPrompt(): string {
  const terms = Object.entries(GLOSSARY)
    .map(([vi, en]) => `${vi} = ${en}`)
    .join('\n')
  return [
    'Dùng đúng các thuật ngữ sau, không thay bằng từ đồng nghĩa:',
    terms,
    '',
    'Giữ nguyên, không dịch: ' + KEEP_AS_IS.join(', '),
    'Giữ nguyên mọi mã hàng, số đo, đơn vị và ký hiệu No.xxxxx.',
  ].join('\n')
}
