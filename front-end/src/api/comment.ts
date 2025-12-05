import client from './client'
import type { Comment, CreateCommentRequest } from '@/types/comment'

const COMMENT_SERVICE_URL = '/comments'

export const commentApi = {
  // 게시글의 댓글 목록 조회
  getCommentsByArticle: async (articleId: number): Promise<Comment[]> => {
    const response = await client.get<Comment[]>(
      `${COMMENT_SERVICE_URL}/article/${articleId}`
    )
    return response.data
  },

  // 댓글 작성
  createComment: async (data: CreateCommentRequest): Promise<Comment> => {
    const response = await client.post<Comment>(COMMENT_SERVICE_URL + '/', data)
    return response.data
  },

  // 댓글 삭제
  deleteComment: async (id: number): Promise<void> => {
    await client.delete(`${COMMENT_SERVICE_URL}/${id}`)
  },
}
