/**
 * Normalize Vietnamese text: strip diacritics, lowercase, trim
 * Converts "Đặc Biệt" → "dac biet", "Mũi Mài" → "mui mai", etc.
 */
export function normalizeText(text: string): string {
  if (!text) return ''
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // Remove combining marks
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim()
}

/**
 * Levenshtein distance: edit distance between two strings
 * Used for fuzzy matching with tolerance ≤2
 */
export function levenshteinDistance(a: string, b: string): number {
  const aLen = a.length
  const bLen = b.length

  if (aLen === 0) return bLen
  if (bLen === 0) return aLen

  const matrix: number[][] = Array(bLen + 1)
    .fill(null)
    .map(() => Array(aLen + 1).fill(0))

  for (let i = 0; i <= aLen; i++) matrix[0][i] = i
  for (let j = 0; j <= bLen; j++) matrix[j][0] = j

  for (let j = 1; j <= bLen; j++) {
    for (let i = 1; i <= aLen; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      )
    }
  }

  return matrix[bLen][aLen]
}

/**
 * Generate URL-safe slug from text
 */
export function createSlug(text: string, suffix?: string): string {
  const base = normalizeText(text)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50)

  return suffix ? `${base}-${suffix}` : base
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + ' ' + sizes[i]
}

/**
 * Validate Vietnamese phone number
 */
export function isValidPhone(phone: string): boolean {
  return /^\d{10,11}$/.test(phone.replace(/[^\d]/g, ''))
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Generate RFQ code: RFQ-YYMMDD-XXX
 */
export function generateRFQCode(): string {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(-2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const rand = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
  return `RFQ-${yy}${mm}${dd}-${rand}`
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Parse comma-separated or semicolon-separated keywords into array
 */
export function parseKeywords(text: string): string[] {
  return text
    .split(/[,;]/)
    .map((k) => k.trim())
    .filter(Boolean)
}
