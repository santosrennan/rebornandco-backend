import { Injectable, Inject } from '@nestjs/common'
import { IRebornRepository } from '../../../domain/repositories/reborn.repository.interface'
import { Reborn } from '../../../domain/entities/reborn.entity'
import { LoggerService } from '../../../infrastructure/mongodb/logger.service'
import { LogContext } from '../../../infrastructure/mongodb/log.schema'
import { REBORN_REPOSITORY } from '../../../shared/tokens'
import { v4 as uuidv4 } from 'uuid'

export interface CreateRebornRequest {
  userId: string
  name: string
  birthDate: string
  weight: number
  height: number
  photoUrl?: string
  description?: string
}

export interface CreateRebornResponse {
  id: string
  userId: string
  name: string
  birthDate: Date
  weight: number
  height: number
  photoUrl: string | null
  description: string | null
  ageInDays: number
  createdAt: Date
}

@Injectable()
export class CreateRebornUseCase {
  constructor(
    @Inject(REBORN_REPOSITORY)
    private readonly rebornRepository: IRebornRepository,
    private readonly loggerService: LoggerService,
  ) {}

  async execute(request: CreateRebornRequest): Promise<CreateRebornResponse> {
    const { userId, name, birthDate, weight, height, photoUrl, description } =
      request

    try {
      // Log início da criação
      await this.loggerService.info(
        LogContext.REBORN,
        'Criação de reborn iniciada',
        {
          userId,
          name,
          birthDate,
          weight,
          height,
        },
        { userId },
      )

      // Criar reborn
      const reborn = Reborn.create(
        uuidv4(),
        userId,
        name,
        new Date(birthDate),
        weight,
        height,
        photoUrl,
        description,
      )

      // Salvar no repositório
      const savedReborn = await this.rebornRepository.save(reborn)

      // Log de sucesso
      await this.loggerService.info(
        LogContext.REBORN,
        'Reborn criado com sucesso',
        {
          rebornId: savedReborn.id,
          userId: savedReborn.userId,
          name: savedReborn.name,
          ageInDays: savedReborn.getAgeInDays(),
        },
        { userId: savedReborn.userId },
      )

      return {
        id: savedReborn.id,
        userId: savedReborn.userId,
        name: savedReborn.name,
        birthDate: savedReborn.birthDate,
        weight: savedReborn.weight,
        height: savedReborn.height,
        photoUrl: savedReborn.photoUrl,
        description: savedReborn.description,
        ageInDays: savedReborn.getAgeInDays(),
        createdAt: savedReborn.createdAt,
      }
    } catch (error) {
      // Log de erro
      await this.loggerService.error(
        LogContext.REBORN,
        'Erro ao criar reborn',
        {
          userId,
          name,
          error: {
            name: error instanceof Error ? error.name : 'Unknown',
            message:
              error instanceof Error ? error.message : 'Erro desconhecido',
          },
        },
        { userId },
      )
      throw error
    }
  }
}
