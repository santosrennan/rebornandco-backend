import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { LogSchema } from '../infrastructure/mongodb/log.schema'
import { LoggerService } from '../infrastructure/mongodb/logger.service'
import { AlertService } from '../infrastructure/monitoring/alert.service'
import { MonitoringController } from './monitoring.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Log', schema: LogSchema }])],
  controllers: [MonitoringController],
  providers: [LoggerService, AlertService],
  exports: [LoggerService, AlertService],
})
export class MonitoringModule {}
