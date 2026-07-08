import { defineQuery } from 'next-sanity'

const elencoListFields = `
  _id, _type, nome, nomeEn, slug, fotoPrincipal, funcao, funcaoEn, destaque
`

const elencoProfileFields = `
  _id, _type, nome, nomeEn, slug, fotoPrincipal, fotosExtras,
  biografia, biografiaEn, funcao, funcaoEn,
  anoNascimento, altura, cidadeEstado, idiomas, destaque
`

export const ATORES_QUERY = defineQuery(`
  *[_type == "ator"] | order(orderRank asc, nome asc) { ${elencoListFields} }
`)

export const ATRIZES_QUERY = defineQuery(`
  *[_type == "atriz"] | order(orderRank asc, nome asc) { ${elencoListFields} }
`)

export const ESTRANGEIROS_QUERY = defineQuery(`
  *[_type == "estrangeiro"] | order(orderRank asc, nome asc) { ${elencoListFields} }
`)

/** Home / filtros: todos os tipos de elenco. */
export const ELENCO_ALL_QUERY = defineQuery(`
  *[_type in ["ator", "atriz", "estrangeiro"]] | order(orderRank asc, nome asc) { ${elencoListFields} }
`)

/** Perfil: qualquer tipo de elenco pelo slug (slug único por documento). */
export const ELENCO_BY_SLUG_QUERY = defineQuery(`
  *[(_type == "ator" || _type == "atriz" || _type == "estrangeiro") && slug.current == $slug][0] { ${elencoProfileFields} }
`)

export const ELENCO_DESTAQUE_QUERY = defineQuery(`
  *[(_type == "ator" || _type == "atriz" || _type == "estrangeiro") && destaque == true] | order(orderRank asc, nome asc) {
    _id, _type, nome, nomeEn, slug, fotoPrincipal, funcao, funcaoEn
  }
`)

export const ATOR_BY_SLUG_QUERY = defineQuery(`
  *[_type == "ator" && slug.current == $slug][0] {
    _id, nome, slug, fotoPrincipal, fotosExtras,
    biografia, funcao, anoNascimento, altura, cidadeEstado, idiomas, destaque
  }
`)

export const ATRIZ_BY_SLUG_QUERY = defineQuery(`
  *[_type == "atriz" && slug.current == $slug][0] {
    _id, nome, slug, fotoPrincipal, fotosExtras,
    biografia, funcao, anoNascimento, altura, cidadeEstado, idiomas, destaque
  }
`)

export const ESTRANGEIRO_BY_SLUG_QUERY = defineQuery(`
  *[_type == "estrangeiro" && slug.current == $slug][0] {
    _id, nome, slug, fotoPrincipal, fotosExtras,
    biografia, funcao, anoNascimento, altura, cidadeEstado, idiomas, destaque
  }
`)

export const BANNERS_QUERY = defineQuery(`
  *[_type == "banner" && ativo == true] | order(ordem asc) {
    _id,
    imagemDesktop,
    imagemMobile,
    link,
    ordem
  }
`)

export const CONFIGURACOES_QUERY = defineQuery(`
  *[_type == "configuracoes"][0] {
    logo,
    redesSociais,
    textoContato,
    heroVideoUrl,
    heroTitulo,
    heroSubtexto,
    heroCtaTexto,
    heroCtaLink,
    homeAgenciaImagem
  }
`)

export const PRODUCOES_QUERY = defineQuery(`
  *[_type == "producao" && ativo == true] | order(ordem asc) {
    _id,
    titulo,
    imagem
  }
`)

export const VIDEOS_PRODUCOES_QUERY = defineQuery(`
  *[_type == "videoProducao" && ativo == true] | order(ordem asc) {
    _id,
    titulo,
    "videoUrl": video.asset->url,
    imagem
  }
`)

export const CRIATIVOS_QUERY = defineQuery(`
  *[_type == "criativo" && ativo == true] | order(orderRank asc, nome asc) {
    _id,
    nome,
    nomeEn,
    slug,
    funcao,
    funcaoEn,
    fotoPrincipal,
    biografiaCurta,
    biografiaCurtaEn,
    site,
    instagram
  }
`)

export const CRIATIVO_BY_SLUG_QUERY = defineQuery(`
  *[_type == "criativo" && slug.current == $slug][0] {
    _id,
    nome,
    nomeEn,
    slug,
    funcao,
    funcaoEn,
    fotoPrincipal,
    "heroDimensions": fotoPrincipal.asset->metadata.dimensions,
    biografiaCurta,
    biografiaCurtaEn,
    bloco1,
    bloco1En,
    galeria1,
    bloco2,
    bloco2En,
    galeria2,
    bloco3,
    bloco3En,
    galeria3,
    site,
    instagram
  }
`)
