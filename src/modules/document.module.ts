import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DocumentController } from '../interfaces/http/document.controller'
import { DocumentEntity } from '../infrastructure/orm/document.entity'
import { DocumentTemplateEntity } from '../infrastructure/orm/document-template.entity'
import { DocumentRepository } from '../infrastructure/orm/document.repository'
import { DocumentTemplateRepository } from '../infrastructure/orm/document-template.repository'
import { BirthCertificateGeneratorService } from '../infrastructure/services/birth-certificate-generator.service'
import { GetTemplatesUseCase } from '../application/use-cases/document/get-templates.use-case'
import { CreateBirthCertificateUseCase } from '../application/use-cases/document/create-birth-certificate.use-case'
import {
  DOCUMENT_REPOSITORY,
  DOCUMENT_TEMPLATE_REPOSITORY,
  REBORN_REPOSITORY,
} from '../shared/tokens'
import { RebornEntity } from '../infrastructure/orm/reborn.entity'
import { RebornRepository } from '../infrastructure/orm/reborn.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentEntity,
      DocumentTemplateEntity,
      RebornEntity,
    ]),
  ],
  controllers: [DocumentController],
  providers: [
    // Repositórios
    {
      provide: DOCUMENT_REPOSITORY,
      useClass: DocumentRepository,
    },
    {
      provide: DOCUMENT_TEMPLATE_REPOSITORY,
      useClass: DocumentTemplateRepository,
    },
    {
      provide: REBORN_REPOSITORY,
      useClass: RebornRepository,
    },

    // Serviços
    BirthCertificateGeneratorService,

    // Casos de uso
    GetTemplatesUseCase,
    CreateBirthCertificateUseCase,
  ],
  exports: [
    DOCUMENT_REPOSITORY,
    DOCUMENT_TEMPLATE_REPOSITORY,
    BirthCertificateGeneratorService,
  ],
})
export class DocumentModule {} 