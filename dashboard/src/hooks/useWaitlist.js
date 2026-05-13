import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useWaitlist() {
  const [usuarios, setUsuarios] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const { data, count, error: err } = await supabase
          .from('usuarios')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })

        if (err) throw err
        setUsuarios(data || [])
        setTotal(count || 0)
      } catch (err) {
        console.error('Error fetching usuarios:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsuarios()
  }, [])

  return { usuarios, total, loading, error }
}
