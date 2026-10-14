import ProductPhoto from '../ProductPhoto'
import ProductCaption from '../ProductCaption'
import { tiltFor } from '../ui'

/**
 * Page compositions. All measures are container units of the page (cqw / cqh),
 * so each layout keeps its proportions from a phone to a large screen.
 * `ctx` = { onOpen, lifted }  (lifted = layoutId of the print currently open)
 */
const lid = (page, p, i = 0) => `${page.id}:${p.id}:${i}`
const photo = (page, p, ctx, i = 0) => ({
  product: p,
  imageIndex: i,
  layoutId: lid(page, p, i),
  lifted: ctx.lifted === lid(page, p, i),
  onOpen: ctx.onOpen,
})
const openFirst = (page, p, ctx, extra = {}) => () =>
  ctx.onOpen({ product: p, imageIndex: 0, aspect: 'square', frame: 'print', layoutId: lid(page, p, 0), tilt: tiltFor(p.id), ...extra })

function Note({ children, className = '' }) {
  return <p className={`font-script leading-relaxed text-madera ${className}`}>{children}</p>
}

/* 1 · One big protagonist */
export function Hero({ page, ctx }) {
  const p = page.products[0]
  const tilt = tiltFor(p.id, 2.2)
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[5cqh]">
      <ProductPhoto {...photo(page, p, ctx)} tilt={tilt} mount="corners" className="w-[min(66cqw,54cqh)]" />
      <ProductCaption product={p} size="lg" align="center" onOpen={openFirst(page, p, ctx, { tilt })} />
    </div>
  )
}

/* 2 · Two vertical photos, staggered */
export function Pair({ page, ctx }) {
  return (
    <div className="grid h-full grid-cols-2 content-center items-start gap-x-[6cqw]">
      {page.products.map((p, i) => {
        const tilt = (i ? 1 : -1) * (1 + Math.abs(tiltFor(p.id, 1.5)))
        return (
          <div key={p.id} className={i ? 'mt-[12cqh]' : ''}>
            <ProductPhoto {...photo(page, p, ctx)} aspect="portrait" mount="tape" tilt={tilt} className="w-full" />
            <ProductCaption
              product={p}
              size="md"
              className="mt-[4cqw]"
              onOpen={openFirst(page, p, ctx, { aspect: 'portrait', tilt })}
            />
          </div>
        )
      })}
    </div>
  )
}

/* 3 · Three small photos + a handwritten line */
export function Trio({ page, ctx }) {
  const [a, b, c] = page.products
  const tilts = [-3, 2.5, 1.5]
  return (
    <div className="grid h-full grid-cols-2 content-center gap-x-[6cqw] gap-y-[4cqw]">
      <div>
        <ProductPhoto {...photo(page, a, ctx)} tilt={tilts[0]} mount="corners" className="w-[90%]" />
        <ProductCaption product={a} size="sm" withLink onOpen={openFirst(page, a, ctx)} className="mt-[3cqw]" />
      </div>
      <div className="mt-[9cqw] flex flex-col items-end text-right">
        <ProductPhoto {...photo(page, b, ctx)} tilt={tilts[1]} mount="corners" className="w-[82%]" />
        <ProductCaption product={b} size="sm" withLink onOpen={openFirst(page, b, ctx)} className="mt-[3cqw]" align="left" />
      </div>
      {c && (
        <div>
          <ProductPhoto {...photo(page, c, ctx)} tilt={tilts[2]} mount="tape" className="w-[86%]" />
          <ProductCaption product={c} size="sm" withLink onOpen={openFirst(page, c, ctx)} className="mt-[3cqw]" />
        </div>
      )}
      <div className="flex items-center justify-center">
        {page.note && <Note className="-rotate-3 text-[max(13px,3.6cqw)]">{page.note}</Note>}
      </div>
    </div>
  )
}

/* 4 · One large photo + a detail shot */
export function BigDetail({ page, ctx }) {
  const p = page.products[0]
  const tilt = -1.2
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="relative">
        <ProductPhoto {...photo(page, p, ctx)} tilt={tilt} mount="corners" className="w-[min(70cqw,56cqh)]" />
        <div className="absolute right-0 -bottom-[12cqw] w-[34cqw]">
          <ProductPhoto {...photo(page, p, ctx, 1)} tilt={6} mount="tape" />
          <Note className="absolute -top-[9cqw] right-[2cqw] rotate-[-6deg] text-[max(11px,2.9cqw)]">el detalle ↘</Note>
        </div>
      </div>
      <ProductCaption product={p} size="lg" className="mt-[6cqw] max-w-[56cqw]" onOpen={openFirst(page, p, ctx, { tilt })} />
    </div>
  )
}

/* 5 · Like family snapshots: polaroids + a caption list, as in an old album */
export function Family({ page, ctx }) {
  const [a, b] = page.products
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="relative flex items-start">
        <ProductPhoto {...photo(page, a, ctx)} frame="polaroid" mount="none" tilt={-4.5} label={a.name} className="z-[1] w-[46cqw]" />
        {b && (
          <ProductPhoto
            {...photo(page, b, ctx)}
            frame="polaroid"
            mount="tape"
            tilt={4}
            label={b.name}
            className="-ml-[6cqw] mt-[12cqw] w-[42cqw]"
          />
        )}
      </div>
      <ol className="mt-[7cqw] space-y-[3cqw] border-t border-oro/25 pt-[3.5cqw]">
        {page.products.map((p, i) => (
          <li key={p.id} className="flex gap-[3cqw]">
            <span className="font-serif text-[max(12px,3cqw)] text-oro italic">{i + 1}.</span>
            <ProductCaption
              product={p}
              size="sm"
              withLink
              onOpen={openFirst(page, p, ctx, { frame: 'polaroid', tilt: i ? 4 : -4.5, label: p.name })}
            />
          </li>
        ))}
      </ol>
      {page.note && <Note className="mt-[3cqw] self-end rotate-2 text-[max(12px,3.2cqw)]">{page.note}</Note>}
    </div>
  )
}

export const TEMPLATES = { hero: Hero, pair: Pair, trio: Trio, bigDetail: BigDetail, family: Family }
