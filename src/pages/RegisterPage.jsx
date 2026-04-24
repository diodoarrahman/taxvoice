import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import LogoMark from '../components/LogoMark'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="auth-page">

      {/* Brand panel */}
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <div className="auth-logo">
            <LogoMark size={36} />
            <span className="auth-logo-text">TaxVoice</span>
          </div>

          <h1 className="auth-brand-headline">
            Join 10,000+<br />civic-minded<br />Indonesians.
          </h1>
          <p className="auth-brand-sub">
            TaxVoice helps students and young adults understand public finance — so you can hold your government accountable.
          </p>

          <ul className="auth-features">
            <li>Free to use — no credit card required</li>
            <li>Built for Indonesian university students</li>
            <li>Data sourced from Kemenkeu &amp; BPS</li>
          </ul>

          <div className="auth-brand-stat">
            <span className="auth-stat-num">10.4%</span>
            <span className="auth-stat-label">Indonesia's tax-to-GDP ratio — below the 15% minimum recommended by the IMF for development.</span>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-form-side">
        <div className="auth-form-inner">
          <h2 className="auth-form-title">Create account</h2>
          <p className="auth-form-sub">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          {error && (
            <div className="auth-error" role="alert">{error}</div>
          )}

          <form onSubmit={handleRegister}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-name">Full name</label>
              <input
                id="reg-name"
                className="auth-input"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Your full name"
                required
                autoComplete="name"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-email">Email address</label>
              <input
                id="reg-email"
                className="auth-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                className="auth-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '1.25rem', lineHeight: 1.5 }}>
            By creating an account you agree to our terms of service and acknowledge our privacy policy.
          </p>
        </div>
      </div>

    </div>
  )
}
