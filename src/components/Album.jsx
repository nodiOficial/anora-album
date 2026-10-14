import { useCallback, useImperativeHandle, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import AlbumPage from './AlbumPage'
import { Ribbon } from './illustrations/AlbumArt'
import { EASE_PAGE } from './ui'

/**
 * The open album + the page-turn engine (PageTurn).
 *
 * Desktop: spreads (0,1)(2,3)… A turn lifts one sheet around the spine (rotateY 0 → ±180°).
 *          Front face = page being turned, back face = the page that lands on the other side.
 * Phone:   one page. The page turns away around its left edge (or comes back over it).
 *
 * `progress` (0 → 1) drives everything: rotation, lift, and the light/shadow on the paper,
 * so a finger drag and an automatic turn share exactly the same animation.
 */
export default function Album({ book, mode, dims, pageIdx, setPageIdx, ctx, onTurnSound, reduce, ref }) {
  const { pages, sections } = book
  const N = pages.length
  const desktop = mode === 'desktop'
  const W = dims.pageW
  const H = dims.pageH

  const minV = desktop ? 0 : 1
  const maxV = desktop ? N / 2 - 1 : N - 2
  const toView = useCallback((i) => (desktop ? Math.floor(i / 2) : Math.min(Math.max(i, 1), N - 2)), [desktop, N])
  const toIndex = useCallback((v) => (desktop ? v * 2 : v), [desktop])

  const view = toView(pageIdx)
  const viewRef = useRef(view)
  viewRef.current = view

  const [turn, setTurn] = useState(null) // { dir, from, to }
  const progress = useMotionValue(0)
  const busy = useRef(false)
  const suppressClick = useRef(false)
  const drag = useRef(null)

  const commit = useCallback(
    (v) => {
      viewRef.current = v
      setPageIdx(toIndex(v))
      setTurn(null)
    },
    [setPageIdx, toIndex],
  )

  const step = useCallback(
    async (dir, { duration, speed = 1 } = {}) => {
      if (busy.current) return false
      const from = viewRef.current
      const to = from + dir
      if (to < minV || to > maxV) return false
      onTurnSound?.(speed)
      if (reduce) {
        commit(to)
        return true
      }
      busy.current = true
      progress.set(0)
      setTurn({ dir, from, to })
      await animate(progress, 1, { duration: duration ?? (desktop ? 1.05 : 0.8), ease: EASE_PAGE })
      commit(to)
      busy.current = false
      return true
    },
    [minV, maxV, reduce, desktop, progress, commit, onTurnSound],
  )

  const goTo = useCallback(
    async (targetIndex) => {
      if (busy.current) return
      const target = toView(targetIndex)
      let diff = target - viewRef.current
      if (!diff) return
      const dir = Math.sign(diff)
      if (Math.abs(diff) > 5) {
        // riffle: skip ahead silently, then show the last few pages turning
        commit(target - dir * 4)
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
        diff = dir * 4
      }
      for (let i = 0; i < Math.abs(diff); i++) {
        const ok = await step(dir, { duration: 0.42, speed: 1.8 })
        if (!ok) break
      }
    },
    [toView, step, commit],
  )

  useImperativeHandle(ref, () => ({ turn: (dir) => step(dir), goTo, isBusy: () => busy.current }), [step, goTo])

  /* ---------- finger / mouse drag ---------- */
  const onPointerDown = (e) => {
    if (busy.current || (e.pointerType === 'mouse' && e.button !== 0)) return
    drag.current = { x: e.clientX, y: e.clientY, active: false, dir: 0, samples: [[e.clientX, performance.now()]] }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y
    if (!d.active) {
      if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy) * 1.2) return
      const dir = dx < 0 ? 1 : -1
      const to = viewRef.current + dir
      if (to < minV || to > maxV || reduce) {
        drag.current = null
        return
      }
      d.active = true
      d.dir = dir
      busy.current = true
      suppressClick.current = true
      progress.set(0)
      setTurn({ dir, from: viewRef.current, to })
      onTurnSound?.(1.2)
      e.currentTarget.setPointerCapture?.(e.pointerId)
    }
    const travel = desktop ? W * 1.5 : W * 1.05
    progress.set(Math.min(1, Math.max(0, (-dx * d.dir) / travel)))
    d.samples.push([e.clientX, performance.now()])
    if (d.samples.length > 5) d.samples.shift()
  }
  const onPointerUp = async () => {
    const d = drag.current
    drag.current = null
    if (!d?.active) return
    const [x0, t0] = d.samples[0]
    const [x1, t1] = d.samples.at(-1)
    const velocity = ((x0 - x1) * d.dir) / Math.max(1, t1 - t0) // px/ms in the turning direction
    const p = progress.get()
    const to = viewRef.current + d.dir
    if (p > 0.32 || velocity > 0.45) {
      await animate(progress, 1, { duration: 0.2 + 0.5 * (1 - p), ease: [0.2, 0.7, 0.3, 1] })
      commit(to)
    } else {
      await animate(progress, 0, { duration: 0.35, ease: 'easeOut' })
      setTurn(null)
    }
    busy.current = false
    window.setTimeout(() => (suppressClick.current = false), 60)
  }
  const onClickCapture = (e) => {
    if (suppressClick.current) {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  /* ---------- which pages are where ---------- */
  let layers
  if (desktop) {
    const s = view
    if (!turn) layers = { left: 2 * s, right: 2 * s + 1 }
    else if (turn.dir > 0)
      layers = { left: 2 * turn.from, right: 2 * turn.to + 1, front: 2 * turn.from + 1, back: 2 * turn.to, sheetSide: 'right' }
    else layers = { left: 2 * turn.to, right: 2 * turn.from + 1, front: 2 * turn.from, back: 2 * turn.to + 1, sheetSide: 'left' }
  } else {
    if (!turn) layers = { single: view }
    else if (turn.dir > 0) layers = { single: turn.to, front: turn.from }
    else layers = { single: turn.from, front: turn.to }
  }

  const gesture = { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onClickCapture }

  return (
    <div className="relative select-none" style={{ touchAction: 'pan-y pinch-zoom' }} {...gesture}>
      {desktop ? (
        <div className="relative" style={{ width: W * 2, height: H, perspective: 2600 }}>
          <BookBase />
          {/* bookmark ribbon: under the pages, only its tail shows */}
          <Ribbon className="anim-ribbon pointer-events-none absolute -bottom-[40px] h-[52px] w-[15px]" style={{ left: W + 22 }} />
          <div className="absolute top-0 left-0 overflow-hidden rounded-l-[3px]" style={{ width: W, height: H }}>
            <AlbumPage page={pages[layers.left]} side="left" ctx={ctx} />
            {turn && <CastShadow progress={progress} role={turn.dir > 0 ? 'covered' : 'revealed'} side="left" />}
          </div>
          <div className="absolute top-0 overflow-hidden rounded-r-[3px]" style={{ left: W, width: W, height: H }}>
            <AlbumPage page={pages[layers.right]} side="right" ctx={ctx} />
            {turn && <CastShadow progress={progress} role={turn.dir > 0 ? 'revealed' : 'covered'} side="right" />}
          </div>
          <Spine height={H} left={W} />
          {turn && (
            <Sheet
              key={`${turn.from}-${turn.to}`}
              progress={progress}
              dir={turn.dir}
              x={layers.sheetSide === 'right' ? W : 0}
              W={W}
              H={H}
              front={<AlbumPage page={pages[layers.front]} side={layers.sheetSide} ctx={ctx} />}
              back={<AlbumPage page={pages[layers.back]} side={layers.sheetSide === 'right' ? 'left' : 'right'} ctx={ctx} />}
            />
          )}
          {!turn && <Tabs sections={sections} view={view} W={W} H={H} onGo={goTo} />}
          <Corner side="left" disabled={view <= minV} onClick={() => step(-1)} />
          <Corner side="right" disabled={view >= maxV} onClick={() => step(1)} />
        </div>
      ) : (
        <div className="relative" style={{ width: W, height: H, perspective: 1700 }}>
          <BookBase single />
          <Ribbon className="anim-ribbon pointer-events-none absolute -bottom-[30px] left-[18px] h-[40px] w-[12px]" />
          <div className="absolute inset-0 overflow-hidden rounded-r-[4px] rounded-l-[2px]">
            <AlbumPage page={pages[layers.single]} side="single" ctx={ctx} />
            {turn && <CastShadow progress={progress} role={turn.dir > 0 ? 'revealed' : 'covered'} side="right" />}
          </div>
          {turn && (
            <PhoneSheet
              key={`${turn.from}-${turn.to}`}
              progress={progress}
              dir={turn.dir}
              W={W}
              H={H}
              front={<AlbumPage page={pages[layers.front]} side="single" ctx={ctx} />}
            />
          )}
          <Corner side="left" small disabled={view <= minV} onClick={() => step(-1)} />
          <Corner side="right" small disabled={view >= maxV} onClick={() => step(1)} />
        </div>
      )}
    </div>
  )
}

/* ----------------------------------------------------------------------------------------- */

/** The turning sheet on desktop. Light and shadow follow the angle of the paper. */
function Sheet({ progress, dir, x, W, H, front, back }) {
  const rotateY = useTransform(progress, (p) => (dir > 0 ? -180 * p : 180 * p))
  const z = useTransform(progress, (p) => Math.sin(p * Math.PI) * 26)
  const frontShade = useTransform(progress, [0, 0.5], [0, 0.55])
  const backShade = useTransform(progress, [0.5, 1], [0.55, 0])
  const sheen = useTransform(progress, [0, 0.25, 0.5], [0, 0.5, 0])
  // the spine side of each face (where the paper curves in)
  const frontSpine = dir > 0 ? 'to right' : 'to left'
  const backSpine = dir > 0 ? 'to left' : 'to right'

  return (
    <motion.div
      className="preserve-3d absolute top-0"
      style={{ left: x, width: W, height: H, rotateY, z, transformOrigin: dir > 0 ? 'left center' : 'right center' }}
    >
      <div className="backface-hidden absolute inset-0 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.25)]">
        {front}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: frontShade, background: `linear-gradient(${frontSpine}, rgba(45,28,12,0.65), rgba(45,28,12,0.15) 45%, rgba(255,236,200,0.08) 85%, transparent)` }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: sheen, background: `linear-gradient(${frontSpine}, transparent 55%, rgba(255,244,222,0.55) 80%, transparent 96%)` }}
        />
      </div>
      <div className="backface-hidden absolute inset-0 overflow-hidden" style={{ transform: 'rotateY(180deg)' }}>
        {back}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: backShade, background: `linear-gradient(${backSpine}, rgba(45,28,12,0.6), rgba(45,28,12,0.12) 45%, transparent)` }}
        />
      </div>
    </motion.div>
  )
}

