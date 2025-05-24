import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

export class UserResponseDto {
  @ApiProperty({ description: 'ID do usuário', example: 'uuid-123' })
  @Expose()
  id: string

  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@example.com',
  })
  @Expose()
  email: string

  @ApiProperty({ description: 'Role do usuário', example: 'user' })
  @Expose()
  role: string

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-15T10:00:00Z',
  })
  @Expose()
  createdAt: Date

  @Exclude()
  passwordHash: string

  @Exclude()
  stripeCustomerId: string
}

export class LoginResponseDto {
  @ApiProperty({ description: 'Token de acesso JWT' })
  @Expose()
  accessToken: string

  @ApiProperty({ type: UserResponseDto })
  @Expose()
  user: UserResponseDto
}

export class SignupResponseDto extends UserResponseDto {}
