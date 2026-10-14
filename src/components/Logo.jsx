import { site } from '../config/site'

/**
 * Official Añora logo, untouched. The white corners of the square file are hidden
 * with an ellipse that follows the gold ring. Crop values are in the original file's pixels.
 */
const NATURAL = 1254
const CROP = { x0: 25, y0: 16, x1: 1227, y1: 1231 }

export default function Logo({ className = '', alt = `${site.name} · ${site.subtitle}`, eager = false }) {
  const cw = CROP.x1 - CROP.x0
  const ch = CROP.y1 - CROP.y0
  return (
    <span className={`relative block overflow-hidden rounded-[50%] ${className}`} style={{ aspectRatio: `${cw} / ${ch}` }}>
      <img
        src={site.logo}
        alt={alt}
        draggable={false}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="absolute max-w-none select-none"
        style={{ width: `${(NATURAL / cw) * 100}%`, left: `${(-CROP.x0 / cw) * 100}%`, top: `${(-CROP.y0 / ch) * 100}%` }}
      />
    </span>
  )
}
