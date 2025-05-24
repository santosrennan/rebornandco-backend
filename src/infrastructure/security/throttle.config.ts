import { ThrottlerModuleOptions } from '@nestjs/throttler'

export const throttleConfig: ThrottlerModuleOptions = {
  throttlers: [
    {
      name: 'short',
      ttl: 60000, // 1 minuto
      limit: 20, // 20 requests por minuto (padrão)
    },
    {
      name: 'medium',
      ttl: 600000, // 10 minutos
      limit: 100, // 100 requests por 10 minutos
    },
    {
      name: 'long',
      ttl: 3600000, // 1 hora
      limit: 500, // 500 requests por hora
    },
  ],
}

// Rate limits específicos para endpoints críticos
export const AUTH_RATE_LIMIT = {
  ttl: 900000, // 15 minutos
  limit: 5, // Apenas 5 tentativas de login por 15min
}

export const SIGNUP_RATE_LIMIT = {
  ttl: 3600000, // 1 hora
  limit: 3, // Apenas 3 registros por hora por IP
}
