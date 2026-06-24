// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImage = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PortableTextBlock = any[]

export interface Criativo {
  _id: string
  nome: string
  slug: { current: string }
  funcao: string
  fotoPrincipal?: SanityImage
  biografiaCurta?: PortableTextBlock
  bloco1?: PortableTextBlock
  galeria1?: SanityImage[]
  bloco2?: PortableTextBlock
  galeria2?: SanityImage[]
  bloco3?: PortableTextBlock
  galeria3?: SanityImage[]
  site?: string
  instagram?: string
  heroDimensions?: { width?: number; height?: number }
}
