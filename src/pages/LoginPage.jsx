import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Incorrect email or password. Please try again.')
      setLoading(false)
    } else {
      navigate('/impact')
    }
  }

  return (
    <div className="auth-page">

      {/* Brand panel */}
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="auth-logo-text">TaxVoice</span>
          </div>

          <h1 className="auth-brand-headline">
            Your taxes.<br />Your voice.<br />Your future.
          </h1>
          <p className="auth-brand-sub">
            Understand where your money goes and help shape Indonesia's fiscal future through education, simulation, and civic discussion.
          </p>

          <ul className="auth-features">
            <li>Real-time budget data from Kemenkeu &amp; BPS</li>
            <li>Interactive tax &amp; budget simulator</li>
            <li>Community forum for civic discourse</li>
          </ul>

          <div className="auth-brand-stat">
            <span className="auth-stat-num">67%</span>
            <span className="auth-stat-label">of Indonesian taxpayers are unsure where their taxes actually go. TaxVoice bridges that gap.</span>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-form-side">
        <div className="auth-form-inner">
          <h2 className="auth-form-title">Sign in</h2>
          <p className="auth-form-sub">
            Don't have an account? <Link to="/register">Create one — it's free</Link>
          </p>

          {error && (
            <div className="auth-error" role="alert">{error}</div>
          )}

          <form onSubmit={handleLogin}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
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
              <label className="auth-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="auth-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}
