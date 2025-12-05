import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import type { User, LoginRequest, RegisterRequest } from '@/types/user'
import { userApi } from '@/api/user'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // 초기 로드 시 사용자 정보 확인
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const currentUser = await userApi.getCurrentUser()
          setUser(currentUser)
        } catch (error) {
          console.error('Failed to get current user:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
        }
      }
      setIsLoading(false)
    }

    void initAuth()
  }, [])

  const login = async (data: LoginRequest) => {
    try {
      const response = await userApi.login(data)
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      const response = await userApi.register(data)
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await userApi.logout()
      setUser(null)
    } catch (error) {
      throw error
    }
  }

  const refreshUser = async () => {
    try {
      const currentUser = await userApi.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Failed to refresh user:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
