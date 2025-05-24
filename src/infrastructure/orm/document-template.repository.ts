import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DocumentTemplate } from '../../domain/entities/document-template.entity'
import { IDocumentTemplateRepository } from '../../domain/repositories/document-template.repository.interface'
import { DocumentTemplateEntity } from './document-template.entity'
import { DocumentType } from '../../domain/enums/document-type.enum'

@Injectable()
export class DocumentTemplateRepository implements IDocumentTemplateRepository {
  constructor(
    @InjectRepository(DocumentTemplateEntity)
    private readonly repository: Repository<DocumentTemplateEntity>,
  ) {}

  async findById(id: string): Promise<DocumentTemplate | null> {
    const entity = await this.repository.findOne({ where: { id } })
    return entity ? this.toDomain(entity) : null
  }

  async findByType(type: DocumentType): Promise<DocumentTemplate[]> {
    const entities = await this.repository.find({
      where: { type, isActive: true },
      order: { createdAt: 'ASC' },
    })
    return entities.map((entity) => this.toDomain(entity))
  }

  async findActive(): Promise<DocumentTemplate[]> {
    const entities = await this.repository.find({
      where: { isActive: true },
      order: { type: 'ASC', createdAt: 'ASC' },
    })
    return entities.map((entity) => this.toDomain(entity))
  }

  async save(template: DocumentTemplate): Promise<DocumentTemplate> {
    const entity = this.toEntity(template)
    const saved = await this.repository.save(entity)
    return this.toDomain(saved)
  }

  private toDomain(entity: DocumentTemplateEntity): DocumentTemplate {
    return new DocumentTemplate(
      entity.id,
      entity.name,
      entity.type,
      entity.description,
      entity.thumbnailUrl,
      entity.baseImageUrl,
      entity.width,
      entity.height,
      entity.placeholders,
      entity.isActive,
      entity.createdAt,
    )
  }

  private toEntity(domain: DocumentTemplate): Partial<DocumentTemplateEntity> {
    return {
      id: domain.id,
      name: domain.name,
      type: domain.type,
      description: domain.description,
      thumbnailUrl: domain.thumbnailUrl,
      baseImageUrl: domain.baseImageUrl,
      width: domain.width,
      height: domain.height,
      placeholders: domain.placeholders,
      isActive: domain.isActive,
      createdAt: domain.createdAt,
    }
  }
} 