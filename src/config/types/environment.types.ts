/**
 * Environment Types and Enums
 * Defines all types used in the configuration system
 */

export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test',
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

export enum DatabaseType {
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
  SQLITE = 'sqlite',
}

export interface DatabaseConfig {
  readonly type: DatabaseType
  readonly host: string
  readonly port: number
  readonly username: string
  readonly password: string
  readonly database: string
  readonly synchronize: boolean
  readonly logging: boolean
  readonly ssl: boolean
  readonly maxConnections: number
  readonly connectTimeoutMS: number
}

export interface MongoConfig {
  readonly uri: string
  readonly database: string
  readonly maxPoolSize: number
  readonly serverSelectionTimeoutMS: number
  readonly socketTimeoutMS: number
}

export interface RedisConfig {
  readonly host: string
  readonly port: number
  readonly password?: string
  readonly db: number
  readonly maxRetriesPerRequest: number
  readonly retryDelayOnFailover: number
}

export interface JwtConfig {
  readonly secret: string
  readonly expiresIn: string
  readonly refreshSecret: string
  readonly refreshExpiresIn: string
  readonly algorithm: string
}

export interface AppConfig {
  readonly name: string
  readonly version: string
  readonly description: string
  readonly port: number
  readonly environment: Environment
  readonly apiPrefix: string
  readonly corsOrigins: string[]
  readonly logLevel: LogLevel
  readonly timezone: string
}

export interface SecurityConfig {
  readonly bcryptRounds: number
  readonly rateLimitTtl: number
  readonly rateLimitMax: number
  readonly sessionSecret: string
  readonly cookieSecret: string
  readonly csrfSecret: string
}

export interface ThirdPartyConfig {
  readonly stripe: {
    readonly publicKey: string
    readonly secretKey: string
    readonly webhookSecret: string
  }
  readonly aws: {
    readonly accessKeyId: string
    readonly secretAccessKey: string
    readonly region: string
    readonly s3Bucket: string
  }
  readonly smtp: {
    readonly host: string
    readonly port: number
    readonly secure: boolean
    readonly user: string
    readonly password: string
    readonly fromEmail: string
  }
}

export interface MonitoringConfig {
  readonly alertsEnabled: boolean
  readonly alertEmail: string
  readonly slackWebhookUrl?: string
  readonly logRetentionDays: number
  readonly metricsEnabled: boolean
  readonly healthCheckInterval: number
}

/**
 * Complete application configuration interface
 */
export interface AppConfiguration {
  readonly app: AppConfig
  readonly database: DatabaseConfig
  readonly mongo: MongoConfig
  readonly redis: RedisConfig
  readonly jwt: JwtConfig
  readonly security: SecurityConfig
  readonly thirdParty: ThirdPartyConfig
  readonly monitoring: MonitoringConfig
} 