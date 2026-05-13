import { Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import { useState, useEffect } from 'react'

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div className="loading-screen">Cargando...</div>
  if (!session) return <Navigate to="/login" replace />

  return children
}
