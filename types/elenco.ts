// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImage = any

export type ElencoTipo = 'ator' | 'atriz' | 'estrangeiro'

export interface ElencoListItem {
  _id: string
  _type: ElencoTipo
  nome: string
  nomeEn?: string | null
  slug: { current?: string | null }
  fotoPrincipal?: SanityImage
  funcao?: string | null
  funcaoEn?: string | null
  destaque?: boolean | null
}

export interface ElencoProfile extends ElencoListItem {
  fotosExtras?: SanityImage[]
  /** Texto simples ou Portable Text (blocos Sanity). */
  biografia?: string | unknown[] | null
  biografiaEn?: string | unknown[] | null
  anoNascimento?: number | null
  altura?: string | null
  cidadeEstado?: string | null
  idiomas?: string[] | null
}
