import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const NATIONAL_TAX_2023    = 1_869_200_000_000_000
const MOCK_TOTAL_TAX_PAID  = 56_000_000
const MOCK_ARTICLES_READ   = 35
const AVATAR_BUCKET        = 'avatars'
const MAX_FILE_SIZE        = 2 * 1024 * 1024 // 2 MB
const ALLOWED_TYPES        = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// ── helpers ──────────────────────────────────────────────────

function getAvatarPath(userId) {
  return `${userId}/avatar`
}

// Ambil public URL dari Supabase Storage, tambah timestamp agar
// browser tidak pakai cache lama setelah foto diganti
function buildAvatarUrl(userId) {
  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(getAvatarPath(userId))
  return `${data.publicUrl}?t=${Date.now()}`
}

function getKnowledgeBadge(n) {
  if (n >= 50) return { label: 'Tax Soulmate',   tier: 'diamond',  color: '#1a56db', bg: '#ebf0ff' }
  if (n >= 30) return { label: 'Tax Lover',       tier: 'platinum', color: '#7c3aed', bg: '#f5f3ff' }
  if (n >= 15) return { label: 'Tax Enthusiast',  tier: 'gold',     color: '#d97706', bg: '#fffbeb' }
  if (n >= 5)  return { label: 'Tax Explorer',    tier: 'silver',   color: '#6b7280', bg: '#f3f4f6' }
  return             { label: 'Tax Curious',      tier: 'bronze',   color: '#92400e', bg: '#fef3c7' }
}

function getTaxBadge(n) {
  if (n >= 100_000_000) return { label: 'Tax Legend',   tier: 'diamond',  color: '#1a56db', bg: '#ebf0ff' }
  if (n >= 50_000_000)  return { label: 'Tax Champion', tier: 'platinum', color: '#7c3aed', bg: '#f5f3ff' }
  if (n >= 25_000_000)  return { label: 'Tax Patriot',  tier: 'gold',     color: '#d97706', bg: '#fffbeb' }
  if (n >= 10_000_000)  return { label: 'Tax Citizen',  tier: 'silver',   color: '#6b7280', bg: '#f3f4f6' }
  return                       { label: 'Tax Newbie',   tier: 'bronze',   color: '#92400e', bg: '#fef3c7' }
}

function TierIcon({ tier, size = 14 }) {
  const colorMap = { diamond: '#1a56db', platinum: '#7c3aed', gold: '#d97706', silver: '#9ca3af', bronze: '#b45309' }
  const color = colorMap[tier] || colorMap.bronze
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
    </svg>
  )
}

