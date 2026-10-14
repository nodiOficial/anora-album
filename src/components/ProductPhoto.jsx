import { useRef } from 'react'
import { motion } from 'framer-motion'
import ProductImage from './illustrations/ProductImage'
import { PhotoCorner, Tape } from './ui'

const ASPECT = { square: '1 / 1', portrait: '3 / 4', landscape: '4 / 3' }

/**
 * A sphere photo placed in the album.
 * - The print (white border or polaroid) is a motion element with a `layoutId`, so when it's opened
 *   it physically flies out of the page into the detail view, and back when closed.
 * - Corner mounts and tape stay on the page (like a real album) while the print is lifted.
 * - A warm light follows the cursor over the glass.
 */
export default function ProductPhoto({
  product,
  imageIndex = 0,
  aspect = 'square',
  frame = 'print', // print | polaroid
  mount = 'corners', // corners | tape | none
  tilt = 0,
  label, // handwritten text on the polaroid strip
  layoutId,
  lifted = false, // true while this print is open in the detail view
  onOpen,
  className = '',
}) {
  const ref = useRef(null)
  const src = product.images[imageIndex] ?? product.images[0]
  const soldOut = product.availability === 'agotado'

  const glint = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`)
  }

  const open = () => onOpen?.({ product, imageIndex, aspect, frame, layoutId, tilt, label })

  return (
    <div className={`relative ${className}`}>
      {/* the print keeps its place on the page even while lifted */}
      <div className="relative" style={{ transform: `rotate(${tilt}deg)` }}>
        <div className={`${frame === 'polaroid' ? 'p-[5%] pb-[22%]' : 'p-[5%]'} invisible`}>
          <div style={{ aspectRatio: ASPECT[aspect] }} />
        </div>
        {/* faint mark left on the paper where the photo sits */}
        <div className="absolute inset-0 rounded-[2px] bg-[#e8dcc4]/50" aria-hidden="true" />
        {mount === 'corners' && (
          <>
            <PhotoCorner className="absolute -top-[3%] -left-[3%] z-10 w-[13%]" />
            <PhotoCorner className="absolute -top-[3%] -right-[3%] z-10 w-[13%]" rotate={90} />
            <PhotoCorner className="absolute -right-[3%] -bottom-[3%] z-10 w-[13%]" rotate={180} />
            <PhotoCorner className="absolute -bottom-[3%] -left-[3%] z-10 w-[13%]" rotate={270} />
          </>
        )}
        {mount === 'tape' && <Tape className="top-[-3%] left-1/2 z-10 -translate-x-1/2 text-[max(9px,2.6cqw)]" rotate={-3} />}
      </div>

      {!lifted && (
        <motion.button
          ref={ref}
          type="button"
          layoutId={layoutId}
          onClick={open}
          onPointerMove={glint}
          aria-label={`Ver detalles de la esfera ${product.name}`}
          style={{ rotate: tilt }}
          whileHover={{ y: -6, rotate: tilt * 0.6, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          className={`group absolute inset-0 block cursor-pointer bg-[#fdfaf3] text-left shadow-[0_1px_1px_rgba(60,35,15,0.18),0_6px_14px_-6px_rgba(60,35,15,0.35)] transition-shadow duration-500 outline-none hover:shadow-[0_2px_2px_rgba(60,35,15,0.14),0_22px_36px_-14px_rgba(60,35,15,0.5)] focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2 focus-visible:ring-offset-papel ${
            frame === 'polaroid' ? 'p-[5%] pb-[22%]' : 'p-[5%]'
          }`}
        >
          <span className={`relative block overflow-hidden ${soldOut ? '[filter:grayscale(0.4)]' : ''}`} style={{ aspectRatio: ASPECT[aspect] }}>
            <ProductImage src={src} alt="" center={aspect === 'portrait'} />
            {/* warm Christmas light sliding over the glass (follows the cursor) */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-700 group-hover:opacity-100 [mask-image:radial-gradient(circle_at_50%_52%,#000_32%,transparent_60%)]"
              style={{
                background:
                  'radial-gradient(circle at var(--gx,30%) var(--gy,30%), rgba(255,226,170,0.75) 0%, rgba(255,190,110,0.25) 14%, transparent 30%)',
              }}
            />
            {/* soft print sheen */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5" />
          </span>
          {frame === 'polaroid' && label && (
            <span className="absolute inset-x-[6%] bottom-[5%] truncate text-center font-script text-[max(10px,2.7cqw)] text-sepia">{label}</span>
          )}
        </motion.button>
      )}
    </div>
  )
}
