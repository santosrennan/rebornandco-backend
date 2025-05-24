import { transform } from './transform.util'

/**
 * Utilitários avançados de resposta para APIs
 */
export class ResponseUtil {
  /**
   * Alias simples para transform - mantém compatibilidade
   */
  static toDto<T>(ClassType: new () => T, data: any): T {
    return transform(ClassType, data)
  }

  /**
   * Resposta de sucesso com metadados
   */
  static success<T>(ClassType: new () => T, data: any, message?: string) {
    return {
      success: true,
      message: message || 'Operação realizada com sucesso',
      data: transform(ClassType, data),
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Resposta paginada padronizada
   */
  static paginated<T>(
    ClassType: new () => T,
    items: any[],
    total: number,
    page = 1,
    limit = 10,
  ) {
    return {
      success: true,
      data: items.map((item) => transform(ClassType, item)),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      timestamp: new Date().toISOString(),
    }
  }
}
