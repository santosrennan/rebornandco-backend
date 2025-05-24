import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { isProduction } from '../../config/environment.config'

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // BLOQUEAR COMPLETAMENTE DOCS EM PRODUÇÃO
    if (isProduction()) {
      // Bloquear qualquer acesso a documentação
      if (
        req.path.startsWith('/docs') ||
        req.path.startsWith('/api-docs') ||
        req.path === '/docs' ||
        req.path === '/api-docs'
      ) {
        throw new ForbiddenException('Resource not available in production')
      }

      // Bloquear headers que podem expor informações
      res.removeHeader('X-Powered-By')
      res.removeHeader('Server')
    }

    // Headers de segurança básica sempre
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

    // Em produção, headers ainda mais rigorosos
    if (isProduction()) {
      res.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains',
      )
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
      res.setHeader('Pragma', 'no-cache')
    }

    next()
  }
}
