import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { articleApi } from '@/api/article'
import type { Article } from '@/types/article'
import '@/styles/ArticleDetail.css'

const ArticleDetail: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchArticle(Number(id))
    }
  }, [id])

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
                <span className="author">작성자: 사용자 {article.userId}</span>
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
