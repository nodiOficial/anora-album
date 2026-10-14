import { useId } from 'react'

/**
 * Arched window of an old Mexican house: cantera frame, open wooden shutters,
 * iron bars, candle and a poinsettia in a clay pot on the sill.
 * variant="night" → glowing warm interior (hero) · variant="day" → for the story photo.
 */
export default function ArchedWindow({ variant = 'night', className = '' }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const night = variant === 'night'
  const c = night
    ? { stone: '#5b4a37', stoneHi: '#7a6449', wood: '#3a2416', woodHi: '#4d3220', iron: '#140d08' }
    : { stone: '#cdb796', stoneHi: '#e3d2b4', wood: '#6b4528', woodHi: '#82573a', iron: '#2a1e14' }

  return (
    <svg viewBox="0 0 340 440" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`in${id}`} cx="50%" cy="72%" r="75%">
          {night ? (
            <>
              <stop offset="0%" stopColor="#ffe2a8" />
              <stop offset="35%" stopColor="#f3a955" />
              <stop offset="75%" stopColor="#a24f22" />
              <stop offset="100%" stopColor="#4a2312" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#8a6446" />
              <stop offset="60%" stopColor="#5a3d29" />
              <stop offset="100%" stopColor="#3a271a" />
            </>
          )}
        </radialGradient>
        <radialGradient id={`fl${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3c4" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffb85c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* open wooden shutters */}
      <path d="M40,410 L40,170 Q40,120 70,96 L70,410 Z" fill={c.wood} transform="translate(-30 0) skewY(4)" />
      <path d="M300,410 L300,170 Q300,120 270,96 L270,410 Z" fill={c.wood} transform="translate(30 0) skewY(-4)" />
      <g stroke={c.woodHi} strokeWidth="2" opacity="0.7">
        <path d="M20,200 V390 M30,190 V392" transform="skewY(4)" />
        <path d="M320,200 V390 M310,190 V392" transform="skewY(-4)" />
      </g>

      {/* cantera frame */}
      <path d="M40,420 V170 A130,130 0 0 1 300,170 V420 Z" fill={c.stone} />
      <path d="M40,420 V170 A130,130 0 0 1 300,170 V420 Z" fill="none" stroke={c.stoneHi} strokeWidth="2" opacity="0.6" />
      <rect x="160" y="34" width="20" height="26" rx="3" fill={c.stoneHi} opacity="0.8" />

      {/* interior */}
      <path d="M62,404 V174 A108,108 0 0 1 278,174 V404 Z" fill={`url(#in${id})`} />
      {night && (
        <g opacity="0.55">
          {/* garland of tiny lights inside the room */}
          <path d="M70,160 Q170,214 270,160" fill="none" stroke="#5a2a12" strokeWidth="1.2" />
          {Array.from({ length: 11 }, (_, i) => {
            const t = i / 10
            const x = 70 + 200 * t
            const y = 160 + 4 * 54 * t * (1 - t)
            return <circle key={i} cx={x} cy={y} r="2.6" fill="#ffe7a8" className="anim-twinkle" style={{ animationDelay: `${-i * 0.7}s` }} />
          })}
        </g>
      )}

      {/* iron bars */}
      <g stroke={c.iron} strokeWidth="4.5" strokeLinecap="round" fill="none">
        {[98, 134, 170, 206, 242].map((x) => (
          <line key={x} x1={x} y1={x === 170 ? 66 : 100} x2={x} y2="404" />
        ))}
        <line x1="62" y1="262" x2="278" y2="262" />
        <path d="M62,190 A108,108 0 0 1 278,190" strokeWidth="3.5" />
        <path d="M134,262 q18,-24 36,0 q18,-24 36,0" strokeWidth="3" />
      </g>

      {/* sill */}
      <rect x="22" y="400" width="296" height="22" rx="3" fill={c.stoneHi} />
      <rect x="22" y="418" width="296" height="8" fill="#000" opacity="0.18" />

      {/* candle */}
      <g transform="translate(110 360)">
        {night && <circle cx="0" cy="-8" r="40" fill={`url(#fl${id})`} className="anim-flicker" />}
        <rect x="-8" y="0" width="16" height="40" rx="2" fill="#f4e6cc" />
        <path d="M-8,4 q8,5 16,0" stroke="#d9c5a2" fill="none" />
        <line x1="0" y1="0" x2="0" y2="-5" stroke="#3a2a1a" strokeWidth="1.2" />
        <path d="M0,-22 C6,-14 5,-6 0,-4 C-5,-6 -6,-14 0,-22 Z" fill="#ffd27a" className="anim-flicker" style={{ transformOrigin: '0px -4px' }} />
      </g>

      {/* poinsettia in a clay pot */}
      <g transform="translate(232 352)">
        <path d="M-20,20 L20,20 L15,50 L-15,50 Z" fill="#a85b35" />
        <rect x="-23" y="16" width="46" height="8" rx="2" fill="#b86a42" />
        {Array.from({ length: 7 }, (_, i) => (
          <path
            key={i}
            d="M0,0 C6,-8 7,-20 0,-32 C-7,-20 -6,-8 0,0 Z"
            transform={`translate(0 8) rotate(${-90 + i * 30})`}
            fill={i % 2 ? '#9f2834' : '#b8323f'}
          />
        ))}
        <circle cx="0" cy="8" r="3.5" fill="#d9a441" />
      </g>
    </svg>
  )
}
