import { useState, useMemo } from 'react'
import { useStats } from '../hooks/useStats'
import { useWaitlist } from '../hooks/useWaitlist'
import { exportToCSV } from '../utils'
import { Users, FileText, BookOpen, Activity, Download, Filter, Eye } from 'lucide-react'

const statCards = [
  { key: 'totalUsuarios', icon: Users, label: 'Usuarios registrados', color: '#3b82f6' },
  { key: 'totalCVs', icon: FileText, label: 'CVs generadas', color: '#10b981' },
  { key: 'totalOportunidades', icon: BookOpen, label: 'Oportunidades activas', color: '#f59e0b' },
  { key: 'webhookRate', icon: Activity, label: 'Tasa de entrega', color: '#ef4444' },
]

export default function OverviewPage() {
  const { stats, loading: statsLoading } = useStats()
  const { usuarios, loading: usersLoading } = useWaitlist()
  const [timeFilter, setTimeFilter] = useState('all')

  const filteredUsers = useMemo(() => {
    if (!usuarios) return []
    if (timeFilter === 'all') return usuarios

    const now = new Date()
    const days = timeFilter === '7d' ? 7 : 30
    const cutoff = new Date(now.setDate(now.getDate() - days))

    return usuarios.filter(u => new Date(u.created_at) >= cutoff)
  }, [usuarios, timeFilter])

  const recentUsers = filteredUsers.slice(0, 10)

  const handleExport = () => {
    const dataToExport = filteredUsers.map(u => ({
      ID: u.id,
      Nombre: u.nombre,
      Barrio: u.barrio,
      Telefono: u.telefono,
      Fecha_Registro: new Date(u.created_at).toLocaleString('es-CO')
    }))
    exportToCSV(dataToExport, `Usuarios_CamelloBot_${timeFilter}`)
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="section-title">Resumen</h1>
          <p className="section-subtitle">Comuna 1 - Popular · Panorama general</p>
        </div>
        <div className="filter-bar" style={{ marginBottom: 0, padding: '0.5rem 0.8rem' }}>
          <Filter size={16} />
          <select 
            className="filter-select" 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="all">Todo el tiempo</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map(({ key, icon: Icon, label, color }) => (
          <div key={key} className="stat-card" style={{ borderTopColor: color }}>
            <div className="stat-header">
              <Icon size={20} color={color} />
              <span className="stat-label">{label}</span>
            </div>
            <div className="stat-value">
              {statsLoading ? (
                <div className="skeleton" style={{ height: '32px', width: '60px', borderRadius: '4px' }}></div>
              ) : (
                <>
                  {stats?.[key] ?? 0}
                  {key === 'webhookRate' && stats && '%'}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="section-block">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="block-title" style={{ marginBottom: 0 }}>Usuarios recientes · C1</h2>
          <button className="btn-ghost" onClick={handleExport} disabled={usersLoading || filteredUsers.length === 0}>
            <Download size={16} />
            Exportar CSV
          </button>
        </div>
        
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Barrio</th>
                <th>Teléfono</th>
                <th>Registro</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td><div className="skeleton skeleton-text" style={{ width: '80%' }}></div></td>
                    <td><div className="skeleton skeleton-text" style={{ width: '60%' }}></div></td>
                    <td><div className="skeleton skeleton-text" style={{ width: '50%' }}></div></td>
                    <td><div className="skeleton skeleton-text" style={{ width: '40%' }}></div></td>
                    <td style={{ textAlign: 'right' }}><div className="skeleton skeleton-text" style={{ width: '32px', display: 'inline-block' }}></div></td>
                  </tr>
                ))
              ) : recentUsers.length === 0 ? (
                <tr><td colSpan={5} className="table-empty">No hay usuarios registrados en este periodo</td></tr>
              ) : (
                recentUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="cell-active">{u.nombre}</td>
                    <td>{u.barrio}</td>
                    <td>{u.telefono}</td>
                    <td>{new Date(u.created_at).toLocaleDateString('es-CO')}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-icon" title="Ver detalles (Próximamente)">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

