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
  private static readonly ENCRYPTION_KEY_NAME = 'app_encryption_key';
  private static encryptionKey = 'app_secure_key_2024';

  /**
   * Generate or retrieve encryption key using Web Crypto API
   */
  private static async getEncryptionKey(): Promise<CryptoKey> {
    try {
      const keyData = sessionStorage.getItem(this.ENCRYPTION_KEY_NAME);
      if (keyData) {
        const keyBuffer = new Uint8Array(JSON.parse(keyData));
        return await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: 'AES-GCM' },
          false,
          ['encrypt', 'decrypt']
        );
      }
      
      // Generate new key
      const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      
      const keyBuffer = await crypto.subtle.exportKey('raw', key);
      sessionStorage.setItem(this.ENCRYPTION_KEY_NAME, JSON.stringify(Array.from(new Uint8Array(keyBuffer))));
      return key;
    } catch (error) {
      console.error('Encryption key generation failed:', error);
      throw error;
    }
  }

  /**
   * Enhanced encryption using Web Crypto API with stronger security
   */
  private static async encryptData(data: string): Promise<{ encrypted: string; iv: string; salt: string }> {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      // Generate a random IV for each encryption (96-bit for AES-GCM)
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Generate a unique salt for key derivation
      const salt = crypto.getRandomValues(new Uint8Array(16));
      
      // Derive key using PBKDF2 with higher iterations
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(this.encryptionKey + navigator.userAgent.substring(0, 100)),
        'PBKDF2',
        false,
        ['deriveKey']
      );
      
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000, // High iteration count for security
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );
      
      // Use AES-GCM for authenticated encryption
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        dataBuffer
      );
      
      return {
        encrypted: Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join(''),
        iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
        salt: Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('')
      };
    } catch (error) {
      console.error('Data encryption failed:', error);
      throw error;
    }
  }

  /**
   * Enhanced decryption using Web Crypto API with stronger security
   */
  private static async decryptData(encryptedData: string, ivHex: string, saltHex?: string): Promise<string> {
    try {
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      
      const encrypted = new Uint8Array(encryptedData.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
      const iv = new Uint8Array(ivHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
      
      let key: CryptoKey;
      
      if (saltHex) {
        // New enhanced decryption with salt-based key derivation
        const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
        
        const keyMaterial = await crypto.subtle.importKey(
          'raw',
          encoder.encode(this.encryptionKey + navigator.userAgent.substring(0, 100)),
          'PBKDF2',
          false,
          ['deriveKey']
        );
        
        key = await crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
          },
          keyMaterial,
          { name: 'AES-GCM', length: 256 },
          false,
          ['decrypt']
        );
      } else {
        // Fallback for old encryption format
        key = await this.getEncryptionKey();
      }
      
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );
      
      return decoder.decode(decryptedBuffer);
    } catch (error) {
      console.error('Data decryption failed:', error);
      throw error;
    }
  }

  /**
   * Store data securely with optional encryption and expiration
   */
  static async setItem(key: string, value: any, options: SecureStorageOptions = {}): Promise<boolean> {
    try {
      const secureKey = this.STORAGE_PREFIX + key;
      
      let processedValue = JSON.stringify(value);
      let encryptionData = null;
      
      // Encrypt if requested
      if (options.encrypt) {
        const { encrypted, iv, salt } = await this.encryptData(processedValue);
        encryptionData = { encrypted, iv, salt };
        processedValue = encrypted;
      }
      
      // Prepare storage object
      const storageData = {
        value: processedValue,
        timestamp: Date.now(),
        expiration: options.expiration ? Date.now() + options.expiration : null,
        encrypted: options.encrypt || false,
        encryptionData,
        version: 2
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
  static async getItem(key: string): Promise<any | null> {
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

      let value = parsedData.value;
      
      // Decrypt if encrypted
      if (parsedData.encrypted && parsedData.encryptionData) {
        try {
          value = await this.decryptData(
            parsedData.encryptionData.encrypted, 
            parsedData.encryptionData.iv,
            parsedData.encryptionData.salt
          );
        } catch (decryptError) {
          console.error('Failed to decrypt data, removing corrupted item:', decryptError);
          this.removeItem(key);
          return null;
        }
      }

      return parsedData.encrypted ? JSON.parse(value) : value;
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