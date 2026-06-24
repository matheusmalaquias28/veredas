import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { PortableText } from 'next-sanity'
import { CRIATIVO_BY_SLUG_QUERY, CRIATIVOS_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Criativo } from '@/types/criativo'
import CriativoDownloadButton from '@/components/CriativoDownloadButton'
import HireForm from '@/components/HireForm'
import { profilePortableTextComponents } from '@/components/portableTextComponents'
import { portableTextToPlain } from '@/lib/portableTextToPlain'

const criativoPortableComponents = {
  ...profilePortableTextComponents,
  block: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    normal: ({ children }: any) => (
      <p className="mb-[1.95rem] last:mb-0">{children}</p>
    ),
  },
}

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Gallery({ images }: { images: any[] }) {
  if (!images?.length) return null
  return (
    <div className="mx-auto w-[78%] min-w-0 max-w-full">
      <div className="grid grid-cols-2 gap-4 md:flex md:flex-row md:items-center md:gap-4">
        {images.map((img, i) => {
          const url = img?.asset ? urlFor(img).width(1560).height(2080).fit('crop').url() : null
          if (!url) return null
          return (
            <div key={i} className="relative aspect-[3/4] w-full overflow-hidden md:flex-1">
              <Image
                src={url}
                alt=""
                fill
                sizes="(max-width: 767px) 39vw, 24vw"
                className="object-cover"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
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
      {/* Back link */}
      <div className="fixed top-[92px] left-0 right-0 z-[90] flex items-center px-6 py-3 md:px-10">
        <Link
          href="/criativos"
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 transition-colors hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Criativos
        </Link>
      </div>

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
          <h1
            className="text-[clamp(1.75rem,7vw,3.8rem)] md:text-[clamp(2.3rem,6vw,3.8rem)]"
            style={{
              fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
              fontWeight: 300,
              color: '#ffffff',
              lineHeight: 0.98,
              letterSpacing: '0.01em',
            }}
          >
            {criativo.nome}
          </h1>
          {criativo.funcao && (
            <p
              className="mt-2 text-[clamp(0.72rem,2.4vw,0.9rem)] font-semibold uppercase tracking-[0.2em]"
              style={{ color: '#4277f6' }}
            >
              {criativo.funcao}
            </p>
          )}
        </div>
      </section>

      {/* Conteúdo */}
      <section className="mx-auto w-full max-w-[980px] px-8 pb-24 pt-3 md:px-14 md:pb-32 md:pt-4">

        {/* Bio */}
        {criativo.biografiaCurta?.length ? (
          <div
            className="mx-auto italic leading-[1.75] text-neutral-300"
            style={{ fontSize: '1.05rem', maxWidth: '63ch' }}
          >
            <PortableText value={criativo.biografiaCurta} components={criativoPortableComponents} />
          </div>
        ) : null}

        {/* Bloco 1 + Galeria 1 */}
        {criativo.bloco1?.length ? (
          <>
            <div className="my-8 h-px bg-white/10" />
            <div
              className="mx-auto text-justify leading-[1.75] text-neutral-300"
              style={{ fontSize: '1.05rem', maxWidth: '74ch' }}
            >
              <PortableText value={criativo.bloco1} components={criativoPortableComponents} />
            </div>
          </>
        ) : null}
        {criativo.galeria1?.length ? (
          <div className="mt-8">
            <Gallery images={criativo.galeria1} />
          </div>
        ) : null}

        {/* Bloco 2 + Galeria 2 */}
        {criativo.bloco2?.length ? (
          <>
            <div className="my-8 h-px bg-white/10" />
            <div
              className="mx-auto text-justify leading-[1.75] text-neutral-300"
              style={{ fontSize: '1.05rem', maxWidth: '74ch' }}
            >
              <PortableText value={criativo.bloco2} components={criativoPortableComponents} />
            </div>
          </>
        ) : null}
        {criativo.galeria2?.length ? (
          <div className="mt-8">
            <Gallery images={criativo.galeria2} />
          </div>
        ) : null}

        {/* Bloco 3 + Galeria 3 */}
        {criativo.bloco3?.length ? (
          <>
            <div className="my-8 h-px bg-white/10" />
            <div
              className="mx-auto italic text-justify leading-[1.75] text-neutral-300"
              style={{ fontSize: '1.05rem', maxWidth: '74ch' }}
            >
              <PortableText value={criativo.bloco3} components={criativoPortableComponents} />
            </div>
          </>
        ) : null}
        {criativo.galeria3?.length ? (
          <div className="mt-8">
            <Gallery images={criativo.galeria3} />
          </div>
        ) : null}

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

        {/* CTA */}
        <div className="mt-12">
          <Link
            href="/criativos"
            className="inline-flex items-center gap-3 border border-white/20 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:border-white hover:text-white"
          >
            Ver todos os criativos
          </Link>
        </div>
      </section>

      <HireForm artistName={criativo.nome} />

      {/* Botão flutuante de download */}
      <CriativoDownloadButton criativo={criativo} />
    </main>
  )
}
