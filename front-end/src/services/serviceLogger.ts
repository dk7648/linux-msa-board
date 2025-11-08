import type { ServiceLog, ServiceFlow } from '@/types/msa'

// MSA 서비스 로그를 저장하는 메모리 저장소
class ServiceLogger {
  private logs: ServiceLog[] = []
  private flows: ServiceFlow[] = []
  private readonly maxLogs = 100

  // 서비스 로그 추가
  addLog(log: Omit<ServiceLog, 'id' | 'timestamp'>): ServiceLog {
    const newLog: ServiceLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    this.logs.unshift(newLog)

    // 최대 로그 개수 유지
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    return newLog
  }

  // 서비스 플로우 시작
  startFlow(operation: string): string {
    const flowId = `flow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const flow: ServiceFlow = {
      id: flowId,
      operation,
      steps: [],
      startTime: new Date().toISOString(),
      status: 'in-progress',
    }

    this.flows.unshift(flow)
    return flowId
  }

  // 서비스 플로우에 스텝 추가
  addFlowStep(flowId: string, step: Omit<ServiceFlowStep, 'timestamp'>): void {
    const flow = this.flows.find((f) => f.id === flowId)
    if (!flow) return

    const newStep: ServiceFlowStep = {
      ...step,
      timestamp: new Date().toISOString(),
    }

    flow.steps.push(newStep)
  }

  // 서비스 플로우 완료
  completeFlow(flowId: string, status: 'completed' | 'failed'): void {
    const flow = this.flows.find((f) => f.id === flowId)
    if (!flow) return

    flow.endTime = new Date().toISOString()
    flow.status = status

    const start = new Date(flow.startTime).getTime()
    const end = new Date(flow.endTime).getTime()
    flow.totalDuration = end - start
  }

  // 최근 로그 조회
  getRecentLogs(count: number = 50): ServiceLog[] {
    return this.logs.slice(0, count)
  }

  // 서비스별 로그 조회
  getLogsByService(serviceName: string, count: number = 50): ServiceLog[] {
    return this.logs
      .filter((log) => log.serviceName === serviceName)
      .slice(0, count)
  }

  // 최근 플로우 조회
  getRecentFlows(count: number = 20): ServiceFlow[] {
    return this.flows.slice(0, count)
  }

  // 모든 로그 초기화
  clearLogs(): void {
    this.logs = []
    this.flows = []
  }
}

// 싱글톤 인스턴스
export const serviceLogger = new ServiceLogger()

// 서비스 호출 래퍼 (로깅 자동화)
export async function callServiceWithLogging<T>(
  serviceName: ServiceLog['serviceName'],
  action: string,
  apiCall: () => Promise<T>,
  flowId?: string
): Promise<T> {
  const startTime = Date.now()

  // 로그 시작
  const log = serviceLogger.addLog({
    serviceName,
    action,
    status: 'pending',
  })

  // 플로우에 스텝 추가
  if (flowId) {
    serviceLogger.addFlowStep(flowId, {
      service: serviceName,
      action,
      status: 'pending',
    })
  }

  try {
    const result = await apiCall()
    const duration = Date.now() - startTime

    // 성공 로그 업데이트
    log.status = 'success'
    log.duration = duration
    log.responseData = result

    if (flowId) {
      serviceLogger.addFlowStep(flowId, {
        service: serviceName,
        action,
        status: 'success',
        duration,
      })
    }

    return result
  } catch (error) {
    const duration = Date.now() - startTime

    // 에러 로그 업데이트
    log.status = 'error'
    log.duration = duration
    log.error = error instanceof Error ? error.message : 'Unknown error'

    if (flowId) {
      serviceLogger.addFlowStep(flowId, {
        service: serviceName,
        action,
        status: 'error',
        duration,
      })
    }

    throw error
  }
}
