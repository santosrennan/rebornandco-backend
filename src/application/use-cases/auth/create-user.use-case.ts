import { Injectable, ConflictException, Inject } from '@nestjs/common'
import { IUserRepository } from 'src/domain/repositories'
import { User } from 'src/domain/entities'
import { IHashService } from 'src/infrastructure/auth/bcrypt.adapter'
import { USER_REPOSITORY, HASH_SERVICE } from 'src/shared/tokens'
import { CreateUserRequest, CreateUserResponse } from 'src/application/types'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(HASH_SERVICE)
    private readonly hashService: IHashService,
  ) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    const { email, password } = request

    // Verificar se usuário já existe
    const existingUser = await this.userRepository.findByEmail(email)
    if (existingUser) {
      throw new ConflictException('Usuário já existe com este email')
    }

    // Hash da senha
    const hashedPassword = await this.hashService.hash(password)

    // Criar usuário
    const user = User.create(uuidv4(), email, hashedPassword)

    // Salvar no repositório
    const savedUser = await this.userRepository.save(user)

    return {
      id: savedUser.id,
      email: savedUser.email.value,
      role: savedUser.role,
      createdAt: savedUser.createdAt,
    }
  }
}
