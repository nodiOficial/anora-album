/**
 * ============================================================
 *  CATÁLOGO AÑORA — add, edit or delete spheres here.
 * ============================================================
 *
 * Fields
 *  id            unique, url-friendly (used as React key)
 *  name          shown as: Esfera “<name>”
 *  collection    small label above the name, e.g. "Colección Tradición"
 *  category      must match an id in collections.js (decides the album section)
 *  price         number in MXN (null → "Precio a consultar")
 *  availability  'disponible' | 'pocas-piezas' | 'agotado' | 'proximamente'
 *  description   1–3 sentences
 *  images        array of image paths. First one = main photo.
 *                While you don't have photos, use 'placeholder:<design>' (illustrated sphere).
 *                Replace with real paths, e.g. '/images/esferas/nochebuena-1.jpg'
 *                (put the files in /public/images/esferas).
 *  finish        short line under the photo (default: "Vidrio soplado · Pintada a mano")
 *  material, dimensions, technique, origin
 *
 * The album pages are built AUTOMATICALLY from this list (src/lib/buildPages.js):
 * each collection gets a divider page and its spheres are laid out with rotating compositions.
 * Order inside a collection = order in this array.
 *
 * NOTE: prices below are EXAMPLES — replace them with real prices.
 */
const base = {
  finish: 'Vidrio soplado · Pintada a mano',
  material: 'Vidrio soplado artesanal',
  technique: 'Soplado, plateado y pintado a mano',
  origin: 'México',
}

