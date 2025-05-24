import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

// Modules
import { MonitoringModule } from './monitoring.module'

// Tokens
import { USER_REPOSITORY, HASH_SERVICE } from '../shared/tokens'

// Entities
import { UserEntity } from '../infrastructure/orm/user.entity'

// Repositories
import { UserRepository } from '../infrastructure/orm/user.repository'

// Auth Services
import { BcryptAdapter } from '../infrastructure/auth/bcrypt.adapter'
import { JwtStrategy } from '../infrastructure/auth/jwt.strategy'
import { JwtAuthGuard } from '../infrastructure/auth/jwt-auth.guard'
import { JwtService } from '../infrastructure/auth/jwt.service'

// Use Cases
import { CreateUserUseCase } from '../application/use-cases/auth/create-user.use-case'
import { LoginUserUseCase } from '../application/use-cases/auth/login-user.use-case'

// Controllers
import { AuthController } from '../controllers/auth.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    MonitoringModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Repositories
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    // Services
    {
      provide: HASH_SERVICE,
      useClass: BcryptAdapter,
    },
    JwtService,
    // Use Cases
    CreateUserUseCase,
    LoginUserUseCase,
    // Auth
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [JwtAuthGuard, USER_REPOSITORY, JwtService],
})
export class AuthModule {}
