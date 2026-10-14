import { useId } from 'react'

/**
 * Illustrated blown-glass sphere (SVG). Used as an elegant placeholder until real photos exist,
 * and as decoration (hero, quote section).
 * Layers: thread → ring → body + painted motif → spherical shading → highlights → gold cap.
 */

// body colors: [light, base, dark]
export const DESIGNS = {
  nochebuena: { body: ['#D4505C', '#9F2834', '#4A0E14'], motif: Nochebuena },
  talavera: { body: ['#FFFDF8', '#EFE5D2', '#A9967A'], motif: Talavera },
  mercurio: { body: ['#FFF2D1', '#C9A35E', '#4A3215'], motif: Mercurio },
  angel: { body: ['#FFF3EA', '#E7CDBB', '#9A7663'], motif: Angel },
  'rey-mago': { body: ['#B4474A', '#7D2426', '#36090B'], motif: Corona },
  estrella: { body: ['#4D6B4F', '#233426', '#0C140D'], motif: Estrella },
  pino: { body: ['#6B7446', '#343A21', '#12150A'], motif: Pino },
  bugambilia: { body: ['#D9607A', '#A52A48', '#4E0D1E'], motif: Bugambilia },
  casita: { body: ['#FFF8EA', '#E8D8BA', '#A28A62'], motif: Casita },
  'liso-rojo': { body: ['#D4505C', '#9F2834', '#4A0E14'], motif: Lineas },
  'liso-verde': { body: ['#4D6B4F', '#233426', '#0C140D'], motif: Lineas },
}

const CX = 100
const CY = 138
const R = 80

export default function Ornament({ design = 'nochebuena', thread = true, className = '', title }) {
  const raw = useId()
  const id = raw.replace(/[^a-zA-Z0-9]/g, '')
  const d = DESIGNS[design] ?? DESIGNS.nochebuena
  const [light, base, dark] = d.body
  const Motif = d.motif

  return (
    <svg
      viewBox="0 0 200 228"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <radialGradient id={`b${id}`} cx="36%" cy="30%" r="78%">
          <stop offset="0%" stopColor={light} />
          <stop offset="45%" stopColor={base} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
        <radialGradient id={`s${id}`} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="58%" stopColor="#1a0c05" stopOpacity="0" />
          <stop offset="100%" stopColor="#1a0c05" stopOpacity="0.42" />
        </radialGradient>
        <radialGradient id={`h${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`g${id}`} x1="0" x2="1">
          <stop offset="0%" stopColor="#6b4518" />
          <stop offset="35%" stopColor="#e2b766" />
          <stop offset="60%" stopColor="#a8752c" />
          <stop offset="100%" stopColor="#4f3311" />
        </linearGradient>
        <clipPath id={`c${id}`}>
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>
      </defs>

      {thread && <line x1="100" y1="0" x2="100" y2="20" stroke="#8a6a40" strokeWidth="1" />}
      <circle cx="100" cy="25" r="6" fill="none" stroke={`url(#g${id})`} strokeWidth="2.2" />

      {/* glass body + motif painted on it */}
      <circle cx={CX} cy={CY} r={R} fill={`url(#b${id})`} />
      <g clipPath={`url(#c${id})`}>
        <Motif gold={`url(#g${id})`} />
        <circle cx={CX} cy={CY} r={R} fill={`url(#s${id})`} />
        {/* warm rim light from the room */}
        <path
          d={`M${CX + 66},${CY + 30} A${R - 6},${R - 6} 0 0 1 ${CX + 18},${CY + 72}`}
          fill="none"
          stroke="#ffd9a0"
          strokeOpacity="0.35"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* soft highlight + reflection of an arched window */}
      <ellipse cx="72" cy="100" rx="24" ry="34" transform="rotate(-32 72 100)" fill={`url(#h${id})`} />
      <g transform="translate(64 84) rotate(-14)" opacity="0.6">
        <path d="M0,22 L0,8 A7,7 0 0 1 14,8 L14,22 Z" fill="#fff" />
        <path d="M7,2 L7,22 M0,13 L14,13" stroke="#000" strokeOpacity="0.18" strokeWidth="1.2" />
      </g>
      <circle cx="122" cy="88" r="2.2" fill="#fff" opacity="0.7" />

      {/* gold cap (casquillo) */}
      <rect x="86" y="30" width="28" height="22" rx="3" fill={`url(#g${id})`} />
      <path
        d="M90,32 V50 M95,32 V50 M100,32 V50 M105,32 V50 M110,32 V50"
        stroke="#3d2709"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      <rect x="84" y="49" width="32" height="5" rx="2.5" fill={`url(#g${id})`} />
    </svg>
  )
}

/* ---------------------------- painted motifs ---------------------------- */

function Nochebuena() {
  const petal = 'M0,0 C9,-12 11,-32 0,-50 C-11,-32 -9,-12 0,0 Z'
  return (
    <g transform={`translate(${CX} ${CY + 4})`}>
      {Array.from({ length: 18 }, (_, i) => (
        <circle
          key={i}
          cx={Math.cos((i / 18) * Math.PI * 2) * 66}
          cy={Math.sin((i / 18) * Math.PI * 2) * 66}
          r="1.8"
          fill="#f6e7c8"
          opacity="0.55"
        />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={petal} transform={`rotate(${i * (360 / 7)})`} fill="#f6e7c8" stroke="#d9b06a" strokeWidth="0.8" />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <path
          key={`i${i}`}
          d={petal}
          transform={`rotate(${i * (360 / 7) + 25}) scale(0.6)`}
          fill="#efd5a4"
          stroke="#c99a3e"
          strokeWidth="1"
        />
      ))}
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 5} cy={Math.sin((a * Math.PI) / 180) * 5} r="2.6" fill="#b5802d" />
      ))}
      <circle r="3" fill="#6b8a3a" />
    </g>
  )
}

