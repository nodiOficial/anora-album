import { memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftRight, Hand } from 'lucide-react'
import { site } from '../config/site'
import ProductImage from './illustrations/ProductImage'
import { PressedFlower } from './illustrations/AlbumArt'
import { TEMPLATES } from './templates/ProductTemplates'
import CollectionDivider from './CollectionDivider'
import ClosingPage from './ClosingPage'
import { Availability, BerrySprig, OrnamentDivider, Star4, Tape, formatPrice } from './ui'

/**
 * One sheet of album paper. `side` sets where the spine shadow falls:
 * left page → shadow on its right edge · right page / single (phone) → on its left edge.
 * The page is a CSS size container: everything inside is measured in cqw / cqh.
 */
function AlbumPage({ page, side = 'right', ctx }) {
  if (!page) return <div className="absolute inset-0 bg-[#e9dfcc]" />

  if (page.type === 'endpaper') return <Endpaper side={side} back={page.back} />

  const head =
    page.type === 'product'
      ? `${page.collection.title} · ${site.name}`
      : page.type === 'overview'
        ? `La colección completa · ${site.name}`
        : null
  const outer = side === 'left' ? 'left' : 'right'

  return (
    <div className="grain absolute inset-0 overflow-hidden bg-papel" style={{ containerType: 'size' }}>
      <PaperShading side={side} />

      <div className="absolute inset-0 flex flex-col px-[8cqw] pt-[6cqw] pb-[7cqw]">
        <p className={`h-[4cqw] shrink-0 text-[max(9px,2cqw)] tracking-[0.32em] text-sepia/60 uppercase ${outer === 'left' ? 'text-left' : 'text-right'}`}>
          {head}
        </p>
        <div className="relative min-h-0 flex-1">
          <PageContent page={page} ctx={ctx} />
        </div>
      </div>

      {page.number != null && page.type !== 'intro' && (
        <span
          className={`absolute bottom-[3.4cqw] font-serif text-[max(11px,2.6cqw)] text-sepia/70 italic tabular-nums ${outer === 'left' ? 'left-[5cqw]' : 'right-[5cqw]'}`}
        >
          {String(page.number).padStart(2, '0')}
        </span>
      )}
    </div>
  )
}

export default memo(AlbumPage)

function PageContent({ page, ctx }) {
  switch (page.type) {
    case 'intro':
      return <Intro />
    case 'divider':
      return <CollectionDivider page={page} sectionNumber={ctx.sectionNumber(page)} />
    case 'product': {
      const T = TEMPLATES[page.template] ?? TEMPLATES.hero
      return <T page={page} ctx={ctx} />
    }
    case 'overview':
      return <Overview page={page} ctx={ctx} />
    case 'notes':
      return <Notes page={page} />
    case 'closing':
      return <ClosingPage onRestart={ctx.onRestart} onCloseAlbum={ctx.onCloseAlbum} />
    default:
      return null
  }
}

/* Paper: aged edges, light fibers, and the curve of the page into the spine */
function PaperShading({ side }) {
  const spine =
    side === 'left'
      ? 'linear-gradient(to left, rgba(80,50,20,0.22) 0%, rgba(80,50,20,0.08) 4%, transparent 12%)'
      : 'linear-gradient(to right, rgba(80,50,20,0.22) 0%, rgba(80,50,20,0.08) 4%, transparent 12%)'
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_45%,transparent_60%,rgba(170,130,80,0.16)_100%)]" />
      <div className="absolute inset-0" style={{ background: spine }} />
      {/* a couple of very faint foxing marks, so it doesn't look digital */}
      <div className="absolute top-[18%] right-[12%] size-[6cqw] rounded-full bg-[#c8a878]/[0.06] blur-[2px]" />
      <div className="absolute bottom-[22%] left-[16%] size-[4cqw] rounded-full bg-[#c8a878]/[0.05] blur-[2px]" />
    </div>
  )
}

function Endpaper({ side, back }) {
  return (
    <div className="endpaper absolute inset-0 overflow-hidden" style={{ containerType: 'size' }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            side === 'left'
              ? 'linear-gradient(to left, rgba(0,0,0,0.35), transparent 14%), radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.35))'
              : 'linear-gradient(to right, rgba(0,0,0,0.35), transparent 14%), radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.35))',
        }}
      />
      {!back && (
        <div className="absolute inset-x-0 bottom-[8cqw] flex flex-col items-center text-[#d8ab62]/80">
          <Star4 className="w-[4cqw]" color="currentColor" />
          <p className="mt-[2cqw] font-serif text-[max(10px,2.4cqw)] tracking-[0.4em] uppercase">Navidad 2026</p>
        </div>
      )}
    </div>
  )
}

