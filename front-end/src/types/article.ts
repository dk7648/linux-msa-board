export interface Article {
  id: number
  title: string
  content: string
  userId: number
  viewCount: number
  createdAt: string
  updatedAt?: string
}

export interface ArticleListResponse {
  content: Article[]  // Spring Page의 content 필드
  totalElements: number
  totalPages: number
  number: number  // 현재 페이지 번호
  size: number
  first: boolean
  last: boolean
}

export interface CreateArticleRequest {
  title: string
  content: string
}

export interface UpdateArticleRequest {
  title?: string
  content?: string
}
