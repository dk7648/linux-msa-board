import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Auth from './pages/Auth'
import Loading from './components/Loading'
import Article from './pages/Article'
import ArticleWrite from './pages/ArticleWrite'
import ArticleDetail from './pages/ArticleDetail'

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
    return <Navigate to="/posts" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/posts" replace />} />
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <Article />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/write"
            element={
              <ProtectedRoute>
                <ArticleWrite />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts/:id"
            element={
              <ProtectedRoute>
                <ArticleDetail />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/posts" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
