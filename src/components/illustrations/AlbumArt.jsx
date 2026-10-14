import PineBranch from './PineBranch'

/** Small line illustrations for divider pages and album details (SVG, theme colors). */

export function DividerArt({ kind, className = '' }) {
  switch (kind) {
    case 'nochebuena':
      return <Nochebuena className={className} />
    case 'estrella':
      return <Estrella className={className} />
    case 'pino':
      return <PineBranch seed={5} tone="day" className={className} />
    case 'bugambilia':
      return <Bugambilia className={className} />
    case 'caja':
      return <Caja className={className} />
    default:
      return <Estrella className={className} />
  }
}

function Nochebuena({ className }) {
  const petal = 'M0,0 C10,-14 12,-38 0,-60 C-12,-38 -10,-14 0,0 Z'
  return (
    <svg viewBox="-80 -80 160 160" className={className} aria-hidden="true">
      {[-28, 208].map((a) => (
        <path key={a} d="M0,0 C16,-10 40,-10 60,0 C40,10 16,10 0,0Z" transform={`rotate(${a}) translate(44 0)`} fill="#5f6b3a" opacity="0.85" />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={petal} transform={`rotate(${i * (360 / 7)})`} fill="#9f2834" />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <path key={`b${i}`} d={petal} transform={`rotate(${i * (360 / 7) + 26}) scale(0.62)`} fill="#b8323f" />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <path key={`v${i}`} d="M0,-6 L0,-44" transform={`rotate(${i * (360 / 7)})`} stroke="#6e1820" strokeWidth="1" opacity="0.5" />
      ))}
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 6} cy={Math.sin((a * Math.PI) / 180) * 6} r="3.2" fill="#d9a441" />
      ))}
      <circle r="3" fill="#6b8a3a" />
    </svg>
  )
}

function star(cx, cy, outer, inner, points, rot = 0) {
  return Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 ? inner : outer
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2 + rot
    return `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`
  }).join(' ')
}

function Estrella({ className }) {
  return (
    <svg viewBox="-60 -60 120 120" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="estrella-oro" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#e7c27a" />
          <stop offset="0.5" stopColor="#b47a2a" />
          <stop offset="1" stopColor="#8a5a1e" />
        </linearGradient>
      </defs>
      <polygon points={star(0, 0, 32, 13, 8, Math.PI / 8)} fill="#e7c27a" opacity="0.35" />
      <polygon points={star(0, 0, 50, 15, 8)} fill="url(#estrella-oro)" />
      <circle r="5" fill="#fff4d6" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2
        return <circle key={i} cx={Math.cos(a) * 56} cy={Math.sin(a) * 56} r="1.2" fill="#b47a2a" opacity="0.6" />
      })}
    </svg>
  )
}

function Bugambilia({ className }) {
  const flowers = [
    [30, 40], [52, 30], [74, 44], [44, 60], [96, 30], [112, 52], [64, 66], [130, 36], [88, 70], [22, 74], [150, 54], [120, 74],
  ]
  return (
    <svg viewBox="0 0 180 110" className={className} aria-hidden="true">
      <path d="M0,40 C40,50 90,30 180,48 M20,30 C50,70 90,80 140,90" fill="none" stroke="#5a3d26" strokeWidth="1.6" />
      {[[40, 50, 20], [100, 44, -30], [70, 80, 60], [140, 62, -10]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="4" ry="9" transform={`rotate(${r} ${x} ${y})`} fill="#5f6b3a" />
      ))}
      {flowers.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${i * 41}) scale(${0.85 + (i % 3) * 0.15})`}>
          {[0, 120, 240].map((a) => (
            <ellipse key={a} cx="0" cy="-6" rx="6" ry="7.5" transform={`rotate(${a})`} fill={i % 4 === 0 ? '#c03a55' : '#9f2834'} />
          ))}
          <circle r="1.6" fill="#f6e7c8" />
        </g>
      ))}
    </svg>
  )
}

function Caja({ className }) {
  return (
    <svg viewBox="0 0 160 130" className={className} aria-hidden="true">
      <path d="M20,52 L140,52 L132,122 L28,122 Z" fill="#c49a6c" />
      <path d="M20,52 L140,52 L132,122 L28,122 Z" fill="none" stroke="#8a6040" strokeWidth="1.2" />
      <rect x="14" y="38" width="132" height="18" rx="2" fill="#d1aa7c" stroke="#8a6040" strokeWidth="1.2" />
      <rect x="72" y="38" width="16" height="84" fill="#7d2426" />
      <path d="M80,38 C60,14 40,20 52,34 C58,40 72,40 80,38 Z M80,38 C100,14 120,20 108,34 C102,40 88,40 80,38 Z" fill="#9f2834" />
      <circle cx="80" cy="37" r="5" fill="#7d2426" />
      <path d="M40,90 h20 M100,96 h22" stroke="#8a6040" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

/** A dried, pressed bougainvillea branch held with tape (notes page) */
export function PressedFlower({ className = '' }) {
  return (
    <svg viewBox="0 0 140 200" className={className} aria-hidden="true">
      <path d="M70,196 C66,150 74,110 68,60 C66,40 72,24 78,8" fill="none" stroke="#7a5a3c" strokeWidth="1.6" />
      <path d="M69,120 C56,110 46,112 38,104 M70,90 C84,80 94,82 104,74 M68,150 C80,144 88,146 96,140" fill="none" stroke="#7a5a3c" strokeWidth="1.1" />
      {[[38, 102, -20], [104, 72, 30], [96, 138, 10], [62, 64, -10], [80, 40, 20], [76, 14, 0]].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${i % 2 ? 0.9 : 1.05})`} opacity="0.88">
          {[0, 120, 240].map((a) => (
            <ellipse key={a} cx="0" cy="-7" rx="7" ry="9" transform={`rotate(${a})`} fill={i % 3 === 0 ? '#a8455a' : '#8d3346'} />
          ))}
          <circle r="1.8" fill="#efdcb8" />
        </g>
      ))}
      {[[58, 132, -40], [84, 108, 40], [62, 84, -30]].map(([x, y, r], i) => (
        <ellipse key={`l${i}`} cx={x} cy={y} rx="5" ry="11" transform={`rotate(${r} ${x} ${y})`} fill="#7b7a4a" opacity="0.8" />
      ))}
    </svg>
  )
}

/** Wine velvet bookmark ribbon with a V-cut end */
export function Ribbon({ className = '', style }) {
  return (
    <svg viewBox="0 0 24 160" className={className} style={style} aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <linearGradient id="ribbon-velvet" x1="0" x2="1">
          <stop offset="0" stopColor="#5a1518" />
          <stop offset="0.45" stopColor="#8e2a2e" />
          <stop offset="1" stopColor="#5a1518" />
        </linearGradient>
      </defs>
      <path d="M2,0 H22 V160 L12,148 L2,160 Z" fill="url(#ribbon-velvet)" />
    </svg>
  )
}
