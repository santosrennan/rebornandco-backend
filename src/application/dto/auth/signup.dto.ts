import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'
import { DomainTransformable } from 'src/shared/base'
import { CreateUserRequest } from 'src/application/types'

export class SignupDto implements DomainTransformable<CreateUserRequest> {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@example.com',
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email: string

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'MinhaSenh@123',
    minLength: 8,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  @MaxLength(50, { message: 'Senha deve ter no máximo 50 caracteres' })
  password: string

  toDomain(): CreateUserRequest {
    return {
      email: this.email,
      password: this.password,
    }
  }
}
