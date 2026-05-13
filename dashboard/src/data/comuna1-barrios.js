export const COMUNA_1 = {
  id: 1,
  nombre: 'Popular',
  lat: 6.300,
  lng: -75.550,
  color: '#ef4444',
}

export const BARRIOS_C1 = [
  'Santo Domingo Savio No. 1',
  'Santo Domingo Savio No. 2',
  'Popular No. 1',
  'Popular No. 2',
  'Granizal',
  'Moscú No. 2',
  'Villa Guadalupe',
  'San Pablo',
  'El Compromiso',
  'La Avanzada',
  'Carpinelo',
]

export function perteneceC1(barrio) {
  return BARRIOS_C1.some(
    (b) => b.toLowerCase() === (barrio || '').toLowerCase()
  )
}
