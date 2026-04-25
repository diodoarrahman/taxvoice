import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import LogoMark from '../components/LogoMark'

/* ── Ticker data ───────────────────────────────────────────── */
const TICKER_ITEMS = [
  { label: 'Tax-to-GDP Ratio',    val: '10.4%' },
  { label: 'State Budget 2024',   val: 'Rp3,106T' },
  { label: 'Revenue Gap (est.)',  val: 'Rp340T' },
  { label: 'New Taxpayers 2025',  val: '+2.3M' },
  { label: 'Taxpayers Unaware',   val: '67%' },
  { label: 'IMF Dev. Threshold',  val: '15% GDP' },
  { label: 'Education Budget',    val: '20%' },
  { label: 'Infrastructure',      val: 'Rp187T' },
  { label: 'Social Protection',   val: 'Rp186T' },
  { label: 'Healthcare',          val: 'Rp144T' },
]

/* ── Counter animation ─────────────────────────────────────── */
function animateCounter(el) {
  const target   = parseFloat(el.dataset.countTarget)
  const prefix   = el.dataset.prefix  || ''
  const suffix   = el.dataset.suffix  || ''
  const decimals = parseInt(el.dataset.decimals || '0', 10)
  const duration = 1600
  const start    = performance.now()
  function tick(now) {
    const p = Math.min((now - start) / duration, 1)
    const e = 1 - Math.pow(1 - p, 4)
    const v = decimals > 0 ? (e * target).toFixed(decimals) : Math.round(e * target)
    el.textContent = prefix + v + suffix
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

/* ══════════════════════════════════════════════════════════════
   SVG ILLUSTRATIONS
   ══════════════════════════════════════════════════════════════ */

/* ── Hero floating ornaments ────────────────────────────────── */
function HeroRpCoin() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true">
      <circle cx="21" cy="21" r="19" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5"/>
      <circle cx="21" cy="21" r="14" stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.35"/>
      <text x="21" y="26" textAnchor="middle" fontSize="10" fontWeight="800"
        fill="#78350f" fontFamily="'Figtree',system-ui">Rp</text>
    </svg>
  )
}

function HeroPercentBadge() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-hidden="true">
      <circle cx="19" cy="19" r="17" fill="#1e3a8a"/>
      <circle cx="19" cy="19" r="13" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none"/>
      <text x="19" y="24" textAnchor="middle" fontSize="14" fontWeight="800"
        fill="white" fontFamily="'Figtree',system-ui">%</text>
    </svg>
  )
}

function HeroMiniChart() {
  return (
    <svg width="56" height="38" viewBox="0 0 56 38" fill="none" aria-hidden="true">
      <rect width="56" height="38" rx="7" fill="white" opacity="0.85"/>
      <polyline points="6,28 14,20 22,24 30,13 38,17 46,8 52,11"
        stroke="#1e3a8a" strokeWidth="2" fill="none"
        strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 28 L14 20 L22 24 L30 13 L38 17 L46 8 L52 11 L52 34 L6 34 Z"
        fill="#1e3a8a" opacity="0.07"/>
      <circle cx="52" cy="11" r="3" fill="#1e3a8a"/>
      <circle cx="30" cy="13" r="2" fill="#2563eb" opacity="0.6"/>
    </svg>
  )
}

/* ── Wave dividers ──────────────────────────────────────────── */
function WaveDown({ fill = '#fff', from = 'oklch(0.965 0.016 264)' }) {
  return (
    <div className="wave-divider" style={{ background: from }} aria-hidden="true">
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" style={{ height: 48 }}>
        <path d="M0,0 C360,48 1080,0 1440,40 L1440,48 L0,48 Z" fill={fill}/>
      </svg>
    </div>
  )
}

/* ── Feature card stamp icons ───────────────────────────────── */
function StampSimulator() {
  return (
    <svg className="feature-stamp" width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <rect width="52" height="52" rx="8" fill="rgba(255,255,255,0.12)"/>
      <line x1="26" y1="14" x2="26" y2="38" stroke="white" strokeWidth="1.5"/>
      <line x1="14" y1="22" x2="38" y2="22" stroke="white" strokeWidth="1.5"/>
      <ellipse cx="14" cy="27" rx="8" ry="5" stroke="white" strokeWidth="1.2" fill="rgba(255,255,255,0.15)"/>
      <ellipse cx="38" cy="25" rx="8" ry="5" stroke="white" strokeWidth="1.2" fill="rgba(255,255,255,0.08)"/>
      <circle cx="26" cy="13" r="2.5" fill="white"/>
    </svg>
  )
}

function StampKnowledge() {
  return (
    <svg className="feature-stamp" width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <rect width="52" height="52" rx="8" fill="rgba(30,58,138,0.08)"/>
      <path d="M12 16 L26 13 L26 38 L12 40 Z" fill="#bfdbfe"/>
      <path d="M40 16 L26 13 L26 38 L40 40 Z" fill="#93c5fd"/>
      <line x1="26" y1="13" x2="26" y2="38" stroke="#1e3a8a" strokeWidth="1.2"/>
      <line x1="16" y1="22" x2="23" y2="21" stroke="#1e3a8a" strokeWidth="1" opacity="0.5"/>
      <line x1="16" y1="26" x2="23" y2="25" stroke="#1e3a8a" strokeWidth="1" opacity="0.5"/>
      <line x1="16" y1="30" x2="23" y2="29" stroke="#1e3a8a" strokeWidth="1" opacity="0.5"/>
      <line x1="29" y1="21" x2="36" y2="22" stroke="#1e3a8a" strokeWidth="1" opacity="0.5"/>
      <line x1="29" y1="25" x2="36" y2="26" stroke="#1e3a8a" strokeWidth="1" opacity="0.5"/>
    </svg>
  )
}

