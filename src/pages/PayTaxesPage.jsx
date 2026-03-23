import { useState } from 'react'
import { supabase } from '../lib/supabase'

const SECTORS = [
  {
    key: 'education_pct',
    label: 'Education',
    icon: '📚',
    color: '#378ADD',
    desc: 'Schools, universities, vocational training',
  },
  {
    key: 'health_pct',
    label: 'Health',
    icon: '🏥',
    color: '#1D9E75',
    desc: 'Hospitals, public health, medicine',
  },
  {
    key: 'infrastructure_pct',
    label: 'Infrastructure',
    icon: '🏗️',
    color: '#EF9F27',
    desc: 'Roads, bridges, public transport',
  },
  {
    key: 'defense_pct',
    label: 'Defense',
    icon: '🛡️',
    color: '#D85A30',
    desc: 'Military, national security, border',
  },
  {
    key: 'social_pct',
    label: 'Social Welfare',
    icon: '🤝',
    color: '#7F77DD',
    desc: 'Subsidies, social protection, housing',
  },
]

const INITIAL_VALUES = {
  education_pct: 25,
  health_pct: 20,
  infrastructure_pct: 20,
  defense_pct: 15,
  social_pct: 20,
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
    const d = values[s.key] === 0
      ? ''
      : `M70,70 L${x1},${y1} A60,60 0 ${large},1 ${x2},${y2} Z`
    angle += slice
    return { ...s, d }
  })

  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      {slices.map(s => s.d && (
        <path key={s.key} d={s.d} fill={s.color} />
      ))}
      <circle cx="70" cy="70" r="32" fill="white" />
    </svg>
  )
}

export default function PayTaxesPage() {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  const total = SECTORS.reduce((sum, s) => sum + values[s.key], 0)
  const remaining = 100 - total
  const isValid = total === 100

  const handleSlider = (key, val) => {
    const newVal = parseInt(val)
    const otherTotal = SECTORS
      .filter(s => s.key !== key)
      .reduce((sum, s) => sum + values[s.key], 0)
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

    if (err) {
      setError(err.message)
    } else {
      setSaved(true)
    }
    setSaving(false)
  }

  const totalColor = isValid ? '#1D9E75' : '#EF9F27'
  const hintText = isValid
    ? '✓ Perfect! Ready to save.'
    : `${remaining}% remaining to allocate`

  return (
    <div className="pay-taxes-page">
      <div className="pt-header">
        <h1 className="pt-title">How would you allocate the state budget?</h1>
        <p className="pt-sub">
          Drag the sliders to distribute 100% of the budget across 5 key sectors.
          Your input helps visualize citizen preferences for public spending.
        </p>
      </div>

      <div className="pt-grid">
        <div className="pt-sliders">
          {SECTORS.map(s => (
            <div key={s.key} className="sector-card">
              <div className="sector-header">
                <div className="sector-icon" style={{ background: s.color + '22' }}>
                  {s.icon}
                </div>
                <div className="sector-name">{s.label}</div>
                <div className="sector-pct" style={{ color: s.color }}>
                  {values[s.key]}%
                </div>
              </div>
              <input
                type="range"
                className="sector-slider"
                min={0}
                max={100}                    // ← selalu 100
                step={1}
                value={values[s.key]}
                style={{ '--accent-color': s.color }}
                onChange={e => handleSlider(s.key, e.target.value)}
              />
              {/* Tambah keterangan di bawah slider */}
              <div className="sector-limit">
                {remaining === 0 && values[s.key] < 100 && (
                  <span className="sector-limit-text">
                    Max reached — reduce another sector first
                  </span>
                )}
              </div>
              <div className="sector-desc">{s.desc}</div>
            </div>
          ))}
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

          {error && <div className="pt-error">{error}</div>}
          {saved && (
            <div className="pt-success">
              ✓ Your preferences have been saved successfully!
            </div>
          )}

          <button
            className="pt-submit"
            disabled={!isValid || saving}
            onClick={handleSubmit}
          >
            {saving ? 'Saving...' : 'Save My Preferences'}
          </button>
        </div>
      </div>
    </div>
  )
}