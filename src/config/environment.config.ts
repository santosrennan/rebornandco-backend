/**
 * Application Configuration
 * Centralized, type-safe configuration management for the entire application
 *
 * @author RebornAndCo Team
 * @description This module provides a single source of truth for all environment
 * configurations with proper validation, type safety, and detailed error reporting.
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import {
  AppConfiguration,
  Environment,
  LogLevel,
  DatabaseType,
} from './types/environment.types'
import {
  getRequiredString,
  getOptionalString,
  getOptionalNumber,
  getOptionalBoolean,
  getOptionalEnum,
  getStringArray,
  getSecretOrGenerate,
  validateRequiredEnvVars,
  ConfigurationError,
} from './utils/validation.utils'

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env')
dotenv.config({ path: envPath })

/**
 * Current environment
 */
const NODE_ENV = getOptionalEnum(
  process.env.NODE_ENV,
  Environment,
  Environment.DEVELOPMENT,
)

/**
 * Validates configuration on startup
 */
function validateConfiguration(): void {
  try {
    // Validate critical environment variables first
    const criticalVars = [
      'DB_HOST',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_DATABASE',
    ]

    // Only require JWT secrets in production
    if (NODE_ENV === Environment.PRODUCTION) {
      criticalVars.push('JWT_SECRET', 'JWT_REFRESH_SECRET')
    }

    validateRequiredEnvVars(criticalVars)
  } catch (error) {
    console.error('❌ Configuration validation failed:')
    if (error instanceof ConfigurationError) {
      console.error(`   Field: ${error.field}`)
      if (NODE_ENV !== Environment.PRODUCTION) {
        console.error(`   Value: ${error.value}`)
      }
      console.error(`   Expected: ${error.expectedType}`)
      console.error(`   Message: ${error.message}`)
    } else {
      console.error(`   ${(error as Error).message}`)
    }

    if (NODE_ENV !== Environment.PRODUCTION) {
      console.error(
        '\n💡 Please check your .env file and ensure all required variables are set.',
      )
    }
    process.exit(1)
  }
}

/**
 * Sanitizes sensitive data for logging
 */
function sanitizeForLogging(
  value: string,
  type: 'password' | 'url' | 'host' = 'password',
): string {
  if (!value) return '[NOT_SET]'

  switch (type) {
    case 'password':
      return '***'
    case 'url':
      // Show only protocol and masked host
      try {
        const url = new URL(value)
        return `${url.protocol}//***.***:${url.port || 'default'}/***`
      } catch {
        return '***://***:***/***'
      }
    case 'host':
      return value.replace(/\./g, '.***')
    default:
      return '***'
  }
}

/**
 * Complete application configuration
 * All configuration is loaded and validated once at application startup
 */
