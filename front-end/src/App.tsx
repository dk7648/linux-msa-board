import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Metrics from './pages/Metrics'
import Loading from './components/Loading'
import View from './pages/View'
import Article from './pages/Article'

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <Loading size="lg" text="로딩 중..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

// Public Route Component (redirect if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <Loading size="lg" text="로딩 중..." />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/metrics"
            element={
              <ProtectedRoute>
                <Metrics />
              </ProtectedRoute>
            }
          />
          {/*MSA시각화 추가*/}
          <Route
            path="/msa-visualization"
            element={
              <ProtectedRoute>
                <View />
              </ProtectedRoute>
            }
          />

          <Route
          path="/articles-list"
          element={
            <ProtectedRoute>
              <Article />
            </ProtectedRoute>
          }
        />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
