// Global type definitions

export interface User {
  id: number
  name: string
  email: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface PaginationParams {
  page: number
  size: number
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}
