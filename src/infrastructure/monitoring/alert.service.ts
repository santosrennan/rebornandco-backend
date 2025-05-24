import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { LoggerService } from '../mongodb/logger.service'
import { LogLevel, LogContext } from '../mongodb/log.schema'

export interface AlertRule {
  id: string
  name: string
  description: string
  condition: (logs: any[]) => boolean
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  enabled: boolean
}

export interface Alert {
  id: string
  ruleId: string
  severity: string
  message: string
  details: Record<string, any>
  timestamp: Date
}

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name)
  private readonly alertRules: AlertRule[] = []
  private readonly recentAlerts: Alert[] = []

  constructor(private readonly loggerService: LoggerService) {
    this.initializeDefaultRules()
  }

  private initializeDefaultRules(): void {
    this.alertRules.push(
      {
        id: 'critical-errors',
        name: 'Erros Críticos',
        description: 'Detecta erros críticos no sistema',
        condition: (logs) =>
          logs.some((log) => log.level === LogLevel.CRITICAL),
        severity: 'CRITICAL',
        enabled: true,
      },
      {
        id: 'multiple-login-failures',
        name: 'Múltiplas Falhas de Login',
        description: 'Detecta múltiplas tentativas de login falhadas',
        condition: (logs) => {
          const loginFailures = logs.filter(
            (log) =>
              log.context === LogContext.AUTH &&
              log.message.includes('senha incorreta'),
          )
          return loginFailures.length >= 5
        },
        severity: 'HIGH',
        enabled: true,
      },
      {
        id: 'slow-requests',
        name: 'Requisições Lentas',
        description: 'Detecta muitas requisições lentas',
        condition: (logs) => {
          const slowRequests = logs.filter(
            (log) =>
              log.details?.responseTime && log.details.responseTime > 5000,
          )
          return slowRequests.length >= 10
        },
        severity: 'MEDIUM',
        enabled: true,
      },
      {
        id: 'high-error-rate',
        name: 'Alta Taxa de Erros',
        description: 'Detecta alta taxa de erros HTTP',
        condition: (logs) => {
          const httpErrors = logs.filter(
            (log) =>
              log.context === LogContext.API && log.details?.statusCode >= 500,
          )
          return httpErrors.length >= 20
        },
        severity: 'HIGH',
        enabled: true,
      },
    )
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkAlerts(): Promise<void> {
    try {
      // Buscar logs dos últimos 5 minutos
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      const recentLogs = await this.getRecentLogs(fiveMinutesAgo)

      for (const rule of this.alertRules) {
        if (!rule.enabled) continue

        if (rule.condition(recentLogs)) {
          await this.triggerAlert(rule, recentLogs)
        }
      }
    } catch (error) {
      this.logger.error('Erro ao verificar alertas:', error)
    }
  }

  private async getRecentLogs(since: Date): Promise<any[]> {
    // Implementar busca no MongoDB por logs recentes
    // Por agora, retornamos array vazio
    return []
  }

  private async triggerAlert(rule: AlertRule, logs: any[]): Promise<void> {
    const alertId = `${rule.id}-${Date.now()}`

    // Verificar se já enviamos este alerta recentemente (debounce)
    const recentSimilarAlert = this.recentAlerts.find(
      (alert) =>
        alert.ruleId === rule.id &&
        Date.now() - alert.timestamp.getTime() < 10 * 60 * 1000, // 10 minutos
    )

    if (recentSimilarAlert) {
      return // Não enviar alerta duplicado
    }

    const alert: Alert = {
      id: alertId,
      ruleId: rule.id,
      severity: rule.severity,
      message: `🚨 ALERTA: ${rule.name}`,
      details: {
        description: rule.description,
        affectedLogs: logs.length,
        timestamp: new Date(),
        samples: logs.slice(0, 3), // Primeiros 3 logs como amostra
      },
      timestamp: new Date(),
    }

    // Adicionar à lista de alertas recentes
    this.recentAlerts.push(alert)

    // Limpar alertas antigos (manter apenas últimos 100)
    if (this.recentAlerts.length > 100) {
      this.recentAlerts.splice(0, this.recentAlerts.length - 100)
    }

    // Log do alerta
    await this.loggerService.critical(
      LogContext.SYSTEM,
      alert.message,
      alert.details,
    )

    // Enviar notificação
    await this.sendNotification(alert)
  }

  private async sendNotification(alert: Alert): Promise<void> {
    // Por enquanto, apenas log no console
    // Aqui poderíamos integrar com:
    // - Slack
    // - Discord
    // - Email
    // - SMS
    // - PagerDuty

    const emoji = this.getSeverityEmoji(alert.severity)
    const message =
      `${emoji} ${alert.message}\n` +
      `Severidade: ${alert.severity}\n` +
      `Logs afetados: ${alert.details.affectedLogs}\n` +
      `Horário: ${alert.timestamp.toLocaleString('pt-BR')}`

    console.error('🔔 NOTIFICAÇÃO DE ALERTA:')
    console.error(message)
    console.error('Detalhes:', JSON.stringify(alert.details, null, 2))

    // Em produção, implementar envio real:
    // await this.slackService.sendAlert(message)
    // await this.emailService.sendAlert(alert)
  }

  private getSeverityEmoji(severity: string): string {
    const emojis = {
      LOW: '🟡',
      MEDIUM: '🟠',
      HIGH: '🔴',
      CRITICAL: '💀',
    }
    return emojis[severity] || '⚠️'
  }

  // Métodos públicos para gerenciamento
  addRule(rule: AlertRule): void {
    this.alertRules.push(rule)
  }

  removeRule(ruleId: string): void {
    const index = this.alertRules.findIndex((rule) => rule.id === ruleId)
    if (index > -1) {
      this.alertRules.splice(index, 1)
    }
  }

  enableRule(ruleId: string): void {
    const rule = this.alertRules.find((rule) => rule.id === ruleId)
    if (rule) {
      rule.enabled = true
    }
  }

  disableRule(ruleId: string): void {
    const rule = this.alertRules.find((rule) => rule.id === ruleId)
    if (rule) {
      rule.enabled = false
    }
  }

  getActiveRules(): AlertRule[] {
    return this.alertRules.filter((rule) => rule.enabled)
  }

  getRecentAlerts(limit: number = 50): Alert[] {
    return this.recentAlerts
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }
}