function formatRupiah(n) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)} miliar`
  if (n >= 1_000_000)     return `Rp ${(n / 1_000_000).toFixed(1)} juta`
  return `Rp ${n.toLocaleString('id-ID')}`
}

function ContributionArc({ ratio }) {
  const clamped   = Math.min(ratio, 2)
  const dashArray = 220
  const filled    = Math.round((clamped / 2) * dashArray)
  return (
    <svg width="160" height="90" viewBox="0 0 160 90">
      <path d="M 10 80 A 70 70 0 0 1 150 80" fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" />
      <path
        d="M 10 80 A 70 70 0 0 1 150 80" fill="none"
        stroke={ratio >= 1 ? '#1a56db' : '#f59e0b'}
        strokeWidth="12" strokeLinecap="round"
        strokeDasharray={`${filled} ${dashArray}`}
      />
      <text x="80" y="70" textAnchor="middle" fontSize="18" fontWeight="700" fill="#111827">
        {ratio >= 1 ? `${ratio.toFixed(1)}x` : `${Math.round(ratio * 100)}%`}
      </text>
      <text x="80" y="85" textAnchor="middle" fontSize="9" fill="#6b7280">
        {ratio >= 1 ? 'di atas rata-rata' : 'dari rata-rata'}
      </text>
    </svg>
  )
}

// ── komponen utama ────────────────────────────────────────────

export default function ProfilePage() {
  const navigate       = useNavigate()
  const fileInputRef   = useRef(null)
  const { refreshAvatar } = useAuth()

  const [profile,    setProfile]    = useState(null)
  const [userId,     setUserId]     = useState(null)
  const [stats,      setStats]      = useState({ posts: 0, replies: 0 })
  const [loading,    setLoading]    = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  // Avatar
  const [photoUrl,   setPhotoUrl]   = useState(null)  // URL yang ditampilkan
  const [imgFailed,  setImgFailed]  = useState(false)  // true jika URL 404 (belum ada foto)
  const [uploading,  setUploading]  = useState(false)
  const [uploadMsg,  setUploadMsg]  = useState(null)   // pesan sukses / error

  const knowledgeBadge = getKnowledgeBadge(MOCK_ARTICLES_READ)
  const taxBadge       = getTaxBadge(MOCK_TOTAL_TAX_PAID)
  const avgTaxPerPerson = Math.round(NATIONAL_TAX_2023 / 69_000_000)
  const ratioToAvg      = MOCK_TOTAL_TAX_PAID / avgTaxPerPerson

  useEffect(() => { fetchProfile() }, [])

  async function fetchProfile() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return navigate('/login')

      setUserId(user.id)

      // Set URL avatar — img onError akan trigger jika file belum ada
      setPhotoUrl(buildAvatarUrl(user.id))
      setImgFailed(false)

      const { data: userData } = await supabase
        .from('users')
        .select('full_name, email, created_at')
        .eq('id', user.id)
        .single()

      const { count: postCount } = await supabase
        .from('forum_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      const { count: replyCount } = await supabase
        .from('forum_replies')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      setProfile(userData)
      setStats({ posts: postCount || 0, replies: replyCount || 0 })
    } finally {
      setLoading(false)
    }
  }

  async function handlePhotoChange(e) {
    const file = e.target.files[0]
    if (!file) return

    // Reset pesan sebelumnya
    setUploadMsg(null)

    // Validasi tipe file
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadMsg('Format tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.')
      return
    }

    // Validasi ukuran file
    if (file.size > MAX_FILE_SIZE) {
      setUploadMsg('Ukuran file maksimal 2 MB.')
      return
    }

    setUploading(true)

    // Tampilkan preview lokal langsung (sebelum upload selesai)
    const localPreview = URL.createObjectURL(file)
    setPhotoUrl(localPreview)
    setImgFailed(false)

    const { error } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(getAvatarPath(userId), file, {
        upsert:      true,       // timpa file lama jika sudah ada
        contentType: file.type,
      })

    if (error) {
      setUploadMsg(`Upload gagal: ${error.message}`)
      // Tetap tampilkan preview lokal supaya user tahu foto sudah dipilih
    } else {
      // Ganti preview lokal dengan URL Supabase Storage + cache-bust
      const persistentUrl = buildAvatarUrl(userId)
      setPhotoUrl(persistentUrl)
      setUploadMsg('Foto profil berhasil diperbarui!')
      refreshAvatar()
    }

    // Bebaskan object URL agar tidak memory leak
    URL.revokeObjectURL(localPreview)
    setUploading(false)

    // Reset input supaya file yang sama bisa dipilih ulang
    e.target.value = ''
  }

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    navigate('/login')
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  function initials(name) {
    if (!name) return '?'
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="community-loading">
        <div className="spinner" />
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="profile-page">

      {/* ── Profile Card ── */}
      <div className="profile-card">
        <div className="profile-avatar-wrap">

          {/* Avatar — klik untuk ganti foto */}
          <div
            className="profile-avatar profile-avatar--clickable"
            onClick={() => !uploading && fileInputRef.current?.click()}
            title="Klik untuk ganti foto profil"
          >
            {photoUrl && !imgFailed ? (
              <img
                src={photoUrl}
                alt="Foto profil"
                className="profile-avatar-img"
                onError={() => setImgFailed(true)}   // fallback ke inisial jika URL 404
              />
            ) : (
              <span className="profile-avatar-initials">
                {initials(profile?.full_name)}
              </span>
            )}

            {/* Overlay ikon kamera */}
            <div className="profile-avatar-overlay">
              {uploading ? (
                <div className="avatar-spinner" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              )}
            </div>
          </div>

          {/* Input file tersembunyi */}
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />

          {/* Status upload */}
          {uploading && (
            <p className="profile-upload-status">Mengunggah...</p>
          )}
          {!uploading && uploadMsg && (
            <p className={`profile-upload-msg ${uploadMsg.startsWith('Upload gagal') || uploadMsg.startsWith('Format') || uploadMsg.startsWith('Ukuran') ? 'profile-upload-msg--error' : ''}`}>
              {uploadMsg}
            </p>
          )}
          <p className="profile-upload-hint">JPG · PNG · WebP · GIF · maks 2 MB</p>
        </div>

        <div className="profile-info">
          <h1 className="profile-name">{profile?.full_name}</h1>
          <p className="profile-email">{profile?.email}</p>
          <p className="profile-joined">Member since {formatDate(profile?.created_at)}</p>
        </div>
      </div>

      {/* ── Activity Stats ── */}
      <div className="profile-stats">
        <div className="profile-stat-card">
          <span className="profile-stat-number">{stats.posts}</span>
          <span className="profile-stat-label">Posts</span>
        </div>
        <div className="profile-stat-card">
          <span className="profile-stat-number">{stats.replies}</span>
          <span className="profile-stat-label">Replies</span>
        </div>
        <div className="profile-stat-card">
          <span className="profile-stat-number">{MOCK_ARTICLES_READ}</span>
          <span className="profile-stat-label">Articles Read</span>
        </div>
      </div>

      {/* ── Gamification Badges ── */}
      <div className="gamification-section">
        <h2 className="gamification-title">Achievement Badges</h2>
        <p className="gamification-sub">Raih badge dengan aktif belajar pajak dan berkontribusi.</p>

        <div className="badges-grid">

          {/* Badge 1: Understand Tax */}
          <div className="badge-card" style={{ borderColor: knowledgeBadge.color + '55', background: knowledgeBadge.bg }}>
            <div className="badge-card-header">
              <div className="badge-icon-wrap" style={{ background: knowledgeBadge.color + '22' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={knowledgeBadge.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div>
                <div className="badge-category">Understand Tax</div>
                <div className="badge-tier" style={{ color: knowledgeBadge.color }}>
                  <TierIcon tier={knowledgeBadge.tier} />
                  &nbsp;{knowledgeBadge.tier.charAt(0).toUpperCase() + knowledgeBadge.tier.slice(1)}
                </div>
              </div>
            </div>
            <div className="badge-label" style={{ color: knowledgeBadge.color }}>{knowledgeBadge.label}</div>
            <div className="badge-progress-row">
              <span className="badge-progress-text">{MOCK_ARTICLES_READ} artikel dibaca</span>
              <span className="badge-next">
                {MOCK_ARTICLES_READ < 50
                  ? `Next: ${[5,15,30,50].find(n => n > MOCK_ARTICLES_READ)} artikel`
                  : 'Level tertinggi!'}
              </span>
            </div>
            <div className="badge-progress-bar-wrap">
              <div className="badge-progress-bar" style={{ width: `${Math.min(100,(MOCK_ARTICLES_READ/50)*100)}%`, background: knowledgeBadge.color }} />
            </div>
          </div>

          {/* Badge 2: Tax Contribution */}
          <div className="badge-card" style={{ borderColor: taxBadge.color + '55', background: taxBadge.bg }}>
            <div className="badge-card-header">
              <div className="badge-icon-wrap" style={{ background: taxBadge.color + '22' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={taxBadge.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <div>
                <div className="badge-category">Tax Contribution</div>
                <div className="badge-tier" style={{ color: taxBadge.color }}>
                  <TierIcon tier={taxBadge.tier} />
                  &nbsp;{taxBadge.tier.charAt(0).toUpperCase() + taxBadge.tier.slice(1)}
                </div>
              </div>
            </div>
            <div className="badge-label" style={{ color: taxBadge.color }}>{taxBadge.label}</div>
            <div className="badge-progress-row">
              <span className="badge-progress-text">Total: {formatRupiah(MOCK_TOTAL_TAX_PAID)}</span>
              <span className="badge-next">
                {MOCK_TOTAL_TAX_PAID < 100_000_000
                  ? `Next: ${formatRupiah([10_000_000,25_000_000,50_000_000,100_000_000].find(n => n > MOCK_TOTAL_TAX_PAID))}`
                  : 'Level tertinggi!'}
              </span>
            </div>
            <div className="badge-progress-bar-wrap">
              <div className="badge-progress-bar" style={{ width: `${Math.min(100,(MOCK_TOTAL_TAX_PAID/100_000_000)*100)}%`, background: taxBadge.color }} />
            </div>
          </div>

        </div>
      </div>

      {/* ── Tax Contribution Stats ── */}
      <div className="contribution-section">
        <h2 className="contribution-title">Kontribusi Pajak Anda</h2>
        <p className="contribution-sub">Seberapa besar peran Anda dalam penerimaan pajak negara.</p>

        <div className="contribution-cards">
          <div className="contribution-main-card">
            <ContributionArc ratio={ratioToAvg} />
            <div className="contribution-amount">{formatRupiah(MOCK_TOTAL_TAX_PAID)}</div>
            <div className="contribution-amount-label">Total pajak Anda (2021–2023)</div>
            <div className="contribution-compare">
              {ratioToAvg >= 1
                ? `Kontribusi Anda ${ratioToAvg.toFixed(1)}x lebih tinggi dari rata-rata WP`
                : `Kontribusi Anda ${Math.round(ratioToAvg * 100)}% dari rata-rata WP Indonesia`}
            </div>
            <div className="contribution-avg-note">
              Rata-rata WP terdaftar: {formatRupiah(avgTaxPerPerson)} / tahun
            </div>
          </div>

          <div className="contribution-side-cards">
            <div className="contribution-stat-card">
              <div className="contribution-stat-icon">🏛️</div>
              <div>
                <div className="contribution-stat-value">{formatRupiah(NATIONAL_TAX_2023)}</div>
                <div className="contribution-stat-label">Total penerimaan pajak Indonesia 2023</div>
              </div>
            </div>
            <div className="contribution-stat-card">
              <div className="contribution-stat-icon">📊</div>
              <div>
                <div className="contribution-stat-value">
                  {(MOCK_TOTAL_TAX_PAID / NATIONAL_TAX_2023 * 100).toExponential(2)}%
                </div>
                <div className="contribution-stat-label">Persentase kontribusi Anda dari total penerimaan</div>
              </div>
            </div>
            <div className="contribution-stat-card contribution-stat-card--accent">
              <div className="contribution-stat-icon">✨</div>
              <div>
                <div className="contribution-stat-value">
                  ~{Math.round(MOCK_TOTAL_TAX_PAID / 9_000_000)} siswa
                </div>
                <div className="contribution-stat-label">
                  Dana setara membiayai pendidikan siswa SD selama 1 tahun (est. Rp 9 juta/siswa)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="profile-actions">
        <button className="profile-forum-btn" onClick={() => navigate('/community')}>
          Go to Share Your Voice
        </button>
        <button className="profile-logout-btn" onClick={handleLogout} disabled={loggingOut}>
          {loggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>

    </div>
  )
}
