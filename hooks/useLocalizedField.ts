'use client'

import { useLang } from '@/contexts/LanguageContext'
import { pickLocalizedContent, pickLocalizedString } from '@/lib/localizedContent'

export function useLocalizedField() {
  const { lang } = useLang()

  return {
    lang,
    string: (pt?: string | null, en?: string | null) => pickLocalizedString(lang, pt, en),
    content: (pt: unknown, en: unknown) => pickLocalizedContent(lang, pt, en),
  }
}