function createConfiguration(): AppConfiguration {
  validateConfiguration()

  const config: AppConfiguration = {
    app: {
      name: getOptionalString(process.env.APP_NAME, 'RebornAndCo API'),
      version: getOptionalString(process.env.APP_VERSION, '1.0.0'),
      description: getOptionalString(
        process.env.APP_DESCRIPTION,
        'Professional Reborn Dolls Management Platform',
      ),
      port: getOptionalNumber(process.env.PORT, 3000),
      environment: NODE_ENV,
      apiPrefix: getOptionalString(process.env.API_PREFIX, 'api/v1'),
      corsOrigins: getStringArray(process.env.CORS_ORIGINS, [
        'http://localhost:3000',
      ]),
      logLevel: getOptionalEnum(
        process.env.LOG_LEVEL,
        LogLevel,
        NODE_ENV === Environment.PRODUCTION ? LogLevel.INFO : LogLevel.DEBUG,
      ),
      timezone: getOptionalString(process.env.TZ, 'UTC'),
    },

    database: {
      type: getOptionalEnum(
        process.env.DB_TYPE,
        DatabaseType,
        DatabaseType.POSTGRES,
      ),
      host: getRequiredString(
        'DB_HOST',
        process.env.DB_HOST,
        'Database host address',
      ),
      port: getOptionalNumber(process.env.DB_PORT, 5432),
      username: getRequiredString(
        'DB_USERNAME',
        process.env.DB_USERNAME,
        'Database username',
      ),
      password: getRequiredString(
        'DB_PASSWORD',
        process.env.DB_PASSWORD,
        'Database password',
      ),
      database: getRequiredString(
        'DB_DATABASE',
        process.env.DB_DATABASE,
        'Database name',
      ),
      synchronize: getOptionalBoolean(
        process.env.DB_SYNCHRONIZE,
        NODE_ENV !== Environment.PRODUCTION,
      ),
      logging: getOptionalBoolean(
        process.env.DB_LOGGING,
        NODE_ENV === Environment.DEVELOPMENT,
      ),
      ssl: getOptionalBoolean(
        process.env.DB_SSL,
        NODE_ENV === Environment.PRODUCTION,
      ),
      maxConnections: getOptionalNumber(process.env.DB_MAX_CONNECTIONS, 10),
      connectTimeoutMS: getOptionalNumber(
        process.env.DB_CONNECT_TIMEOUT,
        30000,
      ),
    },

    mongo: {
      uri: getOptionalString(
        process.env.MONGODB_URI,
        'mongodb://localhost:27017/rebornandco-logs',
      ),
      database: getOptionalString(
        process.env.MONGODB_DATABASE,
        'rebornandco-logs',
      ),
      maxPoolSize: getOptionalNumber(process.env.MONGODB_MAX_POOL_SIZE, 10),
      serverSelectionTimeoutMS: getOptionalNumber(
        process.env.MONGODB_SERVER_SELECTION_TIMEOUT,
        5000,
      ),
      socketTimeoutMS: getOptionalNumber(
        process.env.MONGODB_SOCKET_TIMEOUT,
        45000,
      ),
    },

    redis: {
      host: getOptionalString(process.env.REDIS_HOST, 'localhost'),
      port: getOptionalNumber(process.env.REDIS_PORT, 6379),
      password: process.env.REDIS_PASSWORD,
      db: getOptionalNumber(process.env.REDIS_DB, 0),
      maxRetriesPerRequest: getOptionalNumber(process.env.REDIS_MAX_RETRIES, 3),
      retryDelayOnFailover: getOptionalNumber(
        process.env.REDIS_RETRY_DELAY,
        100,
      ),
    },

    jwt: {
      secret: getSecretOrGenerate('JWT_SECRET', process.env.JWT_SECRET, 32),
      expiresIn: getOptionalString(process.env.JWT_EXPIRES_IN, '24h'),
      refreshSecret: getSecretOrGenerate(
        'JWT_REFRESH_SECRET',
        process.env.JWT_REFRESH_SECRET,
        32,
      ),
      refreshExpiresIn: getOptionalString(
        process.env.JWT_REFRESH_EXPIRES_IN,
        '30d',
      ),
      algorithm: getOptionalString(process.env.JWT_ALGORITHM, 'HS256'),
    },

    security: {
      bcryptRounds: getOptionalNumber(process.env.BCRYPT_ROUNDS, 12),
      rateLimitTtl: getOptionalNumber(process.env.RATE_LIMIT_TTL, 60000),
      rateLimitMax: getOptionalNumber(process.env.RATE_LIMIT_MAX, 20),
      sessionSecret: getSecretOrGenerate(
        'SESSION_SECRET',
        process.env.SESSION_SECRET,
        32,
      ),
      cookieSecret: getSecretOrGenerate(
        'COOKIE_SECRET',
        process.env.COOKIE_SECRET,
        32,
      ),
      csrfSecret: getSecretOrGenerate(
        'CSRF_SECRET',
        process.env.CSRF_SECRET,
        32,
      ),
    },

    thirdParty: {
      stripe: {
        publicKey: getOptionalString(process.env.STRIPE_PUBLIC_KEY, ''),
        secretKey: getOptionalString(process.env.STRIPE_SECRET_KEY, ''),
        webhookSecret: getOptionalString(process.env.STRIPE_WEBHOOK_SECRET, ''),
      },
      aws: {
        accessKeyId: getOptionalString(process.env.AWS_ACCESS_KEY_ID, ''),
        secretAccessKey: getOptionalString(
          process.env.AWS_SECRET_ACCESS_KEY,
          '',
        ),
        region: getOptionalString(process.env.AWS_REGION, 'us-east-1'),
        s3Bucket: getOptionalString(process.env.AWS_S3_BUCKET, ''),
      },
      smtp: {
        host: getOptionalString(process.env.SMTP_HOST, 'localhost'),
        port: getOptionalNumber(process.env.SMTP_PORT, 587),
        secure: getOptionalBoolean(process.env.SMTP_SECURE, false),
        user: getOptionalString(process.env.SMTP_USER, ''),
        password: getOptionalString(process.env.SMTP_PASSWORD, ''),
        fromEmail: getOptionalString(
          process.env.SMTP_FROM_EMAIL,
          'noreply@rebornandco.com',
        ),
      },
    },

    monitoring: {
      alertsEnabled: getOptionalBoolean(
        process.env.MONITORING_ALERTS_ENABLED,
        true,
      ),
      alertEmail: getOptionalString(
        process.env.MONITORING_ALERT_EMAIL,
        'admin@rebornandco.com',
      ),
      slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
      logRetentionDays: getOptionalNumber(process.env.LOG_RETENTION_DAYS, 90),
      metricsEnabled: getOptionalBoolean(process.env.METRICS_ENABLED, true),
      healthCheckInterval: getOptionalNumber(
        process.env.HEALTH_CHECK_INTERVAL,
        30000,
      ),
    },
  }

  // ONLY show sanitized config summary in development - NEVER in production
  if (NODE_ENV === Environment.DEVELOPMENT) {
    console.log('📋 Configuration Summary (Development):')
    console.log(`   Environment: ${config.app.environment}`)
    console.log(`   Port: ${config.app.port}`)
    console.log(
      `   Database: ${config.database.type}://${sanitizeForLogging(config.database.host, 'host')}:${config.database.port}/${config.database.database}`,
    )
    console.log(`   MongoDB: ${sanitizeForLogging(config.mongo.uri, 'url')}`)
    console.log(
      `   Redis: ${sanitizeForLogging(config.redis.host, 'host')}:${config.redis.port}`,
    )
    console.log(`   Log Level: ${config.app.logLevel}`)
    console.log(`   JWT Expiry: ${config.jwt.expiresIn}`)
    console.log(`   CORS Origins: ${config.app.corsOrigins.length} configured`)
  }

  return config
}