function Talavera() {
  const cobalt = '#2c4a96'
  return (
    <g transform={`translate(${CX} ${CY + 4})`}>
      <circle r="68" fill="none" stroke={cobalt} strokeWidth="2.2" />
      <circle r="73" fill="none" stroke={cobalt} strokeWidth="1" />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2
        return <circle key={i} cx={Math.cos(a) * 56} cy={Math.sin(a) * 56} r="3.4" fill={i % 2 ? '#d9a441' : cobalt} />
      })}
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} cx="0" cy="-24" rx="9" ry="20" transform={`rotate(${i * 45})`} fill={cobalt} />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={`d${i}`} cx="0" cy="-40" r="2.4" transform={`rotate(${i * 45 + 22.5})`} fill={cobalt} />
      ))}
      <circle r="10" fill="#f2e9d8" />
      <circle r="4.5" fill="#d9a441" />
    </g>
  )
}

function Mercurio() {
  return (
    <g>
      <ellipse cx="132" cy="140" rx="12" ry="74" fill="#fff" opacity="0.18" />
      <ellipse cx="84" cy="150" rx="7" ry="72" fill="#2a1a08" opacity="0.14" />
      <ellipse cx="100" cy="200" rx="60" ry="14" fill="#2a1a08" opacity="0.18" />
      <ellipse cx="100" cy="72" rx="46" ry="10" fill="#fff6dc" opacity="0.3" />
    </g>
  )
}

function Angel({ gold }) {
  const ink = '#a87a2c'
  return (
    <g>
      <ellipse cx="100" cy="94" rx="16" ry="5" fill="none" stroke={gold} strokeWidth="3" />
      <path d="M93,130 C70,108 50,124 58,154 C68,148 82,148 94,142 Z" fill="#fff6ea" stroke={ink} strokeWidth="1.2" />
      <path d="M107,130 C130,108 150,124 142,154 C132,148 118,148 106,142 Z" fill="#fff6ea" stroke={ink} strokeWidth="1.2" />
      <path d="M100,120 L82,180 Q100,188 118,180 Z" fill="#fffaf2" stroke={ink} strokeWidth="1.2" />
      <path d="M90,160 Q100,165 110,160" fill="none" stroke={ink} strokeWidth="1" />
      <circle cx="100" cy="110" r="11" fill="#f7e9dc" stroke={ink} strokeWidth="1.4" />
      {[[62, 96], [140, 98], [70, 186], [134, 184], [100, 206]].map(([x, y], i) => (
        <path key={i} d={`M${x},${y - 4} L${x + 1.2},${y - 1.2} L${x + 4},${y} L${x + 1.2},${y + 1.2} L${x},${y + 4} L${x - 1.2},${y + 1.2} L${x - 4},${y} L${x - 1.2},${y - 1.2} Z`} fill={ink} />
      ))}
    </g>
  )
}

function Corona({ gold }) {
  return (
    <g>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2
        const x = CX + Math.cos(a) * 64
        const y = CY + 4 + Math.sin(a) * 64
        return <circle key={i} cx={x} cy={y} r="1.8" fill="#e2b766" opacity="0.7" />
      })}
      <path d="M68,150 L63,112 L84,132 L100,102 L116,132 L137,112 L132,150 Z" fill={gold} />
      <rect x="66" y="148" width="68" height="14" rx="2" fill={gold} />
      <circle cx="63" cy="110" r="4" fill="#f3e3c3" />
      <circle cx="100" cy="100" r="4.5" fill="#f3e3c3" />
      <circle cx="137" cy="110" r="4" fill="#f3e3c3" />
      <circle cx="82" cy="155" r="3.2" fill="#2f6b45" />
      <circle cx="100" cy="155" r="3.6" fill="#c23b3f" />
      <circle cx="118" cy="155" r="3.2" fill="#2f6b45" />
    </g>
  )
}

