export interface Comment {
  id: number
  articleId: number
  authorId: number
  content: string
  createdAt: string
  updatedAt?: string
}

export interface CreateCommentRequest {
  articleId: number
  authorId: number
  content: string
}
