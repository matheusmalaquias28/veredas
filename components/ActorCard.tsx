'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { useLocalizedField } from '@/hooks/useLocalizedField'

type ElencoTipo = 'ator' | 'atriz' | 'estrangeiro'

const TIPO_LABEL: Record<ElencoTipo, string> = {
  ator: 'Ator',
  atriz: 'Atriz',
  estrangeiro: 'Estrangeiro',
}

interface Ator {
  _id: string
  _type: ElencoTipo
  nome: string
  nomeEn?: string | null
  slug: { current: string }
  fotoPrincipal: { asset: { _ref: string } }
}

export default function ActorCard({ ator }: { ator: Ator }) {
  const { string } = useLocalizedField()
  const nome = string(ator.nome, ator.nomeEn)

  const imageUrl = ator.fotoPrincipal?.asset
    ? urlFor(ator.fotoPrincipal).width(900).fit('max').url()
    : null

  return (
    <Link
      href={`/elenco/${ator.slug?.current ?? ''}`}
      className="actor-card group relative flex h-full min-h-0 flex-none flex-col overflow-hidden self-stretch"
      draggable={false}
    >
      <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={nome}
            fill
            sizes="(max-width: 767px) 85vw, 34vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            draggable={false}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #e5e5e5, #d4d4d4)' }}
          />
        )}

        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 55%)' }}
        />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.05rem',
              color: '#f0f0f0',
              letterSpacing: '0.05em',
              lineHeight: 1.2,
            }}
          >
            {nome}
          </p>
          <p
            className="mt-1 font-semibold"
            style={{
              fontSize: '0.58rem',
              color: '#4277f6',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            {TIPO_LABEL[ator._type]}
          </p>
        </div>
      </div>
    </Link>
  )
}
