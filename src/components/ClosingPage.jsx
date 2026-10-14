import { BookX, RotateCcw } from 'lucide-react'
import { site, whatsappLink } from '../config/site'
import Logo from './Logo'
import ProductImage from './illustrations/ProductImage'
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from './BrandIcons'
import { OrnamentDivider, Tape } from './ui'

/** Last page: thanks, contacts, and the box where the spheres go back after Christmas */
export default function ClosingPage({ onRestart, onCloseAlbum }) {
  const links = [
    { label: 'Instagram', href: site.social.instagram, Icon: InstagramIcon },
    { label: 'Facebook', href: site.social.facebook, Icon: FacebookIcon },
    { label: 'WhatsApp', href: whatsappLink('Hola, vi el álbum de Añora y me gustaría preguntar por unas esferas.'), Icon: WhatsAppIcon },
  ]
  const btn =
    'inline-flex min-h-[40px] items-center gap-[0.5em] rounded-[3px] px-[1.1em] text-[max(11px,2.6cqw)] tracking-[0.08em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oro'

  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <Logo className="w-[min(28cqw,20cqh)] shadow-[0_6px_16px_-8px_rgba(80,50,20,0.5)]" />
      <p className="mt-[3cqw] font-script text-[max(12px,3.2cqw)] text-madera">{site.tagline}</p>
      <OrnamentDivider className="mt-[3cqw] h-[max(12px,3.4cqw)] w-[38cqw] text-oro/70" />
      <p className="mt-[3.5cqw] max-w-[70cqw] font-serif text-[max(19px,5.8cqw)] leading-[1.12] font-medium text-balance text-olivo">
        Gracias por dejarnos formar parte de tus Navidades.
      </p>

      <div className="mt-[5cqw] flex items-center gap-[5cqw]">
        {/* the box where spheres rest until next December */}
        <figure className="relative w-[30cqw] shrink-0 rotate-[-3deg] bg-[#fdfaf3] p-[1.6cqw] pb-[6cqw] shadow-[0_6px_14px_-6px_rgba(60,35,15,0.4)]">
          <Tape className="-top-[1.2cqw] left-1/2 -translate-x-1/2 text-[max(8px,2.2cqw)]" rotate={2} />
          <div className="aspect-square overflow-hidden">
            <ProductImage src="placeholder:set-posada" alt="Caja con esferas guardadas después de Navidad" />
          </div>
          <figcaption className="absolute inset-x-0 bottom-[1.4cqw] font-script text-[max(8px,2cqw)] text-sepia">hasta el próximo diciembre</figcaption>
        </figure>
        <ul className="flex flex-col items-start gap-[1.6cqw]">
          {links.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[32px] items-center gap-[0.6em] text-[max(12px,3cqw)] text-madera transition-colors hover:text-vino focus-visible:outline-2 focus-visible:outline-oro"
              >
                <Icon size={18} />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-[6cqw] flex flex-wrap justify-center gap-[2.4cqw]">
        <button type="button" onClick={onRestart} className={`${btn} bg-olivo text-marfil hover:bg-pino`}>
          <RotateCcw size={15} strokeWidth={1.6} aria-hidden="true" />
          Volver al inicio
        </button>
        <button type="button" onClick={onCloseAlbum} className={`${btn} text-olivo ring-1 ring-olivo/30 hover:bg-olivo/5`}>
          <BookX size={15} strokeWidth={1.6} aria-hidden="true" />
          Cerrar álbum
        </button>
      </div>
    </div>
  )
}