function Intro() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <p className="text-[max(10px,2.3cqw)] tracking-[0.42em] text-bugambilia uppercase">Álbum de recuerdos</p>
      <h1 className="mt-[3cqw] font-serif text-[max(34px,11cqw)] leading-none font-medium tracking-[0.06em] text-olivo">AÑORA</h1>
      <p className="mt-[2cqw] font-serif text-[max(16px,4.6cqw)] text-sepia italic">{site.catalogTitle}</p>
      <OrnamentDivider className="mt-[5cqw] h-[max(12px,3.6cqw)] w-[40cqw] text-oro/80" />
      <p className="mt-[5cqw] max-w-[66cqw] text-[max(13px,3.2cqw)] leading-[1.7] font-light text-sepia">
        Aquí guardamos las esferas de esta temporada: vidrio soplado y pintado a mano, como el que se sopla en los talleres de
        Tlalpujahua desde hace generaciones. Hojéalo con calma; cada una espera formar parte de tus navidades.
      </p>

      {/* ex libris */}
      <div className="relative mt-[7cqw] w-[56cqw] rotate-[-1.5deg] border border-oro/40 bg-[#fdf8ee] px-[5cqw] py-[3.5cqw] shadow-[0_2px_6px_-2px_rgba(80,50,20,0.25)]">
        <div className="absolute inset-[1.2cqw] border border-oro/25" aria-hidden="true" />
        <p className="text-[max(9px,2cqw)] tracking-[0.35em] text-sepia/80 uppercase">Este álbum pertenece a</p>
        <p className="mt-[1.6cqw] font-script text-[max(15px,4.6cqw)] text-vino">tu casa</p>
      </div>

      <p className="mt-[7cqw] flex items-center gap-[1.6cqw] text-[max(10px,2.3cqw)] tracking-[0.12em] text-sepia/80">
        <Hand className="size-[1.3em]" strokeWidth={1.4} aria-hidden="true" />
        Desliza o usa
        <ArrowLeftRight className="size-[1.3em]" strokeWidth={1.4} aria-hidden="true" />
        para pasar las páginas
      </p>
      <BerrySprig className="absolute right-[-4cqw] bottom-[-2cqw] w-[26cqw] opacity-80" />
    </div>
  )
}

/* Contact sheet with every sphere: quick and practical */
function Overview({ page, ctx }) {
  return (
    <div className="flex h-full flex-col">
      <div className="text-center">
        <h2 className="mt-[2cqw] font-serif text-[max(22px,6.6cqw)] leading-none font-medium text-olivo">La colección completa</h2>
        <p className="mt-[1.6cqw] font-script text-[max(11px,2.8cqw)] text-madera">todas juntas, como en la caja de la abuela</p>
      </div>
      <ul className="mt-[5cqw] grid min-h-0 flex-1 auto-rows-min grid-cols-2 content-start gap-x-[5cqw] gap-y-[2.2cqw]">
        {page.products.map((p) => {
          const layoutId = `${page.id}:${p.id}:0`
          const lifted = ctx.lifted === layoutId
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => ctx.onOpen({ product: p, imageIndex: 0, aspect: 'square', frame: 'print', layoutId, tilt: 0 })}
                className="group flex w-full items-center gap-[2.4cqw] rounded-[2px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oro"
              >
                <span className="relative block w-[10cqw] shrink-0 bg-[#e8dcc4]/50">
                  {!lifted && (
                    <motion.span
                      layoutId={layoutId}
                      className="block bg-[#fdfaf3] p-[0.6cqw] shadow-[0_2px_5px_-2px_rgba(60,35,15,0.4)] transition-transform duration-500 group-hover:-translate-y-[0.6cqw] group-hover:rotate-[-2deg]"
                    >
                      <span className="block aspect-square overflow-hidden">
                        <ProductImage src={p.images[0]} alt="" />
                      </span>
                    </motion.span>
                  )}
                  {lifted && <span className="block aspect-square" />}
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block truncate font-serif text-[max(12px,3.1cqw)] font-medium text-olivo group-hover:text-vino">{p.name}</span>
                  <span className="mt-[0.4cqw] flex flex-wrap items-baseline gap-x-[1.4cqw] text-[max(9px,2.1cqw)]">
                    <span className="font-serif text-[max(11px,2.6cqw)] font-semibold text-vino tabular-nums">{formatPrice(p.price).replace(' MXN', '')}</span>
                    <Availability status={p.availability} />
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="text-center text-[max(9px,2cqw)] tracking-[0.2em] text-sepia/60 uppercase">Precios en pesos mexicanos</p>
    </div>
  )
}

function Notes({ page }) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="relative w-[42cqw] rotate-[4deg]">
        <Tape className="top-[18%] left-[-6%] text-[max(9px,2.6cqw)]" rotate={-28} />
        <Tape className="right-[-4%] bottom-[16%] text-[max(9px,2.6cqw)]" rotate={-24} />
        <PressedFlower className="w-full drop-shadow-[0_3px_3px_rgba(80,50,20,0.25)]" />
      </div>
      <p className="mt-[8cqw] -rotate-2 font-script text-[max(16px,5cqw)] text-madera">{page.note}</p>
      <p className="mt-[2cqw] font-script text-[max(10px,2.6cqw)] text-sepia/70">bugambilia del patio · dic. 2026</p>
    </div>
  )
}