/** Phone: the page turns away around its left edge (or comes back over the current page) */
function PhoneSheet({ progress, dir, W, H, front }) {
  const rotateY = useTransform(progress, (p) => (dir > 0 ? -180 * p : -180 * (1 - p)))
  const opacity = useTransform(progress, dir > 0 ? [0, 0.72, 0.92] : [0.08, 0.28, 1], dir > 0 ? [1, 1, 0] : [0, 1, 1])
  const shade = useTransform(progress, dir > 0 ? [0, 0.5] : [0.5, 1], dir > 0 ? [0, 0.5] : [0.5, 0])
  const z = useTransform(progress, (p) => Math.sin(p * Math.PI) * 18)

  return (
    <motion.div
      className="preserve-3d absolute top-0 left-0"
      style={{ width: W, height: H, rotateY, opacity, z, transformOrigin: 'left center' }}
    >
      <div className="backface-hidden absolute inset-0 overflow-hidden rounded-r-[4px] shadow-[0_0_24px_rgba(0,0,0,0.25)]">
        {front}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: shade, background: 'linear-gradient(to right, rgba(45,28,12,0.6), rgba(45,28,12,0.15) 50%, rgba(255,236,200,0.1) 90%)' }}
        />
      </div>
      {/* reverse side of the sheet: plain paper with a faint show-through */}
      <div className="backface-hidden grain absolute inset-0 overflow-hidden bg-[#f3ead9]" style={{ transform: 'rotateY(180deg)' }}>
        <div className="absolute inset-0 bg-gradient-to-l from-[rgba(45,28,12,0.25)] to-transparent" />
      </div>
    </motion.div>
  )
}

