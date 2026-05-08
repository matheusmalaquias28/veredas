import { client } from '@/sanity/lib/client'
import { ATORES_QUERY } from '@/sanity/lib/queries'
import ElencoAccordionGrid from '@/components/ElencoAccordionGrid'
import PageTitle from '@/components/PageTitle'
import type { ElencoListItem } from '@/types/elenco'

export const revalidate = 60

export const metadata = {
  title: 'Atores — Veredas',
  description: 'Elenco de atores — Veredas Agenciamento Artístico.',
}

export default async function AtoresPage() {
  const artists: ElencoListItem[] = await client.fetch(ATORES_QUERY)
  const normalizeName = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()

  const priorityOrder = [
    'Guilherme Rodio',
    'João Pedro Mariano',
    'Sandro Guerra',
    'Vini Ranieri',
    'Fernando Moscardi',
    'Lucas Oranmian',
    'Herberth Vital',
    'Odá Silva',
    'Fernando Possani',
    'Lucas Limeira',
    'Renato Luciano',
    'Davi Françoá',
    'Alexandre Ammano',
  ]
  const priorityIndex = new Map(priorityOrder.map((name, index) => [normalizeName(name), index]))
  const sortedArtists = [...artists].sort((a, b) => {
    const aIndex = priorityIndex.get(normalizeName(a.nome))
    const bIndex = priorityIndex.get(normalizeName(b.nome))
    if (aIndex != null && bIndex != null) return aIndex - bIndex
    if (aIndex != null) return -1
    if (bIndex != null) return 1
    return a.nome.localeCompare(b.nome, 'pt-BR')
  })

  return (
    <main className="min-h-screen bg-background pb-28">
      <PageTitle pageKey="atores" />
      <div className="px-6 md:px-10">
        <ElencoAccordionGrid artists={sortedArtists} />
      </div>
    </main>
  )
}
