import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="page-stub">
      <h1 style={{ fontSize: '4rem', letterSpacing: '-0.05em' }}>404</h1>
      <p>Halaman tidak ditemukan.</p>
      <Link to="/" style={{ color: 'var(--color-primary)', fontSize: '0.9rem' }}>← Kembali ke Home</Link>
    </div>
  )
}