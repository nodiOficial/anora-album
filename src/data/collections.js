/**
 * Album sections, in order. `id` must match `category` in products.js.
 * Each one gets a divider page (title + quote + small illustration) and an index entry.
 * Empty collections are skipped automatically.
 */
export const collections = [
  {
    id: 'tradicionales',
    title: 'Tradiciones', // big title on the divider page
    indexLabel: 'Tradicionales', // label in the index
    quote: 'Las Navidades que siempre vuelven.',
    illustration: 'nochebuena', // nochebuena | estrella | pino | bugambilia | caja
    tab: '#a85b35', // color of the physical tab on the album edge
  },
  {
    id: 'personajes',
    title: 'Personajes',
    indexLabel: 'Personajes',
    quote: 'Pequeños recuerdos para grandes historias.',
    illustration: 'estrella',
    tab: '#9f2834',
  },
  {
    id: 'navidenas',
    title: 'Navidad',
    indexLabel: 'Navidad',
    quote: 'Diciembre siempre encuentra el camino a casa.',
    illustration: 'pino',
    tab: '#343a21',
  },
  {
    id: 'especiales',
    title: 'Especiales',
    indexLabel: 'Especiales',
    quote: 'Piezas que nacen una sola vez.',
    illustration: 'bugambilia',
    tab: '#b47a2a',
  },
  {
    id: 'sets',
    title: 'Para regalar',
    indexLabel: 'Sets',
    quote: 'Para que la tradición empiece en otra casa.',
    illustration: 'caja',
    tab: '#744b2c',
  },
]
