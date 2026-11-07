import type { ReactNode } from 'react'

/**
 * Thân bài viết. Mỗi phần tử của `doan` là một dòng admin gõ trong trang quản
 * trị; vài ký hiệu đầu dòng cho phép bài có cấu trúc mà không cần trình soạn
 * thảo phức tạp:
 *
 *   ## Tiêu đề mục        ### Tiêu đề nhỏ
 *   - Một ý trong danh sách (các dòng "- " liền nhau gộp thành một danh sách)
 *   ![](đường dẫn ảnh)    ảnh trong bài
 *   | ô 1 | ô 2 | ô 3 |    một hàng bảng; hàng đầu là hàng tiêu đề
 *   **chữ đậm** dùng được ở mọi dòng.
 *
 * Dòng thường là một đoạn văn — giống hệt cách hiện trước đây.
 */

const DOAN = 'mb-5 text-[17px] leading-[1.8] text-ink-700'

/** "**đậm**" → <strong>. */
function chu(s: string): ReactNode {
  const phan = s.split(/(\*\*[^*]+\*\*)/g)
  if (phan.length === 1) return s
  return phan.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') && p.length > 4 ? (
      <strong key={i} className="font-semibold text-ink-900">{p.slice(2, -2)}</strong>
    ) : (
      p
    )
  )
}

type Khoi =
  | { loai: 'p' | 'h2' | 'h3'; chu: string }
  | { loai: 'ul'; dong: string[] }
  | { loai: 'img'; src: string }
  | { loai: 'table'; hang: string[][] }

function tachKhoi(doan: string[]): Khoi[] {
  const ra: Khoi[] = []
  for (const goc of doan) {
    const d = goc.trim()
    if (!d) continue
    const cuoi = ra[ra.length - 1]
    const anh = d.match(/^!\[[^\]]*\]\((\S+)\)$/)
    if (anh) ra.push({ loai: 'img', src: anh[1] })
    else if (d.startsWith('### ')) ra.push({ loai: 'h3', chu: d.slice(4) })
    else if (d.startsWith('## ')) ra.push({ loai: 'h2', chu: d.slice(3) })
    else if (d.startsWith('- ')) {
      if (cuoi?.loai === 'ul') cuoi.dong.push(d.slice(2))
      else ra.push({ loai: 'ul', dong: [d.slice(2)] })
    } else if (d.startsWith('|') && d.endsWith('|') && d.length > 2) {
      const o = d.slice(1, -1).split('|').map((x) => x.trim())
      if (cuoi?.loai === 'table') cuoi.hang.push(o)
      else ra.push({ loai: 'table', hang: [o] })
    } else ra.push({ loai: 'p', chu: d })
  }
  return ra
}

export function ThanBai({ doan }: { doan: string[] }) {
  return (
    <>
      {tachKhoi(doan).map((k, i) => {
        switch (k.loai) {
          case 'h2':
            return <h2 key={i} className="mb-4 mt-9 font-display text-[24px] font-bold leading-snug text-ink-900">{chu(k.chu)}</h2>
          case 'h3':
            return <h3 key={i} className="mb-3 mt-7 font-display text-[19px] font-bold leading-snug text-ink-900">{chu(k.chu)}</h3>
          case 'ul':
            return (
              <ul key={i} className={`${DOAN} list-disc space-y-1.5 pl-6 marker:text-ktd-600`}>
                {k.dong.map((d, j) => <li key={j}>{chu(d)}</li>)}
              </ul>
            )
          case 'img':
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={k.src} alt="" loading="lazy" className="mx-auto mb-6 h-auto max-w-full rounded-lg" />
            )
          case 'table':
            return (
              <div key={i} className="mb-6 overflow-x-auto rounded-lg border border-hairline">
                <table className="w-full border-collapse text-[14px] text-ink-700">
                  <thead>
                    <tr className="bg-surface text-left text-ink-900">
                      {k.hang[0].map((o, j) => <th key={j} className="whitespace-nowrap border-b border-hairline px-3 py-2 font-semibold">{chu(o)}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {k.hang.slice(1).map((h, j) => (
                      <tr key={j} className="border-b border-hairline last:border-0">
                        {h.map((o, m) => <td key={m} className="whitespace-nowrap px-3 py-1.5">{chu(o)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          default:
            return <p key={i} className={DOAN}>{chu(k.chu)}</p>
        }
      })}
    </>
  )
}