/**
 * Singleton configuration instance
 * This ensures configuration is loaded only once and cached
 */
let configInstance: AppConfiguration | null = null

/**
 * Get the application configuration
 * Loads and validates configuration on first call, returns cached instance on subsequent calls
 */
export function getConfiguration(): AppConfiguration {
  if (!configInstance) {
    configInstance = createConfiguration()
  }
  return configInstance
}

/**
 * Check if current environment is production
 */
export function isProduction(): boolean {
  return getConfiguration().app.environment === Environment.PRODUCTION
}

/**
 * Check if current environment is development
 */
export function isDevelopment(): boolean {
  return getConfiguration().app.environment === Environment.DEVELOPMENT
}

/**
 * Shorthand exports for common configuration sections
 */
export const config = {
  get app() {
    return getConfiguration().app
  },
  get database() {
    return getConfiguration().database
  },
  get mongo() {
    return getConfiguration().mongo
  },
  get redis() {
    return getConfiguration().redis
  },
  get jwt() {
    return getConfiguration().jwt
  },
  get security() {
    return getConfiguration().security
  },
  get thirdParty() {
    return getConfiguration().thirdParty
  },
  get monitoring() {
    return getConfiguration().monitoring
  },
}

/**
 * Development helper: reload configuration (use with caution)
 */
export function reloadConfiguration(): AppConfiguration {
  if (isProduction()) {
    throw new Error('Configuration reload is not allowed in production')
  }
  configInstance = null
  return getConfiguration()
}

// Export types for use in other modules
export * from './types/environment.types'
export * from './utils/validation.utils'

// Initialize configuration on module load
getConfiguration()
