/**
 * Builds the album automatically from the data files.
 *
 *  [guarda] [presentación] → per collection: [separador] [composiciones…]
 *  → [la colección completa] → (página de nota si hace falta) → [página final] [guarda]
 *
 * Desktop shows pages in spreads: (0,1) (2,3) … so the final page always lands on the left
 * and the back endpaper on the right.
 *
 * Compositions rotate so no two sections look the same. A "plan" says how to lay out
 * a group of n spheres; a global counter picks the next plan for each group size.
 */
const PLANS = {
  1: [['hero'], ['bigDetail']],
  2: [['family'], ['pair'], ['bigDetail', 'hero']],
  3: [['trio'], ['hero', 'family'], ['bigDetail', 'pair']],
  4: [['hero', 'trio'], ['pair', 'family'], ['bigDetail', 'trio']],
}
const CAPACITY = { hero: 1, bigDetail: 1, pair: 2, family: 2, trio: 3 }
const OVERVIEW_PER_PAGE = 14

function splitGroups(n) {
  // big collections are laid out in groups of 4 (and a remainder)
  const groups = []
  while (n > 4) {
    groups.push(n - 4 >= 2 ? 4 : 3)
    n -= groups.at(-1)
  }
  if (n) groups.push(n)
  return groups
}

export function buildPages({ products, collections, notes }) {
  const pages = []
  let plan = 0
  let note = 0
  const nextNote = () => notes[note++ % notes.length]

  pages.push({ id: 'guarda-inicio', type: 'endpaper' })
  pages.push({ id: 'presentacion', type: 'intro' })

  const sections = []
  for (const c of collections) {
    const items = products.filter((p) => p.category === c.id)
    if (!items.length) continue
    sections.push({ collection: c, pageIndex: pages.length, count: items.length })
    pages.push({ id: `separador-${c.id}`, type: 'divider', collection: c, count: items.length })

    let cursor = 0
    for (const size of splitGroups(items.length)) {
      const options = PLANS[size]
      const templates = options[plan++ % options.length]
      for (const template of templates) {
        const group = items.slice(cursor, cursor + CAPACITY[template])
        cursor += group.length
        pages.push({
          id: `${c.id}-${template}-${group[0].id}`,
          type: 'product',
          template,
          collection: c,
          products: group,
          note: template === 'trio' || template === 'family' ? nextNote() : null,
        })
      }
    }
  }

  // contact sheet with every sphere
  const overviewStart = pages.length
  for (let i = 0; i < products.length; i += OVERVIEW_PER_PAGE) {
    pages.push({ id: `coleccion-completa-${i}`, type: 'overview', products: products.slice(i, i + OVERVIEW_PER_PAGE) })
  }

  // the final page must sit on the left of the last spread
  if (pages.length % 2 === 1) pages.push({ id: 'nota', type: 'notes', note: 'Hecho para quedarse.' })
  const closingIndex = pages.length
  pages.push({ id: 'final', type: 'closing' })
  pages.push({ id: 'guarda-final', type: 'endpaper', back: true })

  // printed page numbers (endpapers don't count)
  pages.forEach((p, i) => {
    p.index = i
    p.number = p.type === 'endpaper' ? null : i
  })

  return {
    pages,
    sections,
    overviewIndex: overviewStart,
    closingIndex,
    contentCount: pages.length - 2,
  }
}
