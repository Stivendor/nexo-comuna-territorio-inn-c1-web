import { useUbicaciones } from '../hooks/useUbicaciones'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

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

export default function MapaPage() {
  const { ubicaciones, loading } = useUbicaciones()

  const grouped = {}
  for (const u of ubicaciones) {
    if (!grouped[u.barrio]) grouped[u.barrio] = {}
    const tipo = u.tipo_demanda || 'otro'
    grouped[u.barrio][tipo] = (grouped[u.barrio][tipo] || 0) + (u.conteo || 1)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="section-title">Mapa de calor</h1>
        <p className="section-subtitle">Comuna 1 - Popular · Demanda por barrio</p>
      </div>

      {loading ? (
        <p className="loading-text">Cargando datos...</p>
      ) : (
        <div className="map-container">
          <MapContainer center={COMUNA_CENTER} zoom={14} className="map-leaflet">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {Object.entries(BARRIO_COORDS).map(([barrio, coords]) => {
              const tipos = grouped[barrio] || {}
              const total = Object.values(tipos).reduce((a, b) => a + b, 0)
              const radius = total > 0 ? 8 + total * 4 : 4

              return (
                <CircleMarker
                  key={barrio}
                  center={coords}
                  radius={radius}
                  pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: total > 0 ? 0.5 : 0.15 }}
                >
                  <Popup>
                    <strong>{barrio}</strong><br />
                    {total > 0 ? (
                      <>
                        {Object.entries(TIPO_LABELS).map(([k, label]) =>
                          tipos[k] ? <span key={k}>{label}: {tipos[k]}<br /></span> : null
                        )}
                        <strong>Total: {total}</strong>
                      </>
                    ) : (
                      'Sin datos'
                    )}
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </div>
      )}
    </div>
  )
}
