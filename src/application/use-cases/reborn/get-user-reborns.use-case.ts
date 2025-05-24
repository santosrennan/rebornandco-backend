import { Injectable, Inject } from '@nestjs/common'
import { IRebornRepository } from '../../../domain/repositories/reborn.repository.interface'
import { REBORN_REPOSITORY } from '../../../shared/tokens'

export interface GetUserRebornsRequest {
  userId: string
}

export interface RebornSummary {
  id: string
  name: string
  birthDate: Date
  weight: number
  height: number
  photoUrl: string | null
  ageInDays: number
  createdAt: Date
}

export interface GetUserRebornsResponse {
  reborns: RebornSummary[]
  total: number
}

@Injectable()
export class GetUserRebornsUseCase {
  constructor(
    @Inject(REBORN_REPOSITORY)
    private readonly rebornRepository: IRebornRepository,
  ) {}

  async execute(
    request: GetUserRebornsRequest,
  ): Promise<GetUserRebornsResponse> {
    const { userId } = request

    const reborns = await this.rebornRepository.findByUserId(userId)

    const rebornSummaries: RebornSummary[] = reborns.map((reborn) => ({
      id: reborn.id,
      name: reborn.name,
      birthDate: reborn.birthDate,
      weight: reborn.weight,
      height: reborn.height,
      photoUrl: reborn.photoUrl,
      ageInDays: reborn.getAgeInDays(),
      createdAt: reborn.createdAt,
    }))

    return {
      reborns: rebornSummaries,
      total: rebornSummaries.length,
    }
  }
}
