import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Request, Response } from 'express'
import { LoggerService } from '../../infrastructure/mongodb/logger.service'
import { LogContext } from '../../infrastructure/mongodb/log.schema'
import { v4 as uuidv4 } from 'uuid'

export const CORRELATION_ID_HEADER = 'x-correlation-id'

interface RequestWithUser extends Request {
  correlationId?: string
  startTime?: number
  user?: {
    id: string
    email: string
    role: string
  }
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const response = context.switchToHttp().getResponse<Response>()
    
    // Gerar Correlation ID
    const correlationId = (request.headers[CORRELATION_ID_HEADER] as string) || uuidv4()
    request.correlationId = correlationId
    response.setHeader(CORRELATION_ID_HEADER, correlationId)
    
    // Marcar início da requisição
    const startTime = Date.now()
    request.startTime = startTime
    
    const { method, url, ip, headers } = request
    const userAgent = headers['user-agent'] || 'Unknown'
    const userId = request.user?.id
    
    // Log da requisição iniciada
    const requestDetails = {
      correlationId,
      method,
      url,
      ip,
      userAgent,
      userId,
      headers: this.sanitizeHeaders(headers),
      body: this.sanitizeBody(request.body),
      query: request.query,
    }

    // Não loga rotas de health check
    if (!this.isHealthCheckRoute(url)) {
      this.loggerService.info(
        LogContext.API,
        `Requisição iniciada: ${method} ${url}`,
        requestDetails,
        {
          userId,
          ip,
          userAgent,
          endpoint: url,
          method,
        },
      )
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const responseTime = Date.now() - startTime
          const { statusCode } = response

          if (!this.isHealthCheckRoute(url)) {
            this.loggerService.info(
              LogContext.API,
              `Requisição completada: ${method} ${url} - ${statusCode}`,
              {
                correlationId,
                method,
                url,
                statusCode,
                responseTime,
                userId,
                responseSize: JSON.stringify(data || {}).length,
              },
              {
                userId,
                ip,
                userAgent,
                endpoint: url,
                method,
                statusCode,
                responseTime,
              },
            )
          }

          // Alertas para requisições lentas (> 5 segundos)
          if (responseTime > 5000) {
            this.loggerService.warn(
              LogContext.API,
              `Requisição LENTA detectada: ${method} ${url}`,
              {
                correlationId,
                responseTime,
                threshold: 5000,
                userId,
              },
              {
                userId,
                ip,
                userAgent,
                endpoint: url,
                method,
                statusCode,
                responseTime,
              },
            )
          }
        },
        error: (error) => {
          const responseTime = Date.now() - startTime
          const statusCode = error.status || 500

          this.loggerService.error(
            LogContext.API,
            `Requisição falhou: ${method} ${url} - ${statusCode}`,
            {
              correlationId,
              method,
              url,
              statusCode,
              responseTime,
              userId,
              error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
              },
            },
            {
              userId,
              ip,
              userAgent,
              endpoint: url,
              method,
              statusCode,
              responseTime,
            },
          )
        },
      }),
    )
  }

  private sanitizeHeaders(headers: any): Record<string, any> {
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key']
    const sanitized: Record<string, any> = {}

    for (const [key, value] of Object.entries(headers)) {
      const lowerKey = key.toLowerCase()
      const isSensitive = sensitiveHeaders.some((header) =>
        lowerKey.includes(header),
      )

      if (isSensitive) {
        sanitized[key] = '[SANITIZED]'
      } else {
        sanitized[key] = value
      }
    }

    return sanitized
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body

    const sensitiveFields = ['password', 'token', 'secret', 'key']
    const sanitized = { ...body }

    for (const [key, value] of Object.entries(sanitized)) {
      const lowerKey = key.toLowerCase()
      const isSensitive = sensitiveFields.some((field) =>
        lowerKey.includes(field),
      )

      if (isSensitive) {
        sanitized[key] = '[SANITIZED]'
      }
    }

    return sanitized
  }

  private isHealthCheckRoute(url: string): boolean {
    const healthRoutes = ['/health', '/ping', '/status', '/metrics']
    return healthRoutes.some((route) => url.includes(route))
  }
} 