import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../infrastructure/auth/jwt-auth.guard'
import { RoleGuard } from '../infrastructure/auth/role.guard'
import { Roles } from '../shared/decorators/roles.decorator'
import { LoggerService } from '../infrastructure/mongodb/logger.service'
import { AlertService } from '../infrastructure/monitoring/alert.service'
import { LogContext } from '../infrastructure/mongodb/log.schema'

@Controller('monitoring')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('admin')
export class MonitoringController {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly alertService: AlertService,
  ) {}

  @Get('dashboard')
  async getDashboard() {
    const errorLogs = await this.loggerService.findErrorLogs(50)
    const recentAlerts = this.alertService.getRecentAlerts(20)
    const activeRules = this.alertService.getActiveRules()

    return {
      summary: {
        totalErrorLogs: errorLogs.length,
        totalActiveAlerts: recentAlerts.length,
        totalActiveRules: activeRules.length,
        healthStatus: errorLogs.length < 10 ? 'healthy' : 'warning',
      },
      errorLogs: errorLogs.slice(0, 10), // Últimos 10 erros
      recentAlerts: recentAlerts.slice(0, 5), // Últimos 5 alertas
      activeRules: activeRules,
    }
  }

  @Get('logs')
  async getLogs(
    @Query('context') context?: LogContext,
    @Query('userId') userId?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 100

    if (context) {
      return this.loggerService.findLogsByContext(context, parsedLimit)
    }

    if (userId) {
      return this.loggerService.findLogsByUser(userId, parsedLimit)
    }

    return this.loggerService.findErrorLogs(parsedLimit)
  }

  @Get('alerts')
  async getAlerts(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 50
    return this.alertService.getRecentAlerts(parsedLimit)
  }

  @Get('rules')
  async getRules() {
    return this.alertService.getActiveRules()
  }

  @Get('health')
  async getHealthStatus() {
    const errorLogs = await this.loggerService.findErrorLogs(100)
    const recentAlerts = this.alertService.getRecentAlerts(10)
    
    // Calcular métricas de saúde
    const criticalErrors = errorLogs.filter(log => log.level === 'critical')
    const criticalAlerts = recentAlerts.filter(alert => alert.severity === 'CRITICAL')
    
    let status = 'healthy'
    let score = 100

    // Penalizar por erros críticos
    if (criticalErrors.length > 0) {
      status = 'critical'
      score -= criticalErrors.length * 20
    } else if (errorLogs.length > 20) {
      status = 'warning'
      score -= (errorLogs.length - 20) * 2
    }

    // Penalizar por alertas críticos
    if (criticalAlerts.length > 0) {
      status = 'critical'
      score -= criticalAlerts.length * 15
    }

    score = Math.max(0, score) // Não deixar score negativo

    return {
      status,
      score,
      timestamp: new Date(),
      metrics: {
        totalErrors: errorLogs.length,
        criticalErrors: criticalErrors.length,
        recentAlerts: recentAlerts.length,
        criticalAlerts: criticalAlerts.length,
      },
      recommendations: this.getHealthRecommendations(status, {
        totalErrors: errorLogs.length,
        criticalErrors: criticalErrors.length,
        recentAlerts: recentAlerts.length,
        criticalAlerts: criticalAlerts.length,
      }),
    }
  }

  private getHealthRecommendations(
    status: string,
    metrics: {
      totalErrors: number
      criticalErrors: number
      recentAlerts: number
      criticalAlerts: number
    },
  ): string[] {
    const recommendations: string[] = []

    if (status === 'critical') {
      recommendations.push('🚨 AÇÃO IMEDIATA NECESSÁRIA')
      
      if (metrics.criticalErrors > 0) {
        recommendations.push(`Investigar ${metrics.criticalErrors} erros críticos`)
      }
      
      if (metrics.criticalAlerts > 0) {
        recommendations.push(`Resolver ${metrics.criticalAlerts} alertas críticos`)
      }
    }

    if (metrics.totalErrors > 20) {
      recommendations.push('Revisar logs de erro recentes')
      recommendations.push('Considerar aumentar monitoring')
    }

    if (metrics.recentAlerts > 5) {
      recommendations.push('Analisar padrões de alertas')
      recommendations.push('Ajustar regras de alerta se necessário')
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Sistema funcionando normalmente')
      recommendations.push('Continuar monitoramento de rotina')
    }

    return recommendations
  }
} 