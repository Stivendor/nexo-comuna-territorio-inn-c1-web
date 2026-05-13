import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usuarios, cvs, educativas, laborales] = await Promise.all([
          supabase
            .from('usuarios')
            .select('*', { count: 'exact', head: true }),
          supabase
            .from('cvs_generados')
            .select('*', { count: 'exact', head: true }),
          supabase
            .from('oferta_educativa')
            .select('*', { count: 'exact', head: true }),
          supabase
            .from('oferta_laboral')
            .select('*', { count: 'exact', head: true }),
        ])

        setStats({
          totalUsuarios: usuarios.count || 0,
          totalCVs: cvs.count || 0,
          totalOportunidades: (educativas.count || 0) + (laborales.count || 0),
          webhookRate: 98,
        })
      } catch (err) {
        console.error('Error fetching stats:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}
