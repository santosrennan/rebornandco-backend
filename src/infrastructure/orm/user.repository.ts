import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../domain/entities/user.entity'
import { IUserRepository } from '../../domain/repositories/user.repository.interface'
import { UserEntity } from './user.entity'
import { Email, PasswordHash } from '../../domain/value-objects'

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } })
    return entity ? this.toDomain(entity) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { email } })
    return entity ? this.toDomain(entity) : null
  }

  async save(user: User): Promise<User> {
    const entity = this.toEntity(user)
    const saved = await this.repository.save(entity)
    return this.toDomain(saved)
  }

  async update(user: User): Promise<User> {
    const entity = this.toEntity(user)
    await this.repository.update(user.id, entity)
    const updated = await this.repository.findOne({ where: { id: user.id } })
    return this.toDomain(updated!)
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id)
  }

  private toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      new Email(entity.email),
      new PasswordHash(entity.passwordHash),
      entity.role,
      entity.stripeCustomerId,
      entity.isActive,
      entity.createdAt,
      entity.updatedAt,
    )
  }

  private toEntity(domain: User): Partial<UserEntity> {
    return {
      id: domain.id,
      email: domain.email.value,
      passwordHash: domain.passwordHash.value,
      role: domain.role,
      stripeCustomerId: domain.stripeCustomerId || undefined,
      isActive: domain.isActive,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    }
  }
}
