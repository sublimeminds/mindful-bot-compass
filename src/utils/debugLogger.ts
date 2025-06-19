
interface LogContext {
  component?: string;
  method?: string;
  [key: string]: any;
}

class DebugLoggerClass {
  private isDevelopment = import.meta.env.DEV;

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, context || '');
    }
  }

  trace(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`[TRACE] ${message}`, context || '');
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, context || '');
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, context || '');
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (this.isDevelopment) {
      console.error(`[ERROR] ${message}`, error || '', context || '');
    }
  }
}

export const DebugLogger = new DebugLoggerClass();
