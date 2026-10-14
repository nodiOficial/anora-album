import { useEffect, useState } from 'react'

/**
 * Album size from the viewport.
 * desktop → two pages side by side (spread) · mobile → one page, ~92% of the width.
 * Space is reserved below the book for the controls.
 */
function compute() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const desktop = vw >= 900 && vw / vh >= 1.15
  if (desktop) {
    const pageH = Math.round(Math.min(vh - 160, (vw - 190) / 2 / 0.72, 820))
    return { mode: 'desktop', pageW: Math.round(pageH * 0.72), pageH }
  }
  let pageW = Math.round(Math.min(vw * 0.92, 520))
  let pageH = Math.round(Math.min(pageW / 0.62, vh - 150))
  if (pageH / pageW < 1.28) pageW = Math.round(pageH / 1.28) // short landscape phones
  return { mode: 'mobile', pageW, pageH }
}

export default function useBookLayout() {
  const [layout, setLayout] = useState(compute)
  useEffect(() => {
    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setLayout(compute()))
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])
  return layout
}
