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

@Entity('reborns')
export class RebornEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  userId: string

  @Column()
  name: string

  @Column()
  birthDate: Date

  @Column('decimal', { precision: 7, scale: 2 })
  weight: number

  @Column('decimal', { precision: 5, scale: 2 })
  height: number

  @Column({ nullable: true })
  photoUrl: string

  @Column({ type: 'text', nullable: true })
  description: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity
}
