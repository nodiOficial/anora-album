import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, List, Volume2, VolumeX } from 'lucide-react'
import { EASE } from './ui'

/** Controls set into the table under the album: index · ← page n / total → · sound */
export default function AlbumControls({ label, shortLabel, onPrev, onNext, canPrev, canNext, onIndex, soundOn, onToggleSound, visible }) {
  const round =
    'grid size-11 place-items-center rounded-full text-marfil/85 ring-1 ring-marfil/20 transition-[background-color,color,opacity] duration-300 hover:bg-marfil/10 hover:text-marfil focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oro disabled:pointer-events-none disabled:opacity-25'
  return (
    <motion.nav
      aria-label="Navegación del álbum"
      initial={{ opacity: 0, y: 12 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.9, ease: EASE, delay: visible ? 0.4 : 0 }}
      className="flex items-center gap-1.5 sm:gap-3"
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <button type="button" onClick={onIndex} className={`${round} w-auto gap-2 px-3.5 min-[440px]:px-4`} aria-haspopup="dialog" aria-label="Índice">
        <span className="flex items-center gap-2 font-serif text-[16px] tracking-wide">
          <List size={17} strokeWidth={1.5} aria-hidden="true" />
          <span className="hidden min-[440px]:inline">Índice</span>
        </span>
      </button>
      <button type="button" onClick={onPrev} disabled={!canPrev} className={round} aria-label="Página anterior">
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>
      <p className="min-w-[6.5rem] text-center font-serif text-[15px] text-marfil/80 tabular-nums sm:min-w-[11rem] sm:text-[16px]" aria-live="polite">
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">{shortLabel}</span>
      </p>
      <button type="button" onClick={onNext} disabled={!canNext} className={round} aria-label="Página siguiente">
        <ChevronRight size={20} strokeWidth={1.5} />
      </button>
      <button type="button" onClick={onToggleSound} className={round} aria-pressed={soundOn} aria-label={soundOn ? 'Silenciar todo el sonido' : 'Activar sonido'}>
        {soundOn ? <Volume2 size={18} strokeWidth={1.5} /> : <VolumeX size={18} strokeWidth={1.5} />}
      </button>
    </motion.nav>
  )
}
