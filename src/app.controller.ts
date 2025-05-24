import { Controller, Get, HttpStatus, Res } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Response } from 'express'
import { Public } from 'src/shared'

@ApiTags('health')
@Controller()
export class AppController {
  @Public()
  @Get('health')
  @ApiOperation({
    summary: 'Health check da aplicação',
    description:
      'Verifica o status básico da aplicação. Não requer autenticação mas está protegida por rate limiting.',
  })
  @ApiResponse({
    status: 200,
    description: 'Aplicação funcionando corretamente',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        message: { type: 'string', example: 'Service is healthy' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Serviço indisponível',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: { type: 'string', example: 'Service unavailable' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'Rate limit excedido',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 429 },
        message: {
          type: 'string',
          example: 'Muitas tentativas. Tente novamente mais tarde',
        },
        error: { type: 'string', example: 'Too Many Requests' },
      },
    },
  })
  async healthCheck(@Res() res: Response) {
    try {
      const isHealthy = await this.performInternalHealthChecks()
      const timestamp = new Date().toISOString()

      if (isHealthy) {
        return res.status(HttpStatus.OK).json({
          status: 'ok',
          message: 'Service is healthy',
          timestamp,
        })
      } else {
        return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
          status: 'error',
          message: 'Service unavailable',
          timestamp,
        })
      }
    } catch (error) {
      const timestamp = new Date().toISOString()

      // Log detalhado internamente (não expor ao cliente)
      console.error('🚨 Health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      })

      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'error',
        message: 'Service unavailable',
        timestamp,
      })
    }
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Informações básicas da API',
    description: 'Endpoint raiz com informações mínimas da API',
  })
  @ApiResponse({
    status: 200,
    description: 'Informações da API',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Reborn API' },
        documentation: { type: 'string', example: '/docs' },
        health: { type: 'string', example: '/health' },
      },
    },
  })
  getRoot() {
    return {
      message: 'Reborn API',
      documentation: '/docs',
      health: '/health',
    }
  }

  private async performInternalHealthChecks(): Promise<boolean> {
    try {
      const uptime = process.uptime()
      const memUsage = process.memoryUsage()

      // Verificações internas (logs detalhados apenas internamente)
      const checks = {
        uptime: uptime > 0,
        memoryHealthy: memUsage.heapUsed < memUsage.heapTotal * 0.9,
        pid: process.pid,
        nodeVersion: process.version,
        memory: {
          rss: Math.round(memUsage.rss / 1024 / 1024),
          heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
          heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        },
      }

      // Log detalhado apenas internamente
      console.log('📊 Health check details', {
        timestamp: new Date().toISOString(),
        uptime: `${Math.round(uptime)}s`,
        memory: `${checks.memory.heapUsed}MB/${checks.memory.heapTotal}MB`,
        pid: checks.pid,
        nodeVersion: checks.nodeVersion,
        status: checks.uptime && checks.memoryHealthy ? 'healthy' : 'degraded',
      })

      return checks.uptime && checks.memoryHealthy
    } catch (error) {
      console.error('🚨 Health check internal error', error)
      return false
    }
  }
}
