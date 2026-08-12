const COMBINING_MARKS = /[̀-ͯ]/g

/**
 * Vietnamese-insensitive normalization: lowercase, strip tone marks, fold đ → d.
 * Lets an engineer type "mui mai" and still hit "mũi mài" (spec C4).
 */
export function normalizeVi(input: unknown): string {
  return String(input ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .replace(/đ/g, 'd')
    .trim()
}

/** URL-safe slug: lowercase, unaccented, hyphen-separated (spec C0). */
export function slugify(input: string): string {
  return normalizeVi(input)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Levenshtein distance, used to tolerate light typos in search (spec C4: ≤ 2). */
export function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (!m) return n
  if (!n) return m

  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  let curr = new Array<number>(n + 1)

  for (let i = 1; i <= m; i++) {
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
    }
    ;[prev, curr] = [curr, prev]
  }
  return prev[n]
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
