import Ornament, { DESIGNS } from './Ornament'

/**
 * Renders a product photo, or an illustrated stand-in while the value is a placeholder.
 *   'placeholder:nochebuena'          → one sphere hanging
 *   'placeholder:nochebuena:detail'   → close-up of the painted motif
 *   'placeholder:nochebuena:pair'     → two spheres at different heights
 *   'placeholder:set-abuela'          → 3-piece set
 *   'placeholder:set-posada'          → 6-piece gift box (top view)
 *   '/images/esferas/foo.jpg'         → real photo (lazy-loaded)
 * The wrapper sets the size; the image always covers it.
 */
export default function ProductImage({ src, alt, className = '', priority = false, center = false }) {
  if (typeof src === 'string' && src.startsWith('placeholder:')) {
    const [, design, view = 'front'] = src.split(':')
    return (
      <div className={`relative h-full w-full overflow-hidden ${className}`} role="img" aria-label={alt}>
        <Backdrop />
        <Scene design={design} view={view} center={center} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`h-full w-full object-cover ${className}`}
    />
  )
}

/** Warm linen backdrop with two out-of-focus candle lights */
function Backdrop() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_35%,#fdf7ec_0%,#f1e4cc_55%,#e2cfae_100%)]" />
      <div className="absolute top-[12%] left-[10%] size-16 rounded-full bg-[#f6c977]/25 blur-xl" />
      <div className="absolute right-[8%] bottom-[18%] size-20 rounded-full bg-[#f3b866]/20 blur-2xl" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#cdb48c]/30 to-transparent" />
    </>
  )
}

function Scene({ design, view, center }) {
  if (design === 'set-abuela') {
    return (
      <div className="absolute inset-0 flex items-start justify-center gap-[2%] px-[6%]">
        {[
          ['liso-rojo', '14%'],
          ['mercurio', '0%'],
          ['liso-verde', '20%'],
        ].map(([d, top]) => (
          <div key={d} className="relative w-[30%]" style={{ marginTop: top }}>
            <Thread h="22%" />
            <Ornament design={d} thread={false} className="anim-sway w-full drop-shadow-[0_10px_14px_rgba(70,40,15,0.25)]" />
          </div>
        ))}
      </div>
    )
  }

  if (design === 'set-posada') {
    const six = ['nochebuena', 'talavera', 'mercurio', 'estrella', 'pino', 'liso-rojo']
    return (
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid w-[78%] grid-cols-3 gap-[3%] rounded-md bg-[#c49a6c] p-[4%] shadow-[0_18px_30px_-12px_rgba(70,40,15,0.45),inset_0_0_0_3px_rgba(120,80,40,0.35)]">
          {six.map((d) => (
            <div key={d} className="grid aspect-square place-items-center rounded-sm bg-[#a87c50] shadow-[inset_0_4px_10px_rgba(60,35,15,0.45)]">
              <TopDown design={d} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!DESIGNS[design]) design = 'nochebuena'

  if (view === 'detail') {
    return (
      <div className="absolute inset-0">
        <Ornament
          design={design}
          thread={false}
          className="absolute top-[-38%] left-1/2 w-[150%] max-w-none -translate-x-1/2 drop-shadow-[0_20px_30px_rgba(70,40,15,0.3)]"
        />
      </div>
    )
  }

  if (view === 'pair') {
    return (
      <div className="absolute inset-0 flex items-start justify-center gap-[4%]">
        <div className="relative mt-[4%] w-[44%]">
          <Thread h="10%" />
          <Ornament design={design} thread={false} className="anim-sway w-full drop-shadow-[0_14px_18px_rgba(70,40,15,0.28)]" />
        </div>
        <div className="relative mt-[22%] w-[34%]" style={{ animationDelay: '-2s' }}>
          <Thread h="30%" />
          <Ornament design={design} thread={false} className="anim-sway w-full drop-shadow-[0_14px_18px_rgba(70,40,15,0.28)]" />
        </div>
      </div>
    )
  }

  return (
    <div className={`absolute inset-0 flex justify-center ${center ? 'items-center' : ''}`}>
      <div className={`relative w-[66%] ${center ? '-mt-[6%]' : 'mt-[6%]'}`}>
        <Thread h="12%" />
        <Ornament design={design} thread={false} className="anim-sway w-full drop-shadow-[0_18px_24px_rgba(70,40,15,0.3)]" />
      </div>
    </div>
  )
}

function Thread({ h }) {
  return <span className="absolute bottom-full left-1/2 w-px -translate-x-1/2 bg-[#8a6a40]/70" style={{ height: `calc(${h} + 100vh)` }} />
}

/** Sphere seen from above, resting in its box compartment */
function TopDown({ design }) {
  const [light, base, dark] = DESIGNS[design].body
  return (
    <svg viewBox="0 0 100 100" className="w-[86%]" aria-hidden="true">
      <defs>
        <radialGradient id={`td-${design}`} cx="38%" cy="34%" r="72%">
          <stop offset="0%" stopColor={light} />
          <stop offset="50%" stopColor={base} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="44" fill={`url(#td-${design})`} />
      <circle cx="50" cy="50" r="9" fill="#c69443" stroke="#6b4518" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="4" fill="none" stroke="#e2b766" strokeWidth="1.5" />
      <ellipse cx="34" cy="32" rx="9" ry="6" fill="#fff" opacity="0.45" transform="rotate(-30 34 32)" />
    </svg>
  )
}