function star(cx, cy, outer, inner, points = 8, rot = 0) {
  const pts = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? inner : outer
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2 + rot
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`)
  }
  return pts.join(' ')
}

function Estrella({ gold }) {
  return (
    <g>
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2
        return <circle key={i} cx={CX + Math.cos(a) * 60} cy={CY + 4 + Math.sin(a) * 60} r="1.6" fill="#e2b766" opacity="0.6" />
      })}
      <polygon points={star(CX, CY + 4, 26, 11, 8, Math.PI / 8)} fill="#f3e3c3" opacity="0.5" />
      <polygon points={star(CX, CY + 4, 38, 13, 8)} fill={gold} />
      <circle cx={CX} cy={CY + 4} r="4" fill="#fff4d6" />
    </g>
  )
}

function sprig(x0, y0, x1, y1, n = 9) {
  const parts = [`M${x0},${y0} L${x1},${y1}`]
  const dx = x1 - x0
  const dy = y1 - y0
  const len = Math.hypot(dx, dy)
  const ux = dx / len
  const uy = dy / len
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1)
    const px = x0 + dx * t
    const py = y0 + dy * t
    const l = 12 * (1 - t * 0.5)
    // needles angled forward on both sides
    parts.push(`M${px},${py} l${(ux * 0.6 - uy) * l},${(uy * 0.6 + ux) * l}`)
    parts.push(`M${px},${py} l${(ux * 0.6 + uy) * l},${(uy * 0.6 - ux) * l}`)
  }
  return parts.join(' ')
}

function Pino() {
  return (
    <g stroke="#d1aa5c" strokeWidth="1.3" strokeLinecap="round" fill="none">
      <path d={sprig(54, 182, 120, 104)} />
      <path d={sprig(150, 176, 100, 120, 7)} />
      <path d={sprig(78, 120, 54, 96, 5)} />
      <g fill="#b33a3a" stroke="none">
        <circle cx="100" cy="150" r="4.5" />
        <circle cx="108" cy="157" r="4" />
        <circle cx="96" cy="160" r="3.6" />
      </g>
    </g>
  )
}

function Bugambilia() {
  const flowers = [
    [76, 104, 1],
    [118, 98, 0.85],
    [142, 136, 1],
    [96, 140, 1.15],
    [64, 162, 0.9],
    [120, 178, 1],
    [88, 198, 0.8],
  ]
  return (
    <g>
      {[[70, 130, -30], [132, 160, 40], [106, 116, 10]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="6" ry="13" transform={`rotate(${r} ${x} ${y})`} fill="#5c6b3a" opacity="0.85" />
      ))}
      {flowers.map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          {[0, 120, 240].map((a) => (
            <ellipse key={a} cx="0" cy="-9" rx="9" ry="11" transform={`rotate(${a + i * 17})`} fill="#ec98ab" opacity="0.92" />
          ))}
          <circle r="2.4" fill="#fff6dc" />
        </g>
      ))}
    </g>
  )
}

function Casita() {
  return (
    <g>
      <path d="M58,182 L58,130 L80,130 Q90,108 100,104 Q110,108 120,130 L142,130 L142,182 Z" fill="#fbf3e4" stroke="#b08a5a" strokeWidth="1.2" />
      <path d="M120,130 L146,130" stroke="#a85b35" strokeWidth="3" strokeLinecap="round" />
      <rect x="91" y="148" width="18" height="34" rx="1" fill="#2f4a34" />
      <rect x="120" y="140" width="13" height="16" fill="#2f4a34" stroke="#8a5a30" strokeWidth="1.5" />
      <circle cx="84" cy="146" r="7" fill="#f2c46a" opacity="0.3" />
      <circle cx="84" cy="146" r="3" fill="#f2c46a" />
      <path d="M96,118 v8 M92,122 h8" stroke="#744b2c" strokeWidth="1.4" />
      {[[56, 128], [62, 120], [52, 138], [66, 134], [60, 146], [70, 124]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#b32b45" />
      ))}
      <path d="M50,182 L150,182" stroke="#a85b35" strokeWidth="1.5" opacity="0.6" />
    </g>
  )
}

function Lineas({ gold }) {
  return (
    <g fill="none" stroke={gold} strokeWidth="2">
      <ellipse cx={CX} cy={CY} rx={R} ry="16" />
      <ellipse cx={CX} cy={CY} rx={R} ry="22" strokeWidth="0.8" />
    </g>
  )
}
