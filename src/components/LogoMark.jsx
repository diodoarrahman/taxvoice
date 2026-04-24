export default function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#0F172A"/>
      <rect x="18" y="14" width="14" height="24" rx="6" fill="#22D3EE"/>
      <path d="M14 30C14 39.9411 22.0589 48 32 48C41.9411 48 50 39.9411 50 30" stroke="#22D3EE" strokeWidth="4" strokeLinecap="round"/>
      <path d="M32 48V56" stroke="#22D3EE" strokeWidth="4" strokeLinecap="round"/>
      <path d="M26 56H38" stroke="#22D3EE" strokeWidth="4" strokeLinecap="round"/>
      <path d="M40 18C43 21 44.5 25 44.5 29C44.5 33 43 37 40 40" stroke="#67E8F9" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}
