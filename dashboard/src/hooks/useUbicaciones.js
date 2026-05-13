import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useUbicaciones() {
  const [ubicaciones, setUbicaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    async function fetchUbicaciones() {
      try {
        const { data, error: err } = await supabase
          .from('ubicaciones_analytics')
          .select('*')
          .ilike('comuna', '%popular%')
          .order('fecha', { ascending: false })

        if (err) throw err
        if (mounted) setUbicaciones(data || [])
      } catch (err) {
        console.error('Error fetching ubicaciones:', err)
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchUbicaciones()

    const interval = setInterval(fetchUbicaciones, 30000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  return { ubicaciones, loading, error }
}
