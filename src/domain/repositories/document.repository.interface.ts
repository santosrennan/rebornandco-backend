import { Document } from '../entities/document.entity'

export interface IDocumentRepository {
  findById(id: string): Promise<Document | null>
  findByUserId(userId: string): Promise<Document[]>
  findByRebornId(rebornId: string): Promise<Document[]>
  save(document: Document): Promise<Document>
  update(document: Document): Promise<Document>
  delete(id: string): Promise<void>
}
