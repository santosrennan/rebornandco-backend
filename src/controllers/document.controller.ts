import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { Response } from 'express'
import { JwtAuthGuard } from '../infrastructure/auth/jwt-auth.guard'
import { GetTemplatesUseCase } from '../application/use-cases/document/get-templates.use-case'
import { CreateBirthCertificateUseCase } from '../application/use-cases/document/create-birth-certificate.use-case'
import { CreateBirthCertificateDto } from '../application/dto/create-birth-certificate.dto'
import { DocumentType } from '../domain/enums/document-type.enum'

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentController {
  constructor(
    private readonly getTemplatesUseCase: GetTemplatesUseCase,
    private readonly createBirthCertificateUseCase: CreateBirthCertificateUseCase,
  ) {}

  @Get('templates')
  @ApiOperation({ summary: 'Listar templates de documentos' })
  @ApiResponse({
    status: 200,
    description: 'Templates listados com sucesso',
  })
  async getTemplates(@Query('type') type?: DocumentType) {
    return this.getTemplatesUseCase.execute(type)
  }

  @Get('templates/birth-certificate')
  @ApiOperation({ summary: 'Listar templates de certidão de nascimento' })
  @ApiResponse({
    status: 200,
    description: 'Templates de certidão listados com sucesso',
  })
  async getBirthCertificateTemplates() {
    return this.getTemplatesUseCase.execute(DocumentType.BIRTH_CERTIFICATE)
  }

  @Post('reborns/:rebornId/birth-certificate')
  @ApiOperation({ summary: 'Gerar certidão de nascimento para um reborn' })
  @ApiResponse({
    status: 201,
    description: 'Certidão gerada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Reborn ou template não encontrado',
  })
  async createBirthCertificate(
    @Req() req: { user: { id: string } },
    @Param('rebornId') rebornId: string,
    @Body() data: CreateBirthCertificateDto,
    @Res() res: Response,
  ) {
    const result = await this.createBirthCertificateUseCase.execute(
      req.user.id,
      rebornId,
      data,
    )

    // Retornar arquivo para download
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${result.file.fileName}"`,
      'Content-Length': result.file.buffer.length,
    })

    return res.send(result.file.buffer)
  }
}
