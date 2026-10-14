/** Lucide v1 removed brand logos; these follow the same 24px / stroke style. */
const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function InstagramIcon({ size = 20, ...p }) {
  return (
    <svg width={size} height={size} {...base} {...p}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" />
    </svg>
  )
}

export function FacebookIcon({ size = 20, ...p }) {
  return (
    <svg width={size} height={size} {...base} {...p}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

export function WhatsAppIcon({ size = 20, ...p }) {
  return (
    <svg width={size} height={size} {...base} {...p}>
      <path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z" />
      <path d="M9 8.6c.2-.5.6-.6 1-.6.2 0 .4.1.5.4l.6 1.4c.1.3 0 .5-.2.7l-.5.5c.5 1.1 1.4 2 2.6 2.6l.5-.5c.2-.2.4-.3.7-.2l1.4.6c.3.1.4.3.4.5 0 .4-.1.8-.6 1-.6.3-1.3.4-2 .2-2.2-.6-4-2.4-4.6-4.6-.2-.7-.1-1.4.2-2z" fill="currentColor" stroke="none" />
    </svg>
  )
}
