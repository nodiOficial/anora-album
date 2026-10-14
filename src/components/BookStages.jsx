import { useEffect, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import AlbumPage from './AlbumPage'
import { BackCoverFace, CoverFace } from './AlbumCover'
import { Ribbon } from './illustrations/AlbumArt'

const OPEN_EASE = [0.62, 0, 0.22, 1]

/**
 * Closed album on the table → opening.
 * Desktop: the book box is two pages wide; while closed it is shifted left by half a page so the
 * cover sits centered. Opening rotates the cover around the spine (−180°) while the book slides
 * to center — the last frame is exactly the first spread of <Album>, so the hand-off is invisible.
 */
export function CoverStage({ mode, dims, book, ctx, opening, onOpened, reduce, onOpenRequest }) {
  const W = dims.pageW
  const H = dims.pageH
  const desktop = mode === 'desktop'
  const p = useMotionValue(0)
  const [hover, setHover] = useState(false)

  const x = useTransform(p, [0, 1], desktop ? [-W / 2, 0] : [0, 0])
  const rotateY = useTransform(p, (v) => -180 * v - (hover && v === 0 ? 4 : 0))
  const coverShade = useTransform(p, [0, 0.5], [0, 0.6])
  const innerShade = useTransform(p, [0.5, 1], [0.6, 0])
  const underShadow = useTransform(p, [0, 0.6, 1], [0.7, 0.25, 0])
  const lift = useTransform(p, (v) => Math.sin(v * Math.PI) * 40)
  const leftBoard = useTransform(p, [0.8, 1], [0, 1])
  const phoneFade = useTransform(p, [0, 0.7, 0.95], [1, 1, 0])

  useEffect(() => {
    if (!opening) return
    const controls = animate(p, 1, { duration: reduce ? 0.01 : desktop ? 2.3 : 1.7, ease: OPEN_EASE })
    controls.then(onOpened)
    return () => controls.stop()
  }, [opening]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div className="relative" style={{ width: desktop ? W * 2 : W, height: H, x, perspective: 2600 }}>
      {/* shadow on the table */}
      <div aria-hidden="true" className="absolute top-[6%] -bottom-[5%] rounded-[50%] bg-black/50 blur-[38px]" style={{ left: desktop ? W - 20 : -20, width: W + 40 }} />
      {desktop && (
        <motion.div aria-hidden="true" style={{ opacity: leftBoard, width: W + 10 }} className="cloth absolute -top-[10px] -bottom-[10px] -left-[10px] rounded-[6px] bg-olivo" />
      )}
      {/* page block under the cover */}
      <div className="absolute top-0" style={{ left: desktop ? W : 0, width: W, height: H }}>
        <div aria-hidden="true" className="cloth absolute -inset-[10px] left-[-2px] rounded-[6px] bg-olivo shadow-[0_14px_30px_-8px_rgba(0,0,0,0.6)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[#efe6d3] shadow-[1px_1px_0_#e2d6be,2px_2px_0_#f3ead9,3px_3px_0_#d9ccb2,4px_4px_0_#efe5d1]" />
        <div className="absolute inset-0 overflow-hidden">
          <AlbumPage page={book.pages[1]} side={desktop ? 'right' : 'single'} ctx={ctx} />
          <motion.div aria-hidden="true" style={{ opacity: underShadow }} className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[rgba(30,18,8,0.75)] via-[rgba(30,18,8,0.3)] to-[rgba(30,18,8,0.15)]" />
        </div>
      </div>

      {/* the cover */}
      <motion.button
        type="button"
        onClick={onOpenRequest}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        aria-label="Abrir catálogo"
        disabled={opening}
        className="preserve-3d absolute top-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-4 focus-visible:ring-offset-mesa"
        style={{ left: desktop ? W : 0, width: W, height: H, rotateY, z: lift, transformOrigin: 'left center', opacity: desktop ? 1 : phoneFade }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      >
        <div className="backface-hidden absolute inset-0 shadow-[0_2px_0_#1d2112,0_18px_40px_-10px_rgba(0,0,0,0.65)]">
          <CoverFace />
          <motion.div aria-hidden="true" style={{ opacity: coverShade }} className="pointer-events-none absolute inset-0 rounded-[3px_6px_6px_3px] bg-gradient-to-r from-black/70 to-black/20" />
        </div>
        <div className="backface-hidden absolute inset-0 overflow-hidden" style={{ transform: 'rotateY(180deg)' }}>
          <AlbumPage page={book.pages[0]} side="left" ctx={ctx} />
          <motion.div aria-hidden="true" style={{ opacity: innerShade }} className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/60 to-black/10" />
        </div>
      </motion.button>

      <Ribbon className="anim-ribbon pointer-events-none absolute" style={{ left: (desktop ? W : 0) + (desktop ? 22 : 18), bottom: desktop ? -40 : -30, height: desktop ? 52 : 40, width: desktop ? 15 : 12 }} />
    </motion.div>
  )
}

/**
 * End of the album: the back cover folds over the last page and the closed book slides to center.
 * Then "Volver a la portada" turns the whole book over to show the front cover again.
 */
export function BackStage({ mode, dims, book, ctx, onTurnedOver, reduce }) {
  const W = dims.pageW
  const H = dims.pageH
  const desktop = mode === 'desktop'
  const p = useMotionValue(0) // closing
  const q = useMotionValue(0) // turning the book over
  const [closed, setClosed] = useState(false)
  const [turning, setTurning] = useState(false)

  const x = useTransform(p, [0, 1], desktop ? [0, W / 2] : [0, 0])
  const rotateY = useTransform(p, (v) => (desktop ? -180 * v : -180 * (1 - v)))
  const lift = useTransform(p, (v) => Math.sin(v * Math.PI) * 40)
  const pageFade = useTransform(p, [0.9, 1], [1, 0])
  const flip = useTransform(q, (v) => 180 * v)
  const flipLift = useTransform(q, (v) => Math.sin(v * Math.PI) * 60)

  useEffect(() => {
    const c = animate(p, 1, { duration: reduce ? 0.01 : desktop ? 2 : 1.4, ease: OPEN_EASE })
    c.then(() => setClosed(true))
    return () => c.stop()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const turnOver = async () => {
    setTurning(true)
    await animate(q, 1, { duration: reduce ? 0.01 : 1.6, ease: OPEN_EASE })
    onTurnedOver()
  }

  const closingPage = book.pages[book.closingIndex]
  const backEndpaper = book.pages[book.pages.length - 1]

  return (
    <div className="relative" style={{ width: desktop ? W * 2 : W, height: H }}>
      <motion.div className="absolute inset-0" style={{ x, perspective: 2600 }}>
        <div aria-hidden="true" className="absolute top-[6%] -bottom-[5%] rounded-[50%] bg-black/50 blur-[38px]" style={{ left: -20, width: W + 40 }} />

        {!closed && (
          <>
            <div aria-hidden="true" className="cloth absolute -top-[10px] -bottom-[10px] -left-[10px] rounded-[6px] bg-olivo" style={{ width: W + 10 }} />
            <motion.div className="absolute top-0 left-0 overflow-hidden" style={{ width: W, height: H, opacity: desktop ? pageFade : 1 }}>
              <AlbumPage page={closingPage} side={desktop ? 'left' : 'single'} ctx={ctx} />
            </motion.div>
          </>
        )}

        {closed ? (
          // closed book: back cover up, ready to be turned over
          <motion.div className="preserve-3d absolute top-0 left-0" style={{ width: W, height: H, rotateY: flip, z: flipLift }}>
            <div className="backface-hidden absolute inset-0 shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)]">
              <BackCoverFace />
            </div>
            <div className="backface-hidden absolute inset-0" style={{ transform: 'rotateY(180deg)' }}>
              <CoverFace />
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="preserve-3d absolute top-0"
            style={{ left: desktop ? W : 0, width: W, height: H, rotateY, z: lift, transformOrigin: 'left center' }}
          >
            <div className="backface-hidden absolute inset-0 overflow-hidden">
              {desktop ? <AlbumPage page={backEndpaper} side="right" ctx={ctx} /> : <div className="endpaper absolute inset-0" />}
            </div>
            <div className="backface-hidden absolute inset-0" style={{ transform: 'rotateY(180deg)' }}>
              <BackCoverFace />
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.button
        type="button"
        onClick={turnOver}
        disabled={!closed || turning}
        initial={{ opacity: 0 }}
        animate={{ opacity: closed && !turning ? 1 : 0 }}
        transition={{ duration: 0.8, delay: closed ? 0.3 : 0 }}
        className="absolute top-[calc(100%+32px)] left-1/2 min-h-11 -translate-x-1/2 rounded-full px-6 font-serif whitespace-nowrap text-[17px] text-marfil/85 ring-1 ring-marfil/25 transition-colors hover:bg-marfil/10 hover:text-marfil focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oro"
        style={{ pointerEvents: closed && !turning ? 'auto' : 'none' }}
      >
        Volver a la portada
      </motion.button>
    </div>
  )
}
