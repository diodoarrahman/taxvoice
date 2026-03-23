import { useState } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts'

// ─── Konstanta ───────────────────────────────────────────────────────────────

const SECTORS = [
  { key: 'education', label: 'Education', icon: '📚', color: '#378ADD', ideal: 25 },
  { key: 'health', label: 'Health', icon: '🏥', color: '#1D9E75', ideal: 20 },
  { key: 'infrastructure', label: 'Infrastructure', icon: '🏗️', color: '#EF9F27', ideal: 20 },
  { key: 'defense', label: 'Defense', icon: '🛡️', color: '#D85A30', ideal: 10 },
  { key: 'social', label: 'Social Welfare', icon: '🤝', color: '#7F77DD', ideal: 25 },
]

const INITIAL_VALUES = {
  education: 25,
  health: 20,
  infrastructure: 20,
  defense: 10,
  social: 25,
}

// ─── Penjelasan dinamis per sektor ───────────────────────────────────────────

const SECTOR_INSIGHTS = {
  education: {
    low: {
      title: 'Critical Underinvestment',
      text: 'Your education allocation falls below the minimum threshold recommended by UNESCO. Chronic underinvestment in education suppresses human capital development, reduces workforce productivity, and perpetuates intergenerational poverty cycles. Countries spending less than 15% of their budget on education consistently show lower HDI scores over 10–20 year horizons.',
    },
    ideal: {
      title: 'Optimal Allocation',
      text: 'Your education allocation aligns with UNESCO benchmarks and World Bank evidence-based recommendations. This range supports universal basic education, tertiary enrollment growth, and teacher quality improvements — all strongly correlated with long-term GDP growth of 0.3–0.5% per additional year of schooling.',
    },
    high: {
      title: 'Diminishing Returns Risk',
      text: 'While education investment is vital, over-allocation beyond 35% may crowd out health and social welfare spending. Research by Hanushek & Woessmann (2015) suggests that beyond a saturation point, additional spending yields diminishing cognitive and economic returns without accompanying structural reforms.',
    },
  },
  health: {
    low: {
      title: 'Public Health Crisis Risk',
      text: 'Allocations below 10% signal severe underinvestment in public health infrastructure. WHO data links low health spending to higher infant mortality, reduced life expectancy, and lower labor productivity. Indonesia\'s own health spending gap is estimated to cost 2–3% of GDP annually in lost productivity.',
    },
    ideal: {
      title: 'Balanced Health Investment',
      text: 'This allocation supports a functional public health system including preventive care, hospital infrastructure, and universal health coverage — consistent with WHO\'s recommendation of 5–6% of GDP for developing nations. Strong health systems also reduce catastrophic household health expenditures that push families into poverty.',
    },
    high: {
      title: 'Oversaturation Without Reform',
      text: 'High health allocations without systemic efficiency reforms risk corruption, procurement waste, and administrative bloat. The OECD notes that beyond 25%, marginal health outcomes improvement plateaus unless accompanied by governance and delivery system reforms.',
    },
  },
  infrastructure: {
    low: {
      title: 'Infrastructure Deficit',
      text: 'Low infrastructure spending widens the connectivity gap between urban and rural areas, increases logistics costs, and deters foreign direct investment. The Asian Development Bank estimates Indonesia\'s infrastructure gap at $1.5 trillion through 2030 — underfunding compounds this structural deficit.',
    },
    ideal: {
      title: 'Growth-Enabling Investment',
      text: 'This range represents the infrastructure investment sweet spot for middle-income developing economies. IMF research shows every 1% of GDP invested in infrastructure yields a 1.5% long-term GDP growth multiplier. Roads, ports, and digital infrastructure are particularly high-return in archipelagic nations like Indonesia.',
    },
    high: {
      title: 'Debt-Trap Risk',
      text: 'Excessive infrastructure spending, particularly through debt-financed mega-projects, can crowd out social spending and create fiscal vulnerabilities. Several Belt & Road Initiative recipient nations demonstrate how infrastructure over-investment leads to unsustainable debt burdens without proportional economic returns.',
    },
  },
  defense: {
    low: {
      title: 'Sovereignty Vulnerability',
      text: 'Defense spending below 3% may compromise territorial integrity and disaster response capacity, particularly critical for Indonesia as the world\'s largest archipelago with 17,000+ islands. SIPRI data shows regional neighbors allocating 2–4% of GDP to defense, creating asymmetric security risks.',
    },
    ideal: {
      title: 'Efficient Security Balance',
      text: 'This allocation balances national security needs with civilian spending priorities. It supports military modernization, disaster response capability (critical for a disaster-prone nation), and cybersecurity infrastructure — without militarizing the budget at the expense of development goals.',
    },
    high: {
      title: 'Militarization Risk',
      text: 'Over-allocation to defense above 20% diverts resources from human development priorities. Stockholm International Peace Research Institute (SIPRI) data consistently shows that high military spending in developing nations correlates with lower education enrollment rates, higher inequality, and slower poverty reduction.',
    },
  },
  social: {
    low: {
      title: 'Social Safety Net Collapse',
      text: 'Insufficient social welfare spending leaves the most vulnerable populations without protection against economic shocks. World Bank research shows that every $1 invested in social protection in developing nations generates $2.50 in economic activity through consumption multipliers — making it one of the highest-return public investments.',
    },
    ideal: {
      title: 'Inclusive Growth Foundation',
      text: 'This allocation builds a robust social safety net that reduces extreme poverty, supports conditional cash transfers, and funds housing subsidies. Evidence from Brazil\'s Bolsa Família and Indonesia\'s own PKH program demonstrates that well-funded social protection programs break intergenerational poverty cycles within two generations.',
    },
    high: {
      title: 'Fiscal Sustainability Concern',
      text: 'While social welfare is essential, allocations above 35% risk creating dependency traps and unsustainable fiscal commitments. European welfare state research highlights the importance of pairing high social spending with strong labor market activation policies to maintain fiscal balance and workforce productivity.',
    },
  },
}

