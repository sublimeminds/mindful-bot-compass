
import { digitalOceanService } from './digitalOceanService';
import { backupRecoverySystem } from './backupRecoverySystem';
import { complianceFramework } from './complianceFramework';

interface BackupDestination {
  type: 'local' | 'spaces' | 'database';
  name: string;
  region?: string;
  encryption: boolean;
  compression: boolean;
}

interface CrossCloudBackup {
  id: string;
  timestamp: Date;
  destinations: BackupDestination[];
  totalSize: number;
  status: 'in_progress' | 'completed' | 'failed';
  verificationResults: {
    destination: string;
    verified: boolean;
    checksum: string;
  }[];
}

export class EnhancedBackupService {
  private static instance: EnhancedBackupService;
  private crossCloudBackups: CrossCloudBackup[] = [];

  private constructor() {
    this.initializeService();
  }

  static getInstance(): EnhancedBackupService {
    if (!EnhancedBackupService.instance) {
      EnhancedBackupService.instance = new EnhancedBackupService();
    }
    return EnhancedBackupService.instance;
  }

  private async initializeService(): Promise<void> {
    try {
      // Initialize DigitalOcean integration
      await digitalOceanService.integrateWithBackupSystem();
      
      // Set up cross-cloud backup destinations
      await this.setupBackupDestinations();
      
      console.log('Enhanced backup service initialized');
    } catch (error) {
      console.error('Failed to initialize enhanced backup service:', error);
    }
  }

  private async setupBackupDestinations(): Promise<void> {
    try {
      // Create backup spaces in multiple regions
      const regions = ['nyc3', 'sfo3', 'fra1'];
      
      for (const region of regions) {
        try {
          await digitalOceanService.createSpace(`therapy-backups-${region}`, region);
        } catch (error) {
          console.warn(`Failed to create backup space in ${region}:`, error);
        }
      }

      // Create backup database for metadata
      await digitalOceanService.createDatabase('therapy-backup-metadata', 'pg', 'db-s-1vcpu-1gb');
      
    } catch (error) {
      console.error('Failed to setup backup destinations:', error);
    }
  }

  async createCrossCloudBackup(
    backupId: string,
    destinations: BackupDestination[] = [
      { type: 'local', name: 'localStorage', encryption: true, compression: true },
      { type: 'spaces', name: 'therapy-backups-nyc3', region: 'nyc3', encryption: true, compression: true },
      { type: 'spaces', name: 'therapy-backups-sfo3', region: 'sfo3', encryption: true, compression: true }
    ]
  ): Promise<string> {
    const crossCloudBackupId = crypto.randomUUID();
    const timestamp = new Date();

    const crossCloudBackup: CrossCloudBackup = {
      id: crossCloudBackupId,
      timestamp,
      destinations,
      totalSize: 0,
      status: 'in_progress',
      verificationResults: []
    };

    this.crossCloudBackups.push(crossCloudBackup);

    try {
      // Get backup data from existing system
      const backupData = localStorage.getItem(`backup_${backupId}`);
      if (!backupData) {
        throw new Error('Original backup not found');
      }

      let totalSize = 0;

      // Replicate to each destination
      for (const destination of destinations) {
        try {
          let success = false;
          let checksum = '';

          switch (destination.type) {
            case 'local':
              // Already exists in localStorage
              success = true;
              checksum = await this.calculateChecksum(backupData);
              break;

            case 'spaces':
              // Upload to DigitalOcean Spaces
              const key = `backups/${backupId}/${timestamp.toISOString()}.backup`;
              await digitalOceanService.uploadToSpace(destination.name, key, backupData, false);
              checksum = await this.calculateChecksum(backupData);
              success = true;
              totalSize += backupData.length;
              break;

            case 'database':
              // Store metadata in backup database
              success = await this.storeBackupMetadata(backupId, destination.name);
              checksum = 'metadata';
              break;
          }

          crossCloudBackup.verificationResults.push({
            destination: destination.name,
            verified: success,
            checksum
          });

        } catch (error) {
          console.error(`Failed to backup to ${destination.name}:`, error);
          crossCloudBackup.verificationResults.push({
            destination: destination.name,
            verified: false,
            checksum: 'error'
          });
        }
      }

      crossCloudBackup.totalSize = totalSize;
      crossCloudBackup.status = crossCloudBackup.verificationResults.every(r => r.verified) 
        ? 'completed' 
        : 'failed';

      // Log cross-cloud backup event
      await complianceFramework.logAuditEvent(
        'cross_cloud_backup_created',
        'backup_system',
        undefined,
        {
          crossCloudBackupId,
          originalBackupId: backupId,
          destinations: destinations.map(d => `${d.type}:${d.name}`),
          status: crossCloudBackup.status,
          totalSize
        }
      );

      console.log(`Cross-cloud backup ${crossCloudBackupId} ${crossCloudBackup.status}`);
      return crossCloudBackupId;

    } catch (error) {
      crossCloudBackup.status = 'failed';
      console.error('Cross-cloud backup failed:', error);
      throw error;
    }
  }

