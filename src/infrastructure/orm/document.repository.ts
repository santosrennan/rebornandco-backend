import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Document } from '../../domain/entities/document.entity'
import { IDocumentRepository } from '../../domain/repositories/document.repository.interface'
import { DocumentEntity } from './document.entity'

@Injectable()
export class DocumentRepository implements IDocumentRepository {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly repository: Repository<DocumentEntity>,
  ) {}

  async findById(id: string): Promise<Document | null> {
    const entity = await this.repository.findOne({ where: { id } })
    return entity ? this.toDomain(entity) : null
  }

  async findByUserId(userId: string): Promise<Document[]> {
    const entities = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    })
    return entities.map((entity) => this.toDomain(entity))
  }

  async findByRebornId(rebornId: string): Promise<Document[]> {
    const entities = await this.repository.find({
      where: { rebornId },
      order: { createdAt: 'DESC' },
    })
    return entities.map((entity) => this.toDomain(entity))
  }

  async save(document: Document): Promise<Document> {
    const entity = this.toEntity(document)
    const saved = await this.repository.save(entity)
    return this.toDomain(saved)
  }

  async update(document: Document): Promise<Document> {
    const entity = this.toEntity(document)
    await this.repository.update(document.id, entity)
    const updated = await this.repository.findOne({
      where: { id: document.id },
    })
    return this.toDomain(updated!)
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id)
  }

  private toDomain(entity: DocumentEntity): Document {
    return new Document(
      entity.id,
      entity.userId,
      entity.rebornId,
      entity.type,
      entity.status,
      entity.fileUrl,
      entity.templateData,
      entity.createdAt,
      entity.updatedAt,
    )
  }

  private toEntity(domain: Document): Partial<DocumentEntity> {
    return {
      id: domain.id,
      userId: domain.userId,
      rebornId: domain.rebornId,
      type: domain.type,
      status: domain.status,
      fileUrl: domain.fileUrl || undefined,
      templateData: domain.templateData,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    }
  }
}
