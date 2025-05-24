import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export enum LogContext {
  AUTH = 'auth',
  REBORN = 'reborn',
  SECURITY = 'security',
  SYSTEM = 'system',
  API = 'api',
}

@Schema({
  collection: 'logs',
  timestamps: true,
})
export class LogDocument extends Document {
  @Prop({ required: true, enum: LogLevel, index: true })
  level: LogLevel

  @Prop({ required: true, enum: LogContext, index: true })
  context: LogContext

  @Prop({ required: true })
  message: string

  @Prop({ type: Object, default: {} })
  details: Record<string, any>

  @Prop({ index: true })
  userId?: string

  @Prop({ index: true })
  ip?: string

  @Prop()
  userAgent?: string

  @Prop()
  endpoint?: string

  @Prop()
  method?: string

  @Prop()
  statusCode?: number

  @Prop()
  responseTime?: number

  @Prop({ default: Date.now })
  timestamp: Date

  createdAt: Date
  updatedAt: Date
}

export const LogSchema = SchemaFactory.createForClass(LogDocument)

// Indexes compostos para performance
LogSchema.index({ level: 1, context: 1, timestamp: -1 })
LogSchema.index({ userId: 1, timestamp: -1 })
LogSchema.index({ ip: 1, timestamp: -1 })

// TTL: Remove logs após 90 dias (inclui índice no timestamp)
LogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 })
