'use client'

import Link from 'next/link'
import { PortableText } from 'next-sanity'
import { useLang } from '@/contexts/LanguageContext'
import { useLocalizedField } from '@/hooks/useLocalizedField'
import { hasCmsContent } from '@/lib/localizedContent'
import { profilePortableTextComponents } from '@/components/portableTextComponents'
import { formatAge } from '@/lib/ageFromBirthYear'
import type { ElencoProfile, ElencoTipo } from '@/types/elenco'

function listHref(tipo: ElencoTipo) {
  switch (tipo) {
    case 'ator': return '/elenco/atores'
    case 'atriz': return '/elenco/atrizes'
    case 'estrangeiro': return '/elenco/estrangeiros'
  }
}

export default function ElencoProfileInfo({ artist }: { artist: ElencoProfile }) {
  const { lang, translations: t } = useLang()
  const { string, content } = useLocalizedField()
  const tipo = artist._type as ElencoTipo
  const backHref = listHref(tipo)

  const nome = string(artist.nome, artist.nomeEn)
  const funcao = string(artist.funcao, artist.funcaoEn)
  const biografia = content(artist.biografia, artist.biografiaEn)

  return (
    <div className="flex flex-1 flex-col px-8 pb-24 pt-28 md:px-14 md:pb-32 md:pt-32">
      <div>
        {funcao && (
          <p
            className="mb-2 font-semibold uppercase md:mb-3"
            style={{ fontSize: '0.56rem', letterSpacing: '0.22em', color: '#4277f6' }}
          >
            {funcao}
          </p>
        )}
        <h1
          style={{
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            fontSize: 'clamp(2rem, 9vw, 5.5rem)',
            fontWeight: 300,
            color: '#ffffff',
            lineHeight: 0.95,
            letterSpacing: '0.01em',
          }}
        >
          {nome}
        </h1>
      </div>

      <div className="my-8 h-px bg-white/10" />

      {/* Dados */}
      <div className="flex flex-col gap-2 text-sm text-neutral-300">
        {artist.anoNascimento != null && (
          <p>
            <span className="font-medium text-white">{t.labels.idade}:</span>{' '}
            {formatAge(artist.anoNascimento, lang)}
          </p>
        )}
        {artist.altura && (
          <p>
            <span className="font-medium text-white">{t.labels.altura}:</span>{' '}
            {artist.altura}
          </p>
        )}
        {artist.cidadeEstado && (
          <p>
            <span className="font-medium text-white">{t.labels.local}:</span>{' '}
            {artist.cidadeEstado}
          </p>
        )}
        {artist.idiomas && artist.idiomas.length > 0 && (
          <p>
            <span className="font-medium text-white">{t.labels.idiomas}:</span>{' '}
            {artist.idiomas.join(', ')}
          </p>
        )}
      </div>

      {/* Biografia */}
      {hasCmsContent(biografia) && (
        <>
          <div className="my-8 h-px bg-white/10" />
          {typeof biografia === 'string' ? (
            <p className="max-w-[52ch] leading-relaxed text-neutral-300" style={{ fontSize: '0.95rem' }}>
              {biografia}
            </p>
          ) : (
            <div className="max-w-[52ch] leading-relaxed text-neutral-300" style={{ fontSize: '0.95rem' }}>
              <PortableText
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value={biografia as any}
                components={profilePortableTextComponents}
              />
            </div>
          )}
        </>
      )}

      {/* CTA */}
      <div className="mt-12">
        <Link
          href={backHref}
          className="inline-flex items-center gap-3 border border-white/20 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:border-white hover:text-white"
        >
          {t.actions.voltarElenco}
        </Link>
      </div>
    </div>
  )
}
