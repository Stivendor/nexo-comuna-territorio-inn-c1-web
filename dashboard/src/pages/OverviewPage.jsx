import { useStats } from '../hooks/useStats'
import { useWaitlist } from '../hooks/useWaitlist'
import { Users, FileText, BookOpen, Activity } from 'lucide-react'

const statCards = [
  { key: 'totalUsuarios', icon: Users, label: 'Usuarios registrados', color: '#3b82f6' },
  { key: 'totalCVs', icon: FileText, label: 'CVs generadas', color: '#10b981' },
  { key: 'totalOportunidades', icon: BookOpen, label: 'Oportunidades activas', color: '#f59e0b' },
  { key: 'webhookRate', icon: Activity, label: 'Tasa de entrega', color: '#ef4444' },
]

export default function OverviewPage() {
  const { stats, loading: statsLoading } = useStats()
  const { usuarios, loading: usersLoading } = useWaitlist()

  const recentUsers = usuarios.slice(0, 10)

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="section-title">Resumen</h1>
        <p className="section-subtitle">Comuna 1 - Popular · Panorama general</p>
      </div>

      <div className="stats-grid">
        {statCards.map(({ key, icon: Icon, label, color }) => (
          <div key={key} className="stat-card" style={{ borderTopColor: color }}>
            <div className="stat-header">
              <Icon size={20} color={color} />
              <span className="stat-label">{label}</span>
            </div>
            <div className="stat-value">
              {statsLoading ? '...' : (stats?.[key] ?? 0)}
              {key === 'webhookRate' && stats && '%'}
            </div>
          </div>
        ))}
      </div>

      <div className="section-block">
        <h2 className="block-title">Usuarios recientes · C1</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Barrio</th>
                <th>Teléfono</th>
                <th>Registro</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading ? (
                <tr><td colSpan={4} className="table-empty">Cargando...</td></tr>
              ) : recentUsers.length === 0 ? (
                <tr><td colSpan={4} className="table-empty">No hay usuarios registrados aún</td></tr>
              ) : (
                recentUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nombre}</td>
                    <td>{u.barrio}</td>
                    <td>{u.telefono}</td>
                    <td>{new Date(u.created_at).toLocaleDateString('es-CO')}</td>
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