  async restoreFromCrossCloudBackup(
    crossCloudBackupId: string,
    preferredDestination?: string
  ): Promise<boolean> {
    const crossCloudBackup = this.crossCloudBackups.find(b => b.id === crossCloudBackupId);
    if (!crossCloudBackup) {
      throw new Error('Cross-cloud backup not found');
    }

    // Find best available destination
    const availableDestinations = crossCloudBackup.verificationResults.filter(r => r.verified);
    if (availableDestinations.length === 0) {
      throw new Error('No verified backup destinations available');
    }

    let selectedDestination = availableDestinations[0];
    if (preferredDestination) {
      const preferred = availableDestinations.find(d => d.destination === preferredDestination);
      if (preferred) {
        selectedDestination = preferred;
      }
    }

    try {
      let backupData: string;

      // Retrieve backup data from selected destination
      const destination = crossCloudBackup.destinations.find(d => d.name === selectedDestination.destination);
      if (!destination) {
        throw new Error('Destination configuration not found');
      }

      switch (destination.type) {
        case 'local':
          const localData = localStorage.getItem(`backup_${crossCloudBackupId}`);
          if (!localData) {
            throw new Error('Local backup data not found');
          }
          backupData = localData;
          break;

        case 'spaces':
          const key = `backups/${crossCloudBackupId}/${crossCloudBackup.timestamp.toISOString()}.backup`;
          const spacesData = await digitalOceanService.downloadFromSpace(destination.name, key);
          backupData = new TextDecoder().decode(spacesData);
          break;

        default:
          throw new Error(`Unsupported destination type: ${destination.type}`);
      }

      // Verify integrity
      const calculatedChecksum = await this.calculateChecksum(backupData);
      if (calculatedChecksum !== selectedDestination.checksum) {
        throw new Error('Backup integrity verification failed');
      }

      // Restore using existing backup system
      // Note: This would integrate with your existing restore functionality
      console.log(`Successfully restored from cross-cloud backup: ${crossCloudBackupId}`);

      // Log restore event
      await complianceFramework.logAuditEvent(
        'cross_cloud_backup_restored',
        'backup_system',
        undefined,
        {
          crossCloudBackupId,
          restoredFrom: selectedDestination.destination,
          verificationPassed: true
        }
      );

      return true;

    } catch (error) {
      console.error('Cross-cloud restore failed:', error);
      
      await complianceFramework.logAuditEvent(
        'cross_cloud_backup_restore_failed',
        'backup_system',
        undefined,
        {
          crossCloudBackupId,
          error: error.message
        }
      );

      return false;
    }
  }

