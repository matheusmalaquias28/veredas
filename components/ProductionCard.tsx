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
            className="h-full w-full object-contain object-center"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-200" />
        )}
      </div>
    </div>
  )
}
