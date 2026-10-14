import { memo, useMemo } from 'react'

/**
 * Procedural pine branch (SVG). Deterministic: same drawing on every load.
 * Grows from the right edge (x = 600) towards the left. Hang ornaments from `anchors`.
 */
function rand(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// point on quadratic Bézier
const q = (p0, p1, p2, t) => [
  (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0],
  (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1],
]

function buildBranch(seed) {
  const r = rand(seed)
  const twigs = []
  const main = [[600, 40], [380, 10], [40, 120]]
  twigs.push({ pts: main, width: 5, density: 70, len: 26 })
  // side twigs
  for (let i = 0; i < 9; i++) {
    const t = 0.12 + i * 0.09
    const start = q(...main, t)
    const dir = i % 2 ? 1 : -1
    const end = [start[0] - 70 - r() * 60, start[1] + dir * (30 + r() * 40)]
    const ctrl = [(start[0] + end[0]) / 2, start[1] + dir * 6]
    twigs.push({ pts: [start, ctrl, end], width: 2.5, density: 22, len: 20 })
  }

  const needles = { dark: [], mid: [], light: [] }
  for (const tw of twigs) {
    for (let k = 0; k < tw.density; k++) {
      const t = k / tw.density
      const [x, y] = q(...tw.pts, t)
      const [x2, y2] = q(...tw.pts, Math.min(1, t + 0.01))
      const ang = Math.atan2(y2 - y, x2 - x)
      for (const side of [-1, 1]) {
        const a = ang + side * (0.75 + r() * 0.35) + 0.25
        const l = tw.len * (0.7 + r() * 0.5) * (1 - t * 0.35)
        const seg = `M${x.toFixed(1)},${y.toFixed(1)}l${(Math.cos(a) * l).toFixed(1)},${(Math.sin(a) * l).toFixed(1)}`
        const bucket = r() < 0.35 ? 'dark' : r() < 0.75 ? 'mid' : 'light'
        needles[bucket].push(seg)
      }
    }
  }
  const stems = twigs.map(({ pts: [a, b, c], width }) => ({ d: `M${a[0]},${a[1]} Q${b[0]},${b[1]} ${c[0]},${c[1]}`, width }))
  return { stems, needles: { dark: needles.dark.join(''), mid: needles.mid.join(''), light: needles.light.join('') } }
}

function PineBranch({ className = '', seed = 7, tone = 'night' }) {
  const { stems, needles } = useMemo(() => buildBranch(seed), [seed])
  const colors =
    tone === 'night'
      ? { dark: '#0f1a12', mid: '#1d3022', light: '#2f4a34', stem: '#3b2a1c' }
      : { dark: '#1b2a1d', mid: '#2c4330', light: '#4a6648', stem: '#5a3d26' }

  return (
    <svg viewBox="0 0 600 220" className={className} aria-hidden="true" preserveAspectRatio="xMaxYMin meet">
      {stems.map((s, i) => (
        <path key={i} d={s.d} fill="none" stroke={colors.stem} strokeWidth={s.width} strokeLinecap="round" />
      ))}
      <path d={needles.dark} stroke={colors.dark} strokeWidth="1.6" strokeLinecap="round" />
      <path d={needles.mid} stroke={colors.mid} strokeWidth="1.5" strokeLinecap="round" />
      <path d={needles.light} stroke={colors.light} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export default memo(PineBranch)
