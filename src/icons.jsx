const iconPaths = {
  arrowLeft: <><path d="m15 18-6-6 6-6"/><path d="M21 12H9"/></>,
  arrowRight: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></>,
  calendar: <><path d="M8 2v4M16 2v4M3 10h18"/><rect width="18" height="18" x="3" y="4" rx="2"/></>,
  chevronDown: <path d="m6 9 6 6 6-6"/>,
  clipboard: <><rect width="16" height="18" x="4" y="4" rx="2"/><path d="M9 4.5V3h6v1.5M8 10h8M8 14h6"/></>,
  closePanel: <><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18m6-13-4 4 4 4"/></>,
  compass: <><circle cx="12" cy="12" r="9"/><path d="m15.4 8.6-2 4.8-4.8 2 2-4.8 4.8-2Z"/></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></>,
  layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></>,
  openPanel: <><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18m2-13 4 4-4 4"/></>,
  play: <><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  video: <><rect width="16" height="14" x="2" y="5" rx="2"/><path d="m18 9 4-2v10l-4-2V9Z"/></>,
  x: <><path d="m6 6 12 12M18 6 6 18"/></>,
  youtube: <><path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5a2.7 2.7 0 0 0-1.9 1.9A28 28 0 0 0 2 12a28 28 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.8Z"/><path d="m10 15 5-3-5-3v6Z"/></>,
}

/** Renders a decorative interface icon by name. */
export default function Icon({ name, size = 20 }) {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {iconPaths[name]}
    </svg>
  )
}
