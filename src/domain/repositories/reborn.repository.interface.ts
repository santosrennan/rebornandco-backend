import { Reborn } from '../entities/reborn.entity'

export interface IRebornRepository {
  findById(id: string): Promise<Reborn | null>
  findByUserId(userId: string): Promise<Reborn[]>
  save(reborn: Reborn): Promise<Reborn>
  update(reborn: Reborn): Promise<Reborn>
  delete(id: string): Promise<void>
}
