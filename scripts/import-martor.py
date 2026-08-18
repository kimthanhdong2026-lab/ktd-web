# Đọc file Excel mô tả sản phẩm Martor + thư mục ảnh, xuất ra manifest.json
# để bước sau (Node + sharp) nén ảnh và sinh dữ liệu TypeScript.
#
# Chạy: python scripts/import-martor.py
import json, os, re, unicodedata, zipfile
from xml.etree import ElementTree as ET

XLSX = 'Hop-thu-den/MARTOR_noi_dung_mô tả sản phẩm (1).xlsx'
IMG_ROOT = 'Hop-thu-den/Martor'
NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'

# Hai thư mục trùng tên với nhiều dòng Excel — chốt mã hàng theo tên file ảnh.
PART_OVERRIDE = {
    'SECUNORM MIZAR': '125002.02',
    'SECUNORM SMARTCUT': '110000.02',
}
# Ảnh bị xếp nhầm thư mục, loại ra để không lẫn sản phẩm.
EXCLUDE = {
    'SECUMAX 150': ['125001'],
    'SECUNORM SMARTCUT': ['110700'],
}

def read_rows():
    z = zipfile.ZipFile(XLSX)
    shared = [''.join(t.text or '' for t in si.iter(f'{NS}t'))
              for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall(f'{NS}si')]
    rows = []
    for row in ET.fromstring(z.read('xl/worksheets/sheet2.xml')).iter(f'{NS}row'):
        cells = []
        for c in row.findall(f'{NS}c'):
            v = c.find(f'{NS}v')
            t = c.get('t')
            cells.append(shared[int(v.text)] if (t == 's' and v is not None)
                         else (v.text if v is not None else ''))
        if any(cells):
            rows.append(cells + [''] * (8 - len(cells)))
    return rows[1:]

def norm(x):
    x = unicodedata.normalize('NFD', x).encode('ascii', 'ignore').decode().upper()
    return re.sub(r'[^A-Z0-9]+', ' ', x).strip()

def part_of(row):
    """Mã hàng lấy từ phần mô tả (cột PART NUMBER bị Excel đổi thành số, mất số 0 cuối)."""
    m = re.search(r'No\.\s*([0-9][0-9.]*[0-9])', row[4])
    return m.group(1) if m else None

def vi_only(text):
    """Bỏ phần tiếng Anh, chỉ giữ phần tiếng Việt."""
    text = re.sub(r'^\s*🇻🇳?\s*MÔ TẢ SẢN PHẨM\s*', '', text)
    for marker in ('EN:', '🇬🇧'):
        if marker in text:
            text = text.split(marker)[0]
    return text.replace('VI:', '').strip()

def paragraphs(text):
    return [p.strip() for p in vi_only(text).split('\n') if p.strip()]

def bullets(text):
    out = []
    for line in vi_only(text).split('\n'):
        line = line.strip().lstrip('•').strip()
        if line:
            out.append(line)
    return out

def order_images(names, model, part):
    digits = re.sub(r'\D', '', part or '')[:6]
    def rank(n):
        u = n.upper()
        if 'NO.' in u or (digits and digits in re.sub(r'\D', '', n)):
            return 0
        if norm(model).split()[-1] in norm(n):
            return 1
        return 2
    return sorted(names, key=lambda n: (rank(n), n))

rows = read_rows()
folders = [d for d in sorted(os.listdir(IMG_ROOT))
           if os.path.isdir(os.path.join(IMG_ROOT, d)) and os.listdir(os.path.join(IMG_ROOT, d))]

items = []
for folder in folders:
    key = norm(folder)
    hits = [r for r in rows if key in norm(r[2])]
    if folder in PART_OVERRIDE:
        hits = [r for r in hits if part_of(r) == PART_OVERRIDE[folder]]
    if len(hits) != 1:
        print(f'!! bỏ qua {folder}: khớp {len(hits)} dòng')
        continue
    row = hits[0]
    part = part_of(row)

    name = re.sub(r'^Dao an toàn\s+', '', row[2]).strip()
    m = re.match(r'(SECUPRO|SECUMAX|SECUNORM|SCALPEL)', norm(name))
    series = m.group(1) if m else (norm(name).split()[-1] if name else 'MARTOR')

    files = [f for f in os.listdir(os.path.join(IMG_ROOT, folder))
             if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    for bad in EXCLUDE.get(folder, []):
        files = [f for f in files if bad not in f]
    files = order_images(files, name, part)[:5]

    pdfs = [f for f in os.listdir(os.path.join(IMG_ROOT, folder)) if f.lower().endswith('.pdf')]

    items.append({
        'folder': folder,
        'part': part,
        'name': name,
        'series': series,
        'paragraphs': paragraphs(row[4]),
        'applications': bullets(row[5]),
        'docUrl': row[6].strip() if row[6].strip().startswith('http') else '',
        'images': files,
        'pdf': pdfs[0] if pdfs else '',
    })

json.dump(items, open('scripts/martor-manifest.json', 'w', encoding='utf-8'),
          ensure_ascii=False, indent=1)
print(f'đã ghi manifest: {len(items)} sản phẩm')
for it in items:
    print(f"  {it['part']:<14} {it['name']:<28} {len(it['images'])} ảnh"
          f"{'  +pdf' if it['pdf'] else ''}{'  +link' if it['docUrl'] else ''}")
