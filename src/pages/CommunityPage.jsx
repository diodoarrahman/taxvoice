import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function CommunityPage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFilteredPosts(
      posts.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.author_name.toLowerCase().includes(q)
      )
    )
  }, [search, posts])

  async function fetchPosts() {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
        id,
        title,
        content,
        created_at,
        users (full_name),
        post_likes (id)
      `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const mapped = data.map(p => ({
        ...p,
        author_name: p.users?.full_name || 'Anonymous',
        likes_count: p.post_likes?.length || 0,
      }))
      setPosts(mapped)
      setFilteredPosts(mapped)
    } catch (err) {
      setError('Failed to load posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  function excerpt(text, max = 120) {
    return text.length > max ? text.slice(0, max).trimEnd() + '...' : text
  }

  return (
    <div className="community-page">

      {/* Header */}
      <div className="community-header">
        <div>
          <h1 className="community-title">Community Forum</h1>
          <p className="community-subtitle">
            Discuss tax policy, budget allocation, and fiscal transparency with fellow citizens.
          </p>
        </div>
        <button
          className="community-new-btn"
          onClick={() => navigate('/community/new')}
        >
          + New Post
        </button>
      </div>

      {/* Search */}
      <div className="community-search-wrap">
        <span className="community-search-icon">🔍</span>
        <input
          className="community-search-input"
          type="text"
          placeholder="Search posts by title, content, or author..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="community-search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* Stats bar */}
      {!loading && !error && (
        <div className="community-stats-bar">
          <span>{posts.length} total posts</span>
          {search && <span>· {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{search}"</span>}
        </div>
      )}

      {/* Content */}
      {loading && (
        <div className="community-loading">
          <div className="spinner" />
          <p>Loading discussions...</p>
        </div>
      )}

      {error && (
        <div className="community-error">
          <p>{error}</p>
          <button onClick={fetchPosts}>Try Again</button>
        </div>
      )}

      {!loading && !error && filteredPosts.length === 0 && (
        <div className="community-empty">
          <div className="community-empty-icon">💬</div>
          <h3>{search ? 'No posts match your search.' : 'No posts yet.'}</h3>
          <p>{search ? 'Try different keywords.' : 'Be the first to start a discussion!'}</p>
          {!search && (
            <button
              className="community-new-btn"
              onClick={() => navigate('/community/new')}
            >
              Start a Discussion
            </button>
          )}
        </div>
      )}

      {!loading && !error && filteredPosts.length > 0 && (
        <div className="community-list">
          {filteredPosts.map(post => (
            <div
              key={post.id}
              className="community-card"
              onClick={() => navigate(`/community/${post.id}`)}
            >
              <div className="community-card-body">
                <h2 className="community-card-title">{post.title}</h2>
                <p className="community-card-excerpt">{excerpt(post.content)}</p>
              </div>
              <div className="community-card-footer">
                <div className="community-card-meta">
                  <span className="community-avatar">
                    {post.author_name.charAt(0).toUpperCase()}
                  </span>
                  <span className="community-author">{post.author_name}</span>
                  <span className="community-dot">·</span>
                  <span className="community-time">{timeAgo(post.created_at)}</span>
                </div>
                <div className="community-card-actions">
                  <span className="community-likes">♥ {post.likes_count}</span>
                  <span className="community-read-more">Read more →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}