// ─── References ──────────────────────────────────────────────────────────────

const REFERENCES = [
  {
    id: 1,
    author: 'UNESCO',
    year: 2022,
    title: 'Global Education Monitoring Report: Finance for Education',
    source: 'United Nations Educational, Scientific and Cultural Organization',
    relevance: 'Basis for 20–28% education budget benchmark',
    url: 'https://www.unesco.org/gem-report',
  },
  {
    id: 2,
    author: 'World Health Organization',
    year: 2021,
    title: 'Health Financing for Universal Coverage',
    source: 'WHO Global Health Observatory',
    relevance: 'Basis for minimum 15% health budget recommendation',
    url: 'https://www.who.int/health_financing',
  },
  {
    id: 3,
    author: 'International Monetary Fund',
    year: 2020,
    title: 'Fiscal Monitor: Policies to Support People During the COVID-19 Pandemic',
    source: 'IMF Fiscal Affairs Department',
    relevance: 'Infrastructure investment multiplier effect (1.5x GDP growth)',
    url: 'https://www.imf.org/fiscal-monitor',
  },
  {
    id: 4,
    author: 'Hanushek, E.A. & Woessmann, L.',
    year: 2015,
    title: 'The Knowledge Capital of Nations: Education and the Economics of Growth',
    source: 'MIT Press',
    relevance: 'Diminishing returns on education spending beyond saturation point',
    url: 'https://mitpress.mit.edu',
  },
  {
    id: 5,
    author: 'Stockholm International Peace Research Institute (SIPRI)',
    year: 2023,
    title: 'SIPRI Military Expenditure Database',
    source: 'SIPRI Yearbook 2023',
    relevance: 'Regional defense spending benchmarks and militarization risks',
    url: 'https://www.sipri.org/databases/milex',
  },
  {
    id: 6,
    author: 'World Bank',
    year: 2022,
    title: 'The State of Social Protection Report',
    source: 'World Bank Social Protection & Jobs',
    relevance: 'Social protection ROI: $2.50 return per $1 invested',
    url: 'https://www.worldbank.org/social-protection',
  },
  {
    id: 7,
    author: 'Asian Development Bank',
    year: 2023,
    title: 'Meeting Asia\'s Infrastructure Needs',
    source: 'ADB Publications',
    relevance: 'Indonesia infrastructure gap estimation ($1.5 trillion through 2030)',
    url: 'https://www.adb.org/publications',
  },
  {
    id: 8,
    author: 'Badan Pusat Statistik (BPS)',
    year: 2023,
    title: 'Statistik Keuangan Pemerintah Pusat 2023',
    source: 'BPS Indonesia',
    relevance: 'Baseline Indonesia state budget allocation data',
    url: 'https://www.bps.go.id',
  },
]

