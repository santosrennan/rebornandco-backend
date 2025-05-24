/**
 * Configuration Validation Utilities
 * Provides type-safe validation and transformation for environment variables
 */


export class ConfigurationError extends Error {
  constructor(
    public readonly field: string,
    public readonly value: any,
    public readonly expectedType: string,
    message?: string,
  ) {
    super(
      message ||
        `Configuration error for field '${field}': expected ${expectedType}, got ${typeof value} (${value})`,
    )
    this.name = 'ConfigurationError'
  }
}

/**
 * Validates and returns a required string value
 */
export function getRequiredString(
  key: string,
  value: string | undefined,
  description?: string,
): string {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    throw new ConfigurationError(
      key,
      value,
      'non-empty string',
      `${description ? `${description}: ` : ''}Environment variable ${key} is required and must be a non-empty string`,
    )
  }
  return value.trim()
}

/**
 * Returns an optional string with default fallback
 */
export function getOptionalString(
  value: string | undefined,
  defaultValue: string,
): string {
  return value && typeof value === 'string' && value.trim() !== ''
    ? value.trim()
    : defaultValue
}

/**
 * Validates and returns a required number value
 */
export function getRequiredNumber(
  key: string,
  value: string | undefined,
  description?: string,
): number {
  if (!value) {
    throw new ConfigurationError(
      key,
      value,
      'number',
      `${description ? `${description}: ` : ''}Environment variable ${key} is required`,
    )
  }

  const parsed = parseInt(value, 10)
  if (isNaN(parsed)) {
    throw new ConfigurationError(
      key,
      value,
      'valid number',
      `${description ? `${description}: ` : ''}Environment variable ${key} must be a valid number`,
    )
  }

  return parsed
}

/**
 * Returns an optional number with default fallback
 */
export function getOptionalNumber(
  value: string | undefined,
  defaultValue: number,
): number {
  if (!value) return defaultValue
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Validates and returns a required boolean value
 */
export function getRequiredBoolean(
  key: string,
  value: string | undefined,
  description?: string,
): boolean {
  if (value === undefined) {
    throw new ConfigurationError(
      key,
      value,
      'boolean',
      `${description ? `${description}: ` : ''}Environment variable ${key} is required`,
    )
  }

  const normalizedValue = value.toLowerCase().trim()
  if (['true', '1', 'yes', 'on'].includes(normalizedValue)) return true
  if (['false', '0', 'no', 'off'].includes(normalizedValue)) return false

  throw new ConfigurationError(
    key,
    value,
    'boolean (true/false, 1/0, yes/no, on/off)',
    `${description ? `${description}: ` : ''}Environment variable ${key} must be a boolean value`,
  )
}

/**
 * Returns an optional boolean with default fallback
 */
export function getOptionalBoolean(
  value: string | undefined,
  defaultValue: boolean,
): boolean {
  if (!value) return defaultValue
  
  const normalizedValue = value.toLowerCase().trim()
  if (['true', '1', 'yes', 'on'].includes(normalizedValue)) return true
  if (['false', '0', 'no', 'off'].includes(normalizedValue)) return false
  
  return defaultValue
}

/**
 * Validates and returns an enum value
 */
export function getRequiredEnum<T extends Record<string, string>>(
  key: string,
  value: string | undefined,
  enumObject: T,
  description?: string,
): T[keyof T] {
  if (!value) {
    throw new ConfigurationError(
      key,
      value,
      `one of: ${Object.values(enumObject).join(', ')}`,
      `${description ? `${description}: ` : ''}Environment variable ${key} is required`,
    )
  }

  const enumValues = Object.values(enumObject)
  if (!enumValues.includes(value as T[keyof T])) {
    throw new ConfigurationError(
      key,
      value,
      `one of: ${enumValues.join(', ')}`,
      `${description ? `${description}: ` : ''}Environment variable ${key} must be one of: ${enumValues.join(', ')}`,
    )
  }

  return value as T[keyof T]
}

/**
 * Returns an optional enum with default fallback
 */
export function getOptionalEnum<T extends Record<string, string>>(
  value: string | undefined,
  enumObject: T,
  defaultValue: T[keyof T],
): T[keyof T] {
  if (!value) return defaultValue
  
  const enumValues = Object.values(enumObject)
  return enumValues.includes(value as T[keyof T])
    ? (value as T[keyof T])
    : defaultValue
}

/**
 * Parses a comma-separated string into an array
 */
export function getStringArray(
  value: string | undefined,
  defaultValue: string[] = [],
): string[] {
  if (!value || value.trim() === '') return defaultValue
  
  return value
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0)
}

/**
 * Validates that all required environment variables are present
 */
export function validateRequiredEnvVars(requiredVars: string[]): void {
  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    throw new ConfigurationError(
      'ENVIRONMENT_VARIABLES',
      missing,
      'defined environment variables',
      `Missing required environment variables: ${missing.join(', ')}`,
    )
  }
}

/**
 * Generates a strong random secret if not provided
 */
export function getSecretOrGenerate(
  key: string,
  value: string | undefined,
  length: number = 32,
): string {
  if (value && value.length >= length) {
    return value
  }

  // Generate a random secret for any environment if not provided
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  // Only warn in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(`⚠️  Generated ${key} for development. Set it explicitly in production!`)
  }
  
  return result
} 