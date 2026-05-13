import { useState, useMemo } from 'react'
import { useWaitlist } from '../hooks/useWaitlist'
import { exportToCSV } from '../utils'
import { Search, Download, Eye, Send } from 'lucide-react'

export default function WaitlistPage() {
  const { usuarios, loading, error } = useWaitlist()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const perPage = 20

  const filtered = useMemo(() => {
    if (!search) return usuarios
    const q = search.toLowerCase()
    return usuarios.filter(
      (u) =>
        u.nombre?.toLowerCase().includes(q) ||
        u.barrio?.toLowerCase().includes(q) ||
        u.telefono?.includes(q)
    )
  }, [usuarios, search])

  const paginated = filtered.slice(page * perPage, (page + 1) * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  const handleExport = () => {
    const dataToExport = filtered.map(u => ({
      ID: u.id,
      Nombre: u.nombre,
      Barrio: u.barrio,
      Telefono: u.telefono,
      Comuna: u.comuna || 'C1',
      Fecha_Registro: new Date(u.created_at).toLocaleString('es-CO')
    }))
    exportToCSV(dataToExport, 'Usuarios_CamelloBot_C1')
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="section-title">Usuarios</h1>
          <p className="section-subtitle">Comuna 1 - Popular · {usuarios.length} registros</p>
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
              <th>Comuna</th>
              <th>Registro</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  <td><div className="skeleton skeleton-text" style={{ width: '80%' }}></div></td>
                  <td><div className="skeleton skeleton-text" style={{ width: '70%' }}></div></td>
                  <td><div className="skeleton skeleton-text" style={{ width: '50%' }}></div></td>
                  <td><div className="skeleton skeleton-text" style={{ width: '30%' }}></div></td>
                  <td><div className="skeleton skeleton-text" style={{ width: '40%' }}></div></td>
                  <td style={{ textAlign: 'right' }}><div className="skeleton skeleton-text" style={{ width: '50px', display: 'inline-block' }}></div></td>
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr><td colSpan={6} className="table-empty">Sin resultados</td></tr>
            ) : (
              paginated.map((u) => (
                <tr key={u.id}>
                  <td className="cell-active">{u.nombre}</td>
                  <td>{u.barrio}</td>
                  <td>{u.telefono}</td>
                  <td><span className="badge-c1">C1</span></td>
                  <td>{new Date(u.created_at).toLocaleDateString('es-CO')}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button className="btn-icon" title="Ver perfil">
                        <Eye size={16} />
                      </button>
                      <button className="btn-icon" title="Enviar mensaje Telegram">
                        <Send size={16} />
                      </button>
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
