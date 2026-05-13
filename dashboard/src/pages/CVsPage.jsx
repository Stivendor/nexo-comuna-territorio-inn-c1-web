import { useCVs } from '../hooks/useCVs'
import { Download, ExternalLink } from 'lucide-react'

export default function CVsPage() {
  const { cvs, loading, error } = useCVs()

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="section-title">CVs Generadas</h1>
        <p className="section-subtitle">Comuna 1 - Popular · {cvs.length} hojas de vida</p>
      </div>

      {error && <p className="error-banner">Error: {error}</p>}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Barrio</th>
              <th>Teléfono</th>
              <th>Fecha</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="table-empty">Cargando...</td></tr>
            ) : cvs.length === 0 ? (
              <tr><td colSpan={5} className="table-empty">No hay CVs generadas aún</td></tr>
            ) : (
              cvs.map((cv) => (
                <tr key={cv.id}>
                  <td>{cv.nombre}</td>
                  <td>{cv.barrio}</td>
                  <td>{cv.telefono}</td>
                  <td>{new Date(cv.created_at).toLocaleDateString('es-CO')}</td>
                  <td>
                    <div className="table-actions">
                      {cv.pdf_url && (
                        <a href={cv.pdf_url} target="_blank" rel="noopener" className="btn-icon" title="Ver PDF">
                          <ExternalLink size={16} />
                        </a>
                      )}
                      {cv.pdf_url && (
                        <a href={cv.pdf_url} download className="btn-icon" title="Descargar">
                          <Download size={16} />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
