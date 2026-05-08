'use client'

import Link from 'next/link'
import { PortableText } from 'next-sanity'
import { useLang } from '@/contexts/LanguageContext'
import type { ElencoProfile, ElencoTipo } from '@/types/elenco'

function listHref(tipo: ElencoTipo) {
  switch (tipo) {
    case 'ator': return '/elenco/atores'
    case 'atriz': return '/elenco/atrizes'
    case 'estrangeiro': return '/elenco/estrangeiros'
  }
}

export default function ElencoProfileInfo({ artist }: { artist: ElencoProfile }) {
  const { translations: t } = useLang()
  const tipo = artist._type as ElencoTipo
  const backHref = listHref(tipo)

  return (
    <div className="flex flex-1 flex-col px-8 pb-24 pt-28 md:px-14 md:pb-32 md:pt-32">
      <div className="hidden md:block">
        {artist.funcao && (
          <p
            className="mb-3 font-semibold uppercase"
            style={{ fontSize: '0.65rem', letterSpacing: '0.25em', color: '#4277f6' }}
          >
            {artist.funcao}
          </p>
        )}
        <h1
          style={{
            fontFamily: 'var(--font-montserrat), Montserrat, sans-serif',
            fontSize: 'clamp(3rem, 6vw, 5.5rem)',
            fontWeight: 300,
            color: '#ffffff',
            lineHeight: 0.95,
            letterSpacing: '0.01em',
          }}
        >
          {artist.nome}
        </h1>
      </div>

      <div className="my-8 h-px bg-white/10" />

      {/* Dados */}
      <div className="flex flex-col gap-2 text-sm text-neutral-300">
        {artist.anoNascimento != null && (
          <p>
            <span className="font-medium text-white">{t.labels.nascimento}:</span>{' '}
            {artist.anoNascimento}
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
      {artist.biografia && (
        <>
          <div className="my-8 h-px bg-white/10" />
          {typeof artist.biografia === 'string' ? (
            <p className="max-w-[52ch] leading-relaxed text-neutral-300" style={{ fontSize: '0.95rem' }}>
              {artist.biografia}
            </p>
          ) : (
            <div className="max-w-[52ch] leading-relaxed text-neutral-300" style={{ fontSize: '0.95rem' }}>
              <PortableText
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value={artist.biografia as any}
                components={{
                  marks: {
                    link: ({ value, children }) => (
                      <a
                        href={value?.href}
                        target={value?.blank ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:opacity-70"
                      >
                        {children}
                      </a>
                    ),
                  },
                }}
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
