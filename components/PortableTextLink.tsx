'use client'

import { useState } from 'react'
import { parseVideoUrl } from '@/lib/videoUrl'
import VideoPopupModal from '@/components/VideoPopupModal'

type PortableTextLinkProps = {
  value?: { href?: string; blank?: boolean }
  children: React.ReactNode
  className?: string
}

export default function PortableTextLink({ value, children, className }: PortableTextLinkProps) {
  const [open, setOpen] = useState(false)
  const href = value?.href
  const video = href ? parseVideoUrl(href) : null

  if (!href) {
    return <span className={className}>{children}</span>
  }

  if (video) {
    const label = typeof children === 'string' ? children : 'Abrir vídeo'

    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`${className ?? ''} cursor-pointer border-0 bg-transparent p-0 text-inherit`}
        >
          {children}
        </button>
        <VideoPopupModal
          open={open}
          onClose={() => setOpen(false)}
          video={video}
          title={label}
        />
      </>
    )
  }

  return (
    <a
      href={href}
      target={value?.blank ? '_blank' : undefined}
      rel={value?.blank ? 'noopener noreferrer' : undefined}
      className={className}
    >
      {children}
    </a>
  )
}
