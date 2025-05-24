import { Injectable, UnauthorizedException, Inject } from '@nestjs/common'
import { IUserRepository } from '../../../domain/repositories/user.repository.interface'
import { IHashService } from '../../../infrastructure/auth/bcrypt.adapter'
import { JwtService } from '../../../infrastructure/auth/jwt.service'
import { LoggerService } from '../../../infrastructure/mongodb/logger.service'
import { LogContext } from '../../../infrastructure/mongodb/log.schema'
import { USER_REPOSITORY, HASH_SERVICE } from '../../../shared/tokens'

export interface LoginUserRequest {
  email: string
  password: string
}

export interface LoginUserResponse {
  accessToken: string
  user: {
    id: string
    email: string
    role: string
  }
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(HASH_SERVICE)
    private readonly hashService: IHashService,
    private readonly jwtService: JwtService,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(request: LoginUserRequest): Promise<LoginUserResponse> {
    const { email, password } = request

    try {
      // Log início da tentativa de login
      await this.loggerService.info(
        LogContext.AUTH,
        'Tentativa de login iniciada',
        { email },
      )

      // Buscar usuário
      const user = await this.userRepository.findByEmail(email)
      if (!user) {
        await this.loggerService.warn(
          LogContext.AUTH,
          'Tentativa de login com email inexistente',
          { email },
        )
        throw new UnauthorizedException('Credenciais inválidas')
      }

      // Verificar senha
      const isPasswordValid = await this.hashService.compare(
        password,
        user.passwordHash.value,
      )

      if (!isPasswordValid) {
        await this.loggerService.warn(
          LogContext.AUTH,
          'Tentativa de login com senha incorreta',
          { userId: user.id, email },
        )
        throw new UnauthorizedException('Credenciais inválidas')
      }

      // Verificar se usuário está ativo
      if (!user.isActive) {
        await this.loggerService.warn(
          LogContext.AUTH,
          'Tentativa de login de usuário desativado',
          { userId: user.id, email },
        )
        throw new UnauthorizedException('Usuário desativado')
      }

      // Gerar JWT
      const payload = {
        sub: user.id,
        email: user.email.value,
        role: user.role,
      }

      const accessToken = this.jwtService.sign(payload)

      // Log de sucesso
      await this.loggerService.info(
        LogContext.AUTH,
        'Login realizado com sucesso',
        {
          userId: user.id,
          email: user.email.value,
          role: user.role,
        },
        { userId: user.id },
      )

      return {
        accessToken,
        user: {
          id: user.id,
          email: user.email.value,
          role: user.role,
        },
      }
    } catch (error) {
      // Log de erro geral
      await this.loggerService.error(
        LogContext.AUTH,
        'Erro durante processo de login',
        {
          email,
          error: {
            name: error instanceof Error ? error.name : 'Unknown error',
            message:
              error instanceof Error ? error.message : 'Unknown error message',
          },
        },
      )
      throw error
    }
  }
}