function StampPreference() {
  return (
    <svg className="feature-stamp" width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <rect width="52" height="52" rx="8" fill="rgba(30,58,138,0.08)"/>
      <rect x="14" y="24" width="24" height="18" rx="2" fill="#bfdbfe" stroke="#1e3a8a" strokeWidth="1.2"/>
      <rect x="21" y="18" width="10" height="9"  rx="1" fill="#93c5fd" stroke="#1e3a8a" strokeWidth="1"/>
      <path d="M19 33 L23 37 L32 28" stroke="#1e3a8a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function StampForum() {
  return (
    <svg className="feature-stamp" width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <rect width="52" height="52" rx="8" fill="rgba(30,58,138,0.08)"/>
      <circle cx="18" cy="20" r="5" fill="#93c5fd"/>
      <path d="M11 36 Q11 28 18 28 Q25 28 25 36" fill="#bfdbfe"/>
      <circle cx="34" cy="18" r="5" fill="#60a5fa"/>
      <path d="M27 34 Q27 26 34 26 Q41 26 41 34" fill="#93c5fd"/>
      <path d="M22 14 L32 14 Q34 14 34 16 L34 22 Q34 24 32 24 L24 24 L21 27 L21 24 Q19 24 19 22 L19 16 Q19 14 22 14Z"
        fill="#1e3a8a" opacity="0.15"/>
    </svg>
  )
}

/* ── Features section deco asterisk ────────────────────────── */
function FeaturesSectionDeco() {
  return (
    <svg className="features__deco" width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45 * Math.PI) / 180
        return (
          <line key={i}
            x1="80" y1="80"
            x2={80 + 72 * Math.cos(a)} y2={80 + 72 * Math.sin(a)}
            stroke="white" strokeWidth={i % 2 === 0 ? 2 : 1}/>
        )
      })}
      <circle cx="80" cy="80" r="14" stroke="white" strokeWidth="2" fill="none"/>
      <circle cx="80" cy="80" r="4"  fill="white" opacity="0.5"/>
    </svg>
  )
}

/* ── How-it-works character illustrations ───────────────────── */
function HowChar1() {
  /* Student reading — light background, golden book, lightbulb */
  return (
    <svg width="88" height="96" viewBox="0 0 88 96" fill="none" aria-hidden="true">
      <circle cx="44" cy="46" r="42" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5"/>
      {/* head */}
      <circle cx="44" cy="26" r="14" fill="#f4b97e"/>
      {/* hair */}
      <path d="M31 22 Q32 11 44 10 Q56 11 57 22 Q55 15 44 14 Q33 15 31 22Z" fill="#2d1b0e"/>
      {/* eyes */}
      <circle cx="39" cy="24" r="2" fill="#1a1a1a"/>
      <circle cx="49" cy="24" r="2" fill="#1a1a1a"/>
      {/* smile */}
      <path d="M39 30 Q44 34 49 30" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* body — navy sweater */}
      <path d="M31 40 Q31 36 44 35 Q57 36 57 40 L59 66 L29 66 Z" fill="#1e3a8a"/>
      {/* left arm → book */}
      <line x1="31" y1="44" x2="18" y2="60" stroke="#f4b97e" strokeWidth="6" strokeLinecap="round"/>
      {/* right arm → book */}
      <line x1="57" y1="44" x2="70" y2="60" stroke="#f4b97e" strokeWidth="6" strokeLinecap="round"/>
      {/* open book */}
      <path d="M17 60 L44 55 L44 76 L17 80 Z" fill="#fde68a"/>
      <path d="M71 60 L44 55 L44 76 L71 80 Z" fill="#fbbf24"/>
      <line x1="44" y1="55" x2="44" y2="76" stroke="#f59e0b" strokeWidth="1.2"/>
      <line x1="22" y1="65" x2="40" y2="63" stroke="#f59e0b" strokeWidth="0.8" opacity="0.6"/>
      <line x1="22" y1="69" x2="40" y2="67" stroke="#f59e0b" strokeWidth="0.8" opacity="0.6"/>
      {/* lightbulb upper-right */}
      <circle cx="72" cy="14" r="7" fill="#fbbf24"/>
      <rect x="69" y="20" width="6" height="3" rx="1" fill="#f59e0b"/>
      <line x1="72" y1="5"  x2="72" y2="3"  stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="79" y1="8"  x2="81" y2="6"  stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="81" y1="14" x2="84" y2="14" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function HowChar2() {
  /* Analyst at laptop — navy bg, white screen with bar chart, glasses */
  return (
    <svg width="88" height="96" viewBox="0 0 88 96" fill="none" aria-hidden="true">
      <circle cx="44" cy="46" r="42" fill="#1e3a8a"/>
      {/* body — light shirt visible behind laptop */}
      <path d="M31 40 Q31 36 44 35 Q57 36 57 40 L57 60 L31 60 Z" fill="#e0eaff"/>
      {/* laptop base */}
      <rect x="16" y="60" width="56" height="5" rx="1.5" fill="#93b4e8"/>
      {/* laptop screen */}
      <rect x="22" y="38" width="44" height="24" rx="2" fill="#bfdbfe"/>
      <rect x="24" y="40" width="40" height="20" rx="1" fill="#f5f8ff"/>
      {/* bar chart on screen */}
      <rect x="27" y="52" width="4"  height="7"  fill="#1e3a8a" opacity="0.55"/>
      <rect x="33" y="48" width="4"  height="11" fill="#1e3a8a" opacity="0.75"/>
      <rect x="39" y="44" width="4"  height="15" fill="#1e3a8a"/>
      <rect x="45" y="49" width="4"  height="10" fill="#1e3a8a" opacity="0.7"/>
      <rect x="51" y="46" width="4"  height="13" fill="#1e3a8a" opacity="0.85"/>
      {/* head above screen */}
      <circle cx="44" cy="24" r="14" fill="#f4b97e"/>
      {/* hair */}
      <path d="M31 20 Q32 9 44 8 Q56 9 57 20 Q55 13 44 12 Q33 13 31 20Z" fill="#1a1a1a"/>
      {/* eyes */}
      <circle cx="39" cy="22" r="2" fill="#1a1a1a"/>
      <circle cx="49" cy="22" r="2" fill="#1a1a1a"/>
      {/* glasses */}
      <rect x="35" y="19" width="8" height="6" rx="2.5" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" fill="none"/>
      <rect x="45" y="19" width="8" height="6" rx="2.5" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" fill="none"/>
      <line x1="43" y1="22" x2="45" y2="22" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2"/>
      <line x1="31" y1="22" x2="35" y2="22" stroke="rgba(255,255,255,0.5)"  strokeWidth="1"/>
      <line x1="53" y1="22" x2="57" y2="22" stroke="rgba(255,255,255,0.5)"  strokeWidth="1"/>
      {/* focused smile */}
      <path d="M40 28 Q44 31 48 28" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* arms on keyboard */}
      <line x1="31" y1="50" x2="20" y2="61" stroke="#f4b97e" strokeWidth="6" strokeLinecap="round"/>
      <line x1="57" y1="50" x2="68" y2="61" stroke="#f4b97e" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  )
}

