import client from './client'
import type {
  Article,
  ArticleListResponse,
  CreateArticleRequest,
  UpdateArticleRequest,
} from '@/types/article'

const ARTICLE_SERVICE_URL = '/articles'

export const articleApi = {
  // 게시글 목록 조회
  getArticles: async (params?: {
    page?: number
    size?: number
    search?: string
  }): Promise<ArticleListResponse> => {
    const response = await client.get<ArticleListResponse>(
      ARTICLE_SERVICE_URL,
      { params }
    )
    return response.data
  },

  // 게시글 상세 조회
  getArticle: async (id: number): Promise<Article> => {
    const response = await client.get<Article>(`${ARTICLE_SERVICE_URL}/${id}`)
    return response.data
  },

  // 게시글 작성
  createArticle: async (
    data: CreateArticleRequest,
    userId?: number
  ): Promise<Article> => {
    console.log('[articleApi] createArticle called with userId:', userId)
    const headers: Record<string, string> = {}
    if (userId) {
      headers['X-User-Id'] = userId.toString()
      console.log('[articleApi] Setting X-User-Id header:', headers['X-User-Id'])
    }
    console.log('[articleApi] Request headers:', headers)
    const response = await client.post<Article>(ARTICLE_SERVICE_URL, data, {
      headers,
    })
    return response.data
  },

  // 게시글 수정
  updateArticle: async (
    id: number,
    data: UpdateArticleRequest
  ): Promise<Article> => {
    const response = await client.put<Article>(
      `${ARTICLE_SERVICE_URL}/${id}`,
      data
    )
    return response.data
  },

  // 게시글 삭제
  deleteArticle: async (id: number): Promise<void> => {
    await client.delete(`${ARTICLE_SERVICE_URL}/${id}`)
  },
}
