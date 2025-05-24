import { Role } from '../enums/role.enum'
import { Email, PasswordHash } from '../value-objects'

export class User {
  constructor(
    public readonly id: string,
    public readonly email: Email,
    public readonly passwordHash: PasswordHash,
    public readonly role: Role = Role.USER,
    public readonly stripeCustomerId: string | null = null,
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(
    id: string,
    email: string,
    hashedPassword: string,
    role: Role = Role.USER,
  ): User {
    return new User(
      id,
      new Email(email),
      new PasswordHash(hashedPassword),
      role,
    )
  }

  updateStripeCustomerId(customerId: string): User {
    return new User(
      this.id,
      this.email,
      this.passwordHash,
      this.role,
      customerId,
      this.isActive,
      this.createdAt,
      new Date(),
    )
  }

  upgradeToRole(newRole: Role): User {
    return new User(
      this.id,
      this.email,
      this.passwordHash,
      newRole,
      this.stripeCustomerId,
      this.isActive,
      this.createdAt,
      new Date(),
    )
  }

  deactivate(): User {
    return new User(
      this.id,
      this.email,
      this.passwordHash,
      this.role,
      this.stripeCustomerId,
      false,
      this.createdAt,
      new Date(),
    )
  }

  isPremium(): boolean {
    return this.role === Role.PREMIUM || this.role === Role.ADMIN
  }

  isAdmin(): boolean {
    return this.role === Role.ADMIN
  }
}
