import client from '../api/client'
import type { User } from '../types/user'

// 사용자 정보 캐시
const userCache = new Map<number, string>()
const pendingRequests = new Map<number, Promise<string>>()

export const getUserDisplayName = async (userId: number): Promise<string> => {
  // 캐시에서 먼저 확인
  if (userCache.has(userId)) {
    return userCache.get(userId)!
  }

  // 이미 요청 중인지 확인
  if (pendingRequests.has(userId)) {
    return pendingRequests.get(userId)!
  }

  // 새로운 요청 생성
  const promise = fetchUserName(userId)
  pendingRequests.set(userId, promise)

  try {
    const userName = await promise
    return userName
  } finally {
    pendingRequests.delete(userId)
  }
}

const fetchUserName = async (userId: number): Promise<string> => {
  try {
    const response = await client.get<User>(`/users/${userId}`)
    const userName =
      response.data.fullName || response.data.username || `사용자 ${userId}`
    userCache.set(userId, userName)
    return userName
  } catch (err) {
    console.error(`Failed to fetch user ${userId}:`, err)
    const fallback = `사용자 ${userId}`
    userCache.set(userId, fallback)
    return fallback
  }
}