function HowChar3() {
  /* Two citizens in discussion — speech bubble + two faces */
  return (
    <svg width="88" height="96" viewBox="0 0 88 96" fill="none" aria-hidden="true">
      <circle cx="44" cy="46" r="42" fill="#dbeafe" stroke="#bfdbfe" strokeWidth="1.5"/>
      {/* shared speech bubble top */}
      <path d="M20 12 L68 12 Q72 12 72 16 L72 32 Q72 36 68 36 L50 36 L44 44 L38 36 L20 36 Q16 36 16 32 L16 16 Q16 12 20 12Z"
        fill="white" stroke="#bfdbfe" strokeWidth="1.2"/>
      {/* three dots in bubble */}
      <circle cx="32" cy="24" r="3" fill="#1e3a8a"/>
      <circle cx="44" cy="24" r="3" fill="#1e3a8a"/>
      <circle cx="56" cy="24" r="3" fill="#1e3a8a"/>
      {/* left figure */}
      <circle cx="24" cy="64" r="12" fill="#1e3a8a"/>
      <path d="M13 61 Q13 51 24 50 Q35 51 35 61 Q33 55 24 54 Q15 55 13 61Z" fill="#2d1b0e"/>
      <circle cx="19" cy="63" r="1.6" fill="white"/>
      <circle cx="29" cy="63" r="1.6" fill="white"/>
      <path d="M19 69 Q24 73 29 69" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M12 76 Q12 70 24 70 Q36 70 36 76 L36 88 L12 88 Z" fill="#1e3a8a"/>
      {/* right figure */}
      <circle cx="64" cy="64" r="12" fill="#2563eb"/>
      <path d="M53 61 Q53 51 64 50 Q75 51 75 61 Q73 55 64 54 Q55 55 53 61Z" fill="#1a1a1a"/>
      <circle cx="59" cy="63" r="1.6" fill="white"/>
      <circle cx="69" cy="63" r="1.6" fill="white"/>
      <path d="M59 69 Q64 73 69 69" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M52 76 Q52 70 64 70 Q76 70 76 76 L76 88 L52 88 Z" fill="#2563eb"/>
    </svg>
  )
}

/* ── Indonesian map watermark ────────────────────────────────── */
function IndonesiaMapSVG() {
  return (
    <svg className="impact__map-bg" viewBox="0 0 800 300" fill="none" aria-hidden="true">
      <path d="M20 140 Q40 100 80 90 Q120 80 150 100 Q160 110 150 130 Q130 160 100 170 Q60 180 30 165 Z" fill="#1e3a8a"/>
      <path d="M180 160 Q220 145 280 148 Q330 150 370 155 Q400 158 390 170 Q360 185 300 186 Q240 186 195 178 Z" fill="#1e3a8a"/>
      <path d="M270 60 Q310 40 370 45 Q420 50 440 80 Q450 110 440 140 Q420 165 380 170 Q330 172 290 155 Q260 140 255 110 Q250 80 270 60 Z" fill="#1e3a8a"/>
      <path d="M470 80 Q490 70 510 80 Q520 100 510 120 Q500 130 490 120 M500 125 Q520 135 530 155 Q525 170 515 165 Q505 155 500 140"
        stroke="#1e3a8a" strokeWidth="18" fill="none" strokeLinecap="round"/>
      <path d="M640 90 Q680 75 720 80 Q760 85 780 110 Q790 140 770 165 Q740 185 700 180 Q660 172 640 150 Q625 130 640 90 Z" fill="#1e3a8a"/>
      <ellipse cx="450" cy="180" rx="25" ry="12" fill="#1e3a8a"/>
      <ellipse cx="510" cy="200" rx="18" ry="8"  fill="#1e3a8a"/>
      <ellipse cx="575" cy="155" rx="20" ry="10" fill="#1e3a8a"/>
    </svg>
  )
}

