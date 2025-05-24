import { Module, MiddlewareConsumer } from '@nestjs/common'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MongooseModule } from '@nestjs/mongoose'
import { BullModule } from '@nestjs/bull'
import { ThrottlerModule } from '@nestjs/throttler'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { AuthModule } from './modules/auth.module'
import { RebornModule } from './modules/reborn.module'
import { DocumentModule } from './modules/document.module'
import { MonitoringModule } from './modules/monitoring.module'
import { JwtAuthGuard } from './infrastructure/auth/jwt-auth.guard'
import { SecurityThrottlerGuard } from './infrastructure/security/security-throttler.guard'
import { SecurityMiddleware } from './infrastructure/security/security.middleware'
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor'
import { LoggerService } from './infrastructure/mongodb/logger.service'
import { AlertService } from './infrastructure/monitoring/alert.service'
import { LogSchema } from './infrastructure/mongodb/log.schema'
import { config } from './config/environment.config'

@Module({
  imports: [
    // Configuração de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Schedule Module para cron jobs
    ScheduleModule.forRoot(),

    // Rate Limiting
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: config.security.rateLimitTtl,
          limit: config.security.rateLimitMax,
        },
        {
          name: 'medium',
          ttl: 600000, // 10 minutos
          limit: 100, // 100 requests por 10 minutos
        },
      ],
    }),

    // Configuração do MongoDB para logs
    MongooseModule.forRoot(config.mongo.uri, {
      maxPoolSize: config.mongo.maxPoolSize,
      serverSelectionTimeoutMS: config.mongo.serverSelectionTimeoutMS,
      socketTimeoutMS: config.mongo.socketTimeoutMS,
    }),

    // Schema do MongoDB para logs
    MongooseModule.forFeature([{ name: 'Log', schema: LogSchema }]),

    // Configuração do TypeORM
    TypeOrmModule.forRoot({
      type: config.database.type as 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: config.database.synchronize,
      logging: config.database.logging,
      ssl: config.database.ssl,
      maxQueryExecutionTime: 30000,
      extra: {
        max: config.database.maxConnections,
        connectionTimeoutMillis: config.database.connectTimeoutMS,
      },
    }),

    // Configuração do BullMQ para filas
    BullModule.forRoot({
      redis: {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
        db: config.redis.db,
        maxRetriesPerRequest: config.redis.maxRetriesPerRequest,
      },
    }),

    // Módulos de negócio
    AuthModule,
    RebornModule,
    DocumentModule,
    MonitoringModule,
  ],
  controllers: [AppController],
  providers: [
    // Serviços de logging e monitoramento
    LoggerService,
    AlertService,

    // JWT Guard Global
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Rate Limiting Guard Global
    {
      provide: APP_GUARD,
      useClass: SecurityThrottlerGuard,
    },
    // Interceptor Global de Logging
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityMiddleware).forRoutes('*')
  }
}
