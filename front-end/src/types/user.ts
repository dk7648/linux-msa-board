// ============================================
// User Service Types
// ============================================

export interface User {
  id: number
  email: string
  username: string
  fullName: string
  avatarUrl?: string
  bio?: string
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends User {
  postsCount: number
  commentsCount: number
  followersCount: number
  followingCount: number
}

// ============================================
// Auth Types
// ============================================

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
  fullName: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface TokenPayload {
  userId: number
  email: string
  exp: number
}

// ============================================
// MSA Service Log Types (for visualization)
// ============================================

export interface ServiceLog {
  id: string
  serviceName: 'USER' | 'POST' | 'COMMENT' | 'GATEWAY'
  action: string
  timestamp: string
  status: 'pending' | 'success' | 'error'
  duration?: number
  requestData?: unknown
  responseData?: unknown
  error?: string
}

export interface ServiceFlowStep {
  service: string
  action: string
  status: 'pending' | 'success' | 'error'
  timestamp: string
  duration?: number
}

export interface ServiceFlow {
  id: string
  operation: string
  steps: ServiceFlowStep[]
  startTime: string
  endTime?: string
  totalDuration?: number
  status: 'in-progress' | 'completed' | 'failed'
}
