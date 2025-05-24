import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { LogDocument, LogLevel, LogContext } from './log.schema'

@Injectable()
export class LoggerService {
  constructor(
    @InjectModel('Log') private readonly logModel: Model<LogDocument>,
  ) {}

  async debug(
    context: LogContext,
    message: string,
    details: Record<string, any> = {},
    metadata?: {
      userId?: string
      ip?: string
      userAgent?: string
      endpoint?: string
      method?: string
      statusCode?: number
      responseTime?: number
    },
  ): Promise<void> {
    await this.createLog(LogLevel.DEBUG, context, message, details, metadata)
  }

  async info(
    context: LogContext,
    message: string,
    details: Record<string, any> = {},
    metadata?: {
      userId?: string
      ip?: string
      userAgent?: string
      endpoint?: string
      method?: string
      statusCode?: number
      responseTime?: number
    },
  ): Promise<void> {
    await this.createLog(LogLevel.INFO, context, message, details, metadata)
  }

  async warn(
    context: LogContext,
    message: string,
    details: Record<string, any> = {},
    metadata?: {
      userId?: string
      ip?: string
      userAgent?: string
      endpoint?: string
      method?: string
      statusCode?: number
      responseTime?: number
    },
  ): Promise<void> {
    await this.createLog(LogLevel.WARN, context, message, details, metadata)
  }

  async error(
    context: LogContext,
    message: string,
    details: Record<string, any> = {},
    metadata?: {
      userId?: string
      ip?: string
      userAgent?: string
      endpoint?: string
      method?: string
      statusCode?: number
      responseTime?: number
    },
  ): Promise<void> {
    await this.createLog(LogLevel.ERROR, context, message, details, metadata)
  }

  async critical(
    context: LogContext,
    message: string,
    details: Record<string, any> = {},
    metadata?: {
      userId?: string
      ip?: string
      userAgent?: string
      endpoint?: string
      method?: string
      statusCode?: number
      responseTime?: number
    },
  ): Promise<void> {
    await this.createLog(LogLevel.CRITICAL, context, message, details, metadata)
  }

  private async createLog(
    level: LogLevel,
    context: LogContext,
    message: string,
    details: Record<string, any>,
    metadata?: {
      userId?: string
      ip?: string
      userAgent?: string
      endpoint?: string
      method?: string
      statusCode?: number
      responseTime?: number
    },
  ): Promise<void> {
    try {
      const sanitizedDetails = this.sanitizeDetails(details)

      const logDocument = new this.logModel({
        level,
        context,
        message,
        details: sanitizedDetails,
        userId: metadata?.userId,
        ip: metadata?.ip,
        userAgent: metadata?.userAgent,
        endpoint: metadata?.endpoint,
        method: metadata?.method,
        statusCode: metadata?.statusCode,
        responseTime: metadata?.responseTime,
        timestamp: new Date(),
      })

      await logDocument.save()

      // Log crítico também no console para alertas imediatos
      if (level === LogLevel.CRITICAL || level === LogLevel.ERROR) {
        console.error(
          `[${level.toUpperCase()}] ${context}: ${message}`,
          sanitizedDetails,
        )
      }
    } catch (error) {
      // Fallback para console se MongoDB falhar
      console.error('Falha ao salvar log no MongoDB:', error)
      console.log(`[${level.toUpperCase()}] ${context}: ${message}`, details)
    }
  }

  private sanitizeDetails(details: Record<string, any>): Record<string, any> {
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'authorization',
    ]
    const sanitized = { ...details }

    const sanitizeRecursive = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj

      if (Array.isArray(obj)) {
        return obj.map(sanitizeRecursive)
      }

      const result: any = {}
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase()
        const isSensitive = sensitiveFields.some((field) =>
          lowerKey.includes(field),
        )

        if (isSensitive) {
          result[key] = '[SANITIZED]'
        } else {
          result[key] = sanitizeRecursive(value)
        }
      }
      return result
    }

    return sanitizeRecursive(sanitized)
  }

  // Métodos para consultas
  async findErrorLogs(limit: number = 100): Promise<LogDocument[]> {
    return this.logModel
      .find({ level: { $in: [LogLevel.ERROR, LogLevel.CRITICAL] } })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec()
  }

  async findLogsByUser(
    userId: string,
    limit: number = 100,
  ): Promise<LogDocument[]> {
    return this.logModel
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec()
  }

  async findLogsByContext(
    context: LogContext,
    limit: number = 100,
  ): Promise<LogDocument[]> {
    return this.logModel
      .find({ context })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec()
  }
}
