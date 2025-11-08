// MSA Visualization Types

export interface MicroService {
  id: string
  name: string
  status: 'active' | 'inactive' | 'error'
  description: string
  endpoint: string
  color: string
}

export interface ServiceConnection {
  from: string
  to: string
  type: 'sync' | 'async'
  description: string
}

export interface ServiceMetrics {
  serviceName: string
  requestCount: number
  errorCount: number
  averageResponseTime: number
  uptime: number
}

export interface MSADashboard {
  services: MicroService[]
  connections: ServiceConnection[]
  metrics: ServiceMetrics[]
  activeLogs: ServiceLog[]
}

// Re-export from user types
export type { ServiceLog, ServiceFlow, ServiceFlowStep } from './user'
