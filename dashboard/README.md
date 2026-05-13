# CamelloBot Dashboard — Comuna 1 - Popular

> Panel de administración del ecosistema Nexo-Comuna para la **Comuna 1 - Popular** de Medellín.

## Stack

- **React 19** + **Vite 8**
- **Supabase** (autenticación + datos en tiempo real)
- **React Router v7** (6 páginas protegidas)
- **Leaflet** + **react-leaflet** (mapa de calor de la C1)
- **Lucide React** (iconos)
- Diseño **mobile-first** con modo oscuro por defecto

## Páginas

| Ruta | Descripción |
|---|---|
| `/login` | Inicio de sesión con Supabase Auth |
| `/dashboard` | Resumen con estadísticas y usuarios recientes de la C1 |
| `/dashboard/waitlist` | Tabla de usuarios filtrada por Comuna 1 - Popular |
| `/dashboard/cvs` | CVs generadas por habitantes de la C1 |
| `/dashboard/oportunidades` | Oportunidades educativas y laborales |
| `/dashboard/mapa` | Mapa de calor centrado en Popular |
| `/dashboard/configuracion` | Configuración del webhook e info del proyecto |

## Filtro C1

Todos los hooks de datos (`useStats`, `useWaitlist`, `useCVs`, `useUbicaciones`) filtran por `comuna = 'Popular'` en Supabase. El mapa está centrado en las coordenadas de la Comuna 1 - Popular.

## Barrios incluidos

Santo Domingo Savio No. 1 y No. 2, Popular No. 1 y No. 2, Granizal, Moscú No. 2, Villa Guadalupe, San Pablo, El Compromiso, La Avanzada, Carpinelo.

## Desarrollo

```bash
npm install
cp .env.example .env  # configurar credenciales de Supabase
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Ecosistema

| Componente | Repositorio |
|---|---|
| **Landing Page** | [`landing-territorio-inn-c1`](https://github.com/Stivendor/landing-territorio-inn-c1) |
| **Dashboard** | `dashboard-territorio-inn-c1-` (este repo) |
| **CamelloBot (C1)** | (https://github.com/Stivendor/camellobot-territorio-inn-c1) |

---

_Construido con ❤️ para la Comuna 1 - Popular de Medellín._
