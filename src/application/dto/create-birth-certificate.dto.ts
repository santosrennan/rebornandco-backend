import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator'
import { DocumentFormat } from '../../domain/enums/document-format.enum'

export class CreateBirthCertificateDto {
  @ApiProperty({
    description: 'ID do template da certidão',
    example: 'template-123',
  })
  @IsUUID()
  templateId: string

  @ApiProperty({
    description: 'Formato de saída do documento',
    enum: DocumentFormat,
    example: DocumentFormat.PNG,
  })
  @IsEnum(DocumentFormat)
  format: DocumentFormat

  @ApiProperty({
    description: 'Nome do hospital/local de nascimento',
    example: 'Hospital das Bonecas',
    required: false,
  })
  @IsOptional()
  @IsString()
  hospital?: string

  @ApiProperty({
    description: 'Nome do médico responsável',
    example: 'Dr. Reborn Silva',
    required: false,
  })
  @IsOptional()
  @IsString()
  doctor?: string

  @ApiProperty({
    description: 'Número de registro',
    example: 'REG-2024-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  registrationNumber?: string

  @ApiProperty({
    description: 'Nome da mãe adotiva',
    example: 'Maria Silva',
    required: false,
  })
  @IsOptional()
  @IsString()
  motherName?: string

  @ApiProperty({
    description: 'Cidade de nascimento',
    example: 'São Paulo',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string

  @ApiProperty({
    description: 'Estado de nascimento',
    example: 'SP',
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string
}
