import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleFirebaseError, handleMapError, handleDataSyncError, logger, setupGlobalErrorHandling } from '../lib/errorHandler';

describe('ErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    logger.clearErrors();
    console.error = vi.fn();
  });

  describe('handleFirebaseError', () => {
    it('handles auth/user-not-found error', () => {
      const error = { code: 'auth/user-not-found', message: 'User not found' };
      const message = handleFirebaseError(error);
      
      expect(message).toBe('Usuario no encontrado. Por favor, verifica tus credenciales.');
      expect(logger.getErrors()).toHaveLength(1);
      expect(logger.getErrors()[0].severity).toBe('low');
    });

    it('handles auth/wrong-password error', () => {
      const error = { code: 'auth/wrong-password', message: 'Wrong password' };
      const message = handleFirebaseError(error);
      
      expect(message).toBe('Contraseña incorrecta. Por favor, inténtalo de nuevo.');
    });

    it('handles network errors', () => {
      const error = { message: 'network error occurred' };
      const message = handleFirebaseError(error);
      
      expect(message).toBe('Error de conexión. Por favor, verifica tu conexión a internet.');
    });

    it('handles unknown errors with default message', () => {
      const error = { code: 'unknown-error', message: 'Unknown error' };
      const message = handleFirebaseError(error);
      
      expect(message).toBe('Ha ocurrido un error. Por favor, inténtalo de nuevo.');
    });

    it('logs error with context', () => {
      const error = { code: 'auth/user-not-found', message: 'User not found' };
      const context = { userId: '123', action: 'login' };
      
      handleFirebaseError(error, context);
      
      const errors = logger.getErrors();
      expect(errors[0].context).toMatchObject(context);
    });
  });

  describe('handleMapError', () => {
    it('logs map errors correctly', () => {
      const error = new Error('Map failed to load');
      const message = handleMapError(error);
      
      expect(message).toBe('Error al cargar el mapa. Por favor, recarga la página.');
      expect(logger.getErrors()).toHaveLength(1);
      expect(logger.getErrors()[0].context?.component).toBe('map');
    });
  });

  describe('handleDataSyncError', () => {
    it('handles data sync errors with high severity', () => {
      const error = new Error('Sync failed');
      const message = handleDataSyncError(error);
      
      expect(message).toBe('Error al sincronizar datos. Tus cambios se guardarán localmente y se sincronizarán cuando se restablezca la conexión.');
      expect(logger.getErrors()[0].severity).toBe('high');
    });
  });

  describe('logger', () => {
    it('logs errors with proper structure', () => {
      const error = new Error('Test error');
      logger.log(error, 'medium', { test: true });
      
      const errors = logger.getErrors();
      expect(errors).toHaveLength(1);
      expect(errors[0]).toMatchObject({
        message: 'Test error',
        severity: 'medium',
        context: { test: true }
      });
      expect(errors[0].timestamp).toBeInstanceOf(Date);
    });

    it('limits stored errors to 50', () => {
      // Add 60 errors
      for (let i = 0; i < 60; i++) {
        logger.log(`Error ${i}`, 'low');
      }
      
      const errors = logger.getErrors();
      expect(errors).toHaveLength(50);
      expect(errors[0].message).toBe('Error 10'); // Should start from error 10 (60-50)
    });

    it('clears errors correctly', () => {
      logger.log('Test error', 'low');
      expect(logger.getErrors()).toHaveLength(1);
      
      logger.clearErrors();
      expect(logger.getErrors()).toHaveLength(0);
    });
  });

  describe('setupGlobalErrorHandling', () => {
    it('sets up global error listeners', () => {
      const mockAddEventListener = vi.fn();
      Object.defineProperty(window, 'addEventListener', {
        value: mockAddEventListener
      });

      setupGlobalErrorHandling();

      expect(mockAddEventListener).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockAddEventListener).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
    });

    it('does nothing when window is undefined', () => {
      const originalWindow = global.window;
      // @ts-ignore - Temporarily making window undefined for testing
      global.window = undefined;

      expect(() => setupGlobalErrorHandling()).not.toThrow();

      global.window = originalWindow;
    });
  });
});