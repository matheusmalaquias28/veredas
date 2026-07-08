// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImage = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PortableTextBlock = any[]

export interface Criativo {
  _id: string
  nome: string
  nomeEn?: string | null
  slug: { current: string }
  funcao: string
  funcaoEn?: string | null
  fotoPrincipal?: SanityImage
  biografiaCurta?: PortableTextBlock
  biografiaCurtaEn?: PortableTextBlock
  bloco1?: PortableTextBlock
  bloco1En?: PortableTextBlock
  galeria1?: SanityImage[]
  bloco2?: PortableTextBlock
  bloco2En?: PortableTextBlock
  galeria2?: SanityImage[]
  bloco3?: PortableTextBlock
  bloco3En?: PortableTextBlock
  galeria3?: SanityImage[]
  site?: string
  instagram?: string
  heroDimensions?: { width?: number; height?: number }
}
