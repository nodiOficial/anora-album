import { availability } from '../data/availability'

export const EASE = [0.22, 1, 0.36, 1]
export const EASE_PAGE = [0.45, 0.05, 0.25, 1]

/** Deterministic small tilt per id, so photos look hand-placed but never jump between renders */
export function tiltFor(id, max = 3) {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) | 0
  return (((h % 1000) + 1000) % 1000) / 1000 * max * 2 - max
}

export function formatPrice(price) {
  if (price == null) return 'Precio a consultar'
  return `$${price.toLocaleString('es-MX')} MXN`
}

export function Availability({ status, className = '' }) {
  const s = availability[status] ?? availability.disponible
  return (
    <span className={`inline-flex items-center gap-[0.45em] ${s.text} ${className}`}>
      <span className={`inline-block size-[0.5em] rounded-full ${s.dot}`} aria-hidden="true" />
      {s.label}
    </span>
  )
}

/** The logo's divider: dot — line — four-point star — line — dot */
export function OrnamentDivider({ className = '', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 220 24" className={className} aria-hidden="true">
      <g fill={color}>
        <circle cx="6" cy="12" r="2.4" />
        <circle cx="214" cy="12" r="2.4" />
        <path d="M110,0 L112.6,9.4 L122,12 L112.6,14.6 L110,24 L107.4,14.6 L98,12 L107.4,9.4 Z" />
      </g>
      <g stroke={color} strokeWidth="1">
        <line x1="16" y1="12" x2="90" y2="12" />
        <line x1="130" y1="12" x2="204" y2="12" />
      </g>
    </svg>
  )
}

export function Star4({ className = '', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path d="M10,0 L11.8,8.2 L20,10 L11.8,11.8 L10,20 L8.2,11.8 L0,10 L8.2,8.2 Z" fill={color} />
    </svg>
  )
}

/** Berry sprig from the logo. tone="gold" = embossed on the cover cloth */
export function BerrySprig({ className = '', flip = false, tone = 'color' }) {
  const gold = tone === 'gold'
  const stem = gold ? '#c9944a' : '#8a7448'
  const leaf = gold ? '#c9944a' : '#5f6b3a'
  const berry = gold ? '#8e2a2c' : '#9f2834'
  return (
    <svg viewBox="0 0 160 70" className={className} aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M156,52 C120,48 80,40 30,18" fill="none" stroke={stem} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M100,42 C92,30 80,26 66,26" fill="none" stroke={stem} strokeWidth="1.2" />
      <path d="M70,34 C60,40 50,40 40,36" fill="none" stroke={stem} strokeWidth="1.1" />
      {[
        [126, 50, 18],
        [110, 46, -24],
        [88, 37, 30],
        [58, 30, -30],
      ].map(([x, y, r], i) => (
        <path key={i} d="M0,0 C6,-8 16,-8 22,-2 C16,4 6,5 0,0Z" transform={`translate(${x} ${y}) rotate(${r})`} fill={leaf} opacity={gold ? 0.85 : 1} />
      ))}
      {[
        [28, 17, 5.5],
        [62, 25, 5],
        [38, 35, 4.6],
        [18, 28, 4.2],
      ].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={berry} stroke={gold ? '#c9944a' : 'none'} strokeWidth="0.8" />
          <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.3} fill="#fff" opacity="0.4" />
        </g>
      ))}
    </svg>
  )
}

/** Photo corner mount (album "esquinero") */
export function PhotoCorner({ className = '', rotate = 0 }) {
  return (
    <svg viewBox="0 0 30 30" className={className} style={{ transform: `rotate(${rotate}deg)` }} aria-hidden="true">
      <path d="M0,0 H30 L0,30 Z" fill="#3a2a1c" />
      <path d="M3,3 H22" stroke="#fff" strokeOpacity="0.12" strokeWidth="1" />
    </svg>
  )
}

/** Translucent paper tape */
export function Tape({ className = '', rotate = 0 }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute block h-[1.6em] w-[5em] bg-[#efe3c6]/75 shadow-[0_1px_2px_rgba(80,50,20,0.15)] [clip-path:polygon(3%_0,97%_4%,100%_92%,1%_100%)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    />
  )
}
