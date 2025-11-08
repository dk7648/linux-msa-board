import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { serviceLogger } from '@/services/serviceLogger'
import type { ServiceLog } from '@/types/msa'
import '@/styles/Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [logs, setLogs] = useState<ServiceLog[]>([])

  useEffect(() => {
    // 로그 업데이트 (1초마다)
    const interval = setInterval(() => {
      const recentLogs = serviceLogger.getRecentLogs(10)
      setLogs(recentLogs)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/auth')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (!user) {
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>MSA 게시판 대시보드</h1>
        <div className="user-info">
          <div className="user-avatar">{getInitials(user.fullName)}</div>
          <div className="user-details">
            <span className="user-name">{user.fullName}</span>
            <span className="user-email">{user.email}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-grid">
          <div className="stat-card">
            <h3>총 서비스 호출</h3>
            <div className="value">{logs.length}</div>
          </div>

          <div className="stat-card">
            <h3>성공한 요청</h3>
            <div className="value">
              {logs.filter((log) => log.status === 'success').length}
            </div>
          </div>

          <div className="stat-card">
            <h3>실패한 요청</h3>
            <div className="value">
              {logs.filter((log) => log.status === 'error').length}
            </div>
          </div>
        </div>

        <div className="service-logs">
          <h2>최근 서비스 호출 로그</h2>
          <div className="log-list">
            {logs.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666' }}>
                아직 로그가 없습니다.
              </p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className={`log-item ${log.status}`}>
                  <div className="log-info">
                    <span className="log-service">{log.serviceName}</span>
                    <span className="log-action">{log.action}</span>
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      {new Date(log.timestamp).toLocaleTimeString('ko-KR')}
                      {log.duration && ` • ${log.duration}ms`}
                    </span>
                  </div>
                  <span className={`log-status ${log.status}`}>
                    {log.status === 'success'
                      ? '성공'
                      : log.status === 'error'
                        ? '실패'
                        : '진행중'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="nav-buttons">
          <button className="nav-button" onClick={() => navigate('/metrics')}>
            📊 실시간 메트릭
          </button>
          <button
            className="nav-button"
            onClick={() => navigate('/msa-visualization')}
          >
            🔍 MSA 시각화
          </button>
          <button className="nav-button" onClick={() => navigate('/articles-list')}>
          <button className="nav-button" onClick={() => navigate('/posts')}>
            📝 게시글
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
