/**
 * Soft paper rustle for page turns, synthesized with the Web Audio API (no audio file).
 * Filtered noise with a quick swell and a slow fade; each turn sounds slightly different.
 * The AudioContext is created on the first user gesture ("Abrir catálogo").
 */
let ctx = null
let noise = null

export function unlockPaperSound() {
  if (ctx) return
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  ctx = new AC()
  const len = Math.floor(ctx.sampleRate * 0.8)
  noise = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = noise.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) {
    // slightly "brown" noise + sparse crackle = paper fibers
    last = last * 0.6 + (Math.random() * 2 - 1) * 0.4
    data[i] = last + (Math.random() < 0.002 ? (Math.random() - 0.5) * 1.6 : 0)
  }
}

export function playPageTurn(volume = 0.05, speed = 1) {
  if (!ctx || !noise || volume <= 0) return
  if (ctx.state === 'suspended') ctx.resume()
  const t = ctx.currentTime
  const dur = 0.42 / speed

  const src = ctx.createBufferSource()
  src.buffer = noise
  src.playbackRate.value = 0.9 + Math.random() * 0.25

  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.Q.value = 0.7
  band.frequency.setValueAtTime(2600 + Math.random() * 600, t)
  band.frequency.exponentialRampToValueAtTime(700, t + dur)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(volume, t + dur * 0.25)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)

  src.connect(band).connect(gain).connect(ctx.destination)
  src.start(t, Math.random() * 0.3)
  src.stop(t + dur + 0.05)
}
