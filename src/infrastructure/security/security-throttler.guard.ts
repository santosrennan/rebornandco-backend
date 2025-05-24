import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'
import { Request } from 'express'

@Injectable()
export class SecurityThrottlerGuard extends ThrottlerGuard {
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    // Não pular rate limiting para nenhuma rota
    // Health check também deve ser protegido contra ataques
    return false
  }

  protected async getTracker(req: Request): Promise<string> {
    // Usar IP + User Agent para melhor tracking
    const ip = req.ip || req.connection.remoteAddress || 'unknown'
    const userAgent = req.get('User-Agent') || 'unknown'
    return `${ip}-${userAgent.substring(0, 50)}`
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
  ): Promise<void> {
    const request = context.switchToHttp().getRequest()
    
    // Log detalhado para monitoramento
    console.error('🚨 Rate limit exceeded', {
      ip: request.ip,
      userAgent: request.get('User-Agent'),
      url: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      headers: {
        'x-forwarded-for': request.get('x-forwarded-for'),
        'x-real-ip': request.get('x-real-ip'),
      }
    })

    throw new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Muitas tentativas. Tente novamente mais tarde',
        error: 'Too Many Requests',
        retryAfter: '60 seconds',
        timestamp: new Date().toISOString(),
      },
      HttpStatus.TOO_MANY_REQUESTS,
    )
  }
}
