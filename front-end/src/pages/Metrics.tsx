import { useState, useEffect } from 'react'
import { serviceLogger } from '@/services/serviceLogger'
import type { ServiceLog } from '@/types/msa'
import '@/styles/Metrics.css'

interface ServiceMetrics {
  serviceName: string
  totalRequests: number
  successCount: number
  errorCount: number
  averageResponseTime: number
  successRate: number
}

function calculateMetrics(logs: ServiceLog[]): ServiceMetrics[] {
  const serviceMap = new Map<string, ServiceLog[]>()

  // 서비스별로 로그 그룹화
  logs.forEach((log) => {
    const existing = serviceMap.get(log.serviceName) || []
    serviceMap.set(log.serviceName, [...existing, log])
  })

  // 서비스별 메트릭 계산
  const metrics: ServiceMetrics[] = []

  serviceMap.forEach((serviceLogs, serviceName) => {
    const totalRequests = serviceLogs.length
    const successCount = serviceLogs.filter((log) => log.status === 'success')
      .length
    const errorCount = serviceLogs.filter((log) => log.status === 'error')
      .length

    const completedLogs = serviceLogs.filter((log) => log.duration)
    const averageResponseTime =
      completedLogs.length > 0
        ? completedLogs.reduce((sum, log) => sum + (log.duration || 0), 0) /
          completedLogs.length
        : 0

    const successRate =
      totalRequests > 0 ? (successCount / totalRequests) * 100 : 0

    metrics.push({
      serviceName,
      totalRequests,
      successCount,
      errorCount,
      averageResponseTime: Math.round(averageResponseTime),
      successRate: Math.round(successRate * 100) / 100,
    })
  })

  return metrics
}

function Metrics() {
  const [metrics, setMetrics] = useState<ServiceMetrics[]>([])

  useEffect(() => {
    // 1초마다 메트릭 업데이트
    const interval = setInterval(() => {
      const recentLogs = serviceLogger.getRecentLogs(100)
      const calculatedMetrics = calculateMetrics(recentLogs)
      setMetrics(calculatedMetrics)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getHealthStatus = (successRate: number) => {
    if (successRate >= 95) return 'healthy'
    if (successRate >= 80) return 'warning'
    return 'critical'
  }

  return (
    <div className="metrics-page">
    <div className="metrics-container">
      <h2>📊 실시간 서비스 메트릭</h2>
      <p className="metrics-subtitle">
        MSA 환경에서 각 서비스의 성능 지표를 실시간으로 모니터링합니다
      </p>

      {metrics.length === 0 ? (
        <div className="no-metrics">
          <p>아직 수집된 메트릭이 없습니다.</p>
          <p>로그인하거나 API를 호출하면 메트릭이 표시됩니다.</p>
        </div>
      ) : (
        <div className="metrics-grid">
          {metrics.map((metric) => (
            <div key={metric.serviceName} className="metric-card">
              <div className="metric-header">
                <h3>{metric.serviceName} Service</h3>
                <span
                  className={`health-badge ${getHealthStatus(metric.successRate)}`}
                >
                  {getHealthStatus(metric.successRate) === 'healthy'
                    ? '✓ 정상'
                    : getHealthStatus(metric.successRate) === 'warning'
                      ? '⚠ 주의'
                      : '✗ 위험'}
                </span>
              </div>

              <div className="metric-stats">
                <div className="stat-item">
                  <span className="stat-label">총 요청</span>
                  <span className="stat-value">{metric.totalRequests}</span>
                </div>

                <div className="stat-item">
                  <span className="stat-label">성공</span>
                  <span className="stat-value success">
                    {metric.successCount}
                  </span>
                </div>

                <div className="stat-item">
                  <span className="stat-label">실패</span>
                  <span className="stat-value error">{metric.errorCount}</span>
                </div>

                <div className="stat-item">
                  <span className="stat-label">평균 응답시간</span>
                  <span className="stat-value">
                    {metric.averageResponseTime}ms
                  </span>
                </div>
              </div>

              <div className="success-rate-bar">
                <div className="success-rate-label">
                  <span>성공률</span>
                  <span className="success-rate-value">
                    {metric.successRate}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${getHealthStatus(metric.successRate)}`}
                    style={{ width: `${metric.successRate}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="metrics-info">
        <h3>💡 메트릭이란?</h3>
        <p>
          메트릭은 시스템의 성능을 수치로 표현한 것입니다. MSA 환경에서는 각
          마이크로서비스의 건강 상태를 실시간으로 파악하는 것이 중요합니다.
        </p>
        <ul>
          <li>
            <strong>총 요청:</strong> 서비스가 처리한 전체 요청 수
          </li>
          <li>
            <strong>성공/실패:</strong> 정상 처리된 요청과 에러가 발생한 요청
          </li>
          <li>
            <strong>평균 응답시간:</strong> 요청을 처리하는데 걸린 평균 시간
          </li>
          <li>
            <strong>성공률:</strong> 전체 요청 중 성공한 요청의 비율
          </li>
        </ul>
      </div>
    </div>
    </div>
  )
}

export default Metrics
