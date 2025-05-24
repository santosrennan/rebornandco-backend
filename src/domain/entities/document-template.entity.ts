import { DocumentType } from '../enums/document-type.enum'
import { TextPlaceholder } from '../value-objects/text-placeholder.vo'

export class DocumentTemplate {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: DocumentType,
    public readonly description: string,
    public readonly thumbnailUrl: string,
    public readonly baseImageUrl: string,
    public readonly width: number,
    public readonly height: number,
    public readonly placeholders: TextPlaceholder[],
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
  ) {}

  static createBirthCertificateTemplate(
    id: string,
    name: string,
    description: string,
    thumbnailUrl: string,
    baseImageUrl: string,
    width: number,
    height: number,
    placeholders: TextPlaceholder[],
  ): DocumentTemplate {
    return new DocumentTemplate(
      id,
      name,
      DocumentType.BIRTH_CERTIFICATE,
      description,
      thumbnailUrl,
      baseImageUrl,
      width,
      height,
      placeholders,
    )
  }

  isForType(type: DocumentType): boolean {
    return this.type === type
  }

  isAvailable(): boolean {
    return this.isActive
  }
}
