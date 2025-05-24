import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// Modules
import { MonitoringModule } from './monitoring.module'

// Tokens
import { REBORN_REPOSITORY } from '../shared/tokens'

// Entities
import { RebornEntity } from '../infrastructure/orm/reborn.entity'

// Repositories
import { RebornRepository } from '../infrastructure/orm/reborn.repository'

// Use Cases
import { CreateRebornUseCase } from '../application/use-cases/reborn/create-reborn.use-case'
import { GetUserRebornsUseCase } from '../application/use-cases/reborn/get-user-reborns.use-case'

// Controllers
import { RebornController } from '../interfaces/http/reborn.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([RebornEntity]),
    MonitoringModule,
  ],
  controllers: [RebornController],
  providers: [
    // Repositories
    {
      provide: REBORN_REPOSITORY,
      useClass: RebornRepository,
    },
    // Use Cases
    CreateRebornUseCase,
    GetUserRebornsUseCase,
  ],
  exports: [REBORN_REPOSITORY],
})
export class RebornModule {}
