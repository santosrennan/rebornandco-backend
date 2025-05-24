import { Injectable } from '@nestjs/common'
import {
  createCanvas,
  loadImage,
  CanvasRenderingContext2D,
  CanvasGradient,
} from 'canvas'
import { DocumentTemplate } from '../../domain/entities/document-template.entity'
import { Reborn } from '../../domain/entities/reborn.entity'
import { DocumentFormat } from '../../domain/enums/document-format.enum'
import { TextPlaceholder } from '../../domain/value-objects/text-placeholder.vo'

interface BirthCertificateData {
  hospital?: string
  doctor?: string
  registrationNumber?: string
  motherName?: string
  city?: string
  state?: string
}

@Injectable()
export class BirthCertificateGeneratorService {
  async generateCertificate(
    template: DocumentTemplate,
    reborn: Reborn,
    customData: BirthCertificateData,
    format: DocumentFormat,
  ): Promise<{ buffer: Buffer; fileName: string }> {
    // 1. Criar canvas
    const canvas = createCanvas(template.width, template.height)
    const ctx = canvas.getContext('2d')

    // 2. Tentar carregar imagem base ou criar uma dinâmica
    try {
      const baseImage = await loadImage(template.baseImageUrl)
      ctx.drawImage(baseImage, 0, 0, template.width, template.height)
    } catch {
      // Criar fundo dinâmico baseado no template
      this.createDynamicBackground(ctx, template)
    }

    // 3. Preparar dados completos
    const completeData = this.prepareData(reborn, customData)

    // 4. Adicionar textos dinâmicos
    for (const placeholder of template.placeholders) {
      this.drawText(ctx, placeholder, completeData)
    }

    // 5. Gerar arquivo final
    const fileName = this.generateFileName(reborn)

    if (format === DocumentFormat.PNG) {
      return {
        buffer: canvas.toBuffer('image/png'),
        fileName: `${fileName}.png`,
      }
    } else {
      // TODO: Implementar conversão para PDF usando Puppeteer
      return {
        buffer: canvas.toBuffer('image/png'),
        fileName: `${fileName}.png`,
      }
    }
  }

  private createDynamicBackground(
    ctx: CanvasRenderingContext2D,
    template: DocumentTemplate,
  ) {
    const { width, height } = template

    // Definir cores baseadas no nome do template
    let gradient: CanvasGradient
    if (template.name.includes('Rosa')) {
      // Template Rosa: degradê rosa suave
      gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#FFF0F5')
      gradient.addColorStop(1, '#FFE4E1')
    } else if (template.name.includes('Azul')) {
      // Template Azul: degradê azul moderno
      gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#F0F8FF')
      gradient.addColorStop(1, '#E6F3FF')
    } else {
      // Template Vintage: degradê dourado
      gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#FFFACD')
      gradient.addColorStop(1, '#F5DEB3')
    }

    // Preencher fundo
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Adicionar bordas decorativas
    ctx.strokeStyle = template.name.includes('Rosa')
      ? '#D8BFD8'
      : template.name.includes('Azul')
        ? '#4682B4'
        : '#DAA520'
    ctx.lineWidth = 3
    ctx.strokeRect(20, 20, width - 40, height - 40)

    // Adicionar título "CERTIDÃO DE NASCIMENTO"
    ctx.font = 'bold 32px serif'
    ctx.fillStyle = template.name.includes('Rosa')
      ? '#8B4513'
      : template.name.includes('Azul')
        ? '#1E3A8A'
        : '#B8860B'
    ctx.textAlign = 'center'
    ctx.fillText('CERTIDÃO DE NASCIMENTO', width / 2, 80)

    // Adicionar subtítulo
    ctx.font = '18px serif'
    ctx.fillStyle = '#666666'
    ctx.fillText('Bebê Reborn', width / 2, 110)

    // Resetar alinhamento
    ctx.textAlign = 'left'
  }

  private prepareData(reborn: Reborn, customData: BirthCertificateData) {
    return {
      reborn_name: reborn.name,
      birth_date: reborn.birthDate.toLocaleDateString('pt-BR'),
      weight: `${reborn.weight}g`,
      height: `${reborn.height}cm`,
      age_days: reborn.getAgeInDays().toString(),
      hospital: customData.hospital || 'Hospital dos Reborns',
      doctor: customData.doctor || 'Dr. Reborn',
      registration_number: customData.registrationNumber || 'REG-' + Date.now(),
      mother_name: customData.motherName || '',
      city: customData.city || 'São Paulo',
      state: customData.state || 'SP',
      today: new Date().toLocaleDateString('pt-BR'),
    }
  }

  private drawText(
    ctx: CanvasRenderingContext2D,
    placeholder: TextPlaceholder,
    data: Record<string, string>,
  ) {
    const value = data[placeholder.key] || ''

    ctx.font = `${placeholder.fontSize}px ${placeholder.fontFamily}`
    ctx.fillStyle = placeholder.color
    ctx.textAlign = placeholder.textAlign || 'left'

    // Quebrar texto se necessário
    if (
      placeholder.maxWidth &&
      ctx.measureText(value).width > placeholder.maxWidth
    ) {
      const words = value.split(' ')
      let line = ''
      let y = placeholder.y

      for (const word of words) {
        const testLine = line + word + ' '
        if (
          ctx.measureText(testLine).width > placeholder.maxWidth &&
          line !== ''
        ) {
          ctx.fillText(line, placeholder.x, y)
          line = word + ' '
          y += placeholder.fontSize * 1.2
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, placeholder.x, y)
    } else {
      ctx.fillText(value, placeholder.x, placeholder.y)
    }
  }

  private generateFileName(reborn: Reborn): string {
    const sanitizedName = reborn.name.replace(/[^a-zA-Z0-9]/g, '_')
    const timestamp = Date.now()
    return `certidao_nascimento_${sanitizedName}_${timestamp}`
  }
}
