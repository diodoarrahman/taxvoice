import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const IMAGE_MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export default function CreatePostPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const titleMax = 120
  const contentMax = 2000

  function handleImageSelect(file) {
    if (!file) return
    if (!IMAGE_TYPES.includes(file.type)) {
      setError('Format gambar tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.')
      return
    }
    if (file.size > IMAGE_MAX_SIZE) {
      setError('Ukuran gambar maksimal 5 MB.')
      return
    }
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError(null)
  }

  function handleRemoveImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

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

      let image_url = null
      if (imageFile) {
        const ext = imageFile.name.split('.').pop()
        const path = `${user.id}/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(path, imageFile, { contentType: imageFile.type })
        if (uploadError) throw new Error('Gagal upload gambar: ' + uploadError.message)

        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(path)
        image_url = urlData.publicUrl
      }

      const { error: insertError } = await supabase
        .from('forum_posts')
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
          image_url,
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

        {/* Image Upload */}
        <div className="createpost-field">
          <label className="createpost-label">
            Gambar <span className="createpost-optional">(opsional)</span>
          </label>

          {imagePreview ? (
            <div className="createpost-image-preview">
              <img src={imagePreview} alt="Preview" />
              <button
                type="button"
                className="createpost-image-remove"
                onClick={handleRemoveImage}
                title="Hapus gambar"
              >
                ✕
              </button>
              <div className="createpost-image-filename">{imageFile?.name}</div>
            </div>
          ) : (
            <div
              className={`createpost-image-zone ${dragOver ? 'createpost-image-zone--over' : ''}`}
              role="button"
              tabIndex={0}
              aria-label="Upload image — click or drag and drop"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click() } }}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => {
                e.preventDefault()
                setDragOver(false)
                handleImageSelect(e.dataTransfer.files[0])
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#94a3b8' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="createpost-image-zone-text">Klik atau seret gambar ke sini</span>
              <span className="createpost-image-zone-hint">JPG, PNG, WebP, GIF · Maks 5 MB</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            style={{ display: 'none' }}
            onChange={e => handleImageSelect(e.target.files[0])}
          />
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
            {loading ? (imageFile ? 'Uploading...' : 'Posting...') : 'Post Discussion'}
          </button>
        </div>

      </div>
    </div>
  )
}
