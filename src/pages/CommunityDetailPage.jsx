import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import UserAvatar from '../components/UserAvatar'

export default function CommunityDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post,          setPost]          = useState(null)
  const [replies,       setReplies]       = useState([])
  const [replyContent,  setReplyContent]  = useState('')
  const [currentUser,   setCurrentUser]   = useState(null)
  const [loadingPost,   setLoadingPost]   = useState(true)
  const [loadingReplies,setLoadingReplies]= useState(true)
  const [submitting,    setSubmitting]    = useState(false)
  const [replyError,    setReplyError]    = useState(null)
  const [hasLiked,      setHasLiked]      = useState(false)
  const [likesCount,    setLikesCount]    = useState(0)
  const [likeLoading,   setLikeLoading]   = useState(false)
  const [sortMode,      setSortMode]      = useState('newest')

  // Set berisi reply_id yang sedang dalam proses toggle (cegah dobel klik)
  const [replyLikeLoading, setReplyLikeLoading] = useState(new Set())

  const replyMax = 1000

  useEffect(() => {
    initPage()
  }, [id])

  // Inisialisasi semua data secara berurutan agar currentUser tersedia
  // saat fetchReplies dipanggil (dibutuhkan untuk cek is_liked per reply)
  async function initPage() {
    fetchPost()

    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)

    fetchReplies(user)
    if (user) fetchPostLikeStatus(user)
  }

  async function fetchPost() {
    setLoadingPost(true)
    const { data, error } = await supabase
      .from('forum_posts')
      .select('id, title, content, image_url, created_at, user_id, users (full_name)')
      .eq('id', id)
      .single()

    if (error || !data) { navigate('/community'); return }
    setPost({ ...data, author_name: data.users?.full_name || 'Anonymous' })
    setLoadingPost(false)
  }

  async function fetchPostLikeStatus(user) {
    const { count } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', id)
    setLikesCount(count || 0)

    const { data } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', user.id)
      .single()
    setHasLiked(!!data)
  }

  // Fetch replies sekaligus mengambil reply_likes —
  // sehingga likes_count & is_liked langsung tersedia tanpa query tambahan
  async function fetchReplies(user) {
    setLoadingReplies(true)
    const { data, error } = await supabase
      .from('forum_replies')
      .select(`
        id, content, created_at, user_id,
        users (full_name),
        reply_likes (id, user_id)
      `)
      .eq('post_id', id)
      .order('created_at', { ascending: true })

    if (!error && data) {
      const mapped = data.map(r => ({
        ...r,
        author_name: r.users?.full_name || 'Anonymous',
        likes_count: r.reply_likes?.length ?? 0,
        is_liked:    user
          ? (r.reply_likes?.some(l => l.user_id === user.id) ?? false)
          : false,
      }))
      setReplies(mapped)
    }
    setLoadingReplies(false)
  }

  async function handlePostLike() {
    if (!currentUser || likeLoading) return
    setLikeLoading(true)

    if (hasLiked) {
      await supabase.from('post_likes').delete()
        .eq('post_id', id).eq('user_id', currentUser.id)
      setHasLiked(false)
      setLikesCount(prev => prev - 1)
    } else {
      await supabase.from('post_likes').insert({ post_id: id, user_id: currentUser.id })
      setHasLiked(true)
      setLikesCount(prev => prev + 1)
    }
    setLikeLoading(false)
  }

  async function handleReplyUpvote(replyId) {
    if (!currentUser || replyLikeLoading.has(replyId)) return

    // Tandai sedang loading
    setReplyLikeLoading(prev => new Set([...prev, replyId]))

    const reply  = replies.find(r => r.id === replyId)
    const isLiked = reply?.is_liked ?? false

    // Optimistic update — UI langsung berubah sebelum respons Supabase
    setReplies(prev => prev.map(r =>
      r.id === replyId
        ? { ...r, likes_count: r.likes_count + (isLiked ? -1 : 1), is_liked: !isLiked }
        : r
    ))

    if (isLiked) {
      const { error } = await supabase.from('reply_likes').delete()
        .eq('reply_id', replyId).eq('user_id', currentUser.id)
      // Rollback jika gagal
      if (error) {
        setReplies(prev => prev.map(r =>
          r.id === replyId
            ? { ...r, likes_count: r.likes_count + 1, is_liked: true }
            : r
        ))
      }
    } else {
      const { error } = await supabase.from('reply_likes')
        .insert({ reply_id: replyId, user_id: currentUser.id })
      if (error) {
        setReplies(prev => prev.map(r =>
          r.id === replyId
            ? { ...r, likes_count: r.likes_count - 1, is_liked: false }
            : r
        ))
      }
    }

    setReplyLikeLoading(prev => {
      const next = new Set(prev)
      next.delete(replyId)
      return next
    })
  }

  // Sort berdasarkan likes_count dari Supabase (bukan local state)
  const sortedReplies = useMemo(() => {
    if (sortMode === 'popular') {
      return [...replies].sort((a, b) => b.likes_count - a.likes_count)
    }
    return [...replies].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  }, [replies, sortMode])

  async function handleReplySubmit() {
    setReplyError(null)
    if (!replyContent.trim())           return setReplyError('Reply cannot be empty.')
    if (replyContent.trim().length < 5) return setReplyError('Reply is too short.')

    setSubmitting(true)
    try {
      const { error } = await supabase.from('forum_replies')
        .insert({ post_id: id, user_id: currentUser.id, content: replyContent.trim() })
      if (error) throw error
      setReplyContent('')
      fetchReplies(currentUser)
    } catch (err) {
      setReplyError(err.message || 'Failed to post reply.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteReply(replyId) {
    const { error } = await supabase.from('forum_replies').delete().eq('id', replyId)
    if (!error) fetchReplies(currentUser)
  }

  async function handleDeletePost() {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    if (post.image_url) {
      const parts = post.image_url.split('/post-images/')
      if (parts.length > 1) {
        await supabase.storage.from('post-images').remove([parts[1].split('?')[0]])
      }
    }

    const { error } = await supabase.from('forum_posts').delete().eq('id', id)
    if (!error) navigate('/community')
  }

  function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
    if (diff < 60)    return `${diff}s ago`
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
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

      <button className="createpost-back" onClick={() => navigate('/community')}>
        ← Back to Share Your Voice
      </button>

      {/* Post */}
      <div className="detail-post-card">
        <div className="detail-post-header">
          <div className="detail-post-meta">
            <UserAvatar userId={post.user_id} name={post.author_name} size={36} />
            <div>
              <span className="community-author">{post.author_name}</span>
              <span className="detail-post-time">{timeAgo(post.created_at)}</span>
            </div>
          </div>
          {currentUser && currentUser.id === post.user_id && (
            <button className="detail-delete-btn" onClick={handleDeletePost}>Delete</button>
          )}
        </div>

        <h1 className="detail-post-title">{post.title}</h1>
        {post.image_url && (
          <img
            className="detail-post-image"
            src={post.image_url}
            alt="Post attachment"
            loading="lazy"
          />
        )}
        <p className="detail-post-content">{post.content}</p>

        <div className="detail-post-footer">
          <button
            className={`detail-like-btn ${hasLiked ? 'detail-like-btn--active' : ''}`}
            onClick={handlePostLike}
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
        <div className="detail-replies-header">
          <h2 className="detail-replies-title">
            Replies {!loadingReplies && `(${replies.length})`}
          </h2>

          {!loadingReplies && replies.length > 1 && (
            <div className="reply-sort-tabs">
              <button
                className={`sort-tab sort-tab--sm ${sortMode === 'newest' ? 'sort-tab--active' : ''}`}
                onClick={() => setSortMode('newest')}
              >
                Terbaru
              </button>
              <button
                className={`sort-tab sort-tab--sm ${sortMode === 'popular' ? 'sort-tab--active' : ''}`}
                onClick={() => setSortMode('popular')}
              >
                Terpopuler
              </button>
            </div>
          )}
        </div>

        {loadingReplies && (
          <div className="community-loading"><div className="spinner" /></div>
        )}

        {!loadingReplies && replies.length === 0 && (
          <div className="detail-no-replies">No replies yet. Be the first to respond!</div>
        )}

        {!loadingReplies && sortedReplies.map(reply => (
          <div key={reply.id} className="detail-reply-card">
            <div className="detail-reply-header">
              <div className="detail-post-meta">
                <UserAvatar userId={reply.user_id} name={reply.author_name} size={28} />
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

            {/* Upvote — tersimpan ke Supabase reply_likes */}
            <div className="reply-upvote-row">
              <button
                className={`reply-upvote-btn ${reply.is_liked ? 'reply-upvote-btn--active' : ''}`}
                onClick={() => handleReplyUpvote(reply.id)}
                disabled={!currentUser || replyLikeLoading.has(reply.id)}
                title={reply.is_liked ? 'Remove upvote' : 'Upvote this reply'}
              >
                <svg
                  width="13" height="13" viewBox="0 0 24 24"
                  fill={reply.is_liked ? 'currentColor' : 'none'}
                  stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                  <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                <span>{reply.likes_count}</span>
              </button>
            </div>
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
