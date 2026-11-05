"""Ghép thư mục ảnh Drive với sản phẩm cho các hãng đặt tên thư mục theo mã hàng.

Chạy:  python scripts/ghep_anh_theo_ma.py <cay.json> <thu-muc-kiem> <Sheet> [...] --ra ghep.json
           [--tay "MÃ=THƯ MỤC" ...]

--tay: ghép tay, thắng mọi luật bên dưới. Đang dùng: "EASY 120=EASY-60-120"
(Technomark, bảng ghép đã gửi team: EASY 60 và EASY 120 dùng chung thư mục).

<cay.json> là cây thư mục Drive (mỗi hãng một danh sách {path, name, id, kind});
<thu-muc-kiem> chứa lo-<Sheet>.json do nap_san_pham.py xuất ở chế độ kiểm.

Thứ tự so (bỏ dấu cách, gạch, chấm; không phân biệt hoa thường), dừng ở luật
đầu tiên tìm thấy:
  1. tên thư mục trùng mã chính
  2. tên thư mục trùng một mã cùng dòng          (ATA "SDM26L" -> "SDM26LR")
  3. tên thư mục bắt đầu bằng mã chính            ("ST100" -> "ST100-CF", "EASY 60" -> "EASY-60-120")
  4. tên thư mục CHỨA mã chính, mã dài >= 6       ("MORFLX-BK-5X6MM-6" -> "BUR_SET_MORFLX_BK_5X6MM_6")
  5. mã chính bắt đầu bằng tên thư mục, tên >= 3  ("950E-ROCKLIN" -> "950")
Thư mục bắt đầu bằng "_" (tài liệu chung) không bao giờ được ghép.

Martor không dùng được cách này (thư mục đặt theo tên sản phẩm) — bảng của
Martor ghép tay, xem Hop-thu-den/KTD-Bang-ghep-anh-Martor-Technomark.xlsx.
"""
import io, json, re, sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

args = sys.argv[1:]
TAY = {}
while '--tay' in args:
    i = args.index('--tay')
    ma, tm = args[i + 1].split('=', 1)
    TAY[ma.strip()] = tm.strip()
    del args[i:i + 2]
RA = args[args.index('--ra') + 1]
args = args[:args.index('--ra')]
CAY = json.load(io.open(args[0], encoding='utf-8'))
KIEM, SHEETS = args[1], args[2:]


def chuan(s):
    return re.sub(r'[^A-Z0-9]', '', s.upper())


def bien_the(b):
    for t in b['specs_vi']:
        if t['label'] == 'Các mã cùng dòng':
            return [x.strip() for x in t['value'].split(',')][1:]
    return []


ket = {}
for sheet in SHEETS:
    ten_hang = next(k for k in CAY if k.lower() == sheet.lower())
    thu_muc = [x for x in CAY[ten_hang] if x['kind'] == 'folder' and not x['path'] and not x['name'].startswith('_')]
    so_anh = {x['id']: sum(1 for y in CAY[ten_hang] if y['kind'] == 'file' and y['path'] == [x['name']]
                           and not y['name'].lower().endswith('.pdf')) for x in thu_muc}
    ds = json.load(io.open(f'{KIEM}/lo-{sheet}.json', encoding='utf-8'))
    da_dung = {}
    for b in ds:
        ma = chuan(b['part'])
        cung = [chuan(x) for x in bien_the(b)]
        luat = [
            ('ghép tay', lambda f: TAY.get(b['part']) == f),
            ('trùng mã', lambda f: chuan(f) == ma),
            ('trùng mã cùng dòng', lambda f: chuan(f) in cung),
            ('thư mục bắt đầu bằng mã', lambda f: chuan(f).startswith(ma)),
            ('thư mục chứa mã', lambda f: len(ma) >= 6 and ma in chuan(f)),
            ('mã bắt đầu bằng thư mục', lambda f: len(chuan(f)) >= 3 and ma.startswith(chuan(f))),
        ]
        chon = None
        for ten_luat, ok in luat:
            hop = [f for f in thu_muc if ok(f['name'])]
            if hop:
                chon = (ten_luat, min(hop, key=lambda f: len(f['name'])))
                break
        if chon:
            f = chon[1]
            ket[b['part']] = {'hang': ten_hang, 'thu_muc': f['name'], 'id': f['id'],
                              'so_anh': so_anh[f['id']], 'ket_qua': chon[0]}
            da_dung.setdefault(f['name'], []).append(b['part'])
        print(f'{sheet:<12} {b["part"]:<22} -> {chon[1]["name"] + "  (" + chon[0] + ", " + str(so_anh[chon[1]["id"]]) + " ảnh)" if chon else "CHƯA CÓ ẢNH"}')
    thua = [f['name'] for f in thu_muc if f['name'] not in da_dung]
    if thua:
        print(f'{sheet:<12} thư mục không ghép với mã nào: {thua}')
    chung = {k: v for k, v in da_dung.items() if len(v) > 1}
    if chung:
        print(f'{sheet:<12} thư mục dùng chung: {chung}')

json.dump(ket, io.open(RA, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'\n{len(ket)} mã có ảnh -> {RA}')