/* ── CTA: celebrating group of 4 ───────────────────────────── */
function CTACelebrationGroup() {
  return (
    <svg className="cta__chars" width="440" height="108" viewBox="0 0 440 108"
      fill="none" aria-hidden="true">
      {/* confetti */}
      <polygon points="72,6  75,12 69,12"  fill="#fbbf24" opacity="0.8"/>
      <polygon points="215,4 218,8  215,12 212,8"  fill="#fbbf24" opacity="0.7"/>
      <polygon points="370,6 373,12 367,12" fill="#fbbf24" opacity="0.75"/>
      <circle cx="140" cy="8"  r="4" fill="#93c5fd" opacity="0.6"/>
      <circle cx="310" cy="10" r="3" fill="#bfdbfe" opacity="0.6"/>
      <circle cx="40"  cy="14" r="3" fill="#fbbf24" opacity="0.5"/>
      <circle cx="400" cy="8"  r="4" fill="#93c5fd" opacity="0.5"/>
      <polygon points="260,3 262,7 260,11 258,7" fill="#f97316" opacity="0.5"/>

      {/* Figure 1 — x=88, navy, medium */}
      <rect x="80"  y="46" width="16" height="42" rx="4" fill="#1e3a8a"/>
      <circle cx="88"  cy="32" r="13" fill="#f4b97e"/>
      <path d="M76 28 Q77 17 88 16 Q99 17 100 28 Q98 21 88 20 Q78 21 76 28Z" fill="#2d1b0e"/>
      <circle cx="83"  cy="30" r="2" fill="#1a1a1a"/>
      <circle cx="93"  cy="30" r="2" fill="#1a1a1a"/>
      <path d="M83 37 Q88 41 93 37" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <line x1="80"  y1="54" x2="66"  y2="37" stroke="#f4b97e" strokeWidth="5" strokeLinecap="round"/>
      <line x1="96"  y1="54" x2="110" y2="37" stroke="#f4b97e" strokeWidth="5" strokeLinecap="round"/>
      <line x1="84"  y1="88" x2="80"  y2="104" stroke="#1e3a8a" strokeWidth="5" strokeLinecap="round"/>
      <line x1="92"  y1="88" x2="96"  y2="104" stroke="#1e3a8a" strokeWidth="5" strokeLinecap="round"/>

      {/* Figure 2 — x=176, blue, tallest */}
      <rect x="168" y="38" width="16" height="50" rx="4" fill="#2563eb"/>
      <circle cx="176" cy="22" r="14" fill="#e8956d"/>
      <path d="M163 18 Q164 6  176 5  Q188 6  189 18 Q187 11 176 10 Q165 11 163 18Z" fill="#1a1a1a"/>
      <circle cx="171" cy="20" r="2" fill="#1a1a1a"/>
      <circle cx="181" cy="20" r="2" fill="#1a1a1a"/>
      <path d="M171 27 Q176 31 181 27" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <line x1="168" y1="46" x2="154" y2="28" stroke="#e8956d" strokeWidth="5" strokeLinecap="round"/>
      <line x1="184" y1="46" x2="198" y2="28" stroke="#e8956d" strokeWidth="5" strokeLinecap="round"/>
      <line x1="172" y1="88" x2="168" y2="104" stroke="#2563eb" strokeWidth="5" strokeLinecap="round"/>
      <line x1="180" y1="88" x2="184" y2="104" stroke="#2563eb" strokeWidth="5" strokeLinecap="round"/>

      {/* Figure 3 — x=264, indigo */}
      <rect x="256" y="48" width="16" height="40" rx="4" fill="#1d4ed8"/>
      <circle cx="264" cy="33" r="13" fill="#f4b97e"/>
      <path d="M252 29 Q253 18 264 17 Q275 18 276 29 Q274 22 264 21 Q254 22 252 29Z" fill="#2d1b0e"/>
      <circle cx="259" cy="31" r="2" fill="#1a1a1a"/>
      <circle cx="269" cy="31" r="2" fill="#1a1a1a"/>
      {/* big open smile */}
      <path d="M259 37 Q264 43 269 37" stroke="#1a1a1a" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <line x1="256" y1="56" x2="242" y2="39" stroke="#f4b97e" strokeWidth="5" strokeLinecap="round"/>
      <line x1="272" y1="56" x2="286" y2="39" stroke="#f4b97e" strokeWidth="5" strokeLinecap="round"/>
      <line x1="260" y1="88" x2="256" y2="104" stroke="#1d4ed8" strokeWidth="5" strokeLinecap="round"/>
      <line x1="268" y1="88" x2="272" y2="104" stroke="#1d4ed8" strokeWidth="5" strokeLinecap="round"/>

      {/* Figure 4 — x=352, navy, shorter */}
      <rect x="344" y="44" width="16" height="44" rx="4" fill="#1e3a8a"/>
      <circle cx="352" cy="29" r="13" fill="#e8956d"/>
      <path d="M340 25 Q341 14 352 13 Q363 14 364 25 Q362 18 352 17 Q342 18 340 25Z" fill="#1a1a1a"/>
      <circle cx="347" cy="27" r="2" fill="#1a1a1a"/>
      <circle cx="357" cy="27" r="2" fill="#1a1a1a"/>
      <path d="M347 33 Q352 37 357 33" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <line x1="344" y1="52" x2="330" y2="35" stroke="#e8956d" strokeWidth="5" strokeLinecap="round"/>
      <line x1="360" y1="52" x2="374" y2="35" stroke="#e8956d" strokeWidth="5" strokeLinecap="round"/>
      <line x1="348" y1="88" x2="344" y2="104" stroke="#1e3a8a" strokeWidth="5" strokeLinecap="round"/>
      <line x1="356" y1="88" x2="360" y2="104" stroke="#1e3a8a" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  )
}

