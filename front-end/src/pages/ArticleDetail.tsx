import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { articleApi } from '@/api/article'
import { commentApi } from '@/api/comment'
import { getUserDisplayName } from '@/utils/userDisplay'
import type { Article } from '@/types/article'
import type { Comment } from '@/types/comment'
import '@/styles/ArticleDetail.css'

const ArticleDetail: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 댓글 관련 상태
  const [comments, setComments] = useState<Comment[]>([])
  const [commentContent, setCommentContent] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  
  // 사용자 이름 캐시
  const [userNames, setUserNames] = useState<Record<number, string>>({})
  
  // 조회수 중복 증가 방지
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (id && !hasLoaded.current) {
      hasLoaded.current = true
      fetchArticle(Number(id))
      fetchComments(Number(id))
    }
  }, [id])
  
  // 사용자 이름 로드
  useEffect(() => {
    const loadUserNames = async () => {
      const userIds = new Set<number>()
      if (article) userIds.add(article.userId)
      comments.forEach((comment) => userIds.add(comment.authorId))
      
      const names: Record<number, string> = {}
      for (const userId of userIds) {
        if (!userNames[userId]) {
          names[userId] = await getUserDisplayName(userId)
        }
      }
      
      if (Object.keys(names).length > 0) {
        setUserNames((prev) => ({ ...prev, ...names }))
      }
    }
    
    if (article || comments.length > 0) {
      void loadUserNames()
    }
  }, [article, comments])

  const fetchArticle = async (articleId: number) => {
    try {
      setLoading(true)
      setError(null)
      const data = await articleApi.getArticle(articleId)
      setArticle(data)
    } catch (err) {
      console.error('Failed to fetch article:', err)
      setError('게시글을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async (articleId: number) => {
    try {
      const data = await commentApi.getCommentsByArticle(articleId)
      setComments(data)
    } catch (err) {
      console.error('Failed to fetch comments:', err)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!commentContent.trim() || !article || !user) return
    
    try {
      setIsSubmittingComment(true)
      await commentApi.createComment({
        articleId: article.id,
        authorId: user.id,
        content: commentContent.trim(),
      })
      setCommentContent('')
      await fetchComments(article.id)
    } catch (err) {
      console.error('Failed to create comment:', err)
      alert('댓글 작성에 실패했습니다.')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?') || !article) return
    
    try {
      await commentApi.deleteComment(commentId)
      await fetchComments(article.id)
    } catch (err) {
      console.error('Failed to delete comment:', err)
      alert('댓글 삭제에 실패했습니다.')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleDelete = async () => {
    if (!article) return
    
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await articleApi.deleteArticle(article.id)
        alert('삭제되었습니다.')
        navigate('/posts')
      } catch (err) {
        console.error('Failed to delete article:', err)
        alert('삭제에 실패했습니다.')
      }
    }
  }

  const handleEdit = () => {
    if (article) {
      navigate(`/posts/${article.id}/edit`)
    }
  }

  const handleBack = () => {
    navigate('/posts')
  }

  const getUserInitial = () => {
    if (!user) return '?'
    return user.fullName?.[0] || user.username?.[0] || '?'
  }

  const canModify = article && user && article.userId === user.id

  return (
    <>
      <header className="main-header">
        <h1>게시글 상세</h1>
        <div className="user-profile">
          <div className="user-avatar">{getUserInitial()}</div>
          <div className="user-info">
            <span className="username">
              {user?.fullName || user?.username || '사용자'}
            </span>
            <span className="email">{user?.email || ''}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </header>

      <main className="container">
        {loading ? (
          <div className="loading-message">게시글을 불러오는 중...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : article ? (
          <div className="card detail-card">
            <div className="article-header">
              <h2 className="article-title">{article.title}</h2>
              <div className="article-meta">
                <span className="author">
                  작성자:{' '}
                  {userNames[article.userId] || `사용자 ${article.userId}`}
                </span>
                <span className="date">
                  {new Date(article.createdAt).toLocaleString('ko-KR')}
                </span>
                <span className="views">조회수: {article.viewCount}</span>
              </div>
            </div>

            <div className="article-content">
              {article.content}
            </div>

            <div className="article-actions">
              <button className="btn btn-back" onClick={handleBack}>
                목록으로
              </button>
              {canModify && (
                <div className="modify-buttons">
                  <button className="btn btn-edit" onClick={handleEdit}>
                    수정
                  </button>
                  <button className="btn btn-delete" onClick={handleDelete}>
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="error-message">게시글을 찾을 수 없습니다.</div>
        )}

        {/* 댓글 섹션 */}
        {article && (
          <div className="card comments-card">
            <h3 className="comments-title">댓글 {comments.length}</h3>
            
            {/* 댓글 작성 폼 */}
            <form onSubmit={handleSubmitComment} className="comment-form">
              <textarea
                className="comment-input"
                placeholder="댓글을 입력하세요..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                rows={3}
                disabled={isSubmittingComment}
              />
              <button
                type="submit"
                className="btn btn-comment-submit"
                disabled={isSubmittingComment || !commentContent.trim()}
              >
                {isSubmittingComment ? '작성 중...' : '댓글 작성'}
              </button>
            </form>

            {/* 댓글 목록 */}
            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="no-comments">첫 댓글을 작성해보세요!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.commentId} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">
                        {userNames[comment.authorId] ||
                          `사용자 ${comment.authorId}`}
                      </span>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleString('ko-KR')}
                      </span>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                    {user && user.id === comment.authorId && (
                      <button
                        className="btn btn-comment-delete"
                        onClick={() => handleDeleteComment(comment.commentId)}
                      >
                        삭제
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <nav className="bottom-nav">
          <button className="nav-button">📊 실시간 매트릭</button>
          <button className="nav-button">🔍 MSA 시각화</button>
          <button className="nav-button active">📋 게시글</button>
        </nav>
      </main>
    </>
  )
}

export default ArticleDetail
