import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Public, transform } from 'src/shared'
import {
  SignupDto,
  LoginDto,
  SignupResponseDto,
  LoginResponseDto,
} from 'src/application/dto'
import { CreateUserUseCase, LoginUserUseCase } from 'src/application/use-cases'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: SignupResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Usuário já existe',
  })
  async signup(@Body() signupDto: SignupDto): Promise<SignupResponseDto> {
    // DTO → Domain (Interface garante toDomain())
    const request = signupDto.toDomain()

    // Use Case recebe domain
    const result = await this.createUserUseCase.execute(request)

    // Domain → ResponseDTO
    return transform(SignupResponseDto, result)
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer login' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    // DTO → Domain (Interface garante toDomain())
    const request = loginDto.toDomain()

    // Use Case recebe domain
    const result = await this.loginUserUseCase.execute(request)

    // Domain → ResponseDTO
    return transform(LoginResponseDto, result)
  }
}
