import { site } from '../config/site'
import Logo from './Logo'
import { BerrySprig, OrnamentDivider, Star4 } from './ui'

/**
 * Front cover: olive book cloth, gold-tooled frame, the official logo set in an oval window
 * (like the photo window on old albums), foil title.
 */
export function CoverFace({ className = '' }) {
  return (
    <div className={`cloth absolute inset-0 overflow-hidden rounded-[3px_6px_6px_3px] bg-olivo ${className}`} style={{ containerType: 'size' }}>
      <CoverLight />
      {/* spine */}
      <div className="absolute inset-y-0 left-0 w-[7cqw] bg-gradient-to-r from-black/35 via-black/10 to-white/[0.04]" />
      <div className="absolute top-[7%] left-[1.5cqw] h-px w-[4cqw] bg-[#c9944a]/70" />
      <div className="absolute top-[7.8%] left-[1.5cqw] h-px w-[4cqw] bg-[#c9944a]/40" />
      <div className="absolute bottom-[7%] left-[1.5cqw] h-px w-[4cqw] bg-[#c9944a]/70" />
      <div className="absolute bottom-[7.8%] left-[1.5cqw] h-px w-[4cqw] bg-[#c9944a]/40" />

      <GoldFrame />

      <div className="absolute inset-0 flex flex-col items-center justify-center pl-[5cqw] text-center">
        <Star4 className="w-[6cqw] drop-shadow-[0_1px_0_rgba(0,0,0,0.5)]" color="#d3a259" />

        {/* oval window with the official logo */}
        <div className="relative mt-[5cqh] w-[54cqw] rounded-[50%] bg-gradient-to-b from-[#e7c27a] via-[#a8752c] to-[#6b4518] p-[1cqw] shadow-[0_1px_0_rgba(255,255,255,0.15),0_6px_18px_rgba(0,0,0,0.45)]">
          <div className="rounded-[50%] bg-[#1c2012] p-[1.2cqw] shadow-[inset_0_3px_10px_rgba(0,0,0,0.8)]">
            <Logo eager className="shadow-[0_2px_8px_rgba(0,0,0,0.5)]" />
          </div>
        </div>

        <p className="foil mt-[5.5cqh] font-serif text-[max(10px,3.1cqw)] font-semibold tracking-[0.5em] uppercase [text-shadow:0_1px_0_rgba(0,0,0,0.0)]">
          Catálogo
        </p>
        <p className="foil mt-[1.2cqw] font-serif text-[max(18px,7.4cqw)] leading-none font-semibold tracking-[0.16em] uppercase">
          Navidad 2026
        </p>
        <div className="mt-[3cqw] flex items-center gap-[2cqw]">
          <BerrySprig tone="gold" flip className="w-[13cqw]" />
          <Star4 className="w-[2.6cqw]" color="#c9944a" />
          <BerrySprig tone="gold" className="w-[13cqw]" />
        </div>
        <p className="mt-[2.4cqw] font-serif text-[max(13px,4.3cqw)] text-[#d8ab62] italic [text-shadow:0_1px_0_rgba(0,0,0,0.45)]">
          “{site.tagline}”
        </p>
      </div>
    </div>
  )
}

/** Back cover: almost nothing — name, craft, and where it was made */
export function BackCoverFace({ className = '' }) {
  return (
    <div className={`cloth absolute inset-0 overflow-hidden rounded-[6px_3px_3px_6px] bg-olivo ${className}`} style={{ containerType: 'size' }}>
      <CoverLight />
      <div className="absolute inset-y-0 right-0 w-[7cqw] bg-gradient-to-l from-black/35 via-black/10 to-white/[0.04]" />
      <GoldFrame spine="right" />
      <div className="absolute inset-0 flex flex-col items-center justify-center pr-[5cqw] text-center">
        <Star4 className="w-[5cqw]" color="#d3a259" />
        <p className="foil mt-[6cqw] font-serif text-[max(26px,10cqw)] leading-none font-semibold tracking-[0.22em]">AÑORA</p>
        <p className="mt-[3cqw] font-serif text-[max(10px,2.8cqw)] font-semibold tracking-[0.42em] text-[#c9944a] uppercase">{site.subtitle}</p>
        <OrnamentDivider className="mt-[7cqw] h-[max(12px,3.4cqw)] w-[40cqw]" color="#b98a45" />
        <p className="mt-[7cqw] font-serif text-[max(13px,4cqw)] text-[#d8ab62] italic">Hecho con cariño en México.</p>
      </div>
    </div>
  )
}

function GoldFrame({ spine = 'left' }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-[6cqw] ${spine === 'left' ? 'left-[11cqw]' : 'right-[11cqw]'}`}>
      <div className="absolute inset-0 border border-[#c9944a]/60" />
      <div className="absolute inset-[1.6cqw] border border-[#c9944a]/30" />
      {['-top-[1.6cqw] -left-[1.6cqw]', '-top-[1.6cqw] -right-[1.6cqw]', '-bottom-[1.6cqw] -left-[1.6cqw]', '-bottom-[1.6cqw] -right-[1.6cqw]'].map((pos) => (
        <Star4 key={pos} className={`absolute w-[3.2cqw] ${pos}`} color="#c9944a" />
      ))}
    </div>
  )
}

function CoverLight() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'radial-gradient(90% 70% at 35% 22%, rgba(255,230,180,0.10), transparent 60%), radial-gradient(130% 110% at 50% 50%, transparent 60%, rgba(0,0,0,0.38))',
      }}
    />
  )
}
