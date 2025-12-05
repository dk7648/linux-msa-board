import React from 'react'
import '@/styles/Article.css'

// 발표용 Mock 데이터 (기존 HTML 테이블 내용을 배열로 변환)
const postData = [
  {
    id: 5,
    title: 'MSA 시각화 서비스 구현 피드백 요청',
    author: '김영한',
    date: '2023.10.26',
    views: 124,
  },
  {
    id: 4,
    title: '게시판 서비스 성능 개선 방안 토의',
    author: '박지민',
    date: '2023.10.25',
    views: 201,
  },
  {
    id: 3,
    title: 'JWT 기반 인증 시스템 도입 가이드',
    author: '이현수',
    date: '2023.10.24',
    views: 350,
  },
  {
    id: 2,
    title: 'Docker & Kubernetes 환경에서 MSA 구축하기',
    author: '최원호',
    date: '2023.10.23',
    views: 410,
  },
  {
    id: 1,
    title: 'MSA 아키텍처 도입을 위한 첫걸음',
    author: '김태희',
    date: '2023.10.22',
    views: 500,
  },
]

// 페이지네이션 Mock 데이터
const paginationData = [
  { page: '1', active: true },
  { page: '2', active: false },
  { page: '3', active: false },
  { page: '다음 »', active: false },
]

const Article: React.FC = () => {
  return (
    <>
      <header className="main-header">
        <h1>게시글 목록</h1>
        <div className="user-profile">
          <div className="user-avatar">테</div>
          <div className="user-info">
            <span className="username">테스트 사용자</span>
            <span className="email">test@example.com</span>
          </div>
          <button className="logout-btn">로그아웃</button>
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
              />
              <button className="search-btn">🔍 검색</button>
            </div>
            <button className="write-post-btn">📝 새 글 작성</button>
          </div>

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
              {postData.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.title}</td>
                  <td>{post.author}</td>
                  <td>{post.date}</td>
                  <td>{post.views}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            {paginationData.map((item, index) => (
              <button
                key={index}
                className={`page-btn ${item.active ? 'active' : ''}`}
              >
                {item.page}
              </button>
            ))}
          </div>
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
