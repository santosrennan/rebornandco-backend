import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { UserEntity } from './user.entity'
import { RebornEntity } from './reborn.entity'
import { DocumentStatus } from '../../domain/enums/document-status.enum'
import { DocumentType } from '../../domain/enums/document-type.enum'

@Entity('documents')
export class DocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  userId: string

  @Column()
  rebornId: string

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  type: DocumentType

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus

  @Column({ nullable: true })
  fileUrl: string

  @Column('jsonb', { default: {} })
  templateData: Record<string, any>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity

  @ManyToOne(() => RebornEntity)
  @JoinColumn({ name: 'rebornId' })
  reborn: RebornEntity
}
