# Álbum de recuerdos de Añora — Catálogo Navidad 2026

Second proposal: the whole website is an album resting on a wooden table. No scroll, no navbar —
you open the cover and turn the pages.

## Stack
React 19 · Vite · Tailwind CSS v4 · Framer Motion · Lucide React · self-hosted fonts. No page-flip library:
the turn is CSS 3D (`perspective`, `rotateY`, `backface-visibility`) driven by one Framer Motion value.

```bash
npm install
npm run dev            # local dev server
npm run build          # production build → dist/
npm run build:single   # one self-contained index.html → dist-single/
```

## Edit the content

| What | File |
|---|---|
| Spheres (add / edit / delete) | `src/data/products.js` |
| Album sections: title, quote, drawing, tab color, order | `src/data/collections.js` |
| Handwritten notes | `src/data/notes.js` |
| States (Disponible, Pocas piezas, Agotado, Próximamente) | `src/data/availability.js` |
| WhatsApp (**placeholder 5210000000000**), Instagram, Facebook, sound volumes | `src/config/site.js` |
| Colors and fonts | `src/index.css` → `@theme` |

**Pages are built automatically** (`src/lib/buildPages.js`): endpaper → presentation → for each collection a
divider page + compositions that rotate (one protagonist · two vertical · three with a note · big + detail ·
family polaroids) → contact sheet with every sphere → final page → back endpaper. Add a product and the album
re-paginates itself, including the index and the page numbers.

### Images
`'placeholder:nochebuena'` shows an illustrated sphere. Replace it with a real path:
`images: ['/images/esferas/nochebuena-1.jpg', '/images/esferas/nochebuena-2.jpg']` (files in `public/images/`).
The second image is used as the "detail" shot. Square photos (~1200 px) work everywhere.

## Interactions
- Open: “Abrir catálogo” or tap the cover. The cover turns around the spine while the book slides to center.
- Turn pages: ← → keys, the arrows, the page corners, or **drag the page** (it follows the finger and settles).
- Index: book-style with page numbers; tabs on the fore-edge (desktop) jump to each section.
- A photo flies out of the page (shared `layoutId`), the album blurs, the info card appears → WhatsApp.
- Close: from the last page (“Cerrar álbum” or →): the back cover folds over, then “Volver a la portada”.

## Sound
Off until the visitor opens the album (checkbox on the cover). One button mutes everything.
Music: original synthesis of “Noche de paz” (public-domain melody), very low. Page rustle: synthesized with the
Web Audio API at runtime (no file).

## Logo
`src/assets/brand/anora-logo-original.png` is the untouched official file; `anora-logo.jpg` is the same artwork at
800 px. It is shown inside an oval window on the cover; the white corners are hidden with CSS.

## Accessibility & performance
Keyboard support everywhere, focus trap in dialogs, `prefers-reduced-motion` (turns become instant, opening is a
fade), container-query units so every page keeps its composition at any size, only `transform`/`opacity` animate.
