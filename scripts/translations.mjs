// Bản dịch tiếng Anh cho dữ liệu trong cơ sở dữ liệu.
//
// Viết tay theo bảng thuật ngữ ở lib/i18n/glossary.ts, không dùng máy dịch
// chung — máy dịch chung cho ra "safe knife" thay vì "safety cutter", và mỗi
// lần chạy lại có thể ra một cách gọi khác.
//
// Dùng bởi scripts/apply-translations.mjs

/** Xuất xứ. Danh sách đóng nên tra bảng là đủ, không cần dịch từng dòng. */
export const ORIGINS = {
  'Đức': 'Germany',
  'Ireland': 'Ireland',
  'Pháp': 'France',
  'Ý': 'Italy',
  'Mỹ': 'United States',
  'Hà Lan': 'Netherlands',
  'Thụy Điển': 'Sweden',
  'Đài Loan': 'Taiwan',
}

/** slug -> mô tả thế mạnh của hãng. */
export const BRANDS = {
  martor:
    'The leading name in safe cutting: safety cutters, safety scissors, blades and specialist cutting tools for industrial environments.',
  morrisflex:
    'Part of the ATA Group, specialising in carbide burrs and abrasive tools for machining, deburring and metal finishing.',
  ata: 'The ATA Group brand for industrial pneumatic tools — grinders, sanders and surface finishing equipment.',
  technomark:
    'Specialists in industrial marking and traceability, with dot peen and laser marking systems designed and built in France.',
  lenzkes:
    'A leading supplier of quick clamping systems for moulds and workpieces, cutting changeover time and improving machine utilisation.',
  tschorn:
    'Precision measuring and machine setting tools for CNC work, best known for 3D probes, edge finders and zero-point setting devices.',
  fiam:
    'Specialists in industrial tightening technology, supplying torque-controlled tools and systems for assembly lines.',
  tecna:
    'Manufacturer of resistance welding equipment, weld parameter testing instruments and load balancer systems for industrial production.',
  helical:
    'High-performance carbide milling tools, with specialist end mill solutions for a wide range of materials and CNC applications.',
  corehog:
    'Cutting tools built specifically for composites — routers, drills and tooling for CFRP, fibreglass and honeycomb structures.',
  'bevel-tools':
    'Specialists in metal bevelling and edge rounding, supplying machines and dedicated cutters for weld edge preparation and edge finishing.',
  rocklinizer:
    'Manufacturer of surface restoration and tool life extension technologies, best known for Rocklinizer® and the MoldMender® mould repair system.',
  moldmender:
    "Rocklin's mould repair brand, specialising in micro-welding units and build-up materials for worn or damaged moulds and metal parts.",
  buchem: 'Supplier of cleaning products for the mould making and plastic injection industries.',
  diprofil:
    'Specialists in precision polishing, filing and finishing tools and machines, particularly for mould making and fine machining.',
  rtc: 'Specialists in quick coupling technology for compressed air, hydraulics, water and other industrial media, with a range of over 10,000 products and accessories.',
  sloky:
    'Specialists in hand torque tools, with torque screwdrivers and controlled-torque adaptors that prevent over-tightening and protect tooling.',
  hartner:
    'A dedicated cutting tool brand with drilling, tapping, reaming and hole machining solutions for mechanical production.',
  karnasch:
    'High-performance machining tools with an in-depth range covering drilling, milling, counterboring, tapping and metal cutting.',
}

/** slug -> [tên nhóm, dòng chữ nhỏ]. */
export const CATEGORIES = {
  'an-toan': ['Safety tools', 'Safety cutters, safety scissors, blades & accessories'],
  'cat-got-cnc': ['CNC cutting tools', 'Drills, end mills, counterbores, taps'],
  'mai-hoan-thien': [
    'Grinding, polishing & surface finishing',
    'Grinders, carbide burrs, polishing tools',
  ],
  'kep-khuon-phoi': [
    'Mould & workpiece clamping',
    'Mould clamps, workpiece clamps, workholding accessories',
  ],
  'do-can-chinh': ['Measuring & machine setting', '3D probes, edge finders, zero-point setting'],
  'danh-dau': ['Marking & traceability', 'Dot peen marking, laser marking, traceability'],
  'nang-ha': ['Lifting & ergonomic equipment', 'Load balancers, balancer units, accessories'],
  'siet-cong-nghiep': [
    'Industrial tightening systems',
    'Industrial screwdrivers, nutrunners, automated torque systems',
  ],
  'siet-luc-cam-tay': ['Hand torque tools', 'Torque screwdrivers, bits, accessories'],
  'vat-mep': ['Bevelling & edge rounding', 'Bevelling, edge rounding, weld edge preparation'],
  composite: ['Composite machining tools', 'End mills, drills, honeycomb tooling'],
  'do-kiem-may-han': [
    'Welding measurement & testing',
    'Weld current and electrode force measurement',
  ],
  'phuc-hoi-be-mat': [
    'Metal surface treatment & repair',
    'Carbide deposition, mould repair, surface restoration',
  ],
  'khop-noi': ['Industrial quick couplings', 'Air, hydraulic & other couplings'],
  've-sinh-khuon': ['Mould cleaning & maintenance', 'Mould and screw cleaning'],
}

