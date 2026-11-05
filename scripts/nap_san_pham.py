"""Nạp sản phẩm từ file Excel của KTD lên website, theo từng lô (từng hãng).

Chạy:  python scripts/nap_san_pham.py <file.xlsm> <Sheet> [<Sheet> ...]
           [--anh bang-ghep.json] [--dich thu-muc-ban-dich] [--ra thu-muc] [--ghi]

Mặc định là chế độ KIỂM: đọc file, chuyển từng dòng thành bản ghi sản phẩm
đúng khuôn của bảng products, so với dữ liệu đang có trên web, và xuất:
  - <ra>/lo-<sheet>.json          bản ghi sẽ được ghi (để soi trước khi nạp)
  - <ra>/lo-<sheet>-bao-cao.xlsx  danh sách lỗi và cảnh báo theo từng dòng Excel
KHÔNG ghi gì vào cơ sở dữ liệu hay kho ảnh.

--dich: thư mục chứa các file ra-*.json, mỗi phần tử {part, desc_vi, desc_en,
name_en, origin_en, noi_bat_en, desc_full_en, applications_en, specs_en}.
desc_vi ở đây là câu mô tả ngắn bên kỹ thuật viết riêng cho thẻ sản phẩm (team
chốt 05/11/2026), thay cho câu đầu của mô tả đầy đủ.

--ghi: ghi thật. Cần SUPABASE_SERVICE_ROLE_KEY trong .env.local, không có lỗi
nào trong báo cáo, và mọi sản phẩm phải có bản tiếng Anh. Thứ tự:
  1. sao lưu toàn bộ sản phẩm của hãng ra <ra>/sao-luu-<hãng>-<giờ>.json
  2. tải ảnh từ thư mục Drive trong bảng ghép, đổi sang webp 1000x750 nền trắng,
     đẩy lên kho products/<hãng>/<slug>-N.webp (tối đa 5 ảnh)
  3. xóa sản phẩm mẫu của hãng không có trong file (B5) — gồm cả mã cũ của B4,
     phải xóa trước vì bản mới dùng lại đường dẫn của nó
  4. ghi từng sản phẩm, trùng mã thì ghi đè (B3); featured/tag cũ được giữ
Cần chạy migration 0021 (cột highlights) trước.

Các quy tắc chuyển đổi đều theo câu trả lời của team ở file câu hỏi vòng 2:
  B1  ô có nhiều mã: mã đầu (hoặc mã sau "Mã chính:") là mã chính; các mã còn
      lại vào bảng thông số ("Các mã cùng dòng") và vào từ khóa tìm kiếm.
  B3  mã đã có trên web: ghi đè nội dung, GIỮ NGUYÊN slug để không chết đường dẫn.
  B4  10130610 / 124001 trên web được thay bằng bản có đuôi .02.
  B9  Rocklin, Tschorn: ô có hai mã -> một trang, mã thứ hai là mã biến thể.
  Phần C: ô ƯU TIÊN không phải số -> để trống; link hãng không bắt đầu bằng
      http -> bỏ; ứng dụng / thông số ngăn bằng ";" -> tách dòng.
"""
import io, json, os, re, sys, unicodedata, urllib.error, urllib.parse, urllib.request

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
DICH = None
GHI = False
RA = 'Hop-thu-den/kiem-nap'
SHEETS = []
i = 1
while i < len(args):
    if args[i] == '--anh':
        ANH = args[i + 1]; i += 2
    elif args[i] == '--ra':
        RA = args[i + 1]; i += 2
    elif args[i] == '--dich':
        DICH = args[i + 1]; i += 2
    elif args[i] == '--ghi':
        GHI = True; i += 1
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


