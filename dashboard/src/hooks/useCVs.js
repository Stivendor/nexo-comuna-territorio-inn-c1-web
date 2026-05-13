import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useCVs() {
  const [cvs, setCVs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCVs() {
      try {
        const { data, error: err } = await supabase
          .from('cvs_generados')
          .select('*')
          .ilike('comuna', '%popular%')
          .order('created_at', { ascending: false })

        if (err) throw err
        setCVs(data || [])
      } catch (err) {
        console.error('Error fetching CVs:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCVs()
  }, [])

  return { cvs, loading, error }
}
