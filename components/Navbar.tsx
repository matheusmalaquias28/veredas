'use client'

import { useState, useEffect, useId } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import LogoVeredas from '@/components/LogoVeredas'

/** Faixas da identidade; cores em `globals.css` (--brand-*). */
const STRIPES = [{ id: 'flame' }, { id: 'blue' }, { id: 'pink' }, { id: 'sun' }] as const

/** Largura final de cada faixa (px). */
const STRIPE_W_FINAL = 5

/** Largura “grande” de cada faixa antes de encolher (abertura). */
const STRIPE_W_LARGE = 92

/** Base `em` para itens do menu (`20em` ≈ 100px com base 5px). */
const MENU_EM_BASE_PX = 5

const navListVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055, delayChildren: 0.38 },
  },
}

const navItemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
}

type StripePhase = 'enter' | 'compact'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [castingOpen, setCastingOpen] = useState(false)
  const [stripePhase, setStripePhase] = useState<StripePhase>('enter')
  const [scrolled, setScrolled] = useState(false)
  const { lang, translations: t, setLang } = useLang()
  const submenuId = useId()

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 60)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  /** Controles e tipografia do header sobre fundo claro. */
  const navForeground = 'dark' as const

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  /** Após abrir: faixas grandes já reveladas → encolhem para 5px, uma por vez. */
  useEffect(() => {
    if (!menuOpen) return
    const staggerEnter = (STRIPES.length - 1) * 0.11
    const enterDoneMs = Math.round((0.48 + staggerEnter + 0.12) * 1000)
    const t = window.setTimeout(() => setStripePhase('compact'), enterDoneMs)
    return () => window.clearTimeout(t)
  }, [menuOpen])

  const closeMenu = () => {
    setCastingOpen(false)
    setStripePhase('enter')
    setMenuOpen(false)
  }

  /** Mesma família do título da hero (`--font-condensed` / Barlow Condensed). */
  const menuTitleFont = {
    fontFamily: 'var(--font-condensed)',
    fontWeight: 800,
  } as const

  const linkClass =
    'block w-full text-center uppercase leading-[0.92] tracking-[0.02em] text-[#242424] transition-colors hover:text-[var(--brand-blue)]'

  const subLinkClass =
    'block py-2 text-center [font-family:var(--font-condensed)] text-[7em] font-semibold uppercase tracking-[0.12em] text-[#242424]/60 transition-colors hover:text-[var(--brand-blue)]'

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[110] transition-all duration-500"
        style={{
          background: menuOpen
            ? 'transparent'
            : scrolled
              ? 'rgba(234,223,213,0.92)'
              : 'transparent',
          backdropFilter: scrolled && !menuOpen ? 'blur(12px)' : 'none',
        }}
      >
        <div className="flex h-[72px] items-center justify-between px-6 md:px-10">
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center text-[#0a0a0a]"
          >
            <LogoVeredas className="h-9 w-auto" />
          </Link>

          <div className="flex items-center gap-5">
            <div
              className={`flex items-center gap-1 text-xs tracking-widest ${menuOpen ? 'opacity-0 pointer-events-none' : ''}`}
            >
              <button
                type="button"
                onClick={() => setLang('pt')}
                className="px-1.5 py-1 transition-colors duration-200"
                style={{
                  color:
                    navForeground === 'dark'
                      ? lang === 'pt'
                        ? '#0a0a0a'
                        : 'rgba(10,10,10,0.35)'
                      : lang === 'pt'
                        ? '#f0f0f0'
                        : 'rgba(240,240,240,0.3)',
                }}
              >
                PT
              </button>
              <span
                style={{
                  color: navForeground === 'dark' ? 'rgba(10,10,10,0.2)' : 'rgba(240,240,240,0.2)',
                }}
              >
                |
              </span>
              <button
                type="button"
                onClick={() => setLang('en')}
                className="px-1.5 py-1 transition-colors duration-200"
                style={{
                  color:
                    navForeground === 'dark'
                      ? lang === 'en'
                        ? '#0a0a0a'
                        : 'rgba(10,10,10,0.35)'
                      : lang === 'en'
                        ? '#f0f0f0'
                        : 'rgba(240,240,240,0.3)',
                }}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (menuOpen) {
                  setCastingOpen(false)
                  setStripePhase('enter')
                  setMenuOpen(false)
                } else {
                  setStripePhase('enter')
                  setMenuOpen(true)
                }
              }}
              aria-label={menuOpen ? t.nav.close : 'Abrir menu'}
              aria-expanded={menuOpen}
              className="relative z-[120] flex h-8 w-8 flex-col justify-center gap-[5px] p-0.5"
            >
              <span
                className={`block h-[1.5px] w-full origin-center transition-all duration-300 ${
                  menuOpen
                    ? 'bg-[#0a0a0a]'
                    : navForeground === 'dark'
                      ? 'bg-[#0a0a0a]'
                      : 'bg-background'
                }`}
                style={{ transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : '' }}
              />
              <span
                className={`block h-[1.5px] w-full transition-all duration-300 ${
                  menuOpen
                    ? 'bg-[#0a0a0a]'
                    : navForeground === 'dark'
                      ? 'bg-[#0a0a0a]'
                      : 'bg-background'
                }`}
                style={{ opacity: menuOpen ? 0 : 1 }}
              />
              <span
                className={`block h-[1.5px] w-full origin-center transition-all duration-300 ${
                  menuOpen
                    ? 'bg-[#0a0a0a]'
                    : navForeground === 'dark'
                      ? 'bg-[#0a0a0a]'
                      : 'bg-background'
                }`}
                style={{ transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : '' }}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[100] flex h-full w-full flex-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              type="button"
              className="hidden h-full min-h-0 min-w-0 flex-1 cursor-pointer border-none bg-black/45 p-0 md:block"
              aria-label={t.nav.close}
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative flex h-full w-full min-w-0 flex-row bg-background md:w-[30%] md:flex-none md:shadow-[-12px_0_40px_rgba(0,0,0,0.12)]"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex h-full shrink-0 flex-row overflow-hidden">
                {STRIPES.map((s, i) => (
                  <motion.div
                    key={s.id}
                    className="h-full shrink-0 origin-left will-change-[transform,width]"
                    style={{
                      backgroundColor: `var(--brand-${s.id})`,
                    }}
                    initial={{ scaleX: 0, width: STRIPE_W_LARGE }}
                    animate={
                      stripePhase === 'enter'
                        ? { scaleX: 1, width: STRIPE_W_LARGE }
                        : { scaleX: 1, width: STRIPE_W_FINAL }
                    }
                    transition={{
                      scaleX: {
                        duration: 0.48,
                        delay: i * 0.11,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      width: {
                        duration: stripePhase === 'compact' ? 0.52 : 0,
                        delay: stripePhase === 'compact' ? i * 0.15 : 0,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }}
                  />
                ))}
              </div>

              <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
                <div className="flex shrink-0 items-center justify-end gap-2 px-4 pb-3 pt-20 sm:gap-3 sm:px-5 sm:pt-24 md:px-5 md:pt-24">
                  <button
                    type="button"
                    onClick={closeMenu}
                    className="flex items-center gap-2 rounded-lg bg-[#bae6fd] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#0c4a6e] transition hover:bg-[#7dd3fc]"
                  >
                    {t.nav.close}
                    <span className="text-base leading-none" aria-hidden>
                      ×
                    </span>
                  </button>
                  <div className="flex h-10 items-center gap-0.5 rounded bg-[var(--brand-blue)] px-2 text-[10px] font-semibold tracking-widest text-white">
                    <button
                      type="button"
                      onClick={() => setLang('pt')}
                      className="rounded px-2 py-1.5 transition"
                      style={{
                        opacity: lang === 'pt' ? 1 : 0.55,
                        background: lang === 'pt' ? 'rgba(255,255,255,0.22)' : 'transparent',
                      }}
                    >
                      PT
                    </button>
                    <span className="opacity-40" aria-hidden>
                      |
                    </span>
                    <button
                      type="button"
                      onClick={() => setLang('en')}
                      className="rounded px-2 py-1.5 transition"
                      style={{
                        opacity: lang === 'en' ? 1 : 0.55,
                        background: lang === 'en' ? 'rgba(255,255,255,0.2)' : 'transparent',
                      }}
                    >
                      EN
                    </button>
                  </div>
                </div>

                <motion.nav
                  className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-4 pb-12 sm:gap-3 sm:px-5 sm:pb-16 md:px-5"
                  style={{ fontSize: `${MENU_EM_BASE_PX}px` }}
                  variants={navListVariants}
                  initial="hidden"
                  animate="show"
                >
                  <motion.div className="w-full max-w-full" variants={navItemVariants}>
                    <Link
                      href="/"
                      className={linkClass}
                      style={{ ...menuTitleFont, fontSize: '20em' }}
                      onClick={closeMenu}
                    >
                      {t.nav.home}
                    </Link>
                  </motion.div>

                  <motion.div className="w-full max-w-full" variants={navItemVariants}>
                    <button
                      type="button"
                      className={`${linkClass} flex w-full items-center justify-center gap-3`}
                      style={{ ...menuTitleFont, fontSize: '20em' }}
                      aria-expanded={castingOpen}
                      aria-controls={submenuId}
                      onClick={() => setCastingOpen((v) => !v)}
                    >
                      {t.nav.casting}
                      <motion.span
                        className="inline-block shrink-0 text-[20px] leading-none text-[var(--brand-blue)]"
                        animate={{ rotate: castingOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        aria-hidden
                      >
                        ▾
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {castingOpen && (
                        <motion.div
                          id={submenuId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden px-1"
                        >
                          <Link
                            href="/elenco/atrizes"
                            className={subLinkClass}
                            onClick={closeMenu}
                          >
                            {t.nav.atrizes}
                          </Link>
                          <Link
                            href="/elenco/atores"
                            className={subLinkClass}
                            onClick={closeMenu}
                          >
                            {t.nav.atores}
                          </Link>
                          <Link
                            href="/elenco/estrangeiros"
                            className={subLinkClass}
                            onClick={closeMenu}
                          >
                            {t.nav.estrangeiros}
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div className="w-full max-w-full" variants={navItemVariants}>
                    <Link
                      href="/criativos"
                      className={linkClass}
                      style={{ ...menuTitleFont, fontSize: '20em' }}
                      onClick={closeMenu}
                    >
                      {t.nav.criativos}
                    </Link>
                  </motion.div>

                  <motion.div className="w-full max-w-full" variants={navItemVariants}>
                    <Link
                      href="/sobre"
                      className={linkClass}
                      style={{ ...menuTitleFont, fontSize: '20em' }}
                      onClick={closeMenu}
                    >
                      {t.nav.sobre}
                    </Link>
                  </motion.div>

                  <motion.div className="w-full max-w-full" variants={navItemVariants}>
                    <Link
                      href="/contato"
                      className={linkClass}
                      style={{ ...menuTitleFont, fontSize: '20em' }}
                      onClick={closeMenu}
                    >
                      {t.nav.contato}
                    </Link>
                  </motion.div>
                </motion.nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