def tach_vi_en(ds):
    """Ô có cả hai khối "VI:" và "EN:" (một số ô ỨNG DỤNG của Martor) -> (vi, en).
    Ô thường -> (ds, None)."""
    nhan = [x.rstrip(':').strip().upper() for x in ds]
    if 'VI' not in nhan or 'EN' not in nhan:
        return ds, None
    vi, en, dang = [], [], None
    for x, n in zip(ds, nhan):
        if n in ('VI', 'EN'):
            dang = n
            continue
        (en if dang == 'EN' else vi).append(x)
    return vi, en


def tach_co(paras):
    """Mô tả dán nguyên từ trang bán hàng (Martor 1792.25): khối "🇻🇳 ..." tiếng Việt,
    khối "🇬🇧 ..." tiếng Anh của hãng, cuối là đoạn "Cam kết & mua hàng".
    -> (vi, en), bỏ dòng tiêu đề cờ, dòng trước khối 🇻🇳 và đoạn bán hàng.
    Ô thường -> (paras, None)."""
    vt = [i for i, x in enumerate(paras) if x.startswith('🇻🇳')]
    gb = [i for i, x in enumerate(paras) if x.startswith('🇬🇧')]
    if not vt or not gb or vt[0] > gb[0]:
        return paras, None
    vi = paras[vt[0] + 1:gb[0]]
    en = paras[gb[0] + 1:]
    for i, x in enumerate(en):
        if VIET.search(x):
            en = en[:i]
            break
    return vi, en


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

# ----------------------------------------------------------------------------- bản dịch tiếng Anh + câu mô tả ngắn
ban_dich = {}
if DICH:
    for f in sorted(os.listdir(DICH)):
        if f.startswith('ra-') and f.endswith('.json'):
            for x in json.load(io.open(os.path.join(DICH, f), encoding='utf-8')):
                ban_dich[x['part']] = x
VIET = re.compile('[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]', re.I)


def ghep_dich(b, loi, ud_en, full_en):
    """Gắn bản tiếng Anh và câu mô tả ngắn viết riêng vào bản ghi."""
    d = ban_dich.get(b['part'])
    if not d:
        loi.append('Chưa có bản tiếng Anh')
        return
    b['desc_vi'] = d['desc_vi']
    for k in ('desc_en', 'name_en', 'origin_en', 'desc_full_en', 'applications_en', 'specs_en'):
        b[k] = d[k]
    b['highlights_en'] = d['noi_bat_en']
    # Ô ỨNG DỤNG đã có sẵn khối "EN:" do hãng viết: dùng thẳng khối đó.
    if ud_en is not None:
        b['applications_en'] = ud_en
    if full_en is not None:
        b['desc_full_en'] = full_en
    for k, vi in (('highlights_en', 'highlights_vi'), ('desc_full_en', 'desc_full_vi'),
                  ('applications_en', 'applications_vi'), ('specs_en', 'specs_vi')):
        if (ud_en is not None and k == 'applications_en') or (full_en is not None and k == 'desc_full_en'):
            continue
        if len(b[k]) != len(b[vi]):
            loi.append(f'Bản dịch {k} lệch số dòng ({len(b[k])} so với {len(b[vi])})')
    if VIET.search(json.dumps({k: v for k, v in b.items() if k.endswith('_en')}, ensure_ascii=False)):
        loi.append('Bản tiếng Anh còn chữ tiếng Việt')
    if not 40 <= len(b['desc_vi']) <= 160 or b['desc_vi'].endswith('…'):
        loi.append(f'Câu mô tả ngắn dài {len(b["desc_vi"])} ký tự')
    b['en_status'] = 'máy dịch'


# ----------------------------------------------------------------------------- chế độ ghi
BUCKET = 'ktd'
COT_GHI = ['part', 'slug', 'brand_slug', 'category_slug', 'name_vi', 'name_en', 'series', 'origin_vi',
           'origin_en', 'desc_vi', 'desc_en', 'desc_full_vi', 'desc_full_en', 'applications_vi',
           'applications_en', 'specs_vi', 'specs_en', 'highlights_vi', 'highlights_en', 'keywords',
           'doc_url', 'priority', 'images', 'en_status']


