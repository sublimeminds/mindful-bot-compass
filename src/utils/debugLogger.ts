
export interface LogContext {
  component?: string;
  method?: string;
  userId?: string;
  sessionId?: string;
  [key: string]: any;
}

export class DebugLogger {
  private static isDevelopment = import.meta.env.DEV;
  private static logLevel = import.meta.env.VITE_LOG_LEVEL || 'info';

  static debug(message: string, context?: LogContext) {
    if (this.isDevelopment && this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${this.formatMessage(message, context)}`, context);
    }
  }

  static info(message: string, context?: LogContext) {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${this.formatMessage(message, context)}`, context);
    }
  }

  static warn(message: string, context?: LogContext) {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${this.formatMessage(message, context)}`, context);
    }
  }

  static error(message: string, error?: Error, context?: LogContext) {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${this.formatMessage(message, context)}`, { error, context });
    }
  }

  static trace(message: string, context?: LogContext) {
    if (this.isDevelopment && this.shouldLog('trace')) {
      console.trace(`[TRACE] ${this.formatMessage(message, context)}`, context);
    }
  }

  static group(label: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.group(`[GROUP] ${this.formatMessage(label, context)}`);
    }
  }

  static groupEnd() {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }

  static time(label: string) {
    if (this.isDevelopment) {
      console.time(`[TIMER] ${label}`);
    }
  }

  static timeEnd(label: string) {
    if (this.isDevelopment) {
      console.timeEnd(`[TIMER] ${label}`);
    }
  }

  private static formatMessage(message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const component = context?.component ? `[${context.component}]` : '';
    const method = context?.method ? `::${context.method}` : '';
    return `${timestamp} ${component}${method} ${message}`;
  }

  private static shouldLog(level: string): boolean {
    const levels = ['trace', 'debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }
}

// Hook for component debugging
export const useDebugLogger = (componentName: string) => {
  const log = {
    debug: (message: string, data?: any) => 
      DebugLogger.debug(message, { component: componentName, ...data }),
    info: (message: string, data?: any) => 
      DebugLogger.info(message, { component: componentName, ...data }),
    warn: (message: string, data?: any) => 
      DebugLogger.warn(message, { component: componentName, ...data }),
    error: (message: string, error?: Error, data?: any) => 
      DebugLogger.error(message, error, { component: componentName, ...data }),
    trace: (message: string, data?: any) => 
      DebugLogger.trace(message, { component: componentName, ...data }),
  };

  return log;
};
