
interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
}

export class EncryptionService {
  private static instance: EncryptionService;
  private config: EncryptionConfig;
  private encryptionKey: string | null = null;

  private constructor() {
    this.config = {
      algorithm: 'AES-256-GCM',
      keyLength: 32,
      ivLength: 12
    };
    this.initializeEncryption();
  }

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  private async initializeEncryption(): Promise<void> {
    try {
      // Derive encryption key from user session instead of localStorage
      this.encryptionKey = await this.deriveSessionKey();
    } catch (error) {
      console.error('Encryption initialization failed:', error);
    }
  }

  private async deriveSessionKey(): Promise<string> {
    // Create a session-based key derivation
    const sessionData = sessionStorage.getItem('supabase.auth.token');
    if (!sessionData) {
      // Generate temporary key for unauthenticated sessions
      return this.generateSecureKey();
    }

    try {
      const session = JSON.parse(sessionData);
      const userId = session.user?.id;
      if (!userId) {
        return this.generateSecureKey();
      }

      // Derive key from user ID using PBKDF2
      const encoder = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(userId),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      const salt = encoder.encode('therapy-app-salt-2025');
      const derivedKey = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      const exported = await crypto.subtle.exportKey('raw', derivedKey);
      return Array.from(new Uint8Array(exported), byte => byte.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('Key derivation failed:', error);
      return this.generateSecureKey();
    }
  }

  private generateSecureKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async encryptSensitiveData(data: string, context: 'therapy_notes' | 'personal_info' | 'session_data'): Promise<string | null> {
    if (!this.encryptionKey) {
      console.error('Encryption key not available');
      return null;
    }

    try {
      // Use Web Crypto API for strong encryption
      const encoder = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(this.encryptionKey),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));

      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );

      const encryptedData = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
          additionalData: encoder.encode(context)
        },
        key,
        encoder.encode(data)
      );

      // Combine salt, iv, and encrypted data
      const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(encryptedData), salt.length + iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      return null;
    }
  }

  async decryptSensitiveData(encryptedData: string, context: 'therapy_notes' | 'personal_info' | 'session_data'): Promise<string | null> {
    if (!this.encryptionKey || !encryptedData) {
      return null;
    }

    try {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      const combined = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));

      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const encrypted = combined.slice(28);

      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(this.encryptionKey),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      const key = await crypto.subtle.deriveKey(
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

      const decryptedData = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
          additionalData: encoder.encode(context)
        },
        key,
        encrypted
      );

      return decoder.decode(decryptedData);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  // Hash sensitive data for comparison without storing plaintext
  async hashSensitiveData(data: string): Promise<string | null> {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = new Uint8Array(hashBuffer);
      return Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('Hashing failed:', error);
      return null;
    }
  }

  // Rotate encryption key
  async rotateEncryptionKey(): Promise<boolean> {
    try {
      // Clear current key and regenerate from session
      this.encryptionKey = null;
      const newKey = await this.deriveSessionKey();
      this.encryptionKey = newKey;
      
      console.log('Encryption key rotated successfully');
      return true;
    } catch (error) {
      console.error('Key rotation failed:', error);
      return false;
    }
  }
}

export const encryptionService = EncryptionService.getInstance();
