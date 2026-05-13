import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './ThemeContext'
import ProtectedRoute from './ProtectedRoute'
import Layout from './Layout'
import LoginPage from './pages/LoginPage'
import OverviewPage from './pages/OverviewPage'
import WaitlistPage from './pages/WaitlistPage'
import CVsPage from './pages/CVsPage'
import OpportunitiesPage from './pages/OpportunitiesPage'
import MapaPage from './pages/MapaPage'
import BarrioStatsPage from './pages/BarrioStatsPage'
import ConfigPage from './pages/ConfigPage'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OverviewPage />} />
            <Route path="waitlist" element={<WaitlistPage />} />
            <Route path="cvs" element={<CVsPage />} />
            <Route path="oportunidades" element={<OpportunitiesPage />} />
            <Route path="mapa" element={<MapaPage />} />
            <Route path="barrios" element={<BarrioStatsPage />} />
            <Route path="configuracion" element={<ConfigPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
