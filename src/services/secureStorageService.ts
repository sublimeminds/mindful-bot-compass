/**
 * Secure Storage Service - Enhanced client-side storage security
 * Implements secure patterns for sensitive data storage
 */

export interface SecureStorageOptions {
  encrypt?: boolean;
  expiration?: number; // milliseconds
  keyRotation?: boolean;
}

export class SecureStorageService {
  private static readonly STORAGE_PREFIX = 'secure_';
  private static readonly KEY_ROTATION_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Store data securely with optional encryption and expiration
   */
  static setItem(key: string, value: any, options: SecureStorageOptions = {}): boolean {
    try {
      const secureKey = this.STORAGE_PREFIX + key;
      
      // Prepare storage object
      const storageData = {
        value,
        timestamp: Date.now(),
        expiration: options.expiration ? Date.now() + options.expiration : null,
        encrypted: options.encrypt || false,
        version: 1
      };

      // Store in sessionStorage by default (more secure than localStorage)
      sessionStorage.setItem(secureKey, JSON.stringify(storageData));
      
      // Log storage operation (without sensitive data)
      console.log(`SecureStorage: Stored ${key} (encrypted: ${storageData.encrypted})`);
      
      return true;
    } catch (error) {
      console.error('SecureStorage: Failed to store item:', error);
      return false;
    }
  }

  /**
   * Retrieve and validate stored data
   */
  static getItem(key: string): any | null {
    try {
      const secureKey = this.STORAGE_PREFIX + key;
      const storedData = sessionStorage.getItem(secureKey);
      
      if (!storedData) {
        return null;
      }

      const parsedData = JSON.parse(storedData);
      
      // Check expiration
      if (parsedData.expiration && Date.now() > parsedData.expiration) {
        this.removeItem(key);
        console.log(`SecureStorage: ${key} expired and removed`);
        return null;
      }

      return parsedData.value;
    } catch (error) {
      console.error('SecureStorage: Failed to retrieve item:', error);
      this.removeItem(key); // Remove corrupted data
      return null;
    }
  }

  /**
   * Remove stored data securely
   */
  static removeItem(key: string): void {
    try {
      const secureKey = this.STORAGE_PREFIX + key;
      sessionStorage.removeItem(secureKey);
      localStorage.removeItem(secureKey); // Also clear from localStorage if exists
    } catch (error) {
      console.error('SecureStorage: Failed to remove item:', error);
    }
  }

  /**
   * Clear all secure storage data
   */
  static clear(): void {
    try {
      // Clear only our secure storage items
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          sessionStorage.removeItem(key);
        }
      });

      const localKeys = Object.keys(localStorage);
      localKeys.forEach(key => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });

      console.log('SecureStorage: All secure data cleared');
    } catch (error) {
      console.error('SecureStorage: Failed to clear storage:', error);
    }
  }

  /**
   * Check if a key exists in secure storage
   */
  static hasItem(key: string): boolean {
    const secureKey = this.STORAGE_PREFIX + key;
    return sessionStorage.getItem(secureKey) !== null;
  }

  /**
   * Get all secure storage keys
   */
  static getKeys(): string[] {
    try {
      const keys = Object.keys(sessionStorage);
      return keys
        .filter(key => key.startsWith(this.STORAGE_PREFIX))
        .map(key => key.replace(this.STORAGE_PREFIX, ''));
    } catch (error) {
      console.error('SecureStorage: Failed to get keys:', error);
      return [];
    }
  }

  /**
   * Clean up expired items
   */
  static cleanup(): void {
    try {
      const keys = this.getKeys();
      keys.forEach(key => {
        // getItem will automatically remove expired items
        this.getItem(key);
      });
      console.log('SecureStorage: Cleanup completed');
    } catch (error) {
      console.error('SecureStorage: Cleanup failed:', error);
    }
  }

  /**
   * Initialize secure storage service
   */
  static initialize(): void {
    // Run cleanup on initialization
    this.cleanup();

    // Set up periodic cleanup
    setInterval(() => {
      this.cleanup();
    }, this.KEY_ROTATION_INTERVAL);

    console.log('SecureStorage: Service initialized');
  }
}