/** Shadow the lifted sheet casts on the pages underneath */
function CastShadow({ progress, role, side }) {
  const opacity = useTransform(progress, role === 'revealed' ? [0, 1] : [0.5, 1], role === 'revealed' ? [0.55, 0] : [0, 0.45])
  const dirCss = side === 'left' ? 'to left' : 'to right'
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ opacity, background: `linear-gradient(${dirCss}, rgba(30,18,8,0.7), rgba(30,18,8,0.18) 35%, transparent 70%)` }}
    />
  )
}

/** Covers, page block edges and the soft shadow on the table */
function BookBase({ single = false }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute -inset-x-[3%] top-[6%] -bottom-[5%] rounded-[50%] bg-black/45 blur-[38px]" />
      {/* cover boards peeking out around the pages */}
      <div className="cloth absolute -inset-[10px] rounded-[6px] bg-olivo shadow-[0_2px_0_#1d2112,0_14px_30px_-8px_rgba(0,0,0,0.6)]" style={{ left: single ? -6 : -10 }} />
      {/* stacked page edges */}
      <div className="absolute inset-0 rounded-[3px] bg-[#efe6d3] shadow-[0_1px_0_#e2d6be,0_2px_0_#f3ead9,0_3px_0_#d9ccb2,0_4px_0_#efe5d1,0_5px_0_#cfc1a6]" />
    </div>
  )
}

