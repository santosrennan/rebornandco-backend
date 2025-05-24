export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export enum LogContext {
  AUTH = 'auth',
  REBORN = 'reborn',
  SECURITY = 'security',
  SYSTEM = 'system',
  API = 'api',
}

export class Log {
  constructor(
    public readonly id: string,
    public readonly level: LogLevel,
    public readonly context: LogContext,
    public readonly message: string,
    public readonly details: Record<string, any>,
    public readonly userId?: string,
    public readonly ip?: string,
    public readonly userAgent?: string,
    public readonly endpoint?: string,
    public readonly method?: string,
    public readonly statusCode?: number,
    public readonly responseTime?: number,
    public readonly timestamp: Date = new Date(),
  ) {}

  static create(
    level: LogLevel,
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
  ): Log {
    return new Log(
      crypto.randomUUID(),
      level,
      context,
      message,
      details,
      metadata?.userId,
      metadata?.ip,
      metadata?.userAgent,
      metadata?.endpoint,
      metadata?.method,
      metadata?.statusCode,
      metadata?.responseTime,
    )
  }

  isError(): boolean {
    return this.level === LogLevel.ERROR || this.level === LogLevel.CRITICAL
  }

  isCritical(): boolean {
    return this.level === LogLevel.CRITICAL
  }

  isSecurityRelated(): boolean {
    return (
      this.context === LogContext.SECURITY || this.context === LogContext.AUTH
    )
  }
}