export const products = [
  {
    ...base,
    id: 'nochebuena',
    name: 'Nochebuena',
    collection: 'Colección Tradición',
    category: 'tradicionales',
    price: 185,
    availability: 'disponible',
    description:
      'La flor que anuncia diciembre en cada casa mexicana, pintada pétalo por pétalo sobre vidrio rojo bugambilia.',
    images: ['placeholder:nochebuena', 'placeholder:nochebuena:detail', 'placeholder:nochebuena:pair'],
    dimensions: '8 cm de diámetro',
  },
  {
    ...base,
    id: 'talavera',
    name: 'Talavera',
    collection: 'Colección Tradición',
    category: 'tradicionales',
    price: 210,
    availability: 'pocas-piezas',
    description:
      'Inspirada en la loza azul y blanca de las cocinas antiguas. Cada trazo azul cobalto se pinta a pulso.',
    images: ['placeholder:talavera', 'placeholder:talavera:detail'],
    dimensions: '8 cm de diámetro',
  },
  {
    ...base,
    id: 'plata-antigua',
    name: 'Plata antigua',
    collection: 'Colección Tradición',
    category: 'tradicionales',
    price: 160,
    availability: 'disponible',
    description:
      'Una esfera de espejo cálido, como las que brillaban en el árbol de la abuela. Refleja toda la luz de la sala.',
    images: ['placeholder:mercurio', 'placeholder:mercurio:detail'],
    technique: 'Soplado y plateado',
    finish: 'Vidrio soplado · Plateado a mano',
    dimensions: '7 cm de diámetro',
  },
  {
    ...base,
    id: 'clasica-roja',
    name: 'Clásica roja',
    collection: 'Colección Tradición',
    category: 'tradicionales',
    price: 120,
    availability: 'disponible',
    description:
      'La esfera de siempre: rojo profundo con un fino listón dorado. La que nunca falta en el árbol.',
    images: ['placeholder:liso-rojo', 'placeholder:liso-rojo:detail', 'placeholder:liso-rojo:pair'],
    finish: 'Vidrio soplado · Filete dorado',
    technique: 'Soplado, plateado y laqueado',
    dimensions: '7 cm de diámetro',
  },
  {
    ...base,
    id: 'angel',
    name: 'Ángel de la casa',
    collection: 'Colección Pastorela',
    category: 'personajes',
    price: 240,
    availability: 'disponible',
    description:
      'Un pequeño ángel que cuida la casa durante las posadas. Alas y aureola en dorado envejecido.',
    images: ['placeholder:angel', 'placeholder:angel:detail'],
    dimensions: '9 cm de alto',
  },
  {
    ...base,
    id: 'rey-mago',
    name: 'Rey Mago',
    collection: 'Colección Pastorela',
    category: 'personajes',
    price: 240,
    availability: 'proximamente',
    description:
      'Para esperar el 6 de enero. Corona dorada sobre vidrio color vino, con detalles en relieve.',
    images: ['placeholder:rey-mago', 'placeholder:rey-mago:detail'],
    dimensions: '9 cm de alto',
  },
  {
    ...base,
    id: 'estrella',
    name: 'Estrella de Belén',
    collection: 'Colección Nochebuena',
    category: 'navidenas',
    price: 195,
    availability: 'disponible',
    description:
      'La estrella de ocho puntas que guía las posadas, sobre un verde pino profundo.',
    images: ['placeholder:estrella', 'placeholder:estrella:detail'],
    dimensions: '8 cm de diámetro',
  },
  {
    ...base,
    id: 'rama-de-pino',
    name: 'Rama de pino',
    collection: 'Colección Nochebuena',
    category: 'navidenas',
    price: 185,
    availability: 'pocas-piezas',
    description:
      'Ramas finas en dorado sobre verde olivo, como el olor a pino que llena la casa en diciembre.',
    images: ['placeholder:pino', 'placeholder:pino:detail'],
    dimensions: '8 cm de diámetro',
  },
  {
    ...base,
    id: 'clasica-verde',
    name: 'Verde pino',
    collection: 'Colección Nochebuena',
    category: 'navidenas',
    price: 120,
    availability: 'pocas-piezas',
    description:
      'Verde pino profundo con filete dorado, para acompañar a las rojas como en casa de la abuela.',
    images: ['placeholder:liso-verde', 'placeholder:liso-verde:detail'],
    finish: 'Vidrio soplado · Filete dorado',
    technique: 'Soplado, plateado y laqueado',
    dimensions: '7 cm de diámetro',
  },
  {
    ...base,
    id: 'casita',
    name: 'Casita de pueblo',
    collection: 'Edición especial',
    category: 'especiales',
    price: 290,
    availability: 'agotado',
    description:
      'Una fachada de pueblo con puerta verde y farol encendido. Un pedacito de hogar para colgar en el árbol.',
    images: ['placeholder:casita', 'placeholder:casita:detail'],
    dimensions: '9 cm de diámetro',
  },
  {
    ...base,
    id: 'bugambilia',
    name: 'Bugambilia',
    collection: 'Edición especial',
    category: 'especiales',
    price: 260,
    availability: 'proximamente',
    description:
      'Flores de bugambilia que trepan por el vidrio, como las que cubren los muros de cal.',
    images: ['placeholder:bugambilia', 'placeholder:bugambilia:detail'],
    dimensions: '9 cm de diámetro',
  },
  {
    ...base,
    id: 'set-abuela',
    name: 'Set de la abuela',
    collection: 'Sets para regalar',
    category: 'sets',
    price: 520,
    availability: 'disponible',
    description:
      'Tres esferas clásicas en rojo, verde y oro, en caja de cartón kraft lista para regalar.',
    images: ['placeholder:set-abuela', 'placeholder:nochebuena', 'placeholder:estrella'],
    dimensions: '3 piezas de 7 cm',
    finish: '3 esferas · Caja kraft para regalo',
  },
  {
    ...base,
    id: 'set-posada',
    name: 'Set Posada',
    collection: 'Sets para regalar',
    category: 'sets',
    price: 980,
    availability: 'pocas-piezas',
    description:
      'Seis esferas surtidas de la Colección Tradición para vestir el árbol completo.',
    images: ['placeholder:set-posada', 'placeholder:talavera', 'placeholder:mercurio'],
    dimensions: '6 piezas de 7 cm',
    finish: '6 esferas · Caja kraft para regalo',
  },
]