/* ── Testimonial cartoon avatar faces ──────────────────────── */
function AvatarAndi() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-label="Andi">
      <circle cx="20" cy="20" r="20" fill="#1e3a8a"/>
      <circle cx="20" cy="17" r="10" fill="#f4b97e"/>
      <path d="M11 13 Q11 4 20 3 Q29 4 29 13 Q27 7 20 7 Q13 7 11 13Z" fill="#2d1b0e"/>
      <circle cx="16" cy="16" r="1.5" fill="#1a1a1a"/>
      <circle cx="24" cy="16" r="1.5" fill="#1a1a1a"/>
      <path d="M16 21 Q20 25 24 21" stroke="#1a1a1a" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M10 35 Q10 29 20 28 Q30 29 30 35" fill="#2563eb"/>
    </svg>
  )
}

function AvatarSiti() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-label="Siti">
      <circle cx="20" cy="20" r="20" fill="#2563eb"/>
      <circle cx="20" cy="17" r="10" fill="#f4b97e"/>
      <path d="M10 13 Q10 3 20 2 Q30 3 30 13 Q28 6 20 6 Q12 6 10 13Z" fill="#1a1a1a"/>
      <path d="M10 13 Q8 22 11 30" fill="#1a1a1a"/>
      <path d="M30 13 Q32 22 29 30" fill="#1a1a1a"/>
      <circle cx="16" cy="16" r="1.5" fill="#1a1a1a"/>
      <circle cx="24" cy="16" r="1.5" fill="#1a1a1a"/>
      <path d="M16 21 Q20 25 24 21" stroke="#1a1a1a" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M10 35 Q10 29 20 28 Q30 29 30 35" fill="#1e3a8a"/>
    </svg>
  )
}

