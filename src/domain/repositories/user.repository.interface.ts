import { User } from '../entities/user.entity'

export interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  save(user: User): Promise<User>
  update(user: User): Promise<User>
  delete(id: string): Promise<void>
}
