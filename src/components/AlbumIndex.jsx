import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { EASE, OrnamentDivider } from './ui'

/**
 * Book-style index on a paper card: "01 · Tradicionales ........ 02".
 * Choosing an entry closes the card and riffles the album to that page.
 */
export default function AlbumIndex({ open, onClose, book, onGo }) {
  const first = useRef(null)
  useEffect(() => {
    if (!open) return
    first.current?.focus({ preventScroll: true })
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const entries = [
    { label: 'Presentación', page: 1 },
    ...book.sections.map((s, i) => ({ n: String(i + 1).padStart(2, '0'), label: s.collection.indexLabel, page: s.pageIndex, color: s.collection.tab })),
    { label: 'La colección completa', page: book.overviewIndex },
    { label: 'Últimas palabras', page: book.closingIndex },
  ]

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] grid place-items-center p-5">
          <motion.div
            className="absolute inset-0 bg-[#120b06]/55 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="index-title"
            initial={{ opacity: 0, y: 30, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -0.6 }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.25 } }}
            transition={{ duration: 0.7, ease: EASE }}
            className="grain relative w-full max-w-[420px] bg-papel px-8 pt-9 pb-8 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]"
          >
            <div className="pointer-events-none absolute inset-3 border border-oro/30" aria-hidden="true" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar índice"
              className="absolute top-3 right-3 grid size-11 place-items-center rounded-full text-sepia hover:text-vino focus-visible:outline-2 focus-visible:outline-oro"
            >
              <X size={20} strokeWidth={1.4} />
            </button>
            <h2 id="index-title" className="text-center font-serif text-3xl font-medium tracking-[0.3em] text-olivo uppercase">
              Índice
            </h2>
            <OrnamentDivider className="mx-auto mt-3 h-4 w-36 text-oro/70" />
            <ol className="mt-6">
              {entries.map((e, i) => (
                <li key={e.label}>
                  <button
                    ref={i === 0 ? first : undefined}
                    type="button"
                    onClick={() => {
                      onClose()
                      window.setTimeout(() => onGo(e.page), 280)
                    }}
                    className="group flex min-h-11 w-full items-baseline gap-3 rounded-sm py-1.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oro"
                  >
                    <span className="w-7 shrink-0 font-serif text-[17px] text-oro italic tabular-nums">{e.n ?? ''}</span>
                    <span className="font-serif text-[20px] text-olivo transition-colors group-hover:text-vino">
                      {e.color && <span className="mr-2 inline-block size-2 -translate-y-0.5 rounded-full" style={{ background: e.color }} aria-hidden="true" />}
                      {e.label}
                    </span>
                    <span className="mx-1 flex-1 border-b border-dotted border-sepia/40" aria-hidden="true" />
                    <span className="font-serif text-[17px] text-sepia tabular-nums">{String(e.page).padStart(2, '0')}</span>
                  </button>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
