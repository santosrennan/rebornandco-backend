export abstract class BaseDto<T> {
  abstract toDomain(): T
  autoMap(): Partial<T> {
    const result = {}
    Object.keys(this).forEach((key) => {
      if (this[key] !== undefined) {
        result[key] = this[key]
      }
    })
    return result as Partial<T>
  }
}
