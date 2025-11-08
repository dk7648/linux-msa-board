import type { User, AuthResponse } from '@/types/user'

// Mock Users Database
const mockUsers: User[] = [
  {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    fullName: '테스트 사용자',
    avatarUrl: '',
    bio: 'MSA 게시판 테스트 계정입니다.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    email: 'admin@example.com',
    username: 'admin',
    fullName: '관리자',
    avatarUrl: '',
    bio: '시스템 관리자 계정입니다.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Mock Token
const MOCK_TOKEN = 'mock-jwt-token-' + Date.now()
const MOCK_REFRESH_TOKEN = 'mock-refresh-token-' + Date.now()

export const mockUserApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    // 시뮬레이션 지연
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = mockUsers.find((u) => u.email === email)

    if (!user || password !== 'password') {
      throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
    }

    return {
      user,
      token: MOCK_TOKEN,
      refreshToken: MOCK_REFRESH_TOKEN,
    }
  },

  register: async (
    email: string,
    username: string,
    fullName: string,
    password: string
  ): Promise<AuthResponse> => {
    // 시뮬레이션 지연
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 중복 확인
    if (mockUsers.some((u) => u.email === email)) {
      throw new Error('이미 존재하는 이메일입니다.')
    }

    if (mockUsers.some((u) => u.username === username)) {
      throw new Error('이미 존재하는 사용자명입니다.')
    }

    const newUser: User = {
      id: mockUsers.length + 1,
      email,
      username,
      fullName,
      avatarUrl: '',
      bio: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockUsers.push(newUser)

    return {
      user: newUser,
      token: MOCK_TOKEN,
      refreshToken: MOCK_REFRESH_TOKEN,
    }
  },

  getCurrentUser: async (): Promise<User> => {
    // 시뮬레이션 지연
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 토큰으로부터 사용자 찾기 (실제로는 토큰 디코딩)
    return mockUsers[0]
  },

  logout: async (): Promise<void> => {
    // 시뮬레이션 지연
    await new Promise((resolve) => setTimeout(resolve, 500))
    // 실제로는 서버에 로그아웃 요청
  },
}

// 개발 모드에서 Mock API 사용 여부
export const USE_MOCK_API = import.meta.env.DEV
