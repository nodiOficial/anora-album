import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { site } from './config/site'
import { products } from './data/products'
import { collections } from './data/collections'
import { notes } from './data/notes'
import { buildPages } from './lib/buildPages'
import { playPageTurn, unlockPaperSound } from './lib/paperSound'
import useAmbientAudio from './hooks/useAmbientAudio'
import useBookLayout from './hooks/useBookLayout'
import Table from './components/Table'
import Album from './components/Album'
import { BackStage, CoverStage } from './components/BookStages'
import AlbumControls from './components/AlbumControls'
import AlbumIndex from './components/AlbumIndex'
import ProductDetail from './components/ProductDetail'
import { EASE } from './components/ui'

export default function App() {
  const layout = useBookLayout()
  const { mode, pageW, pageH } = layout
  const desktop = mode === 'desktop'
  const reduce = useReducedMotion()

  const book = useMemo(() => buildPages({ products, collections, notes }), [])
  const N = book.pages.length

  const [stage, setStage] = useState('cover') // cover → opening → open → closing → back → cover
  const [pageIdx, setPageIdx] = useState(0)
  const [detail, setDetail] = useState(null)
  const [indexOpen, setIndexOpen] = useState(false)
  const [withSound, setWithSound] = useState(true)
  const [soundOn, setSoundOn] = useState(false)
  const albumRef = useRef(null)

  const music = useAmbientAudio({ src: site.sound.music, volume: site.sound.musicVolume, fadeMs: 2600 })

  /* ---------- actions ---------- */
  const openAlbum = () => {
    if (stage !== 'cover') return
    unlockPaperSound() // inside the click → allowed
    if (withSound) {
      music.play()
      window.setTimeout(() => playPageTurn(site.sound.pageVolume * 1.2, 0.6), 250)
    }
    setSoundOn(withSound)
    setPageIdx(0)
    setStage('opening')
  }

  const toggleSound = () => {
    if (soundOn) {
      music.pause()
      setSoundOn(false)
    } else {
      unlockPaperSound()
      music.play()
      setSoundOn(true)
    }
  }

  const turnSound = useCallback((speed) => soundOn && playPageTurn(site.sound.pageVolume, speed), [soundOn])

  const closeAlbum = useCallback(async () => {
    setDetail(null)
    await albumRef.current?.goTo(book.closingIndex)
    setStage('closing')
  }, [book.closingIndex])

  const ctx = useMemo(
    () => ({
      onOpen: setDetail,
      lifted: detail?.layoutId ?? null,
      sectionNumber: (page) => book.sections.findIndex((s) => s.collection.id === page.collection.id) + 1,
      onRestart: () => albumRef.current?.goTo(desktop ? 0 : 1),
      onCloseAlbum: closeAlbum,
    }),
    [detail, book.sections, desktop, closeAlbum],
  )

  /* ---------- page counter ---------- */
  const view = desktop ? Math.floor(pageIdx / 2) : Math.min(Math.max(pageIdx, 1), N - 2)
  const visibleNumbers = (desktop ? [view * 2, view * 2 + 1] : [view]).map((i) => book.pages[i]?.number).filter((n) => n != null)
  const pad = (n) => String(n).padStart(2, '0')
  const label =
    visibleNumbers.length > 1
      ? `Páginas ${pad(visibleNumbers[0])}–${pad(visibleNumbers[1])} / ${pad(book.contentCount)}`
      : `Página ${pad(visibleNumbers[0] ?? 1)} / ${pad(book.contentCount)}`
  const shortLabel = `Pág. ${visibleNumbers.map(pad).join('–') || '01'} / ${pad(book.contentCount)}`
  const atStart = desktop ? view === 0 : view === 1
  const atEnd = desktop ? view === N / 2 - 1 : view === N - 2

  const next = useCallback(() => (atEnd ? closeAlbum() : albumRef.current?.turn(1)), [atEnd, closeAlbum])
  const prev = useCallback(() => albumRef.current?.turn(-1), [])

  /* ---------- keyboard ---------- */
  useEffect(() => {
    const onKey = (e) => {
      if (stage !== 'open' || detail || indexOpen) return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stage, detail, indexOpen, next, prev])

  const dims = { pageW, pageH }

  return (
    <MotionConfig reducedMotion="user">
      <Table lit={stage !== 'cover'} desktop={desktop} />
      <h1 className="sr-only">
        Álbum de recuerdos de {site.name} · {site.catalogTitle}
      </h1>

      <main
        className="relative flex h-full flex-col items-center"
        style={{ paddingTop: 'max(20px, env(safe-area-inset-top))', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid w-full flex-1 place-items-center">
          {(stage === 'cover' || stage === 'opening') && (
            <CoverStage
              mode={mode}
              dims={dims}
              book={book}
              ctx={ctx}
              opening={stage === 'opening'}
              onOpened={() => setStage('open')}
              onOpenRequest={openAlbum}
              reduce={reduce}
            />
          )}
          {stage === 'open' && (
            <Album
              ref={albumRef}
              book={book}
              mode={mode}
              dims={dims}
              pageIdx={pageIdx}
              setPageIdx={setPageIdx}
              ctx={ctx}
              onTurnSound={turnSound}
              reduce={reduce}
            />
          )}
          {(stage === 'closing' || stage === 'back') && (
            <BackStage
              mode={mode}
              dims={dims}
              book={book}
              ctx={ctx}
              reduce={reduce}
              onTurnedOver={() => {
                setPageIdx(0)
                setStage('cover')
              }}
            />
          )}
        </div>

        <div className="flex h-[92px] shrink-0 items-center justify-center">
          <AnimatePresence mode="wait">
            {stage === 'cover' && (
              <motion.div
                key="open"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6, transition: { duration: 0.3 } }}
                transition={{ duration: 1, ease: EASE, delay: 0.5 }}
                className="flex flex-col items-center gap-2.5"
              >
                <button
                  type="button"
                  onClick={openAlbum}
                  className="inline-flex min-h-12 items-center gap-3 rounded-[3px] bg-marfil px-7 font-serif text-[18px] font-semibold text-vino shadow-[0_12px_30px_-10px_rgba(243,169,85,0.45)] transition-[background-color,transform] duration-500 hover:-translate-y-0.5 hover:bg-[#fff3dc] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oro"
                >
                  <BookOpen size={19} strokeWidth={1.5} aria-hidden="true" />
                  Abrir catálogo
                </button>
                <label className="flex min-h-8 cursor-pointer items-center gap-2 text-[13px] tracking-wide text-marfil/70">
                  <input
                    id="with-sound"
                    type="checkbox"
                    checked={withSound}
                    onChange={(e) => setWithSound(e.target.checked)}
                    className="size-4 accent-[#b47a2a]"
                  />
                  Con música suave y sonido de papel
                </label>
              </motion.div>
            )}
            {stage === 'open' && (
              <AlbumControls
                key="controls"
                visible
                label={label}
                shortLabel={shortLabel}
                onPrev={prev}
                onNext={next}
                canPrev={!atStart}
                canNext
                onIndex={() => setIndexOpen(true)}
                soundOn={soundOn}
                onToggleSound={toggleSound}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      <AlbumIndex open={indexOpen} onClose={() => setIndexOpen(false)} book={book} onGo={(i) => albumRef.current?.goTo(i)} />
      <ProductDetail detail={detail} onClose={() => setDetail(null)} />
    </MotionConfig>
  )
}