/**
 * Mã hàng -> [tên sản phẩm, mô tả ngắn].
 *
 * Mô tả để null nghĩa là lấy đoạn mở đầu trong bản tiếng Anh của chính hãng
 * (desc_full_en[0]) — văn bản của hãng luôn đúng hơn bản dịch.
 */
export const PRODUCTS = {
  // --- MARTOR: tên là tên dòng máy, giữ nguyên; mô tả lấy từ hãng ---
  '145001.12': ['SECUMAX 145', null],
  '148001.12': ['SECUMAX 148', null],
  '150001.12': ['SECUMAX 150', null],
  '121001.02': ['SECUMAX EASYSAFE', null],
  '125002.02': ['SECUNORM MIZAR', null],
  '120701.02': ['SECUNORM PROFI25 MDP', null],
  '11900771.02': ['SECUNORM PROFI40', null],
  '110000.02': ['SECUNORM SMARTCUT', null],
  '110700.02': ['SECUNORM SMARTCUT MDP', null],
  '122001.02': ['SECUPRO MARTEGO', null],
  '10130610': ['SECUPRO MAXISAFE', null],
  '116001.02': ['SECUPRO MEGASAFE', null],
  '124001': ['SECUPRO MERAK', null],
  '1031.50': ['SCALPEL 1031 blade', null],
  '12.50': ['SCALPEL 12 blade', null],

  // --- các hãng khác: dịch cả tên và mô tả ---
  'AT-5012': [
    'Pneumatic orbital sander',
    'Random orbital sander with a 125 mm pad, central dust extraction and low vibration for extended use.',
  ],
  'AT-7033': [
    'Pneumatic die grinder',
    'Straight 1/4" pneumatic die grinder with sealed dust-resistant bearings and a well-balanced, low-vibration body.',
  ],
  'BT-R2': [
    'Handheld bevelling tool',
    'Handheld tool for bevelling and rounding metal edges, with interchangeable inserts and adjustable cutting depth.',
  ],
  'BX-88': [
    'Buchem mould cleaning agent',
    'Cleaning solution that removes burnt plastic and residue from injection moulds without attacking the mould steel.',
  ],
  'CH-C4': [
    'Composite CNC router',
    'Cutting tool for CFRP and honeycomb, with a geometry designed to prevent fibre fraying and delamination.',
  ],
  'DF-BSG': [
    'Diprofil BSG mould polishing machine',
    'Reciprocating mould polishing machine for filing and polishing cavities and hard-to-reach areas.',
  ],
  'FIAM-15C': [
    'Fiam 15C electric screwdriver',
    'Torque-controlled industrial electric screwdriver with a mechanical clutch for repeatable assembly tightening.',
  ],
  'HT-HSS8': [
    'Hartner HSS-E drill bit 8 mm',
    'Precision-ground cobalt HSS-E drill bit for alloy steel and stainless steel.',
  ],
  'HEV-40250': [
    'HEV 4-flute end mill',
    'AlTiN-coated 4-flute end mill with variable helix geometry to reduce chatter when milling hardened steel.',
  ],
  'HFV-30187': [
    'HFV 3-flute end mill',
    '3-flute end mill for aluminium, with wide chip gullets and a polished flute finish for free chip evacuation.',
  ],
  'KN-HSSDMOND': [
    'Karnasch carbide annular cutter',
    'TiAlN-coated annular cutter for fast, clean large-diameter holes in steel plate and structural sections.',
  ],
  'LK-125': [
    'Lenzkes clamping set',
    'Clamping set for holding moulds and workpieces on machine tables, with high clamping force and quick changeover.',
  ],
  SPM80R: [
    'Carbide burr',
    'Round-nose carbide burr with a double-cut pattern for a high material removal rate and a controlled finish.',
  ],
  'MF-INOXCUT': [
    'INOX CUT carbide burr',
    'Tungsten carbide burr made specifically for stainless steel, cutting without generating heat discolouration.',
  ],
  'RK-500': [
    'Rocklinizer carbide deposition unit',
    'Spark deposition unit that applies a hard carbide layer to mould surfaces, extending tool and mould life.',
  ],
  'RTC-40': [
    'Flexible drive coupling',
    'Drive coupling that compensates for shaft misalignment, with an elastic element that damps vibration.',
  ],
  'SLOKY-TS15': [
    'Sloky TS-15 torque screwdriver',
    'Precision torque screwdriver with a fixed torque setting, preventing over-tightening of small fasteners.',
  ],
  'MP-350': [
    'Technomark dot peen marker',
    'Dot peen marking machine for text, numbers and DataMatrix codes on metal parts, with permanent, legible results.',
  ],
  '9502AX': [
    'Tecna load balancer',
    'Load balancer that holds a tool in suspension at a set height, removing its weight from the operator during assembly.',
  ],
  'TS-3D': [
    'TSChorn 3D edge finder',
    '3D probe for finding edges and bore centres on milling machines, with a dial indicator readable from any angle.',
  ],
}
