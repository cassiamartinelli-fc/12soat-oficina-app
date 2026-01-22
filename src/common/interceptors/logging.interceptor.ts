import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { logger } from '../logger/winston.logger'
import * as newrelic from 'newrelic'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const { method, url, body, headers } = request
    const userAgent = headers['user-agent'] || ''
    const requestId = headers['x-request-id'] || this.generateRequestId()

    request.requestId = requestId

    const startTime = Date.now()

    logger.info('Incoming request', {
      requestId,
      method,
      url,
      userAgent,
      body: this.sanitizeBody(body),
      timestamp: new Date().toISOString(),
      'trace.id': newrelic.getTransaction()?.traceId,
      'span.id': newrelic.getTransaction()?.id,
    })

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse()
          const statusCode = response.statusCode
          const duration = Date.now() - startTime

          logger.info('Request completed', {
            requestId,
            method,
            url,
            statusCode,
            duration,
            timestamp: new Date().toISOString(),
            'trace.id': newrelic.getTransaction()?.traceId,
            'span.id': newrelic.getTransaction()?.id,
          })
        },
        error: (error) => {
          const duration = Date.now() - startTime

          logger.error('Request failed', {
            requestId,
            method,
            url,
            duration,
            error: {
              message: error.message,
              stack: error.stack,
              name: error.name,
            },
            timestamp: new Date().toISOString(),
            'trace.id': newrelic.getTransaction()?.traceId,
            'span.id': newrelic.getTransaction()?.id,
          })
        },
      })
    )
  }

  private generateRequestId(): string {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private sanitizeBody(body: any): any {
    if (!body) return undefined

    const sanitized = { ...body }
    const sensitiveFields = ['password', 'token', 'apiKey', 'secret']

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***'
      }
    })

    return sanitized
  }
}
