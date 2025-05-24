import { DocumentStatus, DocumentType } from '../enums'

export class Document {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly rebornId: string,
    public readonly type: DocumentType,
    public readonly status: DocumentStatus,
    public readonly fileUrl: string | null = null,
    public readonly templateData: Record<string, any> = {},
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(
    id: string,
    userId: string,
    rebornId: string,
    type: DocumentType,
    templateData: Record<string, any> = {},
  ): Document {
    return new Document(
      id,
      userId,
      rebornId,
      type,
      DocumentStatus.PENDING,
      null,
      templateData,
    )
  }

  startProcessing(): Document {
    return new Document(
      this.id,
      this.userId,
      this.rebornId,
      this.type,
      DocumentStatus.PROCESSING,
      this.fileUrl,
      this.templateData,
      this.createdAt,
      new Date(),
    )
  }

  markAsReady(fileUrl: string): Document {
    return new Document(
      this.id,
      this.userId,
      this.rebornId,
      this.type,
      DocumentStatus.READY,
      fileUrl,
      this.templateData,
      this.createdAt,
      new Date(),
    )
  }

  markAsFailed(): Document {
    return new Document(
      this.id,
      this.userId,
      this.rebornId,
      this.type,
      DocumentStatus.FAILED,
      this.fileUrl,
      this.templateData,
      this.createdAt,
      new Date(),
    )
  }

  belongsToUser(userId: string): boolean {
    return this.userId === userId
  }

  isReady(): boolean {
    return this.status === DocumentStatus.READY
  }

  isPending(): boolean {
    return this.status === DocumentStatus.PENDING
  }

  isProcessing(): boolean {
    return this.status === DocumentStatus.PROCESSING
  }

  hasFailed(): boolean {
    return this.status === DocumentStatus.FAILED
  }
}
