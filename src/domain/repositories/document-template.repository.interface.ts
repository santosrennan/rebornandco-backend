import { DocumentTemplate } from '../entities/document-template.entity'
import { DocumentType } from '../enums/document-type.enum'

export interface IDocumentTemplateRepository {
  findById(id: string): Promise<DocumentTemplate | null>
  findByType(type: DocumentType): Promise<DocumentTemplate[]>
  findActive(): Promise<DocumentTemplate[]>
  save(template: DocumentTemplate): Promise<DocumentTemplate>
} 