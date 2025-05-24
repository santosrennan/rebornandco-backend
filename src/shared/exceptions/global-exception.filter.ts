import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error'
    const isDev = process.env.NODE_ENV === 'development'
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: isDev ? message : this.getSafeMessage(status),
      ...(isDev && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    }
    this.logger.error(`HTTP ${status} Error`, {
      method: request.method,
      url: request.url,
      userAgent: request.get('User-Agent'),
      ip: request.ip,
      error: exception instanceof Error ? exception.message : String(exception),
      stack: exception instanceof Error ? exception.stack : undefined,
    })
    response.status(status).json(errorResponse)
  }
  private getSafeMessage(status: number): string {
    const safeMessages = {
      400: 'Dados inválidos fornecidos',
      401: 'Acesso não autorizado',
      403: 'Acesso negado',
      404: 'Recurso não encontrado',
      409: 'Conflito de dados',
      422: 'Dados não processáveis',
      429: 'Muitas tentativas. Tente novamente mais tarde',
      500: 'Erro interno do servidor',
    }
    return (safeMessages[status] as string) || 'Erro no servidor'
  }
}
