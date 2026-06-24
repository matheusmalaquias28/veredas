function normalizeTitle(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

/** Ordem dos cartazes na home (Sanity continua com `ordem` para outras telas). */
const HOME_PRODUCOES_ORDER = [
  'Tremembé',
  'O Agente Secreto',
  'Emergência Radioativa',
  'Ainda Estou Aqui',
  'O Filho de Mil Homens',
  'Volta Por Cima',
  'Baby',
  'Psica',
  'Maria e o Cangaço',
  'Garota do Momento',
  'Rogéria',
  'Cangaço Novo',
  '7 Prisioneiros',
  'Bandida Número 1',
  'A Batalha da Rua Maria Antônia',
  'Criadas',
  'Éta Mundo Melhor',
  'De Volta aos 15',
  'Estranho Caminho',
  'Retrato de um Certo Oriente',
  'Santo',
  'Arca de Noé',
  'Levante',
  'Depois Que Tudo Mudou',
  'Me Chama de Bruna',
  'Notícias Populares',
  'Dois Tempos',
  'Desalma',
] as const

const ORDER_ALIASES: Record<string, number> = {
  tremembe: 0,
  agentesecreto: 1,
  oagentesecreto: 1,
  emergenciaradiotiva: 2,
  emergenciaradioativa: 2,
  aindaestouaqui: 3,
  ofilhodemilhomens: 4,
  voltaporcima: 5,
  baby: 6,
  psica: 7,
  pssica: 7,
  mariaeocangaco: 8,
  garotadomomento: 9,
  rogeria: 10,
  cangaconovo: 11,
  '7prisioneiros': 12,
  seteprisioneiros: 12,
  bandidanumero1: 13,
  bandidaonumero1: 13,
  abatalhadaruamariaantonia: 14,
  criadas: 15,
  etamundomelhor: 16,
  devoltaaos15: 17,
  estranhocaminho: 18,
  retratodeumcertooriente: 19,
  santo: 20,
  arcadenoe: 21,
  levante: 22,
  depoisquetudomudou: 23,
  mechamadebruna: 24,
  noticiaspopulares: 25,
  doistempos: 26,
  desalma: 27,
}

function orderIndexForTitle(titulo?: string | null): number {
  if (!titulo) return Number.MAX_SAFE_INTEGER

  const normalized = normalizeTitle(titulo)
  if (normalized in ORDER_ALIASES) return ORDER_ALIASES[normalized]

  const fromList = HOME_PRODUCOES_ORDER.findIndex(
    (item) => normalizeTitle(item) === normalized
  )
  if (fromList !== -1) return fromList

  const partial = HOME_PRODUCOES_ORDER.findIndex((item) => {
    const key = normalizeTitle(item)
    return normalized.includes(key) || key.includes(normalized)
  })
  if (partial !== -1) return partial

  return Number.MAX_SAFE_INTEGER
}

export function sortProducoesForHome<T extends { titulo?: string | null }>(producoes: T[]): T[] {
  return [...producoes].sort((a, b) => {
    const indexDiff = orderIndexForTitle(a.titulo) - orderIndexForTitle(b.titulo)
    if (indexDiff !== 0) return indexDiff
    return normalizeTitle(a.titulo ?? '').localeCompare(normalizeTitle(b.titulo ?? ''))
  })
}