// ─── Helper functions ─────────────────────────────────────────────────────────

function calcSectorScore(value, ideal) {
  const deviation = Math.abs(value - ideal)
  const penalty = deviation <= 5 ? 2 : deviation <= 10 ? 3.5 : 5
  return Math.max(0, Math.round(100 - deviation * penalty))
}

function getGrade(score) {
  if (score >= 85) return { grade: 'A', label: 'Excellent', color: '#1D9E75' }
  if (score >= 70) return { grade: 'B', label: 'Good', color: '#378ADD' }
  if (score >= 50) return { grade: 'C', label: 'Fair', color: '#EF9F27' }
  if (score >= 30) return { grade: 'D', label: 'Poor', color: '#D85A30' }
  return { grade: 'F', label: 'Critical', color: '#c0392b' }
}

function getInsight(key, value, ideal) {
  const diff = value - ideal
  if (diff < -7) return SECTOR_INSIGHTS[key].low
  if (diff > 7) return SECTOR_INSIGHTS[key].high
  return SECTOR_INSIGHTS[key].ideal
}

function calcOverallScore(scores) {
  const weights = { education: 0.25, health: 0.20, infrastructure: 0.20, defense: 0.15, social: 0.20 }
  return Math.round(
    SECTORS.reduce((sum, s) => sum + scores[s.key] * weights[s.key], 0)
  )
}

// ─── Komponen ─────────────────────────────────────────────────────────────────

