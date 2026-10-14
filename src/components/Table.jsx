import { memo } from 'react'
import { motion } from 'framer-motion'
import PineBranch from './illustrations/PineBranch'
import Ornament from './illustrations/Ornament'
import ArchedWindow from './illustrations/ArchedWindow'

/**
 * The surface the album rests on: an old wooden table in December.
 * Very few objects around it (desktop only), warm out-of-focus string lights and floating dust.
 */
const LIGHTS = [
  { left: '6%', top: '4%', s: 90, d: '0s' },
  { left: '22%', top: '-3%', s: 60, d: '-2s' },
  { left: '48%', top: '-6%', s: 110, d: '-4s' },
  { left: '71%', top: '-2%', s: 70, d: '-1s' },
  { left: '90%', top: '5%', s: 100, d: '-3s' },
  { left: '96%', top: '62%', s: 80, d: '-5s' },
  { left: '2%', top: '70%', s: 70, d: '-2.5s' },
]
const DUST = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 61) % 100}%`,
  bottom: `${(i * 37) % 50}%`,
  size: 1.5 + ((i * 7) % 3) * 0.7,
  dur: 16 + ((i * 5) % 10),
  delay: -((i * 3.3) % 20),
  dx: `${((i % 5) - 2) * 16}px`,
}))

function Table({ lit, desktop }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* wood */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#2c1c11_0%,#24170e_55%,#1b110a_100%)]" />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'repeating-linear-gradient(178deg, rgba(255,210,150,0.025) 0 2px, transparent 2px 9px), repeating-linear-gradient(181deg, rgba(0,0,0,0.12) 0 1px, transparent 1px 23px)',
        }}
      />
      <div className="grain absolute inset-0 opacity-70" />
      {/* lamp light, a little brighter once the album is open */}
      <motion.div
        className="absolute top-[-20%] left-1/2 h-[120vmin] w-[150vmin] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(243,176,95,0.30),rgba(200,120,60,0.10)_55%,transparent)]"
        animate={{ opacity: lit ? 1 : 0.65, scale: lit ? 1.05 : 1 }}
        transition={{ duration: 2.4, ease: 'easeInOut' }}
      />

      {desktop && (
        <>
          {/* pine sprig */}
          <div className="absolute -top-[4%] -left-[6%] w-[34vw] max-w-[520px] -rotate-[18deg] opacity-90 blur-[0.5px]">
            <PineBranch seed={31} tone="night" className="w-full -scale-x-100" />
          </div>
          {/* an old family photo, half out of the light */}
          <div className="absolute bottom-[7%] left-[5%] w-[12vw] max-w-[180px] rotate-[-9deg] bg-[#eadfc8] p-[0.6vw] pb-[2vw] opacity-80 shadow-[0_10px_24px_rgba(0,0,0,0.5)] [filter:sepia(0.5)_brightness(0.8)]">
            <div className="aspect-[4/5] overflow-hidden bg-[#d9c8a6]">
              <ArchedWindow variant="day" className="mx-auto mt-[8%] w-[80%]" />
            </div>
          </div>
          {/* spheres out of focus */}
          <div className="absolute right-[4%] bottom-[6%] w-[9vw] max-w-[140px] rotate-[12deg] opacity-80 blur-[3px]">
            <Ornament design="nochebuena" thread={false} className="w-full" />
          </div>
          <div className="absolute right-[11%] bottom-[2%] w-[5vw] max-w-[80px] -rotate-[20deg] opacity-70 blur-[4px]">
            <Ornament design="mercurio" thread={false} className="w-full" />
          </div>
        </>
      )}

      {LIGHTS.map((l, i) => (
        <span
          key={i}
          className="anim-twinkle absolute rounded-full bg-[#f6c26b]/35 blur-2xl"
          style={{ left: l.left, top: l.top, width: l.s, height: l.s, animationDelay: l.d, animationDuration: '8s' }}
        />
      ))}
      {DUST.map((d, i) => (
        <span
          key={i}
          className="anim-dust absolute rounded-full bg-[#ffd98f]"
          style={{
            left: d.left,
            bottom: d.bottom,
            width: d.size,
            height: d.size,
            animationDuration: `${d.dur}s`,
            animationDelay: `${d.delay}s`,
            '--dx': d.dx,
            boxShadow: '0 0 6px 1px rgba(255,200,110,0.5)',
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_50%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  )
}

export default memo(Table)
