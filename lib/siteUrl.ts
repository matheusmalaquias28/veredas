/** URL pública do site (OG, metadataBase). Vercel define VERCEL_URL no build/deploy. */
export function getSiteUrlString(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) {
    return explicit.replace(/\/$/, '')
  }
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    return `https://${vercel.replace(/^https?:\/\//, '')}`
  }
  return 'http://localhost:3000'
}

export function getSiteUrl(): URL {
  return new URL(getSiteUrlString())
}