export default function SimulatorPage() {
  const [values, setValues] = useState(INITIAL_VALUES)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [activeTab, setActiveTab] = useState('overview')

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
  }

  const handleSimulate = () => {
    const scores = {}
    SECTORS.forEach(s => {
      scores[s.key] = calcSectorScore(values[s.key], s.ideal)
    })
    const overall = calcOverallScore(scores)
    const newResult = { values: { ...values }, scores, overall }
    setResult(newResult)
    setHistory(prev => [
      ...prev.slice(-4),
      { run: prev.length + 1, overall, ...values },
    ])
    setActiveTab('overview')
  }

  // Data untuk charts
  const radarData = result
    ? SECTORS.map(s => ({
      sector: s.label,
      Your: result.scores[s.key],
      Ideal: 100,
    }))
    : []

  const barData = result
    ? SECTORS.map(s => ({
      name: s.label,
      'Your Allocation': result.values[s.key],
      'Ideal Allocation': s.ideal,
    }))
    : []

  const overallGrade = result ? getGrade(result.overall) : null

  return (
    <div className="simulator-page">

      {/* ── Header ── */}
      <div className="sim-header">
        <h1 className="sim-title">Budget Impact Simulator</h1>
        <p className="sim-sub">
          Allocate the state budget across 5 sectors, then run the simulation to see
          projected impacts, scores, and evidence-based analysis of your choices.
        </p>
      </div>

      <div className="sim-layout">

        {/* ── Panel Kiri: Sliders ── */}
        <div className="sim-left">
          <div className="sim-panel">
            <div className="sim-panel-title">Set Your Allocation</div>

            {SECTORS.map(s => (
              <div key={s.key} className="sim-sector">
                <div className="sim-sector-header">
                  <span className="sim-sector-icon"
                    style={{ background: s.color + '22' }}>{s.icon}</span>
                  <span className="sim-sector-name">{s.label}</span>
                  <span className="sim-sector-ideal">Ideal: {s.ideal}%</span>
                  <span className="sim-sector-val" style={{ color: s.color }}>
                    {values[s.key]}%
                  </span>
                </div>
                <input
                  type="range"
                  className="sim-slider"
                  min={0}
                  max={100}                    // ← selalu 100
                  step={1}
                  value={values[s.key]}
                  style={{ '--sim-accent': remaining === 0 && values[s.key] < 100 ? '#ccc' : s.color }}
                  onChange={e => handleSlider(s.key, e.target.value)}
                />
                {remaining === 0 && values[s.key] < 100 && (
                  <div className="sim-limit-text">
                    Max reached — reduce another sector first
                  </div>
                )}
                <div className="sim-sector-bar-wrap">
                  <div
                    className="sim-sector-bar"
                    style={{
                      width: `${values[s.key]}%`,
                      background: s.color,
                    }}
                  />
                  <div
                    className="sim-sector-ideal-marker"
                    style={{ left: `${s.ideal}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="sim-total-row">
              <span className="sim-total-label">Total</span>
              <span className="sim-total-val"
                style={{ color: isValid ? '#1D9E75' : '#EF9F27' }}>
                {total}%
              </span>
            </div>
            {!isValid && (
              <div className="sim-total-hint">{remaining}% remaining</div>
            )}

            <button
              className="sim-run-btn"
              disabled={!isValid}
              onClick={handleSimulate}
            >
              ▶ Run Simulation
            </button>
          </div>
        </div>

        {/* ── Panel Kanan: Hasil ── */}
        <div className="sim-right">
          {!result ? (
            <div className="sim-empty">
              <div className="sim-empty-icon">📊</div>
              <div className="sim-empty-title">Ready to simulate</div>
              <div className="sim-empty-sub">
                Adjust the sliders to 100% total, then click Run Simulation
                to see projected impacts and scores.
              </div>
            </div>
          ) : (
            <>
              {/* Overall Score */}
              <div className="sim-score-card">
                <div className="sim-score-left">
                  <div className="sim-score-num"
                    style={{ color: overallGrade.color }}>
                    {result.overall}
                  </div>
                  <div className="sim-score-label">Overall Score</div>
                  <div className="sim-score-sub">out of 100</div>
                </div>
                <div className="sim-score-right">
                  <div className="sim-grade"
                    style={{
                      background: overallGrade.color + '18',
                      color: overallGrade.color,
                    }}>
                    {overallGrade.grade}
                  </div>
                  <div className="sim-grade-label"
                    style={{ color: overallGrade.color }}>
                    {overallGrade.label}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="sim-tabs">
                {['overview', 'charts', 'analysis', 'references'].map(tab => (
                  <button
                    key={tab}
                    className={`sim-tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab: Overview */}
              {activeTab === 'overview' && (
                <div className="sim-tab-content">
                  <div className="sim-sector-cards">
                    {SECTORS.map(s => {
                      const score = result.scores[s.key]
                      const grade = getGrade(score)
                      const insight = getInsight(s.key, result.values[s.key], s.ideal)
                      return (
                        <div key={s.key} className="sim-sector-card">
                          <div className="sim-sc-header">
                            <span>{s.icon}</span>
                            <span className="sim-sc-name">{s.label}</span>
                            <span className="sim-sc-badge"
                              style={{
                                background: grade.color + '18',
                                color: grade.color,
                              }}>
                              {grade.grade} · {score}
                            </span>
                          </div>
                          <div className="sim-sc-alloc">
                            <span style={{ color: s.color, fontWeight: 600 }}>
                              {result.values[s.key]}% allocated
                            </span>
                            <span className="sim-sc-vs">vs {s.ideal}% ideal</span>
                          </div>
                          <div className="sim-sc-insight-title">{insight.title}</div>
                          <div className="sim-sc-insight-text">{insight.text}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Tab: Charts */}
              {activeTab === 'charts' && (
                <div className="sim-tab-content">

                  <div className="sim-chart-section">
                    <div className="sim-chart-title">Sector Score — Radar Chart</div>
                    <ResponsiveContainer width="100%" height={280}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="sector" tick={{ fontSize: 11 }} />
                        <Radar name="Your Score" dataKey="Your"
                          stroke="#378ADD" fill="#378ADD" fillOpacity={0.35} />
                        <Radar name="Perfect Score" dataKey="Ideal"
                          stroke="#1D9E75" fill="#1D9E75" fillOpacity={0.1}
                          strokeDasharray="4 4" />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="sim-chart-section">
                    <div className="sim-chart-title">Your Allocation vs Ideal</div>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={barData}
                        margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} unit="%" />
                        <Tooltip formatter={v => v + '%'} />
                        <Legend />
                        <Bar dataKey="Your Allocation" fill="#378ADD" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Ideal Allocation" fill="#1D9E75" radius={[4, 4, 0, 0]}
                          fillOpacity={0.5} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {history.length > 1 && (
                    <div className="sim-chart-section">
                      <div className="sim-chart-title">Score Trend Across Simulations</div>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={history}
                          margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="run" label={{ value: 'Run', position: 'insideBottom', offset: -2, fontSize: 11 }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="overall" name="Overall Score"
                            stroke="#7F77DD" strokeWidth={2}
                            dot={{ fill: '#7F77DD', r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                      <div className="sim-chart-note">
                        Run the simulation multiple times with different allocations to track your score trend.
                      </div>
                    </div>
                  )}

                  {history.length <= 1 && (
                    <div className="sim-chart-hint">
                      💡 Run the simulation at least twice with different allocations to unlock the Score Trend chart.
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Analysis */}
              {activeTab === 'analysis' && (
                <div className="sim-tab-content">
                  <div className="sim-analysis-intro">
                    The scoring model evaluates each sector based on deviation from
                    evidence-based ideal allocations. Penalties scale with distance
                    from the optimal point — small deviations are tolerated, but
                    large gaps are penalized progressively.
                  </div>

                  <div className="sim-analysis-formula">
                    <div className="sim-formula-title">Scoring Formula</div>
                    <div className="sim-formula-box">
                      <code>score = 100 − |allocation − ideal| × penalty</code>
                      <div className="sim-formula-note">
                        Penalty: ×2 if deviation ≤5% · ×3.5 if ≤10% · ×5 if &gt;10%
                      </div>
                    </div>
                    <div className="sim-formula-title" style={{ marginTop: '1rem' }}>
                      Overall Score (Weighted Average)
                    </div>
                    <div className="sim-formula-box">
                      <code>overall = Σ (sector_score × weight)</code>
                      <div className="sim-formula-note">
                        Weights: Education 25% · Health 20% · Infrastructure 20% · Defense 15% · Social 20%
                      </div>
                    </div>
                  </div>

                  <div className="sim-analysis-table">
                    <div className="sim-analysis-title">Breakdown per Sector</div>
                    <table className="sim-table">
                      <thead>
                        <tr>
                          <th>Sector</th>
                          <th>Allocated</th>
                          <th>Ideal</th>
                          <th>Deviation</th>
                          <th>Score</th>
                          <th>Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SECTORS.map(s => {
                          const score = result.scores[s.key]
                          const grade = getGrade(score)
                          const deviation = result.values[s.key] - s.ideal
                          return (
                            <tr key={s.key}>
                              <td>{s.icon} {s.label}</td>
                              <td>{result.values[s.key]}%</td>
                              <td>{s.ideal}%</td>
                              <td style={{
                                color: deviation === 0 ? '#1D9E75'
                                  : Math.abs(deviation) <= 5 ? '#EF9F27' : '#D85A30'
                              }}>
                                {deviation > 0 ? '+' : ''}{deviation}%
                              </td>
                              <td style={{ fontWeight: 600 }}>{score}</td>
                              <td>
                                <span className="sim-table-badge"
                                  style={{
                                    background: grade.color + '18',
                                    color: grade.color,
                                  }}>
                                  {grade.grade}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab: References */}
              {activeTab === 'references' && (
                <div className="sim-tab-content">
                  <div className="sim-ref-intro">
                    The simulation model is grounded in peer-reviewed research,
                    international organization benchmarks, and empirical data from
                    developing economies. The following sources directly inform the
                    ideal allocation points and scoring methodology used in this simulator.
                  </div>
                  <div className="sim-ref-list">
                    {REFERENCES.map(ref => (
                      <div key={ref.id} className="sim-ref-card">
                        <div className="sim-ref-num">{ref.id}</div>
                        <div className="sim-ref-body">
                          <div className="sim-ref-title">
                            {ref.author} ({ref.year}). <em>{ref.title}</em>.
                          </div>
                          <div className="sim-ref-source">{ref.source}</div>
                          <div className="sim-ref-relevance">
                            <span className="sim-ref-tag">Relevance</span>
                            {ref.relevance}
                          </div>
                          <a className="sim-ref-link" href={ref.url}
                            target="_blank" rel="noopener noreferrer">
                            {ref.url} ↗
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}