import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface Producao {
  _id: string
  titulo: string
  imagem: { asset: { _ref: string } }
}

export default function ProductionCard({ producao }: { producao: Producao }) {
  const imageUrl = producao.imagem?.asset
    ? urlFor(producao.imagem).width(900).fit('max').url()
    : null

  return (
    <div className="production-card group relative flex h-full min-h-0 flex-none flex-col overflow-hidden self-stretch">
      <div className="relative aspect-[9/16] w-full shrink-0 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={producao.titulo}
            fill
            sizes="(max-width: 767px) 42vw, 16vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-200" />
        )}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}
        />
      </div>
      <p
        className="mt-3 shrink-0 truncate"
        style={{
          fontSize: '0.65rem',
          color: 'rgba(36,36,36,0.65)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        {producao.titulo}
      </p>
    </div>
  )
}
