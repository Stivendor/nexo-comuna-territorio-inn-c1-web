import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from './supabaseClient'
import { useTheme } from './ThemeContext'
import {
  LayoutDashboard, Users, FileText, BookOpen, MapPin, BarChart3, Settings, LogOut, Moon, Sun, Menu, X
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
  const location = useLocation()
  const { dark, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  return (
    <div className="layout">
      {/* Mobile Header (Top Bar) */}
      <div className="mobile-header">
        <div className="sidebar-brand">
          <span className="brand-icon">🐪</span>
          <div>
            <span className="brand-name">CamelloBot</span>
          </div>
        </div>
        <button className="btn-icon" onClick={toggleMobileMenu} style={{ border: 'none', background: 'transparent' }}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
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
