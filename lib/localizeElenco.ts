import { pickLocalizedContent, pickLocalizedString, type CmsLang } from '@/lib/localizedContent'
import type { ElencoListItem, ElencoProfile } from '@/types/elenco'

export function localizeElencoProfile(artist: ElencoProfile, lang: CmsLang): ElencoProfile {
  return {
    ...artist,
    nome: pickLocalizedString(lang, artist.nome, artist.nomeEn),
    funcao: pickLocalizedString(lang, artist.funcao, artist.funcaoEn) || null,
    biografia: pickLocalizedContent(lang, artist.biografia, artist.biografiaEn) as ElencoProfile['biografia'],
  }
}

export function localizeElencoListItem(item: ElencoListItem, lang: CmsLang): ElencoListItem {
  return {
    ...item,
    nome: pickLocalizedString(lang, item.nome, item.nomeEn),
    funcao: pickLocalizedString(lang, item.funcao, item.funcaoEn) || null,
  }
}
