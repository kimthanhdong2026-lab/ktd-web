"""Nạp sản phẩm từ file Excel của KTD lên website, theo từng lô (từng hãng).

Chạy:  python scripts/nap_san_pham.py <file.xlsm> <Sheet> [<Sheet> ...] [--anh bang-ghep.json] [--ra thu-muc]

Hiện chỉ có chế độ KIỂM: đọc file, chuyển từng dòng thành bản ghi sản phẩm
đúng khuôn của bảng products, so với dữ liệu đang có trên web, và xuất:
  - <ra>/lo-<sheet>.json          bản ghi sẽ được ghi (để soi trước khi nạp)
  - <ra>/lo-<sheet>-bao-cao.xlsx  danh sách lỗi và cảnh báo theo từng dòng Excel
KHÔNG ghi gì vào cơ sở dữ liệu hay kho ảnh. Chế độ ghi thật thêm sau khi team
chốt câu B2 (mô tả ngắn / Điểm nổi bật) ở file câu hỏi vòng 2.

Các quy tắc chuyển đổi đều theo câu trả lời của team ở file câu hỏi vòng 2:
  B1  ô có nhiều mã: mã đầu (hoặc mã sau "Mã chính:") là mã chính; các mã còn
      lại vào bảng thông số ("Các mã cùng dòng") và vào từ khóa tìm kiếm.
  B3  mã đã có trên web: ghi đè nội dung, GIỮ NGUYÊN slug để không chết đường dẫn.
  B4  10130610 / 124001 trên web được thay bằng bản có đuôi .02.
  B9  Rocklin, Tschorn: ô có hai mã -> một trang, mã thứ hai là mã biến thể.
  Phần C: ô ƯU TIÊN không phải số -> để trống; link hãng không bắt đầu bằng
      http -> bỏ; ứng dụng / thông số ngăn bằng ";" -> tách dòng.
"""
import io, json, os, re, sys, unicodedata, urllib.request

import openpyxl
from openpyxl.styles import Alignment, Font, PatternFill, Border, Side
from openpyxl.utils import get_column_letter

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# ----------------------------------------------------------------------------- tham số
args = sys.argv[1:]
if not args:
    print(__doc__)
    sys.exit(1)
FILE = args[0]
ANH = None
RA = 'Hop-thu-den/kiem-nap'
SHEETS = []
i = 1
while i < len(args):
    if args[i] == '--anh':
        ANH = args[i + 1]; i += 2
    elif args[i] == '--ra':
        RA = args[i + 1]; i += 2
    else:
        SHEETS.append(args[i]); i += 1
os.makedirs(RA, exist_ok=True)

# Tên sheet trong Excel -> slug hãng trên web
HANG = {
    'martor': 'martor', 'morrisflex': 'morrisflex', 'rocklinizer': 'rocklinizer', 'buchem': 'buchem',
    'technomark': 'technomark', 'ata': 'ata', 'tecna': 'tecna', 'tschorn': 'tschorn', 'lenzkes': 'lenzkes',
    'diprofil': 'diprofil',
}
# Mã trên web được thay bằng mã mới (B4)
THAY_MA = {'10130610.02': '10130610', '124001.02': '124001'}

# ----------------------------------------------------------------------------- dữ liệu trên web (chỉ đọc)
env = {}
for line in io.open('.env.local', encoding='utf-8'):
    if '=' in line and not line.startswith('#'):
        k, v = line.split('=', 1)
        env[k.strip()] = v.strip()