function Spine({ height, left }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 w-[40px] -translate-x-1/2"
      style={{
        left,
        height,
        background:
          'linear-gradient(to right, transparent, rgba(60,38,16,0.18) 40%, rgba(40,25,10,0.32) 50%, rgba(60,38,16,0.18) 60%, transparent)',
      }}
    />
  )
}

/** Click/tap zone on the outer bottom corner, with a small page-curl on hover */
function Corner({ side, onClick, disabled, small = false }) {
  if (disabled) return null
  const s = small ? 56 : 84
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'right' ? 'Página siguiente' : 'Página anterior'}
      className={`group absolute bottom-0 z-20 outline-none ${side === 'right' ? 'right-0' : 'left-0'}`}
      style={{ width: s, height: s }}
    >
      <span
        className={`absolute bottom-0 block size-0 transition-[width,height] duration-500 ease-out group-hover:size-[34px] group-focus-visible:size-[34px] ${side === 'right' ? 'right-0' : 'left-0'}`}
        style={{
          background:
            side === 'right'
              ? 'linear-gradient(135deg, #f6eedd 0%, #e6dac2 48%, rgba(0,0,0,0.22) 50%, transparent 56%)'
              : 'linear-gradient(225deg, #f6eedd 0%, #e6dac2 48%, rgba(0,0,0,0.22) 50%, transparent 56%)',
          boxShadow: side === 'right' ? '-3px -3px 6px -3px rgba(0,0,0,0.3)' : '3px -3px 6px -3px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  )
}

/** Physical tabs on the fore-edge: sections still ahead stick out on the right, passed ones on the left */
function Tabs({ sections, view, W, H, onGo }) {
  const leftPage = view * 2
  return (
    <AnimatePresence initial={false}>
      {sections.map((s, i) => {
        const ahead = s.pageIndex > leftPage + 1
        const top = H * (0.1 + i * 0.13)
        return (
          <motion.button
            key={`${s.collection.id}-${ahead ? 'r' : 'l'}`}
            type="button"
            onClick={() => onGo(s.pageIndex)}
            initial={{ opacity: 0, x: ahead ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            aria-label={`Ir a ${s.collection.indexLabel}`}
            title={s.collection.indexLabel}
            className={`group absolute z-[5] flex h-[11%] w-[30px] items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.3)] outline-none focus-visible:ring-2 focus-visible:ring-oro ${
              ahead ? 'rounded-r-[4px]' : 'rounded-l-[4px]'
            }`}
            style={{ top, [ahead ? 'left' : 'right']: W * 2 - 2, background: s.collection.tab }}
          >
            <span className="font-serif text-[12px] font-semibold text-marfil/90 tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/10" />
          </motion.button>
        )
      })}
    </AnimatePresence>
  )
}
