export class PasswordHash {
  private readonly _value: string

  constructor(hashedPassword: string) {
    if (!hashedPassword || hashedPassword.length === 0) {
      throw new Error('Hash da senha não pode estar vazio')
    }
    this._value = hashedPassword
  }

  get value(): string {
    return this._value
  }

  equals(other: PasswordHash): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }
}
