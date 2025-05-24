import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'
import { DomainTransformable } from 'src/shared/base'
import { LoginUserRequest } from 'src/application/types'

export class LoginDto implements DomainTransformable<LoginUserRequest> {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@example.com',
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email: string

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'MinhaSenh@123',
  })
  @IsString({ message: 'Senha deve ser uma string' })
  password: string

  toDomain(): LoginUserRequest {
    return {
      email: this.email,
      password: this.password,
    }
  }
}
