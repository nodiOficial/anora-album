import { ArrowRight } from 'lucide-react'
import { Availability, formatPrice } from './ui'

/**
 * Essential info next to a photo. Sizes use container units (cqw) so the composition
 * scales with the page on any screen.
 *   size="lg"  → hero pages          size="md" → two photos per page
 *   size="sm"  → three per page / contact sheet
 */
export default function ProductCaption({ product, size = 'md', align = 'left', onOpen, withLink = size !== 'sm', className = '' }) {
  const name = { lg: 'text-[max(20px,6.2cqw)]', md: 'text-[max(16px,4.6cqw)]', sm: 'text-[max(14px,3.7cqw)]' }[size]
  const meta = { lg: 'text-[max(11px,2.7cqw)]', md: 'text-[max(10px,2.4cqw)]', sm: 'text-[max(10px,2.2cqw)]' }[size]
  const price = { lg: 'text-[max(16px,4.4cqw)]', md: 'text-[max(14px,3.6cqw)]', sm: 'text-[max(13px,3.1cqw)]' }[size]

  return (
    <div className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
      <p className={`font-serif leading-[1.05] font-medium text-olivo ${name}`}>Esfera “{product.name}”</p>
      {size !== 'sm' && <p className={`mt-[0.5em] tracking-wide text-sepia ${meta}`}>{product.finish}</p>}
      <div className={`mt-[0.45em] flex flex-wrap items-baseline gap-x-[0.8em] gap-y-[0.2em] ${align === 'center' ? 'justify-center' : ''}`}>
        <span className={`font-serif font-semibold text-vino tabular-nums ${price}`}>{formatPrice(product.price)}</span>
        <Availability status={product.availability} className={meta} />
      </div>
      {withLink && onOpen && (
        <button
          type="button"
          onClick={onOpen}
          className={`group ${size === 'sm' ? 'mt-[0.4em]' : 'mt-[0.9em]'} inline-flex min-h-[28px] items-center gap-[0.4em] border-b border-oro/40 pb-[0.1em] tracking-[0.08em] text-madera transition-colors hover:border-vino hover:text-vino focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oro ${meta}`}
        >
          Ver detalles
          <ArrowRight className="size-[1.1em] transition-transform duration-500 group-hover:translate-x-[0.25em]" strokeWidth={1.5} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
