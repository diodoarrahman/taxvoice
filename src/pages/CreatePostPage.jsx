import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function CreatePostPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const titleMax = 120
  const contentMax = 2000

  async function handleSubmit() {
    setError(null)

    if (!title.trim()) return setError('Title is required.')
    if (title.trim().length < 10) return setError('Title must be at least 10 characters.')
    if (!content.trim()) return setError('Content is required.')
    if (content.trim().length < 20) return setError('Content must be at least 20 characters.')

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated.')

      const { error: insertError } = await supabase
        .from('forum_posts')
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
        })

      if (insertError) throw insertError

      navigate('/community')
    } catch (err) {
      setError(err.message || 'Failed to submit post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="createpost-page">

      {/* Header */}
      <div className="createpost-header">
        <button className="createpost-back" onClick={() => navigate('/community')}>
          ← Back
        </button>
        <h1 className="createpost-title">Start a Discussion</h1>
        <p className="createpost-subtitle">
          Share your thoughts on tax policy, budget transparency, or fiscal issues.
        </p>
      </div>

      {/* Form */}
      <div className="createpost-form">

        {/* Title */}
        <div className="createpost-field">
          <label className="createpost-label">
            Title <span className="createpost-required">*</span>
          </label>
          <input
            className="createpost-input"
            type="text"
            placeholder="e.g. Why is Indonesia's tax ratio still below 12%?"
            value={title}
            maxLength={titleMax}
            onChange={e => setTitle(e.target.value)}
          />
          <div className="createpost-counter">
            {title.length}/{titleMax}
          </div>
        </div>

        {/* Content */}
        <div className="createpost-field">
          <label className="createpost-label">
            Content <span className="createpost-required">*</span>
          </label>
          <textarea
            className="createpost-textarea"
            placeholder="Write your discussion here. Be specific, constructive, and respectful."
            value={content}
            maxLength={contentMax}
            onChange={e => setContent(e.target.value)}
            rows={8}
          />
          <div className="createpost-counter">
            {content.length}/{contentMax}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="createpost-error">{error}</div>
        )}

        {/* Actions */}
        <div className="createpost-actions">
          <button
            className="createpost-cancel"
            onClick={() => navigate('/community')}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="createpost-submit"
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !content.trim()}
          >
            {loading ? 'Posting...' : 'Post Discussion'}
          </button>
        </div>

      </div>
    </div>
  )
}