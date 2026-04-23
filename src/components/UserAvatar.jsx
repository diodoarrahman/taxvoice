import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const BUCKET = 'avatars'

// Bangun URL avatar dari Supabase Storage.
// Untuk user lain (bukan diri sendiri), tidak perlu version —
// path-nya deterministik sehingga selalu mengarah ke file terbaru.
function buildOtherUrl(userId) {
  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(`${userId}/avatar`)
  return data.publicUrl
}

function toInitials(name) {
  if (!name) return '?'
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

/**
 * UserAvatar — avatar circle yang selalu menampilkan foto terbaru.
 *
 * Props:
 *   userId  – UUID pemilik avatar (dari forum_posts.user_id / forum_replies.user_id)
 *   name    – nama tampilan, dipakai sebagai fallback inisial
 *   size    – diameter lingkaran dalam px (default 36)
 *   className – CSS class tambahan
 */
export default function UserAvatar({ userId, name, size = 36, className = '' }) {
  const { user, avatarUrl } = useAuth()
  const [imgFailed, setImgFailed] = useState(false)

  const isSelf = !!user && user.id === userId

  // URL yang dipakai:
  // • diri sendiri → dari context (mengandung ?v=timestamp, update langsung setelah upload)
  // • user lain    → path deterministik tanpa version (browser mengambil versi terbaru setelah cache expire)
  const url = isSelf
    ? avatarUrl
    : userId
      ? buildOtherUrl(userId)
      : null

  // Reset imgFailed saat URL berubah (misalnya setelah user upload foto baru)
  useEffect(() => {
    setImgFailed(false)
  }, [url])

  const fontSize = Math.round(size * 0.38)

  return (
    <div
      className={`user-avatar ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-primary)',
        color: 'white',
        fontSize,
        fontWeight: 700,
        fontFamily: 'var(--font-sans)',
        flexShrink: 0,
      }}
    >
      {url && !imgFailed ? (
        <img
          src={url}
          alt={name || 'Avatar'}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={() => setImgFailed(true)}
        />
      ) : (
        toInitials(name)
      )}
    </div>
  )
}
