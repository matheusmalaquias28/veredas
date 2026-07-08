export type CmsLang = 'pt' | 'en'

function hasContent(value: unknown): boolean {
  if (value == null) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return false
}

/** Texto simples: usa EN se existir e lang === 'en', senão PT. */
export function pickLocalizedString(
  lang: CmsLang,
  pt?: string | null,
  en?: string | null
): string {
  if (lang === 'en' && en?.trim()) return en.trim()
  return pt?.trim() ?? ''
}

/** Portable Text ou string: fallback para PT quando EN estiver vazio. */
export function pickLocalizedContent(
  lang: CmsLang,
  pt: unknown,
  en: unknown
): unknown | null | undefined {
  if (lang === 'en' && hasContent(en)) return en
  return pt
}

export function hasCmsContent(value: unknown): boolean {
  return hasContent(value)
}