/* ══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll('.hero-enter').forEach(el => el.classList.add('is-loaded'))
    })
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          const counter = entry.target.querySelector('[data-count-target]')
          if (counter) animateCounter(counter)
          if (entry.target.dataset.countTarget) animateCounter(entry.target)
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -52px 0px' }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => { cancelAnimationFrame(raf); observer.disconnect() }
  }, [])

  return (
    <div className="landing">

      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="landing-nav__logo"><LogoMark size={28} />TaxVoice</div>
        <div className="landing-nav__links">
          <a href="#features">Features</a>
          <a href="#impact">Impact</a>
          <a href="#community">Community</a>
        </div>
        <div className="landing-nav__actions">
          <Link to="/login"    className="landing-nav__login">Sign In</Link>
          <Link to="/register" className="landing-nav__cta">Get Started</Link>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero">

        {/* compass ornament */}
        <div className="hero__ornament-wrap" aria-hidden="true">
          <svg className="hero__ornament" viewBox="0 0 520 520" fill="none">
            <circle cx="260" cy="260" r="252" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 10"/>
            <circle cx="260" cy="260" r="196" stroke="currentColor" strokeWidth="1"   strokeDasharray="3 16"/>
            <circle cx="260" cy="260" r="140" stroke="currentColor" strokeWidth="1.5"/>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180
              return <line key={i}
                x1={260 + 148 * Math.cos(a)} y1={260 + 148 * Math.sin(a)}
                x2={260 + 248 * Math.cos(a)} y2={260 + 248 * Math.sin(a)}
                stroke="currentColor" strokeWidth={i % 3 === 0 ? 1.5 : 0.8}/>
            })}
            {Array.from({ length: 72 }).map((_, i) => {
              const a = (i * 5 * Math.PI) / 180
              const r1 = i % 6 === 0 ? 242 : i % 2 === 0 ? 247 : 250
              return <line key={i}
                x1={260 + r1   * Math.cos(a)} y1={260 + r1   * Math.sin(a)}
                x2={260 + 254  * Math.cos(a)} y2={260 + 254  * Math.sin(a)}
                stroke="currentColor" strokeWidth={i % 6 === 0 ? 1.5 : 0.6}/>
            })}
            {[0, 90, 180, 270].map(deg => {
              const a  = (deg * Math.PI) / 180
              const cx = 260 + 140 * Math.cos(a)
              const cy = 260 + 140 * Math.sin(a)
              return <polygon key={deg}
                points={`${cx},${cy-7} ${cx+5},${cy} ${cx},${cy+7} ${cx-5},${cy}`}
                fill="currentColor"/>
            })}
          </svg>
        </div>

        {/* floating ornament badges */}
        <div className="hero__float-ornaments" aria-hidden="true">
          <div className="hero__float-rp">    <HeroRpCoin/></div>
          <div className="hero__float-pct">   <HeroPercentBadge/></div>
          <div className="hero__float-chart"> <HeroMiniChart/></div>
        </div>

        <div className="hero__content">
          <span className="hero__badge hero-enter" data-delay="1">
            Civic-Fiscal Engagement Platform
          </span>
          <h1 className="hero__title hero-enter" data-delay="2">
            Empowering Taxpayers,<br />
            <span className="hero__title--accent">Building the Future</span>
          </h1>
          <p className="hero__desc hero-enter" data-delay="3">
            Participate, learn, and see your taxes at work — building a more
            transparent and accountable Indonesia.
          </p>
          <div className="hero__cta hero-enter" data-delay="4">
            <Link to="/register" className="btn-primary-dark">Create Account</Link>
            <Link to="/impact"   className="btn-outline-dark">See Impact Data</Link>
          </div>
          <div className="hero__stats hero-enter" data-delay="5">
            <div className="hero__stat">
              <span className="hero__stat-num">10.4%</span>
              <span className="hero__stat-label">Tax-to-GDP Ratio</span>
            </div>
            <div className="hero__stat-divider"/>
            <div className="hero__stat">
              <span className="hero__stat-num">Rp3,106T</span>
              <span className="hero__stat-label">State Budget 2024</span>
            </div>
            <div className="hero__stat-divider"/>
            <div className="hero__stat">
              <span className="hero__stat-num">4 Tools</span>
              <span className="hero__stat-label">To engage &amp; learn</span>
            </div>
          </div>
        </div>

        <div className="hero__illustration hero-enter" data-delay="3">
          <div className="hero__photo-frame">
            <img
              src="https://picsum.photos/seed/indonesiacity/840/560"
              alt="Kota Indonesia"
              width="840"
              height="560"
              loading="eager"
            />
          </div>
          <div className="hero__card hero__card--top">
            <span className="hero__card-num">10.4%</span>
            <span className="hero__card-label">Tax-to-GDP Ratio</span>
          </div>
          <div className="hero__card hero__card--bottom">
            <span className="hero__card-num">+2.3M</span>
            <span className="hero__card-label">New Taxpayers 2025</span>
          </div>
        </div>
      </section>

      {/* ── DATA TICKER ─────────────────────────────────────── */}
      <div className="data-ticker" aria-hidden="true">
        <div className="data-ticker__track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map(({ label, val }, i) => (
            <span key={i} className="data-ticker__item">
              <span className="data-ticker__val">{val}</span>
              {label}
              <span className="data-ticker__sep"/>
            </span>
          ))}
        </div>
      </div>

      <WaveDown fill="oklch(0.985 0.007 264)" from="oklch(0.095 0.04 264)"/>

      {/* ── PROBLEM STATEMENT ───────────────────────────────── */}
      <section className="problem">
        <div className="problem__split">
          <div className="problem__inner">
            <span className="section-eyebrow reveal">Why it matters</span>
            <h2 className="section-title reveal" data-delay="1">
              Indonesia's Tax Gap Is Real
            </h2>
            <p className="section-sub reveal" data-delay="2">
              At just <strong>10.4% of GDP</strong>, Indonesia collects far less
              tax than the IMF's 15% development threshold — costing an estimated{' '}
              <strong>Rp340 trillion</strong> annually. Meanwhile,{' '}
              <strong>67% of taxpayers</strong> don't know where their money goes.
            </p>

            <div className="tax-gap-viz reveal" data-delay="3">
              <div className="tax-gap-viz__row">
                <span className="tax-gap-viz__label">Indonesia</span>
                <div className="tax-gap-viz__track">
                  <div className="tax-gap-viz__fill tax-gap-viz__fill--current" style={{ width:'69.3%' }}/>
                </div>
                <span className="tax-gap-viz__val">10.4%</span>
              </div>
              <div className="tax-gap-viz__row">
                <span className="tax-gap-viz__label">IMF target</span>
                <div className="tax-gap-viz__track">
                  <div className="tax-gap-viz__fill tax-gap-viz__fill--target" style={{ width:'100%' }}/>
                </div>
                <span className="tax-gap-viz__val" style={{ color:'#6b7280' }}>15%</span>
              </div>
              <div className="tax-gap-viz__row">
                <span className="tax-gap-viz__label">Gap</span>
                <div className="tax-gap-viz__track">
                  <div className="tax-gap-viz__fill tax-gap-viz__fill--gap" style={{ width:'30.7%' }}/>
                </div>
                <span className="tax-gap-viz__val" style={{ color:'#b45309' }}>4.6%</span>
              </div>
              <p className="tax-gap-viz__caption">Source: Kemenkeu 2024 &amp; IMF Development Threshold</p>
            </div>

            <div className="problem__facts">
              <div className="problem__fact reveal" data-delay="1">
                <span className="problem__fact-num">10.4%</span>
                <span className="problem__fact-label">Tax-to-GDP ratio — below IMF's 15% minimum</span>
                <div className="fact-bar">
                  <div className="fact-bar__track">
                    <div className="fact-bar__fill" style={{ width:'69.3%' }}/>
                  </div>
                  <div className="fact-bar__meta">
                    <span>Current</span>
                    <span className="fact-bar__benchmark">Target: 15%</span>
                  </div>
                </div>
              </div>
              <div className="problem__fact-sep" aria-hidden="true"/>
              <div className="problem__fact reveal" data-delay="2">
                <span className="problem__fact-num">Rp340T</span>
                <span className="problem__fact-label">Annual revenue lost to low compliance</span>
                <div className="fact-bar">
                  <div className="fact-bar__track">
                    <div className="fact-bar__fill" style={{ width:'100%' }}/>
                  </div>
                  <div className="fact-bar__meta">
                    <span>Per year</span>
                    <span className="fact-bar__benchmark">~11% of APBN</span>
                  </div>
                </div>
              </div>
              <div className="problem__fact-sep" aria-hidden="true"/>
              <div className="problem__fact reveal" data-delay="3">
                <span className="problem__fact-num">67%</span>
                <span className="problem__fact-label">Of taxpayers unsure where their money goes</span>
                <div className="fact-bar">
                  <div className="fact-bar__track">
                    <div className="fact-bar__fill" style={{ width:'67%' }}/>
                  </div>
                  <div className="fact-bar__meta">
                    <span>Survey 2023</span>
                    <span className="fact-bar__benchmark">Kemenkeu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="problem__photo-col">
            <div className="problem__photo-frame">
              <img
                src="https://picsum.photos/seed/wargaindonesia/480/640"
                alt=""
                loading="lazy"
                width="480"
                height="640"
              />
            </div>
            <p className="problem__photo-caption">
              Dokumenter — warga &amp; pembangunan Indonesia
            </p>
          </div>
        </div>
      </section>

      <WaveDown fill="#1e3a8a" from="oklch(0.985 0.007 264)"/>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section className="features" id="features">
        <div className="features__inner">
          <FeaturesSectionDeco/>
          <span className="section-eyebrow reveal">Platform features</span>
          <h2 className="section-title reveal" data-delay="1">Everything you need to engage</h2>
          <p className="section-sub reveal" data-delay="2">
            Four tools designed to educate, simulate, and connect citizens with public finance.
          </p>
          <div className="features__grid">
            <div className="feature-card feature-card--featured reveal" data-delay="1">
              <div className="feature-card__featured-body">
                <StampSimulator/>
                <span className="feature-card__tag">Simulate</span>
                <h3>Budget Simulator</h3>
                <p>
                  Allocate Indonesia's national budget across five sectors and get
                  scored against real economic benchmarks. See the tradeoffs
                  policymakers face — and form your own evidence-based opinion.
                </p>
                <Link to="/register" className="feature-card__link">Try the simulator →</Link>
              </div>
              <div className="feature-card__featured-aside">
                <div className="feature-card__featured-stat">
                  <span className="feature-card__featured-num">Rp3,106T</span>
                  <span className="feature-card__featured-label">2024 State Budget — allocate it yourself</span>
                </div>
              </div>
            </div>
            <div className="feature-card reveal" data-delay="2">
              <StampKnowledge/>
              <span className="feature-card__tag">Learn</span>
              <h3>Knowledge Hub</h3>
              <p>Tax policy and budget transparency explained in plain language — no economics degree required.</p>
              <Link to="/register" className="feature-card__link">Explore articles →</Link>
            </div>
            <div className="feature-card reveal" data-delay="3">
              <StampPreference/>
              <span className="feature-card__tag">Participate</span>
              <h3>Budget Preference</h3>
              <p>Tell the government how you'd like your taxes spent — sector by sector, backed by real data.</p>
              <Link to="/register" className="feature-card__link">Share preference →</Link>
            </div>
            <div className="feature-card reveal" data-delay="4" id="community">
              <StampForum/>
              <span className="feature-card__tag">Engage</span>
              <h3>Community Forum</h3>
              <p>Discuss public policy, share ideas, and connect with fellow citizens openly.</p>
              <Link to="/register" className="feature-card__link">Join discussion →</Link>
            </div>
          </div>
        </div>
      </section>

      <WaveDown fill="oklch(0.975 0.012 264)" from="#1e3a8a"/>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="how">
        <span className="section-eyebrow reveal">How it works</span>
        <h2 className="section-title reveal" data-delay="1">Three steps to civic engagement</h2>
        <div className="how__grid">
          <div className="how-step reveal" data-delay="2">
            <div className="how-step__char"><HowChar1/></div>
            <div className="how-step__num">1</div>
            <h3>Learn</h3>
            <p>Read articles and explore real budget and tax data from verified sources.</p>
          </div>
          <div className="how-step__arrow reveal" data-delay="3">→</div>
          <div className="how-step reveal" data-delay="3">
            <div className="how-step__char how-step__char--b"><HowChar2/></div>
            <div className="how-step__num">2</div>
            <h3>Simulate</h3>
            <p>Try your own budget allocation and get scored against optimal economic models.</p>
          </div>
          <div className="how-step__arrow reveal" data-delay="4">→</div>
          <div className="how-step reveal" data-delay="4">
            <div className="how-step__char how-step__char--c"><HowChar3/></div>
            <div className="how-step__num">3</div>
            <h3>Engage</h3>
            <p>Share your preferences and join community discussions on public policy.</p>
          </div>
        </div>
      </section>

      <WaveDown fill="oklch(0.985 0.007 264)" from="oklch(0.975 0.012 264)"/>

      {/* ── IMPACT DATA ─────────────────────────────────────── */}
      <section className="impact" id="impact">
        <IndonesiaMapSVG/>
        <span className="section-eyebrow reveal">Real impact data</span>
        <h2 className="section-title reveal" data-delay="1">Where your taxes go</h2>
        <p className="section-sub reveal" data-delay="2">
          Indonesia's 2024 State Budget — verified public data from Kemenkeu &amp; BPS.
        </p>
        <div className="impact__grid">
          <div className="impact__card reveal" data-delay="1">
            <div className="impact__card-photo">
              <img src="https://picsum.photos/seed/pendidikanid/420/240" alt="" loading="lazy" width="420" height="240"/>
            </div>
            <span className="impact__card-num">20%</span>
            <span className="impact__card-title">Education</span>
            <span className="impact__card-sub">Mandatory allocation per UUD 1945</span>
            <span className="impact__card-source">Kemenkeu 2024</span>
            <div className="impact__bar"><div className="impact__bar-fill" style={{ width:'100%' }}/></div>
          </div>
          <div className="impact__card reveal" data-delay="2">
            <div className="impact__card-photo">
              <img src="https://picsum.photos/seed/infrastruktur/420/240" alt="" loading="lazy" width="420" height="240"/>
            </div>
            <span className="impact__card-num">Rp187T</span>
            <span className="impact__card-title">Infrastructure</span>
            <span className="impact__card-sub">Roads, ports, and connectivity</span>
            <span className="impact__card-source">APBN 2024</span>
            <div className="impact__bar"><div className="impact__bar-fill" style={{ width:'80%' }}/></div>
          </div>
          <div className="impact__card reveal" data-delay="3">
            <div className="impact__card-photo">
              <img src="https://picsum.photos/seed/sosialperlindungan/420/240" alt="" loading="lazy" width="420" height="240"/>
            </div>
            <span className="impact__card-num">Rp186T</span>
            <span className="impact__card-title">Social Protection</span>
            <span className="impact__card-sub">PKH, BPNT, and social programs</span>
            <span className="impact__card-source">APBN 2024</span>
            <div className="impact__bar"><div className="impact__bar-fill" style={{ width:'79%' }}/></div>
          </div>
          <div className="impact__card reveal" data-delay="4">
            <div className="impact__card-photo">
              <img src="https://picsum.photos/seed/kesehatanid/420/240" alt="" loading="lazy" width="420" height="240"/>
            </div>
            <span className="impact__card-num">Rp144T</span>
            <span className="impact__card-title">Healthcare</span>
            <span className="impact__card-sub">JKN, hospitals, and public health</span>
            <span className="impact__card-source">APBN 2024</span>
            <div className="impact__bar"><div className="impact__bar-fill" style={{ width:'61%' }}/></div>
          </div>
        </div>
      </section>

      <WaveDown fill="oklch(0.97 0.014 264)" from="oklch(0.985 0.007 264)"/>

      {/* ── TESTIMONIALS ────────────────────────────────────── */}
      <section className="testimonials">
        <span className="section-eyebrow reveal">Community voices</span>
        <h2 className="section-title reveal" data-delay="1">What users are saying</h2>
        <div className="testimonials__grid">
          <div className="testimonial__card reveal" data-delay="2">
            <span className="testimonial__mark" aria-hidden="true">"</span>
            <div className="testimonial__rating" aria-label="5 stars">
              {[...Array(5)].map((_, i) => <span key={i} className="testimonial__star">★</span>)}
            </div>
            <p className="testimonial__quote">
              TaxVoice makes me feel connected to where my money goes. I can
              finally see the real benefits of paying taxes.
            </p>
            <div className="testimonial__author">
              <div className="testimonial__avatar"><AvatarAndi/></div>
              <div>
                <p className="testimonial__name">Andi</p>
                <p className="testimonial__role">Small Business Owner</p>
              </div>
            </div>
          </div>
          <div className="testimonial__card reveal" data-delay="3">
            <span className="testimonial__mark" aria-hidden="true">"</span>
            <div className="testimonial__rating" aria-label="5 stars">
              {[...Array(5)].map((_, i) => <span key={i} className="testimonial__star">★</span>)}
            </div>
            <p className="testimonial__quote">
              The simulator helped me understand why budget allocation is so
              complex — and my score improved every time I tried!
            </p>
            <div className="testimonial__author">
              <div className="testimonial__avatar"><AvatarSiti/></div>
              <div>
                <p className="testimonial__name">Siti</p>
                <p className="testimonial__role">University Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDown fill="oklch(0.105 0.045 264)" from="oklch(0.97 0.014 264)"/>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="cta">
        <div className="cta__photo-bg" aria-hidden="true">
          <img
            src="https://picsum.photos/seed/indonesianation/1440/600"
            alt=""
            loading="lazy"
            width="1440"
            height="600"
          />
        </div>
        <div className="cta__deco" aria-hidden="true">%</div>
        <div className="cta__content">
          <CTACelebrationGroup/>
          <h2 className="reveal">Ready to Make an Impact?</h2>
          <p className="reveal" data-delay="1">
            Join Indonesians in building a more transparent, accountable country.
          </p>
          <div className="reveal" data-delay="2">
            <Link to="/register" className="btn-primary-dark btn-primary-dark--lg">
              Sign Up — It's Free
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer__brand"><LogoMark size={24}/>TaxVoice</div>
        <nav className="footer__nav">
          <a href="#">About</a>
          <a href="#">FAQ</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact Us</a>
        </nav>
        <p className="footer__copy">© 2025 TaxVoice. Universitas Bengkulu.</p>
      </footer>

    </div>
  )
}
