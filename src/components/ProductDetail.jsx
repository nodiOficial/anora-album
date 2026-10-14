import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { whatsappLink } from '../config/site'
import { availability } from '../data/availability'
import ProductImage from './illustrations/ProductImage'
import { WhatsAppIcon } from './BrandIcons'
import { Availability, EASE, OrnamentDivider, formatPrice } from './ui'

const ASPECT = { square: '1 / 1', portrait: '3 / 4', landscape: '4 / 3' }

/**
 * "Taking a photo out of the album": the print shares its layoutId with the photo on the page,
 * so it lifts, comes closer and straightens while the album blurs behind. Then the info appears.
 */
export default function ProductDetail({ detail, onClose }) {
  return createPortal(<AnimatePresence>{detail && <Sheet key={detail.layoutId} detail={detail} onClose={onClose} />}</AnimatePresence>, document.body)
}

function Sheet({ detail, onClose }) {
  const { product, layoutId, frame, aspect, label } = detail
  const [shown, setShown] = useState(detail.imageIndex ?? 0)
  const panel = useRef(null)
  const closeBtn = useRef(null)
  const status = availability[product.availability] ?? availability.disponible

  useEffect(() => {
    const opener = document.activeElement
    closeBtn.current?.focus({ preventScroll: true })
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !panel.current) return
      const f = panel.current.querySelectorAll('button, a[href]')
      if (!f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      opener?.focus?.({ preventScroll: true })
    }
  }, [onClose])

  const message = status.canOrder
    ? `Hola, me interesa la esfera “${product.name}” (${product.collection}) que vi en el álbum de Añora.`
    : `Hola, ¿me avisan cuando esté disponible la esfera “${product.name}” (${product.collection})?`

  const specs = [
    ['Colección', product.collection],
    ['Material', product.material],
    ['Técnica', product.technique],
    ['Medidas', product.dimensions],
    ['Hecho en', product.origin],
  ].filter(([, v]) => v)

  return (
    <div ref={panel} className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <motion.div
        className="absolute inset-0 bg-[#120b06]/55 backdrop-blur-[6px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 overflow-y-auto overscroll-contain">
        <div className="flex min-h-full flex-col items-center justify-center gap-6 px-5 py-16 md:flex-row md:gap-12 md:px-10">
          {/* the lifted photograph */}
          <div className="pointer-events-auto w-[min(64vw,42vh,420px)] md:w-[min(40vw,460px)]">
            <motion.div
              layoutId={layoutId}
              style={{ rotate: -1.5 }}
              transition={{ type: 'spring', stiffness: 160, damping: 24 }}
              className={`relative bg-[#fdfaf3] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.75),0_4px_10px_rgba(0,0,0,0.25)] ${frame === 'polaroid' ? 'p-[5%] pb-[22%]' : 'p-[5%]'}`}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: ASPECT[aspect] ?? '1 / 1' }}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={shown} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                    <ProductImage src={product.images[shown] ?? product.images[0]} alt={`Esfera ${product.name}`} priority center={aspect === 'portrait'} />
                  </motion.div>
                </AnimatePresence>
              </div>
              {frame === 'polaroid' && label && (
                <span className="absolute inset-x-[6%] bottom-[6%] truncate text-center font-script text-[clamp(12px,2.6vw,17px)] text-sepia">{label}</span>
              )}
            </motion.div>

            {product.images.length > 1 && (
              <motion.div
                className="mt-5 flex justify-center gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                role="group"
                aria-label="Más fotografías"
              >
                {product.images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setShown(i)}
                    aria-label={`Ver fotografía ${i + 1}`}
                    aria-pressed={i === shown}
                    className={`size-14 bg-[#fdfaf3] p-1 shadow-md transition-[transform,opacity] focus-visible:outline-2 focus-visible:outline-oro ${
                      i === shown ? '-translate-y-1 opacity-100' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span className="block h-full w-full overflow-hidden">
                      <ProductImage src={src} alt="" />
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* the information, like a note card placed next to the photo */}
          <motion.div
            className="grain pointer-events-auto relative w-full max-w-[420px] bg-papel px-7 pt-8 pb-7 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)] sm:px-9"
            initial={{ opacity: 0, y: 30, rotate: 1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0.4 }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
          >
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              aria-label="Volver al álbum"
              className="absolute top-2.5 right-2.5 grid size-11 place-items-center rounded-full text-sepia hover:text-vino focus-visible:outline-2 focus-visible:outline-oro"
            >
              <X size={20} strokeWidth={1.4} />
            </button>
            <p className="text-[12px] tracking-[0.3em] text-bugambilia uppercase">{product.collection}</p>
            <h2 id="detail-title" className="mt-2 pr-8 font-serif text-[clamp(30px,4vw,40px)] leading-[1.05] font-medium text-olivo">
              Esfera “{product.name}”
            </h2>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-serif text-2xl font-semibold text-vino tabular-nums">{formatPrice(product.price)}</span>
              <Availability status={product.availability} className="text-[14px]" />
            </div>
            <p className="mt-5 text-[15.5px] leading-[1.75] font-light text-sepia">{product.description}</p>
            <OrnamentDivider className="mt-6 h-4 w-36 text-oro/70" />
            <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-[14.5px]">
              {specs.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="font-serif text-[16px] font-semibold text-olivo">{k}</dt>
                  <dd className="font-light text-sepia">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 font-script text-[13px] leading-relaxed text-madera">cada pieza es única: sus pequeñas variaciones son la huella de las manos que la hicieron</p>
            <a
              href={whatsappLink(message)}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-6 flex min-h-12 w-full items-center justify-center gap-3 rounded-[3px] px-5 font-serif text-[18px] font-semibold transition-[background-color,color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-oro ${
                status.canOrder ? 'bg-vino text-marfil hover:bg-bugambilia' : 'text-olivo ring-1 ring-olivo/35 hover:bg-olivo hover:text-marfil'
              }`}
            >
              <WhatsAppIcon size={19} />
              {status.canOrder ? 'Quiero esta esfera' : 'Avísame cuando esté disponible'}
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
