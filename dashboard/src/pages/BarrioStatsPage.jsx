import { useState, useMemo } from 'react'
import { useWaitlist } from '../hooks/useWaitlist'
import { useCVs } from '../hooks/useCVs'
import { useUbicaciones } from '../hooks/useUbicaciones'
import { BARRIOS_C1 } from '../data/comuna1-barrios'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid
} from 'recharts'
import { TrendingUp, TrendingDown, Minus, Filter } from 'lucide-react'

const TIPO_LABELS = {
  empleo: 'Empleo',
  educacion: 'Educación',
  servicio: 'Servicio',
}

const BARRIO_COORDS = {
  'Santo Domingo Savio No. 1': [6.29709, -75.54431],
  'Santo Domingo Savio No. 2': [6.29947, -75.54010],
  'Granizal': [6.29290, -75.54684],
  'Moscú No. 2': [6.28998, -75.54909],
  'Villa Guadalupe': [6.28727, -75.55167],
  'San Pablo': [6.28712, -75.54562],
  'El Compromiso': [6.28788, -75.54361],
  'La Avanzada': [6.29467, -75.53895],
  'Carpinelo': [6.28909, -75.53892],
}

const COMUNA_CENTER = [6.29334, -75.54482]

function monthOverMonth(items) {
  const now = new Date()
  const currM = now.getMonth()
  const currY = now.getFullYear()
  const prevM = currM === 0 ? 11 : currM - 1
  const prevY = currM === 0 ? currY - 1 : currY

  let curr = 0, prev = 0
  for (const item of items) {
    const d = new Date(item.created_at)
    if (d.getMonth() === currM && d.getFullYear() === currY) curr++
    else if (d.getMonth() === prevM && d.getFullYear() === prevY) prev++
  }

  if (prev === 0 && curr === 0) return { change: 0, label: '0%', direction: 'neutral' }
  if (prev === 0) return { change: 100, label: '+100%', direction: 'up' }

  const pct = ((curr - prev) / prev) * 100
  const direction = pct > 0 ? 'up' : pct < 0 ? 'down' : 'neutral'
  return {
    change: pct,
    label: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`,
    direction,
  }
}

function countByBarrio(list, field = 'barrio') {
  const counts = {}
  for (const item of list) {
    const b = item[field]
    if (b) counts[b] = (counts[b] || 0) + 1
  }
  return counts
}

function sumUbicacionesByBarrio(list) {
  const counts = {}
  for (const item of list) {
    if (item.barrio) counts[item.barrio] = (counts[item.barrio] || 0) + (item.conteo || 1)
  }
  return counts
}

function topSkillByBarrio(list) {
  const skills = {}
  for (const item of list) {
    if (!item.barrio) continue
    if (!skills[item.barrio]) skills[item.barrio] = {}
    const tipo = item.tipo_demanda || 'otro'
    skills[item.barrio][tipo] = (skills[item.barrio][tipo] || 0) + (item.conteo || 1)
  }
  const result = {}
  for (const [barrio, tipos] of Object.entries(skills)) {
    const sorted = Object.entries(tipos).sort((a, b) => b[1] - a[1])
    result[barrio] = sorted[0] ? sorted[0][0] : null
  }
  return result
}

function getDemandByTipo(ubicaciones, tipoFilter) {
  if (!tipoFilter) return sumUbicacionesByBarrio(ubicaciones)
  const filtered = ubicaciones.filter(u => u.tipo_demanda === tipoFilter)
  return sumUbicacionesByBarrio(filtered)
}

function KpiChange({ mom }) {
  if (mom.direction === 'up') return <span className="kpi-change kpi-up"><TrendingUp size={14} /> {mom.label}</span>
  if (mom.direction === 'down') return <span className="kpi-change kpi-down"><TrendingDown size={14} /> {mom.label}</span>
  return <span className="kpi-change kpi-neutral"><Minus size={14} /> {mom.label}</span>
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name === 'usuarios' ? 'Usuarios' : 'CVs'}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function BarrioStatsPage() {
  const { usuarios, loading: loadingUsers } = useWaitlist()
  const { cvs, loading: loadingCVs } = useCVs()
  const { ubicaciones, loading: loadingUbicaciones } = useUbicaciones()

  const [sectorFilter, setSectorFilter] = useState('')

  const loading = loadingUsers || loadingCVs || loadingUbicaciones

  const userCounts = useMemo(() => countByBarrio(usuarios), [usuarios])
  const cvCounts = useMemo(() => countByBarrio(cvs), [cvs])
  const ubicCounts = useMemo(() => getDemandByTipo(ubicaciones, sectorFilter), [ubicaciones, sectorFilter])
  const topSkills = useMemo(() => topSkillByBarrio(ubicaciones), [ubicaciones])

  const totalUsuarios = usuarios.length
  const totalCVs = cvs.length
  const totalUbicaciones = ubicaciones.length
  const conversionRate = totalUsuarios > 0 ? ((totalCVs / totalUsuarios) * 100).toFixed(1) : '0.0'

  const userMom = useMemo(() => monthOverMonth(usuarios), [usuarios])
  const cvMom = useMemo(() => monthOverMonth(cvs), [cvs])

  const sectorTypes = useMemo(() => {
    const types = new Set()
    for (const u of ubicaciones) {
      if (u.tipo_demanda) types.add(u.tipo_demanda)
    }
    return Array.from(types).sort()
  }, [ubicaciones])

  const barChartData = useMemo(() => {
    return BARRIOS_C1.map(name => ({
      name,
      usuarios: userCounts[name] || 0,
      cvs: cvCounts[name] || 0,
    }))
  }, [userCounts, cvCounts])

  const sortedByUsers = useMemo(() => [...barChartData].sort((a, b) => b.usuarios - a.usuarios), [barChartData])
  const sortedByCVs = useMemo(() => [...barChartData].sort((a, b) => b.cvs - a.cvs), [barChartData])

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="section-title">Estadísticas por barrio</h1>
        <p className="section-subtitle">Comuna 1 - Popular · Panel de talento local</p>
      </div>

      <div className="stats-grid kpi-grid">
        <div className="stat-card" style={{ borderTopColor: '#3b82f6' }}>
          <div className="stat-header">
            <span className="stat-label">Usuarios registrados</span>
          </div>
          <div className="stat-value">{totalUsuarios}</div>
          <KpiChange mom={userMom} />
        </div>
        <div className="stat-card" style={{ borderTopColor: '#10b981' }}>
          <div className="stat-header">
            <span className="stat-label">CVs generadas</span>
          </div>
          <div className="stat-value">{totalCVs}</div>
          <KpiChange mom={cvMom} />
        </div>
        <div className="stat-card" style={{ borderTopColor: '#8b5cf6' }}>
          <div className="stat-header">
            <span className="stat-label">Tasa de conversión</span>
          </div>
          <div className="stat-value">{conversionRate}%</div>
          <div className="kpi-sub">Usuarios que completaron su CV</div>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#f59e0b' }}>
          <div className="stat-header">
            <span className="stat-label">Ubicaciones</span>
          </div>
          <div className="stat-value">{totalUbicaciones}</div>
          <div className="kpi-sub">Puntos de demanda registrados</div>
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Cargando estadísticas...</p>
      ) : (
        <>
          {sectorTypes.length > 0 && (
            <div className="filter-bar">
              <Filter size={16} />
              <span className="filter-label">Filtrar por sector:</span>
              <select
                className="filter-select"
                value={sectorFilter}
                onChange={e => setSectorFilter(e.target.value)}
              >
                <option value="">Todos los sectores</option>
                {sectorTypes.map(t => (
                  <option key={t} value={t}>{TIPO_LABELS[t] || t}</option>
                ))}
              </select>
              {sectorFilter && (
                <button className="filter-clear" onClick={() => setSectorFilter('')}>
                  Limpiar filtro
                </button>
              )}
            </div>
          )}

          <div className="charts-row">
            <div className="chart-card">
              <h3 className="chart-title">Usuarios por barrio</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={sortedByUsers} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#888', fontSize: 12 }} axisLine={{ stroke: '#2e2e2e' }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#c8c8c8', fontSize: 11 }} width={150} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="usuarios" radius={[0, 4, 4, 0]} maxBarSize={18}>
                    {sortedByUsers.map((entry, i) => (
                      <Cell key={i} fill={entry.usuarios > 0 ? '#3b82f6' : '#2e2e2e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <h3 className="chart-title">CVs generadas por barrio</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={sortedByCVs} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#888', fontSize: 12 }} axisLine={{ stroke: '#2e2e2e' }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#c8c8c8', fontSize: 11 }} width={150} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="cvs" radius={[0, 4, 4, 0]} maxBarSize={18}>
                    {sortedByCVs.map((entry, i) => (
                      <Cell key={i} fill={entry.cvs > 0 ? '#10b981' : '#2e2e2e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="map-table-row">
            <div className="mini-map-container">
              <h3 className="chart-title">Concentración de talento</h3>
              <div className="mini-map">
                <MapContainer center={COMUNA_CENTER} zoom={13} className="map-leaflet" zoomControl={false} dragging={false} scrollWheelZoom={false} doubleClickZoom={false} touchZoom={false} keyboard={false}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {Object.entries(BARRIO_COORDS).map(([barrio, coords]) => {
                    const u = userCounts[barrio] || 0
                    const c = cvCounts[barrio] || 0
                    const total = u + c
                    const radius = total > 0 ? 6 + Math.min(total * 3, 20) : 3
                    return (
                      <CircleMarker
                        key={barrio}
                        center={coords}
                        radius={radius}
                        pathOptions={{
                          color: total > 0 ? '#10b981' : '#444',
                          fillColor: total > 0 ? '#10b981' : '#444',
                          fillOpacity: total > 0 ? 0.6 : 0.15,
                        }}
                      >
                        <Popup>
                          <strong>{barrio}</strong><br />
                          Usuarios: {u}<br />
                          CVs: {c}<br />
                          <strong>Total: {total}</strong>
                        </Popup>
                      </CircleMarker>
                    )
                  })}
                </MapContainer>
              </div>
            </div>

            <div className="table-wrap" style={{ flex: 1 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Barrio</th>
                    <th>Usuarios</th>
                    <th>CVs</th>
                    <th>Tasa Conv.</th>
                    <th>Talento</th>
                    <th>Top Habilidad</th>
                    <th>Ubicaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {BARRIOS_C1.map((barrio) => {
                    const users = userCounts[barrio] || 0
                    const cvsCount = cvCounts[barrio] || 0
                    const ubics = ubicCounts[barrio] || 0
                    const hasData = users > 0 || cvsCount > 0
                    const tasa = users > 0 ? ((cvsCount / users) * 100).toFixed(0) : null
                    const topSkill = topSkills[barrio]
                    return (
                      <tr key={barrio} className={hasData ? 'row-active' : 'row-inactive'}>
                        <td className="barrio-name">{barrio}</td>
                        <td className={users > 0 ? 'cell-active' : 'cell-empty'}>{users > 0 ? users : '—'}</td>
                        <td className={cvsCount > 0 ? 'cell-active' : 'cell-empty'}>{cvsCount > 0 ? cvsCount : '—'}</td>
                        <td className={tasa !== null ? 'cell-active' : 'cell-empty'}>{tasa !== null ? `${tasa}%` : '—'}</td>
                        <td>
                          {cvsCount > 0 ? (
                            <span className="badge-talento">Disponible</span>
                          ) : (
                            <span className="cell-empty">—</span>
                          )}
                        </td>
                        <td>
                          {topSkill ? (
                            <span className={`badge-skill badge-${topSkill}`}>
                              {TIPO_LABELS[topSkill] || topSkill}
                            </span>
                          ) : (
                            <span className="cell-empty">—</span>
                          )}
                        </td>
                        <td className={ubics > 0 ? 'cell-active' : 'cell-empty'}>{ubics > 0 ? ubics : '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
