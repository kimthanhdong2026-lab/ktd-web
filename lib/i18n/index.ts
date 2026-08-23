import { DEFAULT_LOCALE, type Locale } from './config'
import { vi, type Dictionary } from './vi'
import { en } from './en'

export type { Dictionary }
export * from './config'

const DICTS: Record<Locale, Dictionary> = { vi, en }

/** Từ điển cho một ngôn ngữ. Đồng bộ, không cần await. */
export const dict = (lang: Locale): Dictionary => DICTS[lang] ?? DICTS[DEFAULT_LOCALE]
