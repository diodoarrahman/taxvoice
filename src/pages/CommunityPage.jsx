import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import UserAvatar from '../components/UserAvatar'

export default function CommunityPage() {
  const navigate = useNavigate()
  const [posts, setPosts]           = useState([])
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [sortMode, setSortMode]     = useState('newest') // 'newest' | 'popular'
  const [currentUser, setCurrentUser] = useState(null)
  // Set of post IDs that current user has liked
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [likeLoading, setLikeLoading] = useState(new Set())

  useEffect(() => {
    fetchCurrentUser()
    fetchPosts()
  }, [])

  async function fetchCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
    if (user) {
      const { data } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id)
      if (data) setLikedPosts(new Set(data.map(r => r.post_id)))
    }
  }

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
          image_url,
          created_at,
          user_id,
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
    } catch {
      setError('Failed to load posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpvote(e, postId) {
    e.stopPropagation() // prevent navigating to detail
    if (!currentUser || likeLoading.has(postId)) return

    setLikeLoading(prev => new Set([...prev, postId]))

    const isLiked = likedPosts.has(postId)

    // Optimistic update
    setLikedPosts(prev => {
      const next = new Set(prev)
      isLiked ? next.delete(postId) : next.add(postId)
      return next
    })
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, likes_count: p.likes_count + (isLiked ? -1 : 1) }
        : p
    ))

    if (isLiked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', currentUser.id)
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: currentUser.id })
    }

    setLikeLoading(prev => {
      const next = new Set(prev)
      next.delete(postId)
      return next
    })
  }

  const displayedPosts = useMemo(() => {
    const q = search.toLowerCase()
    const filtered = posts.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.author_name.toLowerCase().includes(q)
    )
    if (sortMode === 'popular') {
      return [...filtered].sort((a, b) => b.likes_count - a.likes_count)
    }
    return [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [posts, search, sortMode])

  function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
    if (diff < 60)    return `${diff}s ago`
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
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
          <h1 className="community-title">Share Your Voice</h1>
          <p className="community-subtitle">
            Discuss tax policy, budget allocation, and fiscal transparency with fellow citizens.
          </p>
        </div>
        <button className="community-new-btn" onClick={() => navigate('/community/new')}>
          + New Post
        </button>
      </div>

      {/* Search */}
      <div className="community-search-wrap">
        <span className="community-search-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
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

      {/* Sort tabs */}
      <div className="community-sort-tabs">
        <button
          className={`sort-tab ${sortMode === 'newest' ? 'sort-tab--active' : ''}`}
          onClick={() => setSortMode('newest')}
        >
          Terbaru
        </button>
        <button
          className={`sort-tab ${sortMode === 'popular' ? 'sort-tab--active' : ''}`}
          onClick={() => setSortMode('popular')}
        >
          Terpopuler
        </button>
      </div>

      {/* Stats bar */}
      {!loading && !error && (
        <div className="community-stats-bar">
          <span>{posts.length} total posts</span>
          {search && <span>· {displayedPosts.length} result{displayedPosts.length !== 1 ? 's' : ''} for "{search}"</span>}
        </div>
      )}

      {/* Loading / Error / Empty */}
      {loading && (
        <div className="community-loading">
          <div className="spinner" /><p>Loading discussions...</p>
        </div>
      )}

      {error && (
        <div className="community-error">
          <p>{error}</p>
          <button onClick={fetchPosts}>Try Again</button>
        </div>
      )}

      {!loading && !error && displayedPosts.length === 0 && (
        <div className="community-empty">
          <div className="community-empty-icon">💬</div>
          <h3>{search ? 'No posts match your search.' : 'No posts yet.'}</h3>
          <p>{search ? 'Try different keywords.' : 'Be the first to start a discussion!'}</p>
          {!search && (
            <button className="community-new-btn" onClick={() => navigate('/community/new')}>
              Start a Discussion
            </button>
          )}
        </div>
      )}

      {/* Post list */}
      {!loading && !error && displayedPosts.length > 0 && (
        <div className="community-list">
          {displayedPosts.map(post => {
            const liked = likedPosts.has(post.id)
            return (
              <article
                key={post.id}
                className="community-card"
                onClick={() => navigate(`/community/${post.id}`)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/community/${post.id}`) } }}
                role="button"
                tabIndex={0}
                aria-label={`Read post: ${post.title}`}
              >
                <div className="community-card-body">
                  {post.image_url && (
                    <img
                      className="community-card-image"
                      src={post.image_url}
                      alt=""
                      loading="lazy"
                    />
                  )}
                  <h2 className="community-card-title">{post.title}</h2>
                  <p className="community-card-excerpt">{excerpt(post.content)}</p>
                </div>
                <div className="community-card-footer">
                  <div className="community-card-meta">
                    <UserAvatar userId={post.user_id} name={post.author_name} size={28} />
                    <span className="community-author">{post.author_name}</span>
                    <span className="community-dot">·</span>
                    <span className="community-time">{timeAgo(post.created_at)}</span>
                  </div>
                  <div className="community-card-actions">
                    {/* Upvote button */}
                    <button
                      className={`post-upvote-btn ${liked ? 'post-upvote-btn--active' : ''}`}
                      onClick={e => handleUpvote(e, post.id)}
                      disabled={!currentUser || likeLoading.has(post.id)}
                      title={liked ? 'Remove upvote' : 'Upvote this post'}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      </svg>
                      {post.likes_count}
                    </button>
                    <span className="community-read-more">Read more →</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

    </div>
  )
}
