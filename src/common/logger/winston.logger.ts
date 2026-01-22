export class Logger {
  private static formatLog(level: string, message: string, meta?: any) {
    const log = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: 'oficina-mecanica-api',
      environment: process.env.NODE_ENV || 'development',
      ...meta,
    }
    return JSON.stringify(log)
  }

  static info(message: string, meta?: any) {
    console.log(this.formatLog('info', message, meta))
  }

  static error(message: string, meta?: any) {
    console.error(this.formatLog('error', message, meta))
  }

  static warn(message: string, meta?: any) {
    console.warn(this.formatLog('warn', message, meta))
  }

  static debug(message: string, meta?: any) {
    console.debug(this.formatLog('debug', message, meta))
  }
}

export const logger = Logger
