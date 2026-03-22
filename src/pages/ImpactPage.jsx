import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts'

// Data dummy
const budgetAllocation = [
  { name: 'Education', value: 20 },
  { name: 'Health', value: 10 },
  { name: 'Infrastructure', value: 25 },
  { name: 'Defense', value: 15 },
  { name: 'Social', value: 30 },
]

const realisasiAPBN = [
  { tahun: '2019', target: 1786, realisasi: 1332 },
  { tahun: '2020', target: 1865, realisasi: 1070 },
  { tahun: '2021', target: 1444, realisasi: 1278 },
  { tahun: '2022', target: 1485, realisasi: 1717 },
  { tahun: '2023', target: 1718, realisasi: 1869 },
  { tahun: '2024', target: 1988, realisasi: 1932 },
]

const taxRatioData = [
  { negara: 'Denmark', ratio: 47 },
  { negara: 'Thailand', ratio: 17 },
  { negara: 'Malaysia', ratio: 12 },
  { negara: 'Indonesia', ratio: 10 },
  { negara: 'Vietnam', ratio: 18 },
]

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626']

export default function ImpactPage() {
  return (
    <div className="impact-page">
      {/* Header */}
      <div className="impact-header">
        <h1>Tax Impact Dashboard</h1>
        <p>Visualizing Indonesia's tax data and public finance</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard label="State Budget 2024" value="IDR 3,325 T" icon="🏛️" color="#2563eb" />
        <StatCard label="Tax Revenue 2024" value="IDR 1,932 T" icon="💰" color="#059669" />
        <StatCard label="Indonesia Tax Ratio" value="~10%" icon="📊" color="#7c3aed" />
        <StatCard label="Registered Taxpayers" value="69 Million" icon="👥" color="#d97706" />
      </div>

      {/* Charts */}
      <div className="charts-grid">

        {/* Pie Chart */}
        <div className="chart-card">
          <h2>State Budget Allocation 2024</h2>
          <p>Government spending breakdown by sector (dummy data)</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={budgetAllocation}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
              >
                {budgetAllocation.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="chart-card">
          <h2>Tax Ratio by Country</h2>
          <p>Tax as a percentage of GDP (2025)</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taxRatioData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="negara" tick={{ fontSize: 12 }} />
              <YAxis unit="%" tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="ratio" radius={[6, 6, 0, 0]}>
                {taxRatioData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.negara === 'Indonesia' ? '#dc2626' : '#2563eb'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="chart-card chart-card--full">
          <h2>Tax Revenue: Target vs Realization</h2>
          <p>In trillion IDR (2019–2024)</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={realisasiAPBN} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="tahun" tick={{ fontSize: 12 }} />
              <YAxis unit="T" tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `Rp ${value} T`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
                name="Target"
              />
              <Line
                type="monotone"
                dataKey="realisasi"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 4 }}
                name="Realization"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <p className="stat-value" style={{ color }}>{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  )
}