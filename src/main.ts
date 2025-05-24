import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import * as compression from 'compression'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './shared/exceptions/global-exception.filter'
import { config } from './config/environment.config'
import { Environment } from './config/types/environment.types'
import { Request, Response } from 'express'

async function bootstrap() {
  // Debug: Verificar NODE_ENV

  const app = await NestFactory.create(AppModule, {
    logger:
      config.app.environment === Environment.PRODUCTION
        ? ['error', 'warn']
        : ['error', 'warn', 'log', 'debug'],
  })

  // Prefixo global da API
  app.setGlobalPrefix(config.app.apiPrefix)

  // SWAGGER - Configurar ANTES do Helmet para evitar problemas de CSP
  const SWAGGER_ENABLED = config.app.environment === Environment.DEVELOPMENT

  if (SWAGGER_ENABLED) {
    console.log('📚 Swagger habilitado para desenvolvimento')

    const swaggerConfig = new DocumentBuilder()
      .setTitle(config.app.name)
      .setDescription(config.app.description)
      .setVersion(config.app.version)
      .addBearerAuth()
      .addTag('health', 'Health check e informações da aplicação')
      .addTag('auth', 'Endpoints de autenticação')
      .addTag('reborns', 'Gerenciamento de reborns')
      .addTag('Monitoring', 'Monitoramento e saúde da aplicação')
      .build()

    const document = SwaggerModule.createDocument(app, swaggerConfig)

    // Swagger FORA do prefixo da API - fica em /docs
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
      customSiteTitle: 'RebornAndCo API Docs',
    })
  }

  // Segurança reforçada - Helmet APÓS o Swagger
  if (config.app.environment === Environment.PRODUCTION) {
    app.use(helmet())
  } else {
    // Em desenvolvimento, CSP mais permissivo para Swagger UI
    app.use(
      helmet({
        contentSecurityPolicy: false, // Desabilita CSP completamente em dev
        crossOriginEmbedderPolicy: false,
      }),
    )
  }
  app.use(compression())

  // Exception filter global
  app.useGlobalFilters(new GlobalExceptionFilter())

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: config.app.environment === Environment.PRODUCTION,
    }),
  )

  // CORS configurado
  app.enableCors({
    origin: config.app.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-correlation-id'],
  })

  if (!SWAGGER_ENABLED) {
    console.log('🔒 Swagger bloqueado para produção')

    // Bloqueia chamadas diretas em produção para não vazar 404 de rota Nest
    app.use(['^/docs', '^/docs-json'], (_req: Request, res: Response) => {
      return res.sendStatus(404)
    })
  }

  await app.listen(config.app.port)

  // Log de inicialização
  if (config.app.environment === Environment.PRODUCTION) {
    console.log(`✅ Application started on port ${config.app.port}`)
  } else {
    console.log(`🚀 Application running on http://localhost:${config.app.port}`)
    console.log(
      `📋 API Base: http://localhost:${config.app.port}/${config.app.apiPrefix}`,
    )
    if (SWAGGER_ENABLED) {
      console.log(`📚 Swagger: http://localhost:${config.app.port}/docs`)
      console.log(
        `📄 OpenAPI JSON: http://localhost:${config.app.port}/docs-json`,
      )
    }
  }
}

void bootstrap()
