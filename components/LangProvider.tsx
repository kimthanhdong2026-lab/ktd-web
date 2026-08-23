'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { DEFAULT_LOCALE, dict, href, type Dictionary, type Locale } from '@/lib/i18n'

interface LangValue {
  lang: Locale
  /** Từ điển của ngôn ngữ hiện tại. */
  t: Dictionary
  /** Dựng đường dẫn có tiền tố ngôn ngữ đúng. */
  path: (p: string) => string
}

const Ctx = createContext<LangValue>({
  lang: DEFAULT_LOCALE,
  t: dict(DEFAULT_LOCALE),
  path: (p) => p,
})

/**
 * Chỉ truyền xuống một chuỗi `lang`, không truyền cả từ điển.
 *
 * Từ điển có chứa hàm (ví dụ `heading(n)`) mà hàm thì không đi qua ranh giới
 * máy chủ — trình duyệt được nên component tự nhập từ điển theo `lang`.
 */
export function LangProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  return (
    <Ctx.Provider value={{ lang, t: dict(lang), path: (p) => href(p, lang) }}>
      {children}
    </Ctx.Provider>
  )
}

export const useLang = () => useContext(Ctx)
