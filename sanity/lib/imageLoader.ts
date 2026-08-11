/**
 * Evita o Image Optimization da Vercel (/_next/image).
 * Imagens do Sanity já são redimensionadas/formatadas via parâmetros na URL.
 */
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  if (src.startsWith('/')) {
    return src
  }

  try {
    const url = new URL(src)
    if (url.hostname === 'cdn.sanity.io') {
      url.searchParams.set('w', String(width))
      url.searchParams.set('auto', 'format')
      if (quality != null) {
        url.searchParams.set('q', String(quality))
      }
      return url.href
    }
  } catch {
    // URL inválida — devolve como veio
  }

  return src
}
