import client from './client'
import type {
  User,
  UserProfile,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '@/types/user'
import { mockUserApi, USE_MOCK_API } from '@/mocks/mockUserApi'

const USER_SERVICE_URL = '/v1/users'

export const userApi = {
  // 회원가입
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    // Mock API 사용
    if (USE_MOCK_API) {
      const response = await mockUserApi.register(
        data.email,
        data.username,
        data.fullName,
        data.password
      )
      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      return response
    }

    const response = await client.post<AuthResponse>(
      `${USER_SERVICE_URL}/register`,
      data
    )
    // 토큰 저장
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('refreshToken', response.data.refreshToken)
    }
    return response.data
  },

  // 로그인
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // Mock API 사용
    if (USE_MOCK_API) {
      const response = await mockUserApi.login(data.email, data.password)
      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      return response
    }

    const response = await client.post<AuthResponse>(
      `${USER_SERVICE_URL}/login`,
      data
    )
    // 토큰 저장
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('refreshToken', response.data.refreshToken)
    }
    return response.data
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    // Mock API 사용
    if (USE_MOCK_API) {
      await mockUserApi.logout()
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      return
    }

    await client.post(`${USER_SERVICE_URL}/logout`)
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async (): Promise<User> => {
    // Mock API 사용
    if (USE_MOCK_API) {
      return await mockUserApi.getCurrentUser()
    }

    const response = await client.get<User>(`${USER_SERVICE_URL}/me`)
    return response.data
  },

  // 사용자 프로필 조회
  getUserProfile: async (userId: number): Promise<UserProfile> => {
    const response = await client.get<UserProfile>(
      `${USER_SERVICE_URL}/${userId}/profile`
    )
    return response.data
  },

  // 사용자 정보 수정
  updateUser: async (userId: number, data: Partial<User>): Promise<User> => {
    const response = await client.put<User>(
      `${USER_SERVICE_URL}/${userId}`,
      data
    )
    return response.data
  },

  // 사용자 목록 조회
  getUsers: async (params?: {
    page?: number
    size?: number
    search?: string
  }): Promise<{ users: User[]; total: number }> => {
    const response = await client.get<{ users: User[]; total: number }>(
      USER_SERVICE_URL,
      { params }
    )
    return response.data
  },

  // 사용자 삭제
  deleteUser: async (userId: number): Promise<void> => {
    await client.delete(`${USER_SERVICE_URL}/${userId}`)
  },
}
