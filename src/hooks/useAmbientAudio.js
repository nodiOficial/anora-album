import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Background music with soft fades.
 * Browsers block autoplay with sound, so `start()` MUST be called from a click/tap handler.
 * The Audio element is created lazily on that first gesture (no download before the user asks).
 */
export default function useAmbientAudio({ src, volume = 0.2, fadeMs = 2000 }) {
  const audioRef = useRef(null)
  const fadeRef = useRef(0)
  const wantedRef = useRef(false) // user intent (survives tab switches)
  const [playing, setPlaying] = useState(false)

  const fadeTo = useCallback(
    (target, ms, then) => {
      const a = audioRef.current
      if (!a) return
      cancelAnimationFrame(fadeRef.current)
      const from = a.volume
      const t0 = performance.now()
      const step = (now) => {
        const k = Math.min(1, (now - t0) / ms)
        a.volume = from + (target - from) * k * k * (3 - 2 * k) // smoothstep
        if (k < 1) fadeRef.current = requestAnimationFrame(step)
        else then?.()
      }
      fadeRef.current = requestAnimationFrame(step)
    },
    [],
  )

  const play = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio(src)
      a.loop = true
      a.preload = 'auto'
      a.volume = 0
      audioRef.current = a
    }
    const a = audioRef.current
    wantedRef.current = true
    const p = a.play()
    setPlaying(true)
    fadeTo(volume, fadeMs)
    // if the browser refuses (rare after a gesture), reflect the real state
    p?.catch(() => {
      wantedRef.current = false
      setPlaying(false)
    })
  }, [src, volume, fadeMs, fadeTo])

  const pause = useCallback(
    (remember = false) => {
      const a = audioRef.current
      if (!remember) wantedRef.current = false
      setPlaying(false)
      if (!a) return
      fadeTo(0, 700, () => a.pause())
    },
    [fadeTo],
  )

  const toggle = useCallback(() => (wantedRef.current ? pause() : play()), [play, pause])

  // pause while the tab is hidden, resume if the user had music on
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && wantedRef.current) pause(true)
      else if (!document.hidden && wantedRef.current) play()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [play, pause])

  useEffect(
    () => () => {
      cancelAnimationFrame(fadeRef.current)
      audioRef.current?.pause()
    },
    [],
  )

  return { playing, play, pause, toggle }
}
