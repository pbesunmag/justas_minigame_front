import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { ArenaPage } from './pages/ArenaPage'
import { ArmoryPage } from './pages/ArmoryPage'
import { CampHubPage } from './pages/CampHubPage'
import { LoginPage } from './pages/LoginPage'
import { NewGameFlowPage } from './pages/NewGameFlowPage'
import { SaveSlotsPage } from './pages/SaveSlotsPage'

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/saves" element={<SaveSlotsPage />} />
            <Route path="/new-game" element={<NewGameFlowPage />} />
            <Route path="/camp/:saveId" element={<CampHubPage />} />
            <Route path="/camp/:saveId/armory" element={<ArmoryPage />} />
            <Route path="/camp/:saveId/arena" element={<ArenaPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/saves" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
