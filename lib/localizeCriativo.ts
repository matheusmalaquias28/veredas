import { pickLocalizedContent, pickLocalizedString, type CmsLang } from '@/lib/localizedContent'
import type { Criativo } from '@/types/criativo'

export function localizeCriativo(criativo: Criativo, lang: CmsLang): Criativo {
  return {
    ...criativo,
    nome: pickLocalizedString(lang, criativo.nome, criativo.nomeEn),
    funcao: pickLocalizedString(lang, criativo.funcao, criativo.funcaoEn),
    biografiaCurta: pickLocalizedContent(
      lang,
      criativo.biografiaCurta,
      criativo.biografiaCurtaEn
    ) as Criativo['biografiaCurta'],
    bloco1: pickLocalizedContent(lang, criativo.bloco1, criativo.bloco1En) as Criativo['bloco1'],
    bloco2: pickLocalizedContent(lang, criativo.bloco2, criativo.bloco2En) as Criativo['bloco2'],
    bloco3: pickLocalizedContent(lang, criativo.bloco3, criativo.bloco3En) as Criativo['bloco3'],
  }
}
