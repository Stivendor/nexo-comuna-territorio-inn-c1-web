import { useState, useMemo } from 'react'
import { useCVs } from '../hooks/useCVs'
import { exportToCSV } from '../utils'
import { Download, ExternalLink, Search } from 'lucide-react'

export default function CVsPage() {
  const { cvs, loading, error } = useCVs()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const perPage = 20

  const filtered = useMemo(() => {
    if (!search) return cvs
    const q = search.toLowerCase()
    return cvs.filter(
      (cv) =>
        cv.nombre?.toLowerCase().includes(q) ||
        cv.barrio?.toLowerCase().includes(q) ||
        cv.telefono?.includes(q)
    )
  }, [cvs, search])

  const paginated = filtered.slice(page * perPage, (page + 1) * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  const handleExport = () => {
    const dataToExport = filtered.map(cv => ({
      ID: cv.id,
      Nombre: cv.nombre,
      Barrio: cv.barrio,
      Telefono: cv.telefono,
      PDF_URL: cv.pdf_url || '',
      Fecha_Generacion: new Date(cv.created_at).toLocaleString('es-CO')
    }))
    exportToCSV(dataToExport, 'CVs_CamelloBot_C1')
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="section-title">CVs Generadas</h1>
          <p className="section-subtitle">Comuna 1 - Popular · {cvs.length} hojas de vida</p>
        </div>
        <button className="btn-ghost" onClick={handleExport} disabled={loading || filtered.length === 0}>
          <Download size={16} />
          Exportar CSV
        </button>
      </div>

      <div className="search-bar">
        <Search size={16} />
        <input
          type="text"
          placeholder="Buscar por nombre, barrio o teléfono..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
        />
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
              <th style={{ textAlign: 'right' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  <td><div className="skeleton skeleton-text" style={{ width: '80%' }}></div></td>
                  <td><div className="skeleton skeleton-text" style={{ width: '70%' }}></div></td>
                  <td><div className="skeleton skeleton-text" style={{ width: '50%' }}></div></td>
                  <td><div className="skeleton skeleton-text" style={{ width: '40%' }}></div></td>
                  <td style={{ textAlign: 'right' }}><div className="skeleton skeleton-text" style={{ width: '70px', display: 'inline-block' }}></div></td>
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr><td colSpan={5} className="table-empty">No hay resultados</td></tr>
            ) : (
              paginated.map((cv) => (
                <tr key={cv.id}>
                  <td className="cell-active">{cv.nombre}</td>
                  <td>{cv.barrio}</td>
                  <td>{cv.telefono}</td>
                  <td>{new Date(cv.created_at).toLocaleDateString('es-CO')}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      {cv.pdf_url && (
                        <>
                          <a href={cv.pdf_url} target="_blank" rel="noopener noreferrer" className="btn-icon" title="Ver PDF">
                            <ExternalLink size={16} />
                          </a>
                          <a href={cv.pdf_url} download className="btn-icon" title="Descargar">
                            <Download size={16} />
                          </a>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>Anterior</button>
          <span>Página {page + 1} de {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Siguiente</button>
        </div>
      )}
    </div>
  )
}
