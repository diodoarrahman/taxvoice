import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import { supabase } from '../lib/supabase'

// Mock CoreTax data — in production this would come from CoreTax API
const CORETAX_MOCK = {
  npwp: '12.345.678.9-012.000',
  nama: 'Pengguna TaxVoice',
  riwayat: [
    { id: 1, tahun: 2021, jenis: 'PPh 21', jumlah: 12500000, status: 'Lunas' },
    { id: 2, tahun: 2022, jenis: 'PPh 21', jumlah: 15000000, status: 'Lunas' },
    { id: 3, tahun: 2022, jenis: 'PPn',    jumlah: 3200000,  status: 'Lunas' },
    { id: 4, tahun: 2023, jenis: 'PPh 21', jumlah: 18500000, status: 'Lunas' },
    { id: 5, tahun: 2023, jenis: 'PPn',    jumlah: 4800000,  status: 'Lunas' },
    { id: 6, tahun: 2023, jenis: 'PPh 25', jumlah: 2000000,  status: 'Lunas' },
  ],
}

const totalDibayar = CORETAX_MOCK.riwayat.reduce((s, r) => s + r.jumlah, 0)
const budgetAlokasi = Math.round(totalDibayar * 0.05)

// Payment history grouped by year for chart
const byYear = CORETAX_MOCK.riwayat.reduce((acc, r) => {
  acc[r.tahun] = (acc[r.tahun] || 0) + r.jumlah
  return acc
}, {})
const historyChart = Object.entries(byYear).map(([tahun, jumlah]) => ({ tahun, jumlah }))

const SECTORS = [
  { key: 'education_pct',     label: 'Education',      icon: '📚', color: '#378ADD', desc: 'Schools, universities, vocational training' },
  { key: 'health_pct',        label: 'Health',         icon: '🏥', color: '#1D9E75', desc: 'Hospitals, public health, medicine' },
  { key: 'infrastructure_pct',label: 'Infrastructure', icon: '🏗️', color: '#EF9F27', desc: 'Roads, bridges, public transport' },
  { key: 'defense_pct',       label: 'Defense',        icon: '🛡️', color: '#D85A30', desc: 'Military, national security, border' },
  { key: 'social_pct',        label: 'Social Welfare', icon: '🤝', color: '#7F77DD', desc: 'Subsidies, social protection, housing' },
]

const INITIAL_VALUES = { education_pct: 25, health_pct: 20, infrastructure_pct: 20, defense_pct: 15, social_pct: 20 }

// Default community aggregate fallback (shown before real data loads)
const DEFAULT_COMMUNITY = [
  { name: 'Education',      avg: 32, fill: '#378ADD' },
  { name: 'Health',         avg: 27, fill: '#1D9E75' },
  { name: 'Infrastructure', avg: 18, fill: '#EF9F27' },
  { name: 'Defense',        avg: 10, fill: '#D85A30' },
  { name: 'Social Welfare', avg: 13, fill: '#7F77DD' },
]

function formatRupiah(n) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

function PieChart({ values }) {
  const total = SECTORS.reduce((sum, s) => sum + values[s.key], 0)
  if (total === 0) return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r="60" fill="#f0f0f0" />
      <circle cx="70" cy="70" r="32" fill="white" />
    </svg>
  )
  let angle = -Math.PI / 2
  const slices = SECTORS.map(s => {
    const slice = (values[s.key] / total) * 2 * Math.PI
    const x1 = 70 + 60 * Math.cos(angle)
    const y1 = 70 + 60 * Math.sin(angle)
    const x2 = 70 + 60 * Math.cos(angle + slice)
    const y2 = 70 + 60 * Math.sin(angle + slice)
    const large = slice > Math.PI ? 1 : 0
    const d = values[s.key] === 0 ? '' : `M70,70 L${x1},${y1} A60,60 0 ${large},1 ${x2},${y2} Z`
    angle += slice
    return { ...s, d }
  })
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      {slices.map(s => s.d && <path key={s.key} d={s.d} fill={s.color} />)}
      <circle cx="70" cy="70" r="32" fill="white" />
    </svg>
  )
}

