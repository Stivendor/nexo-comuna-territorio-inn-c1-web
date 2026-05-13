import { useState, useMemo } from 'react'
import { useWaitlist } from '../hooks/useWaitlist'
import { Search } from 'lucide-react'

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

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="section-title">Usuarios</h1>
        <p className="section-subtitle">Comuna 1 - Popular · {usuarios.length} registros</p>
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
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="table-empty">Cargando...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={5} className="table-empty">Sin resultados</td></tr>
            ) : (
              paginated.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.barrio}</td>
                  <td>{u.telefono}</td>
                  <td><span className="badge-c1">C1</span></td>
                  <td>{new Date(u.created_at).toLocaleDateString('es-CO')}</td>
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
