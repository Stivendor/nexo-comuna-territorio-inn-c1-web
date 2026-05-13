import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useOpportunities() {
  const [oportunidades, setOportunidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchOportunidades() {
      try {
        const [educativas, laborales] = await Promise.all([
          supabase
            .from('oferta_educativa')
            .select('*')
            .order('created_at', { ascending: false }),
          supabase
            .from('oferta_laboral')
            .select('*')
            .order('created_at', { ascending: false }),
        ])

        if (educativas.error) throw educativas.error
        if (laborales.error) throw laborales.error

        const mapped = [
          ...(educativas.data || []).map((e) => ({
            id: e.id,
            titulo: e.nombre_programa,
            descripcion: [e.institucion, e.facultad, e.interes].filter(Boolean).join(' · '),
            activa: true,
            tipo: 'Educación',
            url: e.url_inscripcion,
            created_at: e.created_at,
          })),
          ...(laborales.data || []).map((l) => ({
            id: l.id,
            titulo: l.titulo,
            descripcion: [l.empresa, l.descripcion].filter(Boolean).join(' — '),
            activa: l.activa,
            tipo: l.modalidad || 'Laboral',
            url: l.url_aplicacion,
            created_at: l.created_at,
          })),
        ]

        mapped.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        setOportunidades(mapped)
      } catch (err) {
        console.error('Error fetching oportunidades:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOportunidades()
  }, [])

  return { oportunidades, loading, error }
}
