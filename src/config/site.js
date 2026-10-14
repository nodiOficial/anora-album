/**
 * Global settings. Everything marked TODO is a placeholder.
 */
import ambientMusic from '../assets/audio/ambiente-navideno.mp3'
import logo from '../assets/brand/anora-logo.jpg'

export const site = {
  name: 'Añora',
  subtitle: 'Artesanías Mexicanas',
  tagline: 'Recuerdos que vuelven a casa.',
  catalogTitle: 'Catálogo Navidad 2026',
  logo, // web-sized copy of the official logo (original in assets/brand)

  // TODO: real WhatsApp number, international format, digits only (52 = México).
  // PLACEHOLDER — this number does not exist.
  whatsappNumber: '5210000000000',

  social: {
    instagram: 'https://instagram.com/', // TODO
    facebook: 'https://facebook.com/', // TODO
  },

  sound: {
    music: ambientMusic, // original synthesis of "Noche de paz" (public-domain melody)
    musicVolume: 0.14, // very low
    pageVolume: 0.05, // paper rustle when turning a page (synthesized, no file)
  },
}

export function whatsappLink(message) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`
}
