import { useOpportunities } from '../hooks/useOpportunities'
import { ExternalLink, Clock } from 'lucide-react'

export default function OpportunitiesPage() {
  const { oportunidades, loading, error } = useOpportunities()

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="section-title">Oportunidades</h1>
        <p className="section-subtitle">Programas y vacantes disponibles para la C1</p>
      </div>

      {error && <p className="error-banner">Error: {error}</p>}

      <div className="card-grid">
        {loading ? (
          <p className="loading-text">Cargando oportunidades...</p>
        ) : oportunidades.length === 0 ? (
          <p className="empty-text">No hay oportunidades registradas</p>
        ) : (
          oportunidades.map((op) => (
            <div key={op.id} className="opportunity-card">
              <div className="opp-header">
                <h3>{op.titulo}</h3>
                <span className={`status-badge ${op.activa ? 'active' : 'inactive'}`}>
                  {op.activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <p className="opp-desc">{op.descripcion}</p>
              <div className="opp-meta">
                <span><Clock size={14} /> {new Date(op.created_at).toLocaleDateString('es-CO')}</span>
                <span>{op.tipo}</span>
              </div>
              {op.url && (
                <a href={op.url} target="_blank" rel="noopener" className="opp-link">
                  <ExternalLink size={14} /> Ver más
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
