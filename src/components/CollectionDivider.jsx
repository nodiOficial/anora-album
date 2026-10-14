import { DividerArt } from './illustrations/AlbumArt'
import { OrnamentDivider } from './ui'

/** Editorial section opener: lots of negative space, a number, a title, a line, a small drawing */
export default function CollectionDivider({ page, sectionNumber }) {
  const c = page.collection
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <p className="font-serif text-[max(40px,15cqw)] leading-none font-medium text-oro/80 italic tabular-nums">
        {String(sectionNumber).padStart(2, '0')}
      </p>
      <h2 className="mt-[4cqw] font-serif text-[max(24px,8.4cqw)] leading-none font-medium tracking-[0.18em] text-olivo uppercase">
        {c.title}
      </h2>
      <OrnamentDivider className="mt-[5cqw] h-[max(14px,4cqw)] w-[44cqw] text-oro/80" />
      <p className="mt-[5cqw] max-w-[64cqw] font-serif text-[max(17px,5.2cqw)] leading-snug text-balance text-sepia italic">“{c.quote}”</p>
      <DividerArt kind={c.illustration} className="mt-[9cqw] h-[min(34cqw,26cqh)] w-auto max-w-[60cqw] opacity-90" />
      <p className="mt-[7cqw] text-[max(10px,2.3cqw)] tracking-[0.3em] text-sepia/70 uppercase">
        {page.count} {page.count === 1 ? 'esfera' : 'esferas'}
      </p>
    </div>
  )
}
