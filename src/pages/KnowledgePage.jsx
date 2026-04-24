import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getArticleThumbUrl } from '../lib/articleThumb'

const CATEGORIES = ['All', 'tax', 'budget', 'transparency', 'development', 'guide', 'education']

const ThumbIcons = {
  tax: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22V9l9-7 9 7v13"/><path d="M9 22V14h6v8"/>
    </svg>
  ),
  budget: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><path d="M12 3v9l5.4 5.4"/>
    </svg>
  ),
  transparency: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  development: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  guide: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  education: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
    </svg>
  ),
}

const categoryThumb = {
  tax:          { bg: 'oklch(31% 0.18 260)', icon: ThumbIcons.tax          },
  budget:       { bg: 'oklch(29% 0.16 290)', icon: ThumbIcons.budget       },
  transparency: { bg: 'oklch(28% 0.17 20)',  icon: ThumbIcons.transparency },
  development:  { bg: 'oklch(33% 0.12 55)',  icon: ThumbIcons.development  },
  guide:        { bg: 'oklch(28% 0.14 300)', icon: ThumbIcons.guide        },
  education:    { bg: 'oklch(30% 0.12 168)', icon: ThumbIcons.education    },
  default:      { bg: 'oklch(28% 0.05 260)', icon: ThumbIcons.default      },
}

const categoryColors = {
  tax: '#2563eb',
  budget: '#7c3aed',
  transparency: '#dc2626',
  development: '#d97706',
  guide: '#7c3aed',
  education: '#059669',
}

export default function KnowledgePage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true) // starts true; effect sets false when done
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cancelled = false
    supabase
      .from('articles')
      .select('id, title, category, read_time_min, created_at')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) console.error('Error fetching articles:', error)
        else setArticles(data)
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const filtered = articles.filter(article => {
    const matchCategory = activeCategory === 'All' || article.category === activeCategory
    const matchSearch = article.title.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="knowledge-page">
      <div className="knowledge-header">
        <h1>Understand Tax</h1>
        <p>Learn about taxation and public finance in a clear and accessible way</p>
      </div>

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

function ArticleThumbnail({ id, category, title }) {
  const thumb = categoryThumb[category] || categoryThumb.default
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="article-thumb-placeholder" style={{ backgroundColor: thumb.bg }}>
        <span className="article-thumb-svg">{thumb.icon}</span>
      </div>
    )
  }

  return (
    <img
      src={getArticleThumbUrl(id, category)}
      alt={title}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

function ArticleCard({ article }) {
  const formattedDate = new Date(article.created_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <Link to={`/knowledge/${article.id}`} className="article-card">
      <div className="article-thumbnail">
        <ArticleThumbnail id={article.id} category={article.category} title={article.title} />
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
