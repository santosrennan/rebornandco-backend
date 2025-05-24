import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm'
import { DocumentType } from '../../domain/enums/document-type.enum'
import { TextPlaceholder } from '../../domain/value-objects/text-placeholder.vo'

@Entity('document_templates')
export class DocumentTemplateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  type: DocumentType

  @Column('text')
  description: string

  @Column()
  thumbnailUrl: string

  @Column()
  baseImageUrl: string

  @Column()
  width: number

  @Column()
  height: number

  @Column('jsonb')
  placeholders: TextPlaceholder[]

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date
} 