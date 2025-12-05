import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { articleApi } from '@/api/article'
import '@/styles/ArticleWrite.css'

const ArticleWrite: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('제목을 입력해주세요.')
      return
    }
    
    if (!content.trim()) {
      setError('내용을 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      
      console.log('[ArticleWrite] Current user object:', user)
      console.log('[ArticleWrite] User ID:', user?.id)
      
      if (!user?.id) {
        setError('로그인 정보가 없습니다.')
        return
      }
      
      console.log('[ArticleWrite] Sending article with userId:', user.id)
      
      await articleApi.createArticle(
        {
          title: title.trim(),
          content: content.trim(),
        },
        user.id
      )
      
      // 작성 완료 후 목록 페이지로 이동
      navigate('/posts')
    } catch (err) {
      console.error('Failed to create article:', err)
      setError('게시글 작성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (window.confirm('작성을 취소하시겠습니까?')) {
      navigate('/posts')
    }
  }

  const getUserInitial = () => {
    if (!user) return '?'
    return user.fullName?.[0] || user.username?.[0] || '?'
  }

  return (
    <>
      <header className="main-header">
        <h1>게시글 작성</h1>
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
        <div className="card write-card">
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="title">제목</label>
              <input
                id="title"
                type="text"
                className="form-input"
                placeholder="제목을 입력하세요..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">내용</label>
              <textarea
                id="content"
                className="form-textarea"
                placeholder="내용을 입력하세요..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={2000}
                rows={15}
                disabled={isSubmitting}
              />
              <div className="char-count">
                {content.length} / 2000
              </div>
            </div>

            <div className="button-group">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                취소
              </button>
              <button
                type="submit"
                className="btn btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? '작성 중...' : '작성 완료'}
              </button>
            </div>
          </form>
        </div>

        <nav className="bottom-nav">
          <button className="nav-button">📊 실시간 매트릭</button>
          <button className="nav-button">🔍 MSA 시각화</button>
          <button className="nav-button active">📋 게시글</button>
        </nav>
      </main>
    </>
  )
}

export default ArticleWrite