def doc(path):
    k = env['NEXT_PUBLIC_SUPABASE_ANON_KEY']
    req = urllib.request.Request(env['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/' + path,
                                 headers={'apikey': k, 'Authorization': 'Bearer ' + k})
    return json.load(urllib.request.urlopen(req, timeout=60))


CATS = doc('categories?select=slug,name_vi,parent_slug&visible=is.true')
NHOM_NHO = {c['name_vi'].strip().lower(): c['slug'] for c in CATS if c['parent_slug']}
WEB = {p['part']: p for p in doc('products?select=part,slug,brand_slug,images,doc_pdf')}


# ----------------------------------------------------------------------------- tiện ích
def chu(v):
    return '' if v is None else str(v).strip()


def slugify(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn').replace('đ', 'd')
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def dong(s):
    """Tách một ô thành các dòng: theo xuống dòng, nếu chỉ một dòng thì theo dấu ;"""
    s = chu(s)
    if not s:
        return []
    parts = [x.strip(' -•\t') for x in s.split('\n')]
    parts = [x for x in parts if x]
    if len(parts) == 1 and ';' in parts[0]:
        parts = [x.strip() for x in parts[0].split(';') if x.strip()]
    return parts


def doan(s):
    return [x.strip() for x in chu(s).split('\n') if x.strip()]


def cau_dau(paras, toi_da=160):
    """Câu đầu của mô tả đầy đủ, cắt gọn dưới toi_da ký tự (phương án a của B2)."""
    if not paras:
        return ''
    c = re.split(r'(?<=[.!?])\s', paras[0])[0].strip()
    if len(c) <= toi_da:
        return c
    return c[:toi_da].rsplit(' ', 1)[0].rstrip(',;:') + '…'


MA_RE = re.compile(r'[A-Z]{1,4}\d{2,}[\w./-]*|\d{3,}[\w./-]*', re.I)


def tach_ma(o):
    """Ô MÃ HÀNG -> (mã chính, [mã biến thể])."""
    s = chu(o).lstrip('*').strip()
    m = re.search(r'Mã chính\s*:\s*([^\s–,;]+)', s)
    if m:
        chinh = m.group(1).rstrip('.')
        cac = []
        for t in re.findall(r'[A-Z]{2}\d{5}-[\w]+(?:\s+DIN)?(?:\s+ACC)?', s):
            t = t.strip()
            if t != chinh and t not in cac:
                cac.append(t)
        return chinh, cac
    if re.search(r'[,;\n]| / ', s):
        toks = [t.strip().lstrip('*') for t in re.split(r'[,;\n]| / ', s) if t.strip()]
        return toks[0], toks[1:]
    return s, []


def thong_so(o, canh):
    out = []
    for d in dong(o):
        if ':' in d:
            k, v = d.split(':', 1)
            out.append({'label': k.strip(), 'value': v.strip()})
        else:
            out.append({'label': '', 'value': d})
            canh.append(f'Thông số không có dấu ":" — hiện thành một dòng không nhãn: "{d[:50]}"')
    return out


# ----------------------------------------------------------------------------- bảng ghép ảnh (B6, B7)
ghep_anh = {}
if ANH:
    ghep_anh = json.load(io.open(ANH, encoding='utf-8'))

# ----------------------------------------------------------------------------- xử lý từng sheet
wb = openpyxl.load_workbook(FILE, data_only=True)
tong = {}
for sheet in SHEETS:
    ws = wb[sheet]
    rows = list(ws.iter_rows(values_only=True))
    hdr = [chu(h).upper() for h in rows[0]]

    def cot(*ten):
        for t in ten:
            for j, h in enumerate(hdr):
                if h.startswith(t):
                    return j
        return None

    C = {
        'ten': cot('TÊN SẢN PHẨM'), 'ma': cot('MÃ HÀNG'), 'series': cot('DÒNG SẢN PHẨM'), 'xx': cot('XUẤT XỨ'),
        'nb': 7, 'full': cot('MÔ TẢ ĐẦY ĐỦ'), 'ud': cot('ỨNG DỤNG'), 'ts': cot('THÔNG SỐ'), 'tk': cot('TỪ KHÓA'),
        'anh': cot('TÊN FILE ẢNH'), 'pdf': cot('TÊN FILE PDF'), 'link': cot('LINK TRANG HÃNG'),
        'ut': cot('ƯU TIÊN'), 'nho': cot('NHÓM NHỎ'),
    }
    hang = HANG[sheet.lower()]
    ban_ghi, bao_cao, da_thay = [], [], set()
    for idx, r in enumerate(rows[1:], start=2):
        g = lambda k: r[C[k]] if C[k] is not None and C[k] < len(r) else None
        ten = chu(g('ten'))
        if not ten or chu(r[0]) == '(ví dụ)' or chu(r[1]) in ('Chọn từ danh sách', 'THƯƠNG HIỆU *'):
            continue
        loi, canh = [], []
        ma, bien_the = tach_ma(g('ma'))
        if not ma:
            loi.append('Thiếu mã hàng')
        if isinstance(g('ma'), (int, float)):
            canh.append('Mã hàng ở dạng số trong Excel — kiểm lại số 0 đầu/cuối')
        if len(ten) > 60:
            canh.append(f'Tên dài {len(ten)} ký tự (khuyến nghị ≤ 60)')
        nho = NHOM_NHO.get(chu(g('nho')).lower())
        if not nho:
            loi.append(f'Nhóm nhỏ "{chu(g("nho"))}" không có trên web')
        full = doan(g('full'))
        if not full:
            loi.append('Thiếu mô tả đầy đủ')
        noi_bat = dong(g('nb'))
        ud = dong(g('ud'))
        ts = thong_so(g('ts'), canh)
        if bien_the:
            ts.append({'label': 'Các mã cùng dòng', 'value': ', '.join([ma] + bien_the)})
        tk = [x.strip() for x in re.split(r'[,;\n]', chu(g('tk'))) if x.strip()]
        tk += [x for x in bien_the if x not in tk]
        link = chu(g('link'))
        if link and not link.lower().startswith('http'):
            canh.append(f'Link hãng không phải đường dẫn, bỏ qua: "{link[:40]}"')
            link = ''
        ut = chu(g('ut'))
        uu_tien = int(float(ut)) if re.fullmatch(r'\d+(\.0)?', ut) else None

        cu = WEB.get(ma) or WEB.get(THAY_MA.get(ma, ''))
        if THAY_MA.get(ma) in WEB:
            da_thay.add(THAY_MA[ma])
            canh.append(f'Thay mã cũ {THAY_MA[ma]} trên web (B4); giữ đường dẫn cũ')
        slug = cu['slug'] if cu else slugify(f'{ten} {ma}')
        trang_thai = 'GHI ĐÈ (đã có trên web)' if cu else 'THÊM MỚI'

        anh = ghep_anh.get(ma)
        if anh is None:
            canh.append('Chưa có ảnh trong bảng ghép' + (' — giữ ảnh đang có trên web' if cu and cu['images'] else ''))

        b = {
            'part': ma, 'slug': slug, 'brand_slug': hang, 'category_slug': nho,
            'name_vi': ten, 'series': chu(g('series')) or None, 'origin_vi': chu(g('xx')) or None,
            'desc_vi': cau_dau(full),          # TẠM theo phương án (a) của B2 — chờ team chốt
            'noi_bat_vi': noi_bat,             # CHỜ: cột "Điểm nổi bật" (điểm 1 tin nhắn gửi team)
            'desc_full_vi': full, 'applications_vi': ud, 'specs_vi': ts, 'keywords': tk,
            'doc_url': link or None, 'priority': uu_tien,
            'anh_thu_muc': anh, 'pdf_ten_file': chu(g('pdf')) or None,
            '_dong_excel': idx, '_trang_thai': trang_thai,
        }
        ban_ghi.append(b)
        bao_cao.append([idx, ma, ten, trang_thai, len(bien_the), len(noi_bat), len(ts), len(ud),
                        '; '.join(loi), '; '.join(canh)])

    # mã trùng trong cùng sheet
    dem = {}
    for b in ban_ghi:
        dem[b['part']] = dem.get(b['part'], 0) + 1
    for row in bao_cao:
        if dem[row[1]] > 1:
            row[8] = (row[8] + '; ' if row[8] else '') + 'Mã bị trùng trong sheet'

    # sản phẩm mẫu của hãng này trên web sẽ bị xóa (B5: xóa dần theo hãng)
    ma_moi = {b['part'] for b in ban_ghi}
    se_xoa = [p for p, v in WEB.items() if v['brand_slug'] == hang and p not in ma_moi]

    json.dump(ban_ghi, io.open(f'{RA}/lo-{sheet}.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

    # --- báo cáo Excel
    out = openpyxl.Workbook()
    w = out.active
    w.title = sheet
    BLUE = '005E96'
    thin = Side(style='thin', color='D4D9DE')
    box = Border(left=thin, right=thin, top=thin, bottom=thin)
    so_loi = sum(1 for r in bao_cao if r[8])
    w.cell(row=1, column=1, value=f'KIỂM THỬ NẠP — {sheet.upper()}: {len(ban_ghi)} sản phẩm · {so_loi} dòng có LỖI · '
                                     f'{sum(1 for r in bao_cao if r[3].startswith("GHI"))} ghi đè · '
                                     f'{sum(1 for r in bao_cao if r[3] == "THÊM MỚI")} thêm mới').font = Font(bold=True, size=13, color=BLUE)
    w.cell(row=2, column=1, value='Sản phẩm mẫu của hãng sẽ bị xóa (B5): ' + (', '.join(se_xoa) if se_xoa else 'không có'))
    H = ['Dòng Excel', 'Mã chính', 'Tên sản phẩm', 'Trạng thái', 'Số mã biến thể', 'Số ý nổi bật', 'Số dòng thông số',
         'Số ý ứng dụng', 'LỖI (phải sửa trước khi nạp)', 'Cảnh báo (bên kỹ thuật tự xử lý)']
    Wd = [9, 14, 36, 20, 9, 9, 9, 9, 34, 60]
    for j, h in enumerate(H, start=1):
        c = w.cell(row=4, column=j, value=h)
        c.font = Font(bold=True, color='FFFFFF')
        c.fill = PatternFill('solid', fgColor=BLUE)
        c.alignment = Alignment(wrap_text=True, vertical='center')
        c.border = box
        w.column_dimensions[get_column_letter(j)].width = Wd[j - 1]
    for i2, row in enumerate(bao_cao, start=5):
        for j, v in enumerate(row, start=1):
            c = w.cell(row=i2, column=j, value=v)
            c.alignment = Alignment(wrap_text=True, vertical='top')
            c.border = box
        if row[8]:
            w.cell(row=i2, column=9).fill = PatternFill('solid', fgColor='FDECEE')
    w.freeze_panes = 'A5'
    out.save(f'{RA}/lo-{sheet}-bao-cao.xlsx')
    tong[sheet] = (len(ban_ghi), so_loi, se_xoa)
    print(f'{sheet}: {len(ban_ghi)} sản phẩm, {so_loi} dòng có lỗi, sẽ xóa mẫu: {se_xoa}')
