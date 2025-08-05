interface ErrorLog {
  message: string;
  stack?: string;
  timestamp: Date;
  userAgent?: string;
  url?: string;
  userId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private errors: ErrorLog[] = [];
  
  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }
  
  log(error: Error | string, severity: ErrorLog['severity'] = 'medium', context?: Record<string, any>) {
    const errorLog: ErrorLog = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      timestamp: new Date(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      severity,
      context
    };
    
    this.errors.push(errorLog);
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error logged:', errorLog);
    }
    
    // In production, you might want to send to an external service
    if (import.meta.env.PROD && severity === 'critical') {
      this.sendToExternalService(errorLog);
    }
    
    // Keep only last 50 errors to prevent memory issues
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50);
    }
  }
  
  getErrors(): ErrorLog[] {
    return [...this.errors];
  }
  
  clearErrors(): void {
    this.errors = [];
  }
  
  private async sendToExternalService(errorLog: ErrorLog): Promise<void> {
    try {
      // Example: Send to your error tracking service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorLog)
      // });
      console.log('Would send to external service:', errorLog);
    } catch (err) {
      console.error('Failed to send error to external service:', err);
    }
  }
}

// Utility functions for common error scenarios
export const handleFirebaseError = (error: any, context?: Record<string, any>) => {
  const logger = ErrorLogger.getInstance();
  
  let severity: ErrorLog['severity'] = 'medium';
  let friendlyMessage = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
  
  // Map Firebase error codes to user-friendly messages
  switch (error?.code) {
    case 'auth/user-not-found':
      friendlyMessage = 'Usuario no encontrado. Por favor, verifica tus credenciales.';
      severity = 'low';
      break;
    case 'auth/wrong-password':
      friendlyMessage = 'Contraseña incorrecta. Por favor, inténtalo de nuevo.';
      severity = 'low';
      break;
    case 'auth/network-request-failed':
      friendlyMessage = 'Error de conexión. Por favor, verifica tu conexión a internet.';
      severity = 'medium';
      break;
    case 'auth/too-many-requests':
      friendlyMessage = 'Demasiados intentos. Por favor, espera un momento antes de intentar de nuevo.';
      severity = 'medium';
      break;
    case 'permission-denied':
      friendlyMessage = 'No tienes permisos para realizar esta acción.';
      severity = 'high';
      break;
    default:
      if (error?.message?.includes('network')) {
        friendlyMessage = 'Error de conexión. Por favor, verifica tu conexión a internet.';
        severity = 'medium';
      }
  }
  
  logger.log(error, severity, { ...context, friendlyMessage });
  return friendlyMessage;
};

export const handleMapError = (error: any, context?: Record<string, any>) => {
  const logger = ErrorLogger.getInstance();
  logger.log(error, 'medium', { ...context, component: 'map' });
  return 'Error al cargar el mapa. Por favor, recarga la página.';
};

export const handleDataSyncError = (error: any, context?: Record<string, any>) => {
  const logger = ErrorLogger.getInstance();
  logger.log(error, 'high', { ...context, component: 'dataSync' });
  return 'Error al sincronizar datos. Tus cambios se guardarán localmente y se sincronizarán cuando se restablezca la conexión.';
};

export const logger = ErrorLogger.getInstance();

// Global error handler setup
export const setupGlobalErrorHandling = () => {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('error', (event) => {
    logger.log(event.error || event.message, 'high', {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    logger.log(event.reason, 'high', {
      type: 'unhandledPromiseRejection'
    });
  });
};