def goi(method, path, body=None, headers=None, data=None):
    k = env['SUPABASE_SERVICE_ROLE_KEY']
    h = {'apikey': k, 'Authorization': 'Bearer ' + k}
    h.update(headers or {})
    if body is not None:
        data = json.dumps(body, ensure_ascii=False).encode('utf-8')
        h['Content-Type'] = 'application/json'
    req = urllib.request.Request(env['NEXT_PUBLIC_SUPABASE_URL'] + path, data=data, method=method, headers=h)
    try:
        t = urllib.request.urlopen(req, timeout=120).read()
        return json.loads(t) if t else None
    except urllib.error.HTTPError as e:
        sys.exit(f'LỖI {e.code} {method} {path[:80]}: {e.read()[:300]!r}')


def tep_trong_thu_muc(fid):
    """Ảnh trong một thư mục Drive công khai, đọc lúc chạy (team có thể vừa thêm ảnh)."""
    import html as H
    req = urllib.request.Request(f'https://drive.google.com/embeddedfolderview?id={fid}',
                                 headers={'User-Agent': 'Mozilla/5.0'})
    t = urllib.request.urlopen(req, timeout=60).read().decode('utf-8', 'ignore')
    out = []
    for m in re.finditer(r'<div class="flip-entry" id="entry-([\w-]+)".*?<a href="([^"]+)".*?'
                         r'class="flip-entry-title">([^<]*)<', t, flags=re.S):
        ten = H.unescape(m.group(3))
        if '/folders/' not in m.group(2) and not ten.lower().endswith('.pdf'):
            out.append((ten, m.group(1)))
    so = lambda ten: [int(x) if x.isdigit() else x.lower() for x in re.split(r'(\d+)', ten)]
    return sorted(out, key=lambda x: so(x[0]))


_kho_tai = {}


