import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm'
import { LogLevel, LogContext } from '../../domain/entities/log.entity'

@Entity('logs')
@Index(['level', 'context', 'timestamp']) // Index composto para queries rápidas
@Index(['userId', 'timestamp']) // Index para logs por usuário
@Index(['ip', 'timestamp']) // Index para logs por IP
export class LogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'enum',
    enum: LogLevel,
  })
  @Index()
  level: LogLevel

  @Column({
    type: 'enum',
    enum: LogContext,
  })
  @Index()
  context: LogContext

  @Column('text')
  message: string

  @Column('jsonb', { default: {} })
  details: Record<string, any>

  @Column({ nullable: true })
  @Index()
  userId: string

  @Column({ nullable: true })
  @Index()
  ip: string

  @Column({ nullable: true })
  userAgent: string

  @Column({ nullable: true })
  endpoint: string

  @Column({ nullable: true })
  method: string

  @Column({ nullable: true })
  statusCode: number

  @Column({ nullable: true, type: 'float' })
  responseTime: number

  @CreateDateColumn()
  @Index()
  timestamp: Date
}
