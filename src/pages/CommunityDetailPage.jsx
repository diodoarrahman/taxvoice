import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function CommunityDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [replies, setReplies] = useState([])
  const [replyContent, setReplyContent] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [loadingPost, setLoadingPost] = useState(true)
  const [loadingReplies, setLoadingReplies] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [replyError, setReplyError] = useState(null)
  const [hasLiked, setHasLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [likeLoading, setLikeLoading] = useState(false)

  const replyMax = 1000

  useEffect(() => {
    fetchCurrentUser()
    fetchPost()
    fetchReplies()
  }, [id])

  useEffect(() => {
    if (currentUser && post) fetchLikeStatus()
  }, [currentUser, post])

  async function fetchCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
  }

  async function fetchPost() {
    setLoadingPost(true)
    const { data, error } = await supabase
      .from('forum_posts')
      .select(`
        id, title, content, likes_count, created_at, user_id,
        users (full_name)
      `)
      .eq('id', id)
      .single()

    if (error || !data) {
      navigate('/community')
      return
    }

    setPost({ ...data, author_name: data.users?.full_name || 'Anonymous' })
    setLoadingPost(false)
  }

  async function fetchReplies() {
    setLoadingReplies(true)
    const { data, error } = await supabase
      .from('forum_replies')
      .select(`
        id, content, created_at, user_id,
        users (full_name)
      `)
      .eq('post_id', id)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setReplies(data.map(r => ({
        ...r,
        author_name: r.users?.full_name || 'Anonymous'
      })))
    }
    setLoadingReplies(false)
  }
  async function fetchLikeStatus() {
    // Hitung likes dari tabel post_likes — bukan dari cached likes_count
    const { count } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', id)

    setLikesCount(count || 0)

    // Cek apakah user ini sudah like
    const { data } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', currentUser.id)
      .single()

    setHasLiked(!!data)
  }

  async function handleLike() {
    if (!currentUser || likeLoading) return
    setLikeLoading(true)

    if (hasLiked) {
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', id)
        .eq('user_id', currentUser.id)

      setHasLiked(false)
      setLikesCount(prev => prev - 1)
    } else {
      await supabase
        .from('post_likes')
        .insert({ post_id: id, user_id: currentUser.id })

      setHasLiked(true)
      setLikesCount(prev => prev + 1)
    }

    setLikeLoading(false)
  }

  async function handleReplySubmit() {
    setReplyError(null)
    if (!replyContent.trim()) return setReplyError('Reply cannot be empty.')
    if (replyContent.trim().length < 5) return setReplyError('Reply is too short.')

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('forum_replies')
        .insert({
          post_id: id,
          user_id: currentUser.id,
          content: replyContent.trim(),
        })

      if (error) throw error

      setReplyContent('')
      fetchReplies()
    } catch (err) {
      setReplyError(err.message || 'Failed to post reply.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteReply(replyId) {
    const { error } = await supabase
      .from('forum_replies')
      .delete()
      .eq('id', replyId)

    if (!error) fetchReplies()
  }

  async function handleDeletePost() {
    const confirm = window.confirm('Are you sure you want to delete this post?')
    if (!confirm) return

    const { error } = await supabase
      .from('forum_posts')
      .delete()
      .eq('id', id)

    if (!error) navigate('/community')
  }

  function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  function initials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loadingPost) {
    return (
      <div className="community-loading">
        <div className="spinner" />
        <p>Loading post...</p>
      </div>
    )
  }

  return (
    <div className="detail-page">

      {/* Back */}
      <button className="createpost-back" onClick={() => navigate('/community')}>
        ← Back to Community
      </button>

      {/* Post */}
      <div className="detail-post-card">
        <div className="detail-post-header">
          <div className="detail-post-meta">
            <span className="community-avatar">{initials(post.author_name)}</span>
            <div>
              <span className="community-author">{post.author_name}</span>
              <span className="detail-post-time">{timeAgo(post.created_at)}</span>
            </div>
          </div>
          {/* Delete button — only for post owner */}
          {currentUser && currentUser.id === post.user_id && (
            <button className="detail-delete-btn" onClick={handleDeletePost}>
              Delete
            </button>
          )}
        </div>

        <h1 className="detail-post-title">{post.title}</h1>
        <p className="detail-post-content">{post.content}</p>

        <div className="detail-post-footer">
          <button
            className={`detail-like-btn ${hasLiked ? 'detail-like-btn--active' : ''}`}
            onClick={handleLike}
            disabled={likeLoading}
          >
            {hasLiked ? '♥' : '♡'} {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </button>
          <span className="detail-reply-count">
            💬 {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
          </span>
        </div>
      </div>

      {/* Replies section */}
      <div className="detail-replies-section">
        <h2 className="detail-replies-title">
          Replies {!loadingReplies && `(${replies.length})`}
        </h2>

        {loadingReplies && (
          <div className="community-loading">
            <div className="spinner" />
          </div>
        )}

        {!loadingReplies && replies.length === 0 && (
          <div className="detail-no-replies">
            No replies yet. Be the first to respond!
          </div>
        )}

        {!loadingReplies && replies.map(reply => (
          <div key={reply.id} className="detail-reply-card">
            <div className="detail-reply-header">
              <div className="detail-post-meta">
                <span className="community-avatar community-avatar-sm">
                  {initials(reply.author_name)}
                </span>
                <div>
                  <span className="community-author">{reply.author_name}</span>
                  <span className="detail-post-time">{timeAgo(reply.created_at)}</span>
                </div>
              </div>
              {currentUser && currentUser.id === reply.user_id && (
                <button
                  className="detail-delete-reply-btn"
                  onClick={() => handleDeleteReply(reply.id)}
                >
                  Delete
                </button>
              )}
            </div>
            <p className="detail-reply-content">{reply.content}</p>
          </div>
        ))}
      </div>

      {/* Reply form */}
      <div className="detail-reply-form">
        <h3 className="detail-reply-form-title">Write a Reply</h3>
        <textarea
          className="createpost-textarea"
          placeholder="Share your thoughts on this discussion..."
          value={replyContent}
          maxLength={replyMax}
          onChange={e => setReplyContent(e.target.value)}
          rows={4}
        />
        <div className="detail-reply-form-footer">
          <span className="createpost-counter">{replyContent.length}/{replyMax}</span>
          {replyError && <span className="detail-reply-error">{replyError}</span>}
          <button
            className="createpost-submit"
            onClick={handleReplySubmit}
            disabled={submitting || !replyContent.trim()}
          >
            {submitting ? 'Posting...' : 'Post Reply'}
          </button>
        </div>
      </div>

    </div>
  )
}