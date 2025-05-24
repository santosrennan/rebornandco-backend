export abstract class BaseDto<T> {
  abstract toDomain(): T
}
