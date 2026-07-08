'use client'

import Image from 'next/image'
import { PortableText } from 'next-sanity'
import { useLocalizedField } from '@/hooks/useLocalizedField'
import { hasCmsContent } from '@/lib/localizedContent'
import { urlFor } from '@/sanity/lib/image'
import { profilePortableTextComponents } from '@/components/portableTextComponents'
import type { Criativo } from '@/types/criativo'

const criativoPortableComponents = {
  ...profilePortableTextComponents,
  block: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    normal: ({ children }: any) => (
      <p className="mb-[1.95rem] last:mb-0">{children}</p>
    ),
  },
}

export function CriativoProfileHeroText({ criativo }: { criativo: Criativo }) {
  const { string } = useLocalizedField()
  const nome = string(criativo.nome, criativo.nomeEn)
  const funcao = string(criativo.funcao, criativo.funcaoEn)

  return (
    <>
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
        {nome}
      </h1>
      {funcao && (
        <p
          className="mt-2 text-[clamp(0.72rem,2.4vw,0.9rem)] font-semibold uppercase tracking-[0.2em]"
          style={{ color: '#4277f6' }}
        >
          {funcao}
        </p>
      )}
    </>
  )
}

function PortableBlock({
  value,
  className,
  style,
}: {
  value: unknown
  className: string
  style?: React.CSSProperties
}) {
  if (!hasCmsContent(value)) return null
  if (typeof value === 'string') {
    return (
      <p className={className} style={style}>
        {value}
      </p>
    )
  }
  return (
    <div className={className} style={style}>
      <PortableText
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value={value as any}
        components={criativoPortableComponents}
      />
    </div>
  )
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

export function CriativoProfileBody({ criativo }: { criativo: Criativo }) {
  const { content } = useLocalizedField()

  const biografiaCurta = content(criativo.biografiaCurta, criativo.biografiaCurtaEn)
  const bloco1 = content(criativo.bloco1, criativo.bloco1En)
  const bloco2 = content(criativo.bloco2, criativo.bloco2En)
  const bloco3 = content(criativo.bloco3, criativo.bloco3En)

  const textStyle = { fontSize: '1.05rem' } as const
  const narrowStyle = { ...textStyle, maxWidth: '63ch' }
  const wideStyle = { ...textStyle, maxWidth: '74ch' }

  return (
    <>
      {hasCmsContent(biografiaCurta) && (
        <PortableBlock
          value={biografiaCurta}
          className="mx-auto italic leading-[1.75] text-neutral-300"
          style={narrowStyle}
        />
      )}

      {hasCmsContent(bloco1) && (
        <>
          <div className="my-8 h-px bg-white/10" />
          <PortableBlock
            value={bloco1}
            className="mx-auto text-justify leading-[1.75] text-neutral-300"
            style={wideStyle}
          />
        </>
      )}
      {criativo.galeria1?.length ? (
        <div className="mt-8">
          <Gallery images={criativo.galeria1} />
        </div>
      ) : null}

      {hasCmsContent(bloco2) && (
        <>
          <div className="my-8 h-px bg-white/10" />
          <PortableBlock
            value={bloco2}
            className="mx-auto text-justify leading-[1.75] text-neutral-300"
            style={wideStyle}
          />
        </>
      )}
      {criativo.galeria2?.length ? (
        <div className="mt-8">
          <Gallery images={criativo.galeria2} />
        </div>
      ) : null}

      {hasCmsContent(bloco3) && (
        <>
          <div className="my-8 h-px bg-white/10" />
          <PortableBlock
            value={bloco3}
            className="mx-auto italic text-justify leading-[1.75] text-neutral-300"
            style={wideStyle}
          />
        </>
      )}
      {criativo.galeria3?.length ? (
        <div className="mt-8">
          <Gallery images={criativo.galeria3} />
        </div>
      ) : null}
    </>
  )
}
