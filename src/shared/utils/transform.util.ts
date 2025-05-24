import { plainToClass, ClassTransformOptions } from 'class-transformer'

/**
 * Transforma dados brutos em DTOs de resposta
 * @param ClassType - Classe DTO de destino
 * @param data - Dados a serem transformados
 * @param options - Opções de transformação (opcional)
 */
export function transform<T>(
  ClassType: new () => T,
  data: any,
  options?: ClassTransformOptions,
): T {
  const defaultOptions: ClassTransformOptions = {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  }

  return plainToClass(ClassType, data, { ...defaultOptions, ...options })
}

/**
 * Transforma array de dados em array de DTOs
 * @param ClassType - Classe DTO de destino
 * @param data - Array de dados a serem transformados
 * @param options - Opções de transformação (opcional)
 */
export function transformArray<T>(
  ClassType: new () => T,
  data: any[],
  options?: ClassTransformOptions,
): T[] {
  return data.map((item) => transform(ClassType, item, options))
}
