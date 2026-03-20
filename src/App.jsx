import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'

// Pages - semua masih stub, akan diisi satu per satu
import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import PayTaxesPage   from './pages/PayTaxesPage'
import SimulatorPage  from './pages/SimulatorPage'
import KnowledgePage  from './pages/KnowledgePage'
import KnowledgeDetailPage from './pages/KnowledgeDetailPage'
import CommunityPage  from './pages/CommunityPage'
import CommunityDetailPage from './pages/CommunityDetailPage'
import ImpactPage     from './pages/ImpactPage'
import ProfilePage    from './pages/ProfilePage'
import NotFoundPage   from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - tanpa sidebar */}
        <Route path="/"         element={<LandingPage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated routes - dengan sidebar */}
        <Route element={<Layout />}>
          <Route path="/pay-taxes"           element={<PayTaxesPage />} />
          <Route path="/simulator"           element={<SimulatorPage />} />
          <Route path="/knowledge"           element={<KnowledgePage />} />
          <Route path="/knowledge/:id"       element={<KnowledgeDetailPage />} />
          <Route path="/community"           element={<CommunityPage />} />
          <Route path="/community/:id"       element={<CommunityDetailPage />} />
          <Route path="/impact"              element={<ImpactPage />} />
          <Route path="/profile"             element={<ProfilePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}