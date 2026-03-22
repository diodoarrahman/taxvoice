import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const CATEGORIES = ['All', 'tax', 'budget', 'transparency', 'development', 'guide', 'education']

export default function KnowledgePage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [])

  async function fetchArticles() {
    setLoading(true)
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, category, thumbnail_url, read_time_min, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching articles:', error)
    } else {
      setArticles(data)
    }
    setLoading(false)
  }

  const filtered = articles.filter(article => {
    const matchCategory = activeCategory === 'All' || article.category === activeCategory
    const matchSearch = article.title.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="knowledge-page">
      {/* Header */}
      <div className="knowledge-header">
        <h1>Knowledge Hub</h1>
        <p>Learn about taxation and public finance in a clear and accessible way</p>
      </div>

      {/* Search & Filter */}
      <div className="knowledge-controls">
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="knowledge-search"
        />
        <div className="category-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="knowledge-loading">
          <div className="spinner" />
          <p>Loading articles...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="knowledge-empty">
          <p>No articles found.</p>
        </div>
      ) : (
        <div className="articles-grid">
          {filtered.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}

function ArticleCard({ article }) {
  const formattedDate = new Date(article.created_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const categoryColors = {
    tax: '#2563eb',
    budget: '#7c3aed',
    transparency: '#dc2626',
    development: '#d97706',
    guide: '#7c3aed',
    education: '#059669',
  }

  return (
    <Link to={`/knowledge/${article.id}`} className="article-card">
      <div className="article-thumbnail">
        <img src={article.thumbnail_url} alt={article.title} />
        <span
          className="article-category-badge"
          style={{ backgroundColor: categoryColors[article.category] || '#6b7280' }}
        >
          {article.category}
        </span>
      </div>
      <div className="article-body">
        <h3 className="article-title">{article.title}</h3>
        <div className="article-meta">
          <span>📅 {formattedDate}</span>
          <span>⏱ {article.read_time_min} min read</span>
        </div>
      </div>
    </Link>
  )
}