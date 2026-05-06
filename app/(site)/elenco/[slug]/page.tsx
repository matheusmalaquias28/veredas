import Image from 'next/image'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import {
  ELENCO_BY_SLUG_QUERY,
  ATORES_QUERY,
  ATRIZES_QUERY,
  ESTRANGEIROS_QUERY,
} from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { ElencoListItem, ElencoProfile, ElencoTipo } from '@/types/elenco'
import ElencoDownloadButton from '@/components/ElencoDownloadButton'
import ElencoProfileInfo from '@/components/ElencoProfileInfo'
import { portableTextToPlain } from '@/lib/portableTextToPlain'

export const revalidate = 60


export async function generateStaticParams() {
  const [atores, atrizes, estrangeiros] = await Promise.all([
    client.fetch(ATORES_QUERY),
    client.fetch(ATRIZES_QUERY),
    client.fetch(ESTRANGEIROS_QUERY),
  ])
  const merged: ElencoListItem[] = [...atores, ...atrizes, ...estrangeiros]
  const slugs = merged.map((x) => x.slug?.current).filter((s): s is string => Boolean(s))
  const unique = [...new Set(slugs)]
  return unique.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const artist: ElencoProfile | null = await client.fetch(ELENCO_BY_SLUG_QUERY, { slug })
  if (!artist) return { title: 'Elenco — Veredas' }
  const desc = portableTextToPlain(artist.biografia)
  return {
    title: `${artist.nome} — Veredas`,
    description: desc || undefined,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Gallery({ images }: { images: any[] }) {
  if (!images?.length) return null
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
      {images.map((img, i) => {
        const u = img?.asset ? urlFor(img).width(900).fit('max').url() : null
        if (!u) return null
        return (
          <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-xl">
            <Image src={u} alt="" fill sizes="(max-width: 767px) 45vw, 28vw" className="object-cover" />
          </div>
        )
      })}
    </div>
  )
}

export default async function ElencoProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const artist: ElencoProfile | null = await client.fetch(ELENCO_BY_SLUG_QUERY, { slug })
  if (!artist) notFound()

  const heroUrl = artist.fotoPrincipal?.asset
    ? urlFor(artist.fotoPrincipal).width(1000).height(1333).fit('crop').url()
    : null

  return (
    <main className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full shrink-0 md:w-[45%] md:sticky md:top-0 md:h-screen">
          {heroUrl ? (
            <Image
              src={heroUrl}
              alt={artist.nome}
              fill
              priority
              sizes="(max-width: 767px) 100vw, 45vw"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full min-h-[60vw] bg-neutral-100 md:min-h-0" />
          )}
          <div className="aspect-[3/4] w-full md:hidden" aria-hidden />
        </div>

        <ElencoProfileInfo artist={artist} />
      </div>

      {artist.fotosExtras && artist.fotosExtras.length > 0 && (
        <div className="mx-auto max-w-5xl px-6 pb-20 md:px-10">
          <div className="mb-8 h-px bg-neutral-100" />
          <Gallery images={artist.fotosExtras} />
        </div>
      )}

      <ElencoDownloadButton artist={artist} />
    </main>
  )
}
