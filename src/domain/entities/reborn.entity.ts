export class Reborn {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly birthDate: Date,
    public readonly weight: number,
    public readonly height: number,
    public readonly photoUrl: string | null = null,
    public readonly description: string | null = null,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(
    id: string,
    userId: string,
    name: string,
    birthDate: Date,
    weight: number,
    height: number,
    photoUrl?: string,
    description?: string,
  ): Reborn {
    return new Reborn(
      id,
      userId,
      name,
      birthDate,
      weight,
      height,
      photoUrl || null,
      description || null,
    )
  }

  updatePhoto(photoUrl: string): Reborn {
    return new Reborn(
      this.id,
      this.userId,
      this.name,
      this.birthDate,
      this.weight,
      this.height,
      photoUrl,
      this.description,
      this.createdAt,
      new Date(),
    )
  }

  updateDescription(description: string): Reborn {
    return new Reborn(
      this.id,
      this.userId,
      this.name,
      this.birthDate,
      this.weight,
      this.height,
      this.photoUrl,
      description,
      this.createdAt,
      new Date(),
    )
  }

  belongsToUser(userId: string): boolean {
    return this.userId === userId
  }

  getAgeInDays(): number {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - this.birthDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
}
