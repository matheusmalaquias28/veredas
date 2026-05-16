type HeroViewfinderProps = {
  tagline: string
  recLabel: string
}

function CornerBracket({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const base = 'absolute h-5 w-5 border-white/90 md:h-8 md:w-8'
  const corners = {
    tl: 'top-0 left-0 border-t border-l',
    tr: 'top-0 right-0 border-t border-r',
    bl: 'bottom-0 left-0 border-b border-l',
    br: 'bottom-0 right-0 border-b border-r',
  }
  return <span className={`${base} ${corners[position]}`} aria-hidden />
}

export default function HeroViewfinder({
  tagline,
  recLabel,
}: HeroViewfinderProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[2] [font-family:var(--font-montserrat)] text-white"
      aria-hidden
    >
      <div className="absolute inset-x-[clamp(1.25rem,3.5vw,2.75rem)] top-[clamp(1.25rem,3.5vw,2.75rem)] bottom-[clamp(4rem,10vw,6.5rem)]">
        <CornerBracket position="tl" />
        <CornerBracket position="tr" />
        <CornerBracket position="bl" />
        <CornerBracket position="br" />

        <span className="absolute top-1/2 left-0 h-px w-2.5 -translate-y-1/2 bg-white/85 md:w-3.5" />
        <span className="absolute top-1/2 right-0 h-px w-2.5 -translate-y-1/2 bg-white/85 md:w-3.5" />
        <span className="absolute top-0 left-1/2 h-2.5 w-px -translate-x-1/2 bg-white/85 md:h-3.5" />
        <span className="absolute bottom-0 left-1/2 h-2.5 w-px -translate-x-1/2 bg-white/85 md:h-3.5" />
      </div>

      <div className="absolute inset-x-0 bottom-[clamp(1.25rem,3.5vw,2.75rem)] grid grid-cols-[1fr_auto_1fr] items-end gap-3 px-[clamp(1.25rem,3.5vw,2.75rem)]">
        <p className="justify-self-start text-[8px] font-light uppercase leading-snug tracking-[0.18em] text-white/90 sm:text-[9px] md:max-w-[22rem] md:text-[11px] md:tracking-[0.24em]">
          {tagline}
        </p>

        <div className="flex flex-col items-center justify-self-center">
          <span className="flex h-9 w-[1.35rem] items-start justify-center rounded-full border border-white/75 pt-1.5">
            <span className="block h-2 w-px animate-bounce bg-white/90" />
          </span>
        </div>

        <div className="flex shrink-0 items-center justify-self-end gap-2.5 text-[10px] font-medium uppercase tracking-[0.3em] text-white md:text-[11px]">
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-red-500/45" />
            <span className="relative h-2 w-2 rounded-full bg-[#e53935] shadow-[0_0_8px_rgba(229,57,53,0.65)]" />
          </span>
          {recLabel}
        </div>
      </div>
    </div>
  )
}
