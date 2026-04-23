import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

const BUCKET = 'avatars'

function buildAvatarUrl(userId, version) {
  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(`${userId}/avatar`)
  // ?v= memaksa browser mengambil file baru setelah foto diganti
  return `${data.publicUrl}?v=${version}`
}

export function AuthProvider({ children }) {
  const [user,          setUser]          = useState(undefined) // undefined = belum tahu, null = tidak login
  const [avatarVersion, setAvatarVersion] = useState(() => Date.now())

  useEffect(() => {
    // Ambil session awal
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Dengarkan perubahan auth (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Dipanggil oleh ProfilePage setelah upload foto berhasil.
  // Memperbarui version → semua komponen yang pakai avatarUrl dari context
  // langsung re-render dengan URL baru (cache-busted).
  const refreshAvatar = useCallback(() => {
    setAvatarVersion(Date.now())
  }, [])

  const avatarUrl = user ? buildAvatarUrl(user.id, avatarVersion) : null

  return (
    <AuthContext.Provider value={{ user, avatarUrl, avatarVersion, refreshAvatar }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
