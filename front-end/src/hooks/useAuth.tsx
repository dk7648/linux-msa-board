import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import type { User, LoginRequest, RegisterRequest } from '@/types/user'
import { userApi } from '@/api/user'
import { serviceLogger, callServiceWithLogging } from '@/services/serviceLogger'

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
          const currentUser = await callServiceWithLogging(
            'USER',
            'GET_CURRENT_USER',
            () => userApi.getCurrentUser()
          )
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
    const flowId = serviceLogger.startFlow('USER_LOGIN')

    try {
      const response = await callServiceWithLogging(
        'USER',
        'LOGIN',
        () => userApi.login(data),
        flowId
      )

      setUser(response.user)
      serviceLogger.completeFlow(flowId, 'completed')
    } catch (error) {
      serviceLogger.completeFlow(flowId, 'failed')
      throw error
    }
  }

  const register = async (data: RegisterRequest) => {
    const flowId = serviceLogger.startFlow('USER_REGISTER')

    try {
      const response = await callServiceWithLogging(
        'USER',
        'REGISTER',
        () => userApi.register(data),
        flowId
      )

      setUser(response.user)
      serviceLogger.completeFlow(flowId, 'completed')
    } catch (error) {
      serviceLogger.completeFlow(flowId, 'failed')
      throw error
    }
  }

  const logout = async () => {
    const flowId = serviceLogger.startFlow('USER_LOGOUT')

    try {
      await callServiceWithLogging(
        'USER',
        'LOGOUT',
        () => userApi.logout(),
        flowId
      )

      setUser(null)
      serviceLogger.completeFlow(flowId, 'completed')
    } catch (error) {
      serviceLogger.completeFlow(flowId, 'failed')
      throw error
    }
  }

  const refreshUser = async () => {
    try {
      const currentUser = await callServiceWithLogging(
        'USER',
        'GET_CURRENT_USER',
        () => userApi.getCurrentUser()
      )
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