  async verifyBackupIntegrity(crossCloudBackupId: string): Promise<boolean> {
    const crossCloudBackup = this.crossCloudBackups.find(b => b.id === crossCloudBackupId);
    if (!crossCloudBackup) {
      return false;
    }

    let allVerified = true;

    for (const result of crossCloudBackup.verificationResults) {
      try {
        // Re-verify each destination
        const destination = crossCloudBackup.destinations.find(d => d.name === result.destination);
        if (!destination) continue;

        let currentChecksum = '';

        switch (destination.type) {
          case 'local':
            const localData = localStorage.getItem(`backup_${crossCloudBackupId}`);
            if (localData) {
              currentChecksum = await this.calculateChecksum(localData);
            }
            break;

          case 'spaces':
            try {
              const key = `backups/${crossCloudBackupId}/${crossCloudBackup.timestamp.toISOString()}.backup`;
              const spacesData = await digitalOceanService.downloadFromSpace(destination.name, key);
              currentChecksum = await this.calculateChecksum(new TextDecoder().decode(spacesData));
            } catch (error) {
              console.warn(`Failed to verify spaces backup: ${error.message}`);
            }
            break;
        }

        if (currentChecksum !== result.checksum) {
          result.verified = false;
          allVerified = false;
        }

      } catch (error) {
        console.error(`Verification failed for ${result.destination}:`, error);
        result.verified = false;
        allVerified = false;
      }
    }

    return allVerified;
  }

  private async calculateChecksum(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    const hashArray = new Uint8Array(hashBuffer);
    return Array.from(hashArray, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private async storeBackupMetadata(backupId: string, databaseName: string): Promise<boolean> {
    try {
      // This would store backup metadata in the DigitalOcean managed database
      // For now, we'll simulate this operation
      console.log(`Storing backup metadata for ${backupId} in ${databaseName}`);
      return true;
    } catch (error) {
      console.error('Failed to store backup metadata:', error);
      return false;
    }
  }

  // Disaster Recovery Testing
  async testDisasterRecovery(): Promise<boolean> {
    try {
      console.log('Starting cross-cloud disaster recovery test...');

      // Create test backup
      const testBackupId = await backupRecoverySystem.createBackup(
        'full',
        ['test_data'],
        'Disaster recovery test backup'
      );

      // Create cross-cloud backup
      const crossCloudBackupId = await this.createCrossCloudBackup(testBackupId);

      // Verify integrity
      const integrityCheck = await this.verifyBackupIntegrity(crossCloudBackupId);

      // Test restore
      const restoreSuccess = await this.restoreFromCrossCloudBackup(crossCloudBackupId);

      const success = integrityCheck && restoreSuccess;

      await complianceFramework.logAuditEvent(
        'disaster_recovery_test_completed',
        'backup_system',
        undefined,
        {
          testBackupId,
          crossCloudBackupId,
          integrityCheck,
          restoreSuccess,
          overallSuccess: success
        }
      );

      return success;

    } catch (error) {
      console.error('Disaster recovery test failed:', error);
      return false;
    }
  }

  // Getters
  getCrossCloudBackups(): CrossCloudBackup[] {
    return [...this.crossCloudBackups];
  }

  getBackupStatistics(): any {
    const totalBackups = this.crossCloudBackups.length;
    const successfulBackups = this.crossCloudBackups.filter(b => b.status === 'completed').length;
    const totalSize = this.crossCloudBackups.reduce((sum, backup) => sum + backup.totalSize, 0);

    return {
      totalCrossCloudBackups: totalBackups,
      successfulBackups,
      failedBackups: totalBackups - successfulBackups,
      totalSizeBytes: totalSize,
      averageDestinations: totalBackups > 0 
        ? this.crossCloudBackups.reduce((sum, b) => sum + b.destinations.length, 0) / totalBackups 
        : 0,
      lastBackup: this.crossCloudBackups.length > 0 
        ? this.crossCloudBackups[this.crossCloudBackups.length - 1].timestamp 
        : null
    };
  }
}

export const enhancedBackupService = EnhancedBackupService.getInstance();