def anh_webp(file_id):
    """Tải một ảnh từ Drive -> webp 1000x750 nền trắng, như ảnh đang có trên web.
    Nhớ theo id tệp: các mã dùng chung thư mục chỉ tải một lần."""
    if file_id in _kho_tai:
        return _kho_tai[file_id]
    from PIL import Image
    req = urllib.request.Request(f'https://drive.google.com/uc?export=download&id={file_id}',
                                 headers={'User-Agent': 'Mozilla/5.0'})
    raw = urllib.request.urlopen(req, timeout=300).read()
    if raw[:15].lower().startswith(b'<!doctype html'):
        # Tệp quá lớn để Drive quét virus (có ảnh Martor tới 103 MB): Drive trả
        # trang hỏi "Download anyway" — gửi lại đúng các ô ẩn của form đó.
        t = raw.decode('utf-8', 'ignore')
        form = re.search(r'<form id="download-form" action="([^"]+)"(.*?)</form>', t, re.S)
        if not form:
            sys.exit(f'Drive không cho tải tệp {file_id}')
        q = urllib.parse.urlencode(re.findall(r'name="([^"]+)" value="([^"]*)"', form.group(2)))
        req = urllib.request.Request(form.group(1) + '?' + q, headers={'User-Agent': 'Mozilla/5.0'})
        raw = urllib.request.urlopen(req, timeout=600).read()
    Image.MAX_IMAGE_PIXELS = None  # ảnh gốc của hãng rất lớn, nguồn tin cậy
    im = Image.open(io.BytesIO(raw))
    im.load()
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA')
        nen = Image.new('RGBA', im.size, (255, 255, 255, 255))
        nen.alpha_composite(im)
        im = nen
    im = im.convert('RGB')
    im.thumbnail((1000, 750), Image.LANCZOS)
    khung = Image.new('RGB', (1000, 750), (255, 255, 255))
    khung.paste(im, ((1000 - im.width) // 2, (750 - im.height) // 2))
    buf = io.BytesIO()
    khung.save(buf, 'WEBP', quality=85)
    _kho_tai[file_id] = buf.getvalue()
    return _kho_tai[file_id]


def ghi_lo(hang, ban_ghi, se_xoa):
    import datetime
    if 'SUPABASE_SERVICE_ROLE_KEY' not in env:
        sys.exit('Thiếu SUPABASE_SERVICE_ROLE_KEY trong .env.local')
    thieu_en = [b['part'] for b in ban_ghi if not b.get('name_en')]
    if thieu_en:
        sys.exit(f'Còn {len(thieu_en)} sản phẩm chưa có tiếng Anh: {thieu_en[:5]}')

    # 1. sao lưu
    gio = datetime.datetime.now().strftime('%Y%m%d-%H%M')
    cu = goi('GET', f'/rest/v1/products?select=*&brand_slug=eq.{hang}')
    f = f'{RA}/sao-luu-{hang}-{gio}.json'
    json.dump(cu, io.open(f, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'  sao lưu {len(cu)} sản phẩm -> {f}')

    # 2. ảnh — chưa có thư mục thì giữ ảnh đang có trên web (nếu có)
    for n, b in enumerate(ban_ghi, start=1):
        b['images'] = b['_anh_cu']
        a = b.get('anh_thu_muc')
        if not a:
            continue
        duong = []
        for j, (_, fid) in enumerate(tep_trong_thu_muc(a['id'])[:5], start=1):
            kho = f'products/{hang}/{b["slug"]}-{j}.webp'
            goi('POST', f'/storage/v1/object/{BUCKET}/{kho}', data=anh_webp(fid),
                headers={'Content-Type': 'image/webp', 'x-upsert': 'true'})
            duong.append(kho)
        if duong:
            b['images'] = duong
        print(f'  ảnh {n:>3}/{len(ban_ghi)}  {b["part"]:<14} {len(duong)} ảnh')

    # 3. xóa mẫu (B5) và mã cũ (B4) — trước khi ghi, vì bản mới dùng lại slug
    for p in se_xoa:
        goi('DELETE', f'/rest/v1/products?part=eq.{urllib.parse.quote(p)}')
        print(f'  xóa {p}')

    # 4. ghi; không gửi featured/tag nên giá trị cũ được giữ
    for b in ban_ghi:
        goi('POST', '/rest/v1/products?on_conflict=part', body={k: b.get(k) for k in COT_GHI},
            headers={'Prefer': 'resolution=merge-duplicates,return=minimal'})
    print(f'  ghi {len(ban_ghi)} sản phẩm')

    con = doc(f'products?select=part&brand_slug=eq.{hang}')
    print(f'  kiểm lại: trên web có {len(con)} sản phẩm {hang}')


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
        full, full_en = tach_co(doan(g('full')))
        if not full:
            loi.append('Thiếu mô tả đầy đủ')
        noi_bat = dong(g('nb'))
        ud, ud_en = tach_vi_en(dong(g('ud')))
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
            'desc_vi': cau_dau(full),          # chỉ dùng khi chưa có --dich; bản dịch thay bằng câu viết riêng
            'highlights_vi': noi_bat,          # khối "Điểm nổi bật", team chốt 05/11/2026
            'desc_full_vi': full, 'applications_vi': ud, 'specs_vi': ts, 'keywords': tk,
            'doc_url': link or None, 'priority': uu_tien,
            'anh_thu_muc': anh, 'pdf_ten_file': chu(g('pdf')) or None,
            '_dong_excel': idx, '_trang_thai': trang_thai,
            '_anh_cu': (cu or {}).get('images') or [],
        }
        if DICH:
            ghep_dich(b, loi, ud_en, full_en)
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

    if GHI:
        if so_loi:
            sys.exit(f'{sheet}: còn {so_loi} dòng có lỗi — sửa xong mới ghi được. Xem báo cáo.')
        ghi_lo(hang, ban_ghi, se_xoa)
