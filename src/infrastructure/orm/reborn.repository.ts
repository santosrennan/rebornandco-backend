import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Reborn } from '../../domain/entities/reborn.entity'
import { IRebornRepository } from '../../domain/repositories/reborn.repository.interface'
import { RebornEntity } from './reborn.entity'

@Injectable()
export class RebornRepository implements IRebornRepository {
  constructor(
    @InjectRepository(RebornEntity)
    private readonly repository: Repository<RebornEntity>,
  ) {}

  async findById(id: string): Promise<Reborn | null> {
    const entity = await this.repository.findOne({ where: { id } })
    return entity ? this.toDomain(entity) : null
  }

  async findByUserId(userId: string): Promise<Reborn[]> {
    const entities = await this.repository.find({ where: { userId } })
    return entities.map((entity) => this.toDomain(entity))
  }

  async save(reborn: Reborn): Promise<Reborn> {
    const entity = this.toEntity(reborn)
    const saved = await this.repository.save(entity)
    return this.toDomain(saved)
  }

  async update(reborn: Reborn): Promise<Reborn> {
    const entity = this.toEntity(reborn)
    await this.repository.update(reborn.id, entity)
    const updated = await this.repository.findOne({ where: { id: reborn.id } })
    return this.toDomain(updated!)
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id)
  }

  private toDomain(entity: RebornEntity): Reborn {
    return new Reborn(
      entity.id,
      entity.userId,
      entity.name,
      entity.birthDate,
      Number(entity.weight),
      Number(entity.height),
      entity.photoUrl,
      entity.description,
      entity.createdAt,
      entity.updatedAt,
    )
  }

  private toEntity(domain: Reborn): Partial<RebornEntity> {
    return {
      id: domain.id,
      userId: domain.userId,
      name: domain.name,
      birthDate: domain.birthDate,
      weight: domain.weight,
      height: domain.height,
      photoUrl: domain.photoUrl || undefined,
      description: domain.description || undefined,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    }
  }
}
