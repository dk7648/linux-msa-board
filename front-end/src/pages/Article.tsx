import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { articleApi } from '@/api/article'
import type { Article as ArticleType } from '@/types/article'
import '@/styles/Article.css'

const Article: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  // 상태 관리
  const [articles, setArticles] = useState<ArticleType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10

  // 게시글 목록 가져오기
  const fetchArticles = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await articleApi.getArticles({
        page: currentPage - 1,  // Spring은 0-based 페이지
        size: pageSize,
        search: searchQuery || undefined,
      })
      setArticles(response.content || [])
      setTotalPages(response.totalPages || 1)
    } catch (err) {
      console.error('Failed to fetch articles:', err)
      setError('게시글을 불러오는데 실패했습니다.')
      setArticles([])  // 에러 시 빈 배열 설정
    } finally {
      setLoading(false)
    }
  }

  // 페이지 변경 시 게시글 다시 가져오기
  useEffect(() => {
    fetchArticles()
  }, [currentPage, searchQuery])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // 검색 처리
  const handleSearch = () => {
    setCurrentPage(1) // 검색 시 첫 페이지로
    fetchArticles()
  }

  // 검색어 입력 시 엔터키 처리
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // 게시글 작성 페이지로 이동
  const handleWritePost = () => {
    navigate('/posts/write')
  }

  // 게시글 상세보기
  const handleViewPost = (id: number) => {
    navigate(`/posts/${id}`)
  }

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 사용자 이름에서 첫 글자 추출 (아바타용)
  const getUserInitial = () => {
    if (!user) return '?'
    return user.fullName?.[0] || user.username?.[0] || '?'
  }

  return (
    <>
      <header className="main-header">
        <h1>게시글 목록</h1>
        <div className="user-profile">
          <div className="user-avatar">{getUserInitial()}</div>
          <div className="user-info">
            <span className="username">{user?.fullName || user?.username || '사용자'}</span>
            <span className="email">{user?.email || ''}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </header>

      <main className="container">
        <h2 className="content-title">최신 게시글</h2>

        <div className="card post-list-card">
          <div className="card-header-actions">
            <div className="search-filter">
              <input
                type="text"
                placeholder="검색어를 입력하세요..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
              />
              <button className="search-btn" onClick={handleSearch}>
                🔍 검색
              </button>
            </div>
            <button className="write-post-btn" onClick={handleWritePost}>
              📝 새 글 작성
            </button>
          </div>

          {loading ? (
            <div className="loading-message">게시글을 불러오는 중...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : !articles || articles.length === 0 ? (
            <div className="empty-message">게시글이 없습니다.</div>
          ) : (
            <>
              <table className="post-table">
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>조회수</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr
                      key={article.id}
                      onClick={() => handleViewPost(article.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{article.id}</td>
                      <td>{article.title}</td>
                      <td>사용자 {article.userId}</td>
                      <td>
                        {new Date(article.createdAt).toLocaleDateString(
                          'ko-KR'
                        )}
                      </td>
                      <td>{article.viewCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  « 이전
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`page-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  다음 »
                </button>
              </div>
            </>
          )}
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

export default Article
