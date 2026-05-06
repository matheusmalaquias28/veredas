'use client'

import { useLang } from '@/contexts/LanguageContext'

/** Repetições por metade do track (a segunda metade duplica a primeira para o loop). */
const SEGMENT_COUNT = 14

export default function FooterMarquee() {
  const { translations: t } = useLang()
  const text = t.footer.marqueeLine

  return (
    <div className="footer-marquee border-t border-black/10 bg-black py-10 md:py-14 lg:py-16" aria-hidden="true">
      <div className="footer-marquee__track flex w-max">
        <div className="flex shrink-0">
          {Array.from({ length: SEGMENT_COUNT }, (_, i) => (
            <span
              key={`a-${i}`}
              className="footer-marquee__segment inline-flex shrink-0 items-center whitespace-nowrap px-[min(2rem,5vw)]"
            >
              {text}
            </span>
          ))}
        </div>
        <div className="flex shrink-0">
          {Array.from({ length: SEGMENT_COUNT }, (_, i) => (
            <span
              key={`b-${i}`}
              className="footer-marquee__segment inline-flex shrink-0 items-center whitespace-nowrap px-[min(2rem,5vw)]"
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
