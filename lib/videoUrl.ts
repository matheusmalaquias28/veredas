export type ParsedVideo =
  | { kind: 'youtube'; embedUrl: string; originalUrl: string }
  | { kind: 'vimeo'; embedUrl: string; originalUrl: string }
  | { kind: 'file'; src: string; originalUrl: string }

const VIDEO_FILE_PATTERN = /\.(mp4|webm|mov|m4v|ogv|ogg)(\?.*)?$/i
const VIMEO_HASH_PATTERN = /^[a-f0-9]{8,}$/i
const VIMEO_SKIP_SEGMENTS = new Set(['video', 'videos', 'channels', 'groups', 'album', 'albums', 'review', 'manage', 'user'])

function normalizeUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim()
  if (!trimmed) return null

  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`

  return `https://${trimmed.replace(/^\/+/, '')}`
}

function youtubeId(url: URL): string | null {
  if (url.hostname === 'youtu.be') {
    return url.pathname.slice(1).split('/')[0] || null
  }

  if (!url.hostname.includes('youtube.com')) return null

  if (url.pathname.startsWith('/embed/')) {
    return url.pathname.split('/')[2] || null
  }

  if (url.pathname.startsWith('/shorts/')) {
    return url.pathname.split('/')[2] || null
  }

  return url.searchParams.get('v')
}

function vimeoPrivacyHash(url: URL, parts: string[], idIndex: number): string | undefined {
  const fromQuery = url.searchParams.get('h')
  if (fromQuery) return fromQuery

  const next = parts[idIndex + 1]
  if (!next || VIMEO_SKIP_SEGMENTS.has(next)) return undefined
  if (/^\d+$/.test(next)) return undefined
  if (VIMEO_HASH_PATTERN.test(next)) return next

  return undefined
}

function vimeoFromUrl(url: URL): { id: string; hash?: string } | null {
  const host = url.hostname.replace(/^www\./, '').toLowerCase()
  if (!host.endsWith('vimeo.com')) return null

  const parts = url.pathname.split('/').filter(Boolean)

  if (parts[0] === 'video' && parts[1] && /^\d+$/.test(parts[1])) {
    return {
      id: parts[1],
      hash: url.searchParams.get('h') ?? undefined,
    }
  }

  const videoSegmentIndex = parts.lastIndexOf('video')
  if (videoSegmentIndex !== -1 && parts[videoSegmentIndex + 1] && /^\d+$/.test(parts[videoSegmentIndex + 1])) {
    const id = parts[videoSegmentIndex + 1]
    return {
      id,
      hash: url.searchParams.get('h') ?? vimeoPrivacyHash(url, parts, videoSegmentIndex + 1),
    }
  }

  const numericParts = parts.filter((part) => /^\d{5,}$/.test(part))
  if (numericParts.length === 0) return null

  const id = numericParts[numericParts.length - 1]
  const idIndex = parts.lastIndexOf(id)

  return {
    id,
    hash: vimeoPrivacyHash(url, parts, idIndex),
  }
}

function buildVimeoEmbedUrl(id: string, hash?: string): string {
  const embed = new URL(`https://player.vimeo.com/video/${id}`)
  embed.searchParams.set('autoplay', '1')
  embed.searchParams.set('title', '0')
  embed.searchParams.set('byline', '0')
  embed.searchParams.set('portrait', '0')
  if (hash) embed.searchParams.set('h', hash)
  return embed.toString()
}

export function parseVideoUrl(rawUrl: string): ParsedVideo | null {
  const normalized = normalizeUrl(rawUrl)
  if (!normalized) return null

  let url: URL
  try {
    url = new URL(normalized)
  } catch {
    return null
  }

  const youtube = youtubeId(url)
  if (youtube) {
    return {
      kind: 'youtube',
      originalUrl: rawUrl,
      embedUrl: `https://www.youtube.com/embed/${youtube}?autoplay=1&rel=0`,
    }
  }

  const vimeo = vimeoFromUrl(url)
  if (vimeo) {
    return {
      kind: 'vimeo',
      originalUrl: rawUrl,
      embedUrl: buildVimeoEmbedUrl(vimeo.id, vimeo.hash),
    }
  }

  if (VIDEO_FILE_PATTERN.test(url.pathname)) {
    return {
      kind: 'file',
      originalUrl: rawUrl,
      src: normalized,
    }
  }

  return null
}

export function isVideoUrl(rawUrl: string): boolean {
  return parseVideoUrl(rawUrl) !== null
}