export default function PayTaxesPage() {
  const [values, setValues]     = useState(INITIAL_VALUES)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState(null)
  const [communityData, setCommunityData] = useState(DEFAULT_COMMUNITY)
  const [communityCount, setCommunityCount] = useState(null)

  const total     = SECTORS.reduce((sum, s) => sum + values[s.key], 0)
  const remaining = 100 - total
  const isValid   = total === 100

  // Fetch community aggregate from preferences table
  useEffect(() => {
    async function fetchCommunity() {
      const { data } = await supabase
        .from('preferences')
        .select('education_pct, health_pct, infrastructure_pct, defense_pct, social_pct')

      if (data && data.length > 0) {
        const n = data.length
        const totals = data.reduce(
          (acc, p) => ({
            education:      acc.education      + (p.education_pct      || 0),
            health:         acc.health         + (p.health_pct         || 0),
            infrastructure: acc.infrastructure + (p.infrastructure_pct || 0),
            defense:        acc.defense        + (p.defense_pct        || 0),
            social:         acc.social         + (p.social_pct         || 0),
          }),
          { education: 0, health: 0, infrastructure: 0, defense: 0, social: 0 }
        )
        setCommunityData([
          { name: 'Education',      avg: Math.round(totals.education / n),      fill: '#378ADD' },
          { name: 'Health',         avg: Math.round(totals.health / n),         fill: '#1D9E75' },
          { name: 'Infrastructure', avg: Math.round(totals.infrastructure / n), fill: '#EF9F27' },
          { name: 'Defense',        avg: Math.round(totals.defense / n),        fill: '#D85A30' },
          { name: 'Social Welfare', avg: Math.round(totals.social / n),         fill: '#7F77DD' },
        ])
        setCommunityCount(n)
      }
    }
    fetchCommunity()
  }, [saved]) // re-fetch after user saves

  const handleSlider = (key, val) => {
    const newVal = parseInt(val)
    const otherTotal = SECTORS.filter(s => s.key !== key).reduce((sum, s) => sum + values[s.key], 0)
    const clamped = Math.min(newVal, 100 - otherTotal)
    setValues(prev => ({ ...prev, [key]: clamped }))
    setSaved(false)
  }

  const handleSubmit = async () => {
    if (!isValid) return
    setSaving(true)
    setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not authenticated.'); setSaving(false); return }

    const { error: err } = await supabase
      .from('preferences')
      .upsert({ user_id: user.id, ...values }, { onConflict: 'user_id' })

    if (err) setError(err.message)
    else setSaved(true)
    setSaving(false)
  }

  const totalColor = isValid ? '#1D9E75' : '#EF9F27'
  const hintText   = isValid ? '✓ Perfect! Ready to save.' : `${remaining}% remaining to allocate`

  return (
    <div className="pay-taxes-page">

      {/* ── Header ── */}
      <div className="pt-header">
        <h1 className="pt-title">Target Your Tax</h1>
        <p className="pt-sub">
          Lihat riwayat pajak Anda dari CoreTax, lalu tentukan ke mana 5% dari pajak Anda ingin dialokasikan.
        </p>
      </div>

      {/* ── CoreTax Section ── */}
      <div className="coretax-section">
        <div className="coretax-section-header">
          <div className="coretax-badge-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div>
            <div className="coretax-label">Data dari CoreTax</div>
            <div className="coretax-npwp">NPWP: {CORETAX_MOCK.npwp}</div>
          </div>
          <span className="coretax-connected-badge">Terhubung</span>
        </div>

        {/* Payment history table */}
        <div className="coretax-table-wrap">
          <table className="coretax-table">
            <thead>
              <tr>
                <th>Tahun</th>
                <th>Jenis Pajak</th>
                <th>Jumlah</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {CORETAX_MOCK.riwayat.map(r => (
                <tr key={r.id}>
                  <td>{r.tahun}</td>
                  <td><span className="tax-type-badge">{r.jenis}</span></td>
                  <td className="coretax-amount">{formatRupiah(r.jumlah)}</td>
                  <td><span className="status-lunas">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment history bar chart */}
        <div className="coretax-chart-wrap">
          <div className="coretax-chart-label">Total pembayaran per tahun</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={historyChart} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="tahun" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}jt`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => formatRupiah(v)} labelFormatter={l => `Tahun ${l}`} />
              <Bar dataKey="jumlah" radius={[4, 4, 0, 0]} fill="#378ADD" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── 5% Budget Card ── */}
      <div className="budget-highlight-card">
        <div className="budget-highlight-left">
          <div className="budget-highlight-label">Total Pajak Anda (2021–2023)</div>
          <div className="budget-highlight-total">{formatRupiah(totalDibayar)}</div>
          <div className="budget-highlight-sub">
            5% dari total pajak yang Anda bayarkan
          </div>
        </div>
        <div className="budget-highlight-right">
          <div className="budget-5pct-label">Alokasi Anda</div>
          <div className="budget-5pct-amount">{formatRupiah(budgetAlokasi)}</div>
          <div className="budget-5pct-desc">Dana yang bisa Anda arahkan ke sektor prioritas</div>
        </div>
      </div>

      {/* ── Allocation Sliders ── */}
      <div className="pt-section-title">Alokasikan Dana Anda</div>
      <p className="pt-section-sub">
        Tentukan ke sektor mana {formatRupiah(budgetAlokasi)} ingin Anda prioritaskan.
        Pilihan Anda akan digabung dengan suara pengguna lain.
      </p>

      <div className="pt-grid">
        <div className="pt-sliders">
          {SECTORS.map(s => {
            const rupiahAmount = Math.round(budgetAlokasi * values[s.key] / 100)
            return (
              <div key={s.key} className="sector-card">
                <div className="sector-header">
                  <div className="sector-icon">{s.icon}</div>
                  <div className="sector-name">{s.label}</div>
                  <div className="sector-pct" style={{ color: s.color }}>{values[s.key]}%</div>
                </div>
                <input
                  type="range"
                  className="sector-slider"
                  min={0} max={100} step={1}
                  value={values[s.key]}
                  style={{ '--accent-color': s.color }}
                  onChange={e => handleSlider(s.key, e.target.value)}
                />
                <div className="sector-rupiah" style={{ color: s.color }}>
                  {formatRupiah(rupiahAmount)}
                </div>
                <div className="sector-limit">
                  {remaining === 0 && values[s.key] < 100 && (
                    <span className="sector-limit-text">Max reached — reduce another sector first</span>
                  )}
                </div>
                <div className="sector-desc">{s.desc}</div>
              </div>
            )
          })}
        </div>

        <div className="pt-right">
          <div className="pie-card">
            <div className="pie-label">Your Allocation</div>
            <div className="pie-container">
              <PieChart values={values} />
              <div className="pt-legend">
                {SECTORS.map(s => (
                  <div key={s.key} className="legend-item">
                    <div className="legend-dot" style={{ background: s.color }} />
                    <div className="legend-name">{s.label}</div>
                    <div className="legend-val">{values[s.key]}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="total-card">
            <div>
              <div className="total-label">Total allocated</div>
              <div className="total-hint" style={{ color: totalColor }}>{hintText}</div>
            </div>
            <div className="total-num" style={{ color: totalColor }}>{total}%</div>
          </div>

          {error  && <div className="pt-error">{error}</div>}
          {saved  && <div className="pt-success">✓ Preferensi Anda berhasil disimpan!</div>}

          <button className="pt-submit" disabled={!isValid || saving} onClick={handleSubmit}>
            {saving ? 'Saving...' : 'Save My Preferences'}
          </button>
        </div>
      </div>

      {/* ── Community Aggregate Chart ── */}
      <div className="community-aggregate-section">
        <div className="community-aggregate-header">
          <h2 className="community-aggregate-title">Pilihan Komunitas TaxVoice</h2>
          {communityCount && (
            <span className="community-aggregate-count">Dari {communityCount.toLocaleString('id-ID')} pengguna</span>
          )}
        </div>
        <p className="community-aggregate-sub">
          Rata-rata alokasi yang dipilih seluruh pengguna TaxVoice — suara kolektif warga.
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={communityData}
            layout="vertical"
            margin={{ top: 0, right: 40, left: 100, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" unit="%" tick={{ fontSize: 12 }} domain={[0, 50]} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={95} />
            <Tooltip formatter={v => `${v}%`} />
            <Bar dataKey="avg" radius={[0, 4, 4, 0]}>
              {communityData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}
