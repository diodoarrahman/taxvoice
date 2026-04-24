import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../lib/supabase'
import { getArticleThumbUrl } from '../lib/articleThumb'

export default function KnowledgeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticle()
  }, [id])

  async function fetchArticle() {
    setLoading(true)
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      navigate('/knowledge')
    } else {
      setArticle(data)
    }
    setLoading(false)
  }

  if (loading) return (
    <div className="knowledge-loading">
      <div className="spinner" />
      <p>Loading article...</p>
    </div>
  )

  const formattedDate = new Date(article.created_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const categoryColors = {
    pajak: '#2563eb',
    APBN: '#7c3aed',
    transparansi: '#dc2626',
    pembangunan: '#d97706',
    panduan: '#7c3aed',
    edukasi: '#059669',
  }

  return (
    <div className="detail-page">
      {/* Back Button */}
      <button onClick={() => navigate('/knowledge')} className="back-button">
        ← Back to Knowledge Hub
      </button>

      {/* Thumbnail */}
      <div className="detail-thumbnail">
        <img
          src={getArticleThumbUrl(article.id, article.category)}
          alt={article.title}
          decoding="async"
        />
      </div>

      {/* Article Header */}
      <div className="detail-header">
        <span
          className="detail-category-badge"
          style={{ backgroundColor: categoryColors[article.category] || '#6b7280' }}
        >
          {article.category}
        </span>
        <h1 className="detail-title">{article.title}</h1>
        <div className="detail-meta">
          <span>📅 {formattedDate}</span>
          <span>⏱ {article.read_time_min} menit baca</span>
        </div>
      </div>

      {/* Article Content */}
      <div className="detail-content">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>
    </div>
  )
}