import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import { useTheme } from './ThemeContext'
import {
  LayoutDashboard, Users, FileText, BookOpen, MapPin, BarChart3, Settings, LogOut, Moon, Sun
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Resumen', end: true },
  { to: '/dashboard/waitlist', icon: Users, label: 'Usuarios' },
  { to: '/dashboard/cvs', icon: FileText, label: 'CVs Generadas' },
  { to: '/dashboard/oportunidades', icon: BookOpen, label: 'Oportunidades' },
  { to: '/dashboard/mapa', icon: MapPin, label: 'Mapa de calor' },
  { to: '/dashboard/barrios', icon: BarChart3, label: 'Estadísticas x barrio' },
  { to: '/dashboard/configuracion', icon: Settings, label: 'Configuración' },
]

export default function Layout() {
  const navigate = useNavigate()
  const { dark, toggleTheme } = useTheme()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="brand-icon">🐪</span>
            <div>
              <span className="brand-name">CamelloBot</span>
              <span className="brand-sub">Comuna 1 - Popular</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={toggleTheme}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            <span>{dark ? 'Modo claro' : 'Modo oscuro'}</span>
          </button>
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
