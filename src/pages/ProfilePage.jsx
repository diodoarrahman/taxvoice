import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({ posts: 0, replies: 0 })
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return navigate('/login')

      // Fetch user profile
      const { data: userData } = await supabase
        .from('users')
        .select('full_name, email, created_at')
        .eq('id', user.id)
        .single()

      // Fetch post & reply count
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

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    navigate('/login')
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

      {/* Profile card */}
      <div className="profile-card">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">
            {initials(profile?.full_name)}
          </div>
        </div>

        <div className="profile-info">
          <h1 className="profile-name">{profile?.full_name}</h1>
          <p className="profile-email">{profile?.email}</p>
          <p className="profile-joined">
            Member since {formatDate(profile?.created_at)}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="profile-stat-card">
          <span className="profile-stat-number">{stats.posts}</span>
          <span className="profile-stat-label">Posts</span>
        </div>
        <div className="profile-stat-card">
          <span className="profile-stat-number">{stats.replies}</span>
          <span className="profile-stat-label">Replies</span>
        </div>
      </div>

      {/* Actions */}
      <div className="profile-actions">
        <button
          className="profile-forum-btn"
          onClick={() => navigate('/community')}
        >
          Go to Community Forum
        </button>
        <button
          className="profile-logout-btn"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>

    </div>
  )
}