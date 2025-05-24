import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import {
  DOCUMENT_TEMPLATE_REPOSITORY,
  DOCUMENT_REPOSITORY,
  REBORN_REPOSITORY,
} from '../../../shared/tokens'
import { IDocumentTemplateRepository } from '../../../domain/repositories/document-template.repository.interface'
import { IDocumentRepository } from '../../../domain/repositories/document.repository.interface'
import { IRebornRepository } from '../../../domain/repositories/reborn.repository.interface'
import { Document } from '../../../domain/entities/document.entity'
import { DocumentType } from '../../../domain/enums/document-type.enum'
import { BirthCertificateGeneratorService } from '../../../infrastructure/services/birth-certificate-generator.service'
import { CreateBirthCertificateDto } from '../../dto/create-birth-certificate.dto'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class CreateBirthCertificateUseCase {
  constructor(
    @Inject(DOCUMENT_TEMPLATE_REPOSITORY)
    private readonly templateRepository: IDocumentTemplateRepository,
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,
    @Inject(REBORN_REPOSITORY)
    private readonly rebornRepository: IRebornRepository,
    private readonly certificateGenerator: BirthCertificateGeneratorService,
  ) {}

  async execute(
    userId: string,
    rebornId: string,
    data: CreateBirthCertificateDto,
  ): Promise<{
    document: Document
    file: { buffer: Buffer; fileName: string }
  }> {
    // 1. Validar reborn
    const reborn = await this.rebornRepository.findById(rebornId)
    if (!reborn) {
      throw new NotFoundException('Reborn não encontrado')
    }

    if (!reborn.belongsToUser(userId)) {
      throw new NotFoundException('Reborn não pertence ao usuário')
    }

    // 2. Validar template
    const template = await this.templateRepository.findById(data.templateId)
    if (!template) {
      throw new NotFoundException('Template não encontrado')
    }

    if (!template.isForType(DocumentType.BIRTH_CERTIFICATE)) {
      throw new NotFoundException('Template não é de certidão de nascimento')
    }

    if (!template.isAvailable()) {
      throw new NotFoundException('Template não está disponível')
    }

    // 3. Criar documento no status PROCESSING
    const documentId = uuidv4()
    let document = Document.create(
      documentId,
      userId,
      rebornId,
      DocumentType.BIRTH_CERTIFICATE,
      {
        templateId: data.templateId,
        hospital: data.hospital,
        doctor: data.doctor,
        registrationNumber: data.registrationNumber,
        motherName: data.motherName,
        city: data.city,
        state: data.state,
        format: data.format,
      },
    )

    document = document.startProcessing()
    await this.documentRepository.save(document)

    try {
      // 4. Gerar arquivo
      const file = await this.certificateGenerator.generateCertificate(
        template,
        reborn,
        {
          hospital: data.hospital,
          doctor: data.doctor,
          registrationNumber: data.registrationNumber,
          motherName: data.motherName,
          city: data.city,
          state: data.state,
        },
        data.format,
      )

      // 5. Atualizar documento com sucesso (em um sistema real, salvaria o arquivo primeiro)
      const fileUrl = `/documents/${documentId}/${file.fileName}`
      document = document.markAsReady(fileUrl)
      await this.documentRepository.update(document)

      return { document, file }
    } catch (error) {
      // 6. Marcar como falhou em caso de erro
      document = document.markAsFailed()
      await this.documentRepository.update(document)
      throw error
    }
  }
}
