export interface DomainTransformable<T> {
  toDomain(): T
}
export function WithDomainTransform<T>() {
  return class {
    toDomain(): T {
      const result = {} as T
      Object.keys(this).forEach((key) => {
        if (this[key] !== undefined && typeof this[key] !== 'function') {
          ;(result as any)[key] = this[key]
        }
      })
      return result
    }
    autoMap(): Partial<T> {
      const result = {} as Partial<T>
      Object.keys(this).forEach((key) => {
        if (this[key] !== undefined && typeof this[key] !== 'function') {
          ;(result as any)[key] = this[key]
        }
      })
      return result
    }
  }
}
