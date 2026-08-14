import Image from 'next/image'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { CRIATIVO_BY_SLUG_QUERY, CRIATIVOS_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Criativo } from '@/types/criativo'
import CriativoDownloadButton from '@/components/CriativoDownloadButton'
import { CriativoBackLink, CriativoListCta } from '@/components/CriativoPageLinks'
import { CriativoProfileBody, CriativoProfileHeroText } from '@/components/CriativoProfileContent'
import LocalizedHireForm from '@/components/LocalizedHireForm'
import { portableTextToPlain } from '@/lib/portableTextToPlain'

export const revalidate = 60

export async function generateStaticParams() {
  const criativos: Criativo[] = await client.fetch(CRIATIVOS_QUERY)
  return criativos.map((c) => ({ slug: c.slug?.current }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const criativo: Criativo | null = await client.fetch(CRIATIVO_BY_SLUG_QUERY, { slug })
  if (!criativo) return { title: 'Criativo — Veredas' }
  const desc = portableTextToPlain(criativo.biografiaCurta)
  return {
    title: `${criativo.nome} — Veredas`,
    description: desc || undefined,
  }
}

export default async function CriativoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const criativo: Criativo | null = await client.fetch(CRIATIVO_BY_SLUG_QUERY, { slug })
  if (!criativo) notFound()

  const heroDims = criativo.heroDimensions
  const heroAspectW = heroDims?.width ?? 3
  const heroAspectH = heroDims?.height ?? 4

  const heroUrl =
    criativo.fotoPrincipal?.asset?._ref
      ? urlFor(criativo.fotoPrincipal).width(1920).fit('max').quality(90).url()
      : null

  return (
    <main className="min-h-screen bg-black text-neutral-200">
      <CriativoBackLink />

      {/* Hero full-bleed */}
      <section className="relative h-[50svh] min-h-[50svh] w-full overflow-hidden bg-black md:h-[100svh] md:min-h-[100svh]">
        {heroUrl ? (
          <div className="absolute inset-0 flex items-start justify-center">
            <div
              className="relative h-full w-auto max-w-full shrink-0"
              style={{ aspectRatio: `${heroAspectW} / ${heroAspectH}` }}
            >
              <Image
                src={heroUrl}
                alt={criativo.nome}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />

              {/* Mescla nas bordas da imagem */}
              <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
                <div className="absolute inset-y-0 left-0 w-[22%] bg-gradient-to-r from-black to-transparent" />
                <div className="absolute inset-y-0 right-0 w-[22%] bg-gradient-to-l from-black to-transparent" />
                <div className="absolute inset-x-0 top-0 h-[14%] bg-gradient-to-b from-black to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-black via-black/80 to-transparent" />
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-neutral-900" />
        )}

        {/* Reforço inferior para legibilidade do título em toda a largura */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[65%] bg-gradient-to-t from-black via-black/60 to-transparent md:h-[52%]"
        />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1200px] flex-col items-center justify-end px-6 pb-4 text-center md:px-14 md:pb-12">
          <CriativoProfileHeroText criativo={criativo} />
        </div>
      </section>

      {/* Conteúdo */}
      <section className="mx-auto w-full max-w-[980px] px-8 pb-24 pt-3 md:px-14 md:pb-32 md:pt-4">
        <CriativoProfileBody criativo={criativo} />

        {/* Links */}
        {(criativo.site || criativo.instagram) && (
          <>
            <div className="my-8 h-px bg-white/10" />
            <div className="flex flex-col gap-3">
              {criativo.site && (
                <a
                  href={criativo.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M7 1c-2 2-2 8 0 12M7 1c2 2 2 8 0 12M1 7h12" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  {criativo.site.replace(/^https?:\/\//, '')}
                </a>
              )}
              {criativo.instagram && (
                <a
                  href={`https://instagram.com/${criativo.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <rect x="1" y="1" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="10.5" cy="3.5" r="0.7" fill="currentColor" />
                  </svg>
                  @{criativo.instagram}
                </a>
              )}
            </div>
          </>
        )}

        <CriativoListCta />
      </section>

      <LocalizedHireForm nome={criativo.nome} nomeEn={criativo.nomeEn} />

      {/* Botão flutuante de download */}
      <CriativoDownloadButton criativo={criativo} />
    </main>
  )
}
