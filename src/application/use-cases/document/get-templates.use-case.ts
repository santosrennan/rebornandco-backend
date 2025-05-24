import { Injectable, Inject } from '@nestjs/common'
import { DOCUMENT_TEMPLATE_REPOSITORY } from '../../../shared/tokens'
import { IDocumentTemplateRepository } from '../../../domain/repositories/document-template.repository.interface'
import { DocumentTemplate } from '../../../domain/entities/document-template.entity'
import { DocumentType } from '../../../domain/enums/document-type.enum'

@Injectable()
export class GetTemplatesUseCase {
  constructor(
    @Inject(DOCUMENT_TEMPLATE_REPOSITORY)
    private readonly templateRepository: IDocumentTemplateRepository,
  ) {}

  async execute(type?: DocumentType): Promise<DocumentTemplate[]> {
    if (type) {
      return await this.templateRepository.findByType(type)
    }
    return await this.templateRepository.findActive()
  }
}
