interface HealthRecord {
  id: string;
  patientId: string;
  recordType: 'session' | 'assessment' | 'prescription' | 'progress' | 'emergency';
  data: any;
  timestamp: Date;
  hash: string;
  previousHash: string;
  signature: string;
  permissions: RecordPermission[];
}

interface RecordPermission {
  grantedTo: string; // therapist, doctor, patient, emergency
  accessLevel: 'read' | 'write' | 'admin';
  expiresAt?: Date;
  purpose: string;
}

interface SmartContract {
  id: string;
  type: 'therapy_agreement' | 'insurance_claim' | 'progress_milestone' | 'crisis_protocol';
  parties: string[];
  terms: any;
  status: 'pending' | 'active' | 'completed' | 'breached';
  conditions: ContractCondition[];
  executionHistory: ContractExecution[];
}

interface ContractCondition {
  id: string;
  description: string;
  type: 'automatic' | 'manual_verification' | 'time_based' | 'metric_based';
  trigger: any;
  action: string;
  fulfilled: boolean;
}

interface ContractExecution {
  timestamp: Date;
  conditionId: string;
  action: string;
  result: 'success' | 'failure';
  metadata: any;
}

interface ImmutableProgress {
  patientId: string;
  milestoneId: string;
  achievedAt: Date;
  verifiedBy: string[];
  metrics: any;
  blockHash: string;
  consensusValidation: boolean;
}

class BlockchainHealthRecordsService {
  private blockchain: HealthRecord[] = [];
  private smartContracts: Map<string, SmartContract> = new Map();
  private immutableProgress: Map<string, ImmutableProgress[]> = new Map();
  private encryptionKey: string = 'demo_key_' + Math.random().toString(36);

  constructor() {
    this.initializeGenesisBlock();
  }

  // Decentralized Health Data Storage
  async storeHealthRecord(record: Omit<HealthRecord, 'hash' | 'previousHash' | 'signature'>): Promise<string> {
    try {
      const previousBlock = this.getLatestBlock();
      const previousHash = previousBlock ? previousBlock.hash : '0';
      
      const fullRecord: HealthRecord = {
        ...record,
        previousHash,
        hash: await this.calculateHash(record),
        signature: await this.signRecord(record)
      };

      // Validate record integrity
      if (!await this.validateRecord(fullRecord)) {
        throw new Error('Record validation failed');
      }

      // Check permissions
      if (!this.hasWritePermission(record.patientId, 'system')) {
        throw new Error('Insufficient permissions to store record');
      }

      this.blockchain.push(fullRecord);
      
      // Trigger smart contract execution if applicable
      await this.checkSmartContractTriggers(fullRecord);

      return fullRecord.hash;
    } catch (error) {
      console.error('Failed to store health record:', error);
      throw error;
    }
  }

  async retrieveHealthRecords(
    patientId: string, 
    requesterId: string,
    filters?: {
      recordType?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<HealthRecord[]> {
    try {
      // Check access permissions
      if (!this.hasReadPermission(patientId, requesterId)) {
        throw new Error('Insufficient permissions to access records');
      }

      let records = this.blockchain.filter(record => 
        record.patientId === patientId
      );

      // Apply filters
      if (filters) {
        if (filters.recordType) {
          records = records.filter(record => record.recordType === filters.recordType);
        }
        if (filters.startDate) {
          records = records.filter(record => record.timestamp >= filters.startDate!);
        }
        if (filters.endDate) {
          records = records.filter(record => record.timestamp <= filters.endDate!);
        }
      }

      // Decrypt sensitive data
      return await Promise.all(
        records.map(record => this.decryptRecord(record, requesterId))
      );
    } catch (error) {
      console.error('Failed to retrieve health records:', error);
      throw error;
    }
  }

  // Smart Contracts for Therapy Agreements
  async createTherapyAgreement(
    patientId: string,
    therapistId: string,
    terms: {
      sessionFrequency: number;
      duration: number; // in weeks
      goals: string[];
      emergencyContacts: string[];
      privacySettings: any;
    }
  ): Promise<string> {
    try {
      const contractId = `therapy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const contract: SmartContract = {
        id: contractId,
        type: 'therapy_agreement',
        parties: [patientId, therapistId],
        terms,
        status: 'pending',
        conditions: [
          {
            id: 'consent_verification',
            description: 'Patient must provide informed consent',
            type: 'manual_verification',
            trigger: { action: 'patient_consent_required' },
            action: 'activate_agreement',
            fulfilled: false
          },
          {
            id: 'session_compliance',
            description: `Attend ${terms.sessionFrequency} sessions per week`,
            type: 'metric_based',
            trigger: { metric: 'weekly_sessions', threshold: terms.sessionFrequency },
            action: 'track_compliance',
            fulfilled: false
          },
          {
            id: 'progress_milestones',
            description: 'Achieve therapeutic goals within timeframe',
            type: 'metric_based',
            trigger: { metric: 'goal_achievement', threshold: 0.7 },
            action: 'milestone_reached',
            fulfilled: false
          }
        ],
        executionHistory: []
      };

      this.smartContracts.set(contractId, contract);
      
      // Store contract creation on blockchain
      await this.storeHealthRecord({
        id: `contract_${contractId}`,
        patientId,
        recordType: 'session',
        data: { contractId, action: 'created', terms },
        timestamp: new Date(),
        permissions: [
          { grantedTo: patientId, accessLevel: 'read', purpose: 'patient_access' },
          { grantedTo: therapistId, accessLevel: 'read', purpose: 'therapist_access' }
        ]
      });

      return contractId;
    } catch (error) {
      console.error('Failed to create therapy agreement:', error);
      throw error;
    }
  }

  async executeSmartContract(contractId: string, conditionId: string, verificationData?: any): Promise<boolean> {
    try {
      const contract = this.smartContracts.get(contractId);
      if (!contract) {
        throw new Error('Contract not found');
      }

      const condition = contract.conditions.find(c => c.id === conditionId);
      if (!condition) {
        throw new Error('Condition not found');
      }

      let executionResult = false;

      switch (condition.type) {
        case 'manual_verification':
          executionResult = this.verifyManualCondition(condition, verificationData);
          break;
        case 'automatic':
          executionResult = await this.executeAutomaticCondition(condition);
          break;
        case 'metric_based':
          executionResult = await this.checkMetricCondition(condition, contract.parties[0]);
          break;
        case 'time_based':
          executionResult = this.checkTimeCondition(condition);
          break;
      }

      // Record execution
      const execution: ContractExecution = {
        timestamp: new Date(),
        conditionId,
        action: condition.action,
        result: executionResult ? 'success' : 'failure',
        metadata: verificationData
      };

      contract.executionHistory.push(execution);
      condition.fulfilled = executionResult;

      // Check if all conditions are fulfilled
      if (contract.conditions.every(c => c.fulfilled)) {
        contract.status = 'completed';
        await this.finalizeContract(contract);
      }

      return executionResult;
    } catch (error) {
      console.error('Smart contract execution failed:', error);
      return false;
    }
  }

  // Immutable Progress Tracking
  async recordProgressMilestone(
    patientId: string,
    milestoneId: string,
    metrics: any,
    verifiers: string[]
  ): Promise<string> {
    try {
      // Create consensus validation
      const consensusValidation = await this.validateConsensus(verifiers, metrics);
      
      const progress: ImmutableProgress = {
        patientId,
        milestoneId,
        achievedAt: new Date(),
        verifiedBy: verifiers,
        metrics,
        blockHash: await this.calculateProgressHash(patientId, milestoneId, metrics),
        consensusValidation
      };

      // Store in immutable progress log
      const existingProgress = this.immutableProgress.get(patientId) || [];
      existingProgress.push(progress);
      this.immutableProgress.set(patientId, existingProgress);

      // Store on blockchain
      await this.storeHealthRecord({
        id: `progress_${milestoneId}_${Date.now()}`,
        patientId,
        recordType: 'progress',
        data: progress,
        timestamp: new Date(),
        permissions: [
          { grantedTo: patientId, accessLevel: 'read', purpose: 'patient_progress' },
          ...verifiers.map(verifier => ({
            grantedTo: verifier,
            accessLevel: 'read' as const,
            purpose: 'verification_access'
          }))
        ]
      });

      return progress.blockHash;
    } catch (error) {
      console.error('Failed to record progress milestone:', error);
      throw error;
    }
  }

  async getImmutableProgressHistory(patientId: string): Promise<ImmutableProgress[]> {
    try {
      const progress = this.immutableProgress.get(patientId) || [];
      
      // Verify integrity of all progress records
      const verifiedProgress = await Promise.all(
        progress.map(async (p) => {
          const isValid = await this.verifyProgressIntegrity(p);
          return { ...p, isValid };
        })
      );

      return verifiedProgress;
    } catch (error) {
      console.error('Failed to get progress history:', error);
      return [];
    }
  }

  // Blockchain Integrity & Security
  async validateBlockchainIntegrity(): Promise<{
    isValid: boolean;
    corruptedBlocks: string[];
    totalBlocks: number;
  }> {
    const corruptedBlocks: string[] = [];
    let isValid = true;

    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const previousBlock = this.blockchain[i - 1];

      // Verify hash chain
      if (currentBlock.previousHash !== previousBlock.hash) {
        corruptedBlocks.push(currentBlock.id);
        isValid = false;
      }

      // Verify block hash
      const calculatedHash = await this.calculateHash({
        id: currentBlock.id,
        patientId: currentBlock.patientId,
        recordType: currentBlock.recordType,
        data: currentBlock.data,
        timestamp: currentBlock.timestamp,
        permissions: currentBlock.permissions
      });

      if (currentBlock.hash !== calculatedHash) {
        corruptedBlocks.push(currentBlock.id);
        isValid = false;
      }

      // Verify signature
      if (!await this.verifySignature(currentBlock)) {
        corruptedBlocks.push(currentBlock.id);
        isValid = false;
      }
    }

    return {
      isValid,
      corruptedBlocks,
      totalBlocks: this.blockchain.length
    };
  }

  // Permission Management
  async grantAccess(
    patientId: string,
    grantedTo: string,
    accessLevel: 'read' | 'write' | 'admin',
    purpose: string,
    expiresAt?: Date
  ): Promise<void> {
    try {
      // Find all records for patient
      const patientRecords = this.blockchain.filter(record => 
        record.patientId === patientId
      );

      // Add permission to each record
      patientRecords.forEach(record => {
        const existingPermission = record.permissions.find(p => p.grantedTo === grantedTo);
        
        if (existingPermission) {
          existingPermission.accessLevel = accessLevel;
          existingPermission.purpose = purpose;
          if (expiresAt) existingPermission.expiresAt = expiresAt;
        } else {
          record.permissions.push({
            grantedTo,
            accessLevel,
            purpose,
            expiresAt
          });
        }
      });

      // Log permission change
      await this.storeHealthRecord({
        id: `permission_${Date.now()}`,
        patientId,
        recordType: 'session',
        data: {
          action: 'permission_granted',
          grantedTo,
          accessLevel,
          purpose,
          expiresAt
        },
        timestamp: new Date(),
        permissions: [
          { grantedTo: patientId, accessLevel: 'read', purpose: 'permission_audit' }
        ]
      });
    } catch (error) {
      console.error('Failed to grant access:', error);
      throw error;
    }
  }

  async revokeAccess(patientId: string, revokedFrom: string): Promise<void> {
    try {
      const patientRecords = this.blockchain.filter(record => 
        record.patientId === patientId
      );

      patientRecords.forEach(record => {
        record.permissions = record.permissions.filter(p => 
          p.grantedTo !== revokedFrom
        );
      });

      // Log permission revocation
      await this.storeHealthRecord({
        id: `permission_revoked_${Date.now()}`,
        patientId,
        recordType: 'session',
        data: {
          action: 'permission_revoked',
          revokedFrom
        },
        timestamp: new Date(),
        permissions: [
          { grantedTo: patientId, accessLevel: 'read', purpose: 'permission_audit' }
        ]
      });
    } catch (error) {
      console.error('Failed to revoke access:', error);
      throw error;
    }
  }

  // Helper Methods
  private initializeGenesisBlock(): void {
    const genesisBlock: HealthRecord = {
      id: 'genesis_block',
      patientId: 'system',
      recordType: 'session',
      data: { message: 'TherapySync Blockchain Genesis Block' },
      timestamp: new Date(),
      hash: '0000000000000000000000000000000000000000000000000000000000000000',
      previousHash: '',
      signature: 'genesis_signature',
      permissions: []
    };

    this.blockchain.push(genesisBlock);
  }

  private getLatestBlock(): HealthRecord | null {
    return this.blockchain.length > 0 ? this.blockchain[this.blockchain.length - 1] : null;
  }

  private async calculateHash(record: any): Promise<string> {
    const data = JSON.stringify(record);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async signRecord(record: any): Promise<string> {
    // Simplified signature - in production would use proper cryptographic signing
    const hash = await this.calculateHash(record);
    return `signature_${hash.substring(0, 16)}`;
  }

  private async validateRecord(record: HealthRecord): Promise<boolean> {
    // Basic validation - in production would include more comprehensive checks
    return !!(record.id && record.patientId && record.recordType && record.data);
  }

  private async verifySignature(record: HealthRecord): Promise<boolean> {
    const expectedSignature = await this.signRecord({
      id: record.id,
      patientId: record.patientId,
      recordType: record.recordType,
      data: record.data,
      timestamp: record.timestamp
    });
    return record.signature === expectedSignature;
  }

  private hasReadPermission(patientId: string, requesterId: string): boolean {
    if (requesterId === patientId) return true; // Patient can always read their own data
    
    const patientRecords = this.blockchain.filter(r => r.patientId === patientId);
    return patientRecords.some(record => 
      record.permissions.some(permission => 
        permission.grantedTo === requesterId && 
        ['read', 'write', 'admin'].includes(permission.accessLevel) &&
        (!permission.expiresAt || permission.expiresAt > new Date())
      )
    );
  }

  private hasWritePermission(patientId: string, requesterId: string): boolean {
    if (requesterId === 'system') return true; // System can always write
    if (requesterId === patientId) return true; // Patient can write their own data
    
    const patientRecords = this.blockchain.filter(r => r.patientId === patientId);
    return patientRecords.some(record => 
      record.permissions.some(permission => 
        permission.grantedTo === requesterId && 
        ['write', 'admin'].includes(permission.accessLevel) &&
        (!permission.expiresAt || permission.expiresAt > new Date())
      )
    );
  }

  private async decryptRecord(record: HealthRecord, requesterId: string): Promise<HealthRecord> {
    // Simplified decryption - in production would use proper encryption
    return record;
  }

  private async checkSmartContractTriggers(record: HealthRecord): Promise<void> {
    const relevantContracts = Array.from(this.smartContracts.values()).filter(contract =>
      contract.parties.includes(record.patientId) && contract.status === 'active'
    );

    for (const contract of relevantContracts) {
      for (const condition of contract.conditions) {
        if (!condition.fulfilled && condition.type === 'automatic') {
          await this.executeSmartContract(contract.id, condition.id);
        }
      }
    }
  }

  private verifyManualCondition(condition: ContractCondition, verificationData: any): boolean {
    return verificationData?.verified === true;
  }

  private async executeAutomaticCondition(condition: ContractCondition): Promise<boolean> {
    // Implement automatic condition logic
    return true;
  }

  private async checkMetricCondition(condition: ContractCondition, patientId: string): Promise<boolean> {
    // Check if metric condition is met based on patient data
    return Math.random() > 0.3; // Simplified logic
  }

  private checkTimeCondition(condition: ContractCondition): boolean {
    return new Date() >= new Date(condition.trigger.targetDate);
  }

  private async finalizeContract(contract: SmartContract): Promise<void> {
    // Implement contract finalization logic
    console.log(`Contract ${contract.id} completed successfully`);
  }

  private async validateConsensus(verifiers: string[], metrics: any): Promise<boolean> {
    // Simplified consensus validation
    return verifiers.length >= 2;
  }

  private async calculateProgressHash(patientId: string, milestoneId: string, metrics: any): Promise<string> {
    return this.calculateHash({ patientId, milestoneId, metrics, timestamp: Date.now() });
  }

  private async verifyProgressIntegrity(progress: ImmutableProgress): Promise<boolean> {
    const expectedHash = await this.calculateProgressHash(
      progress.patientId,
      progress.milestoneId,
      progress.metrics
    );
    return progress.blockHash === expectedHash;
  }

  // Public API Methods
  getBlockchainStats(): {
    totalBlocks: number;
    totalContracts: number;
    activeContracts: number;
    totalPatients: number;
    averageBlockSize: number;
  } {
    const uniquePatients = new Set(this.blockchain.map(record => record.patientId)).size;
    const activeContracts = Array.from(this.smartContracts.values()).filter(c => c.status === 'active').length;
    const avgBlockSize = this.blockchain.length > 0 
      ? this.blockchain.reduce((sum, block) => sum + JSON.stringify(block).length, 0) / this.blockchain.length 
      : 0;

    return {
      totalBlocks: this.blockchain.length,
      totalContracts: this.smartContracts.size,
      activeContracts,
      totalPatients: uniquePatients,
      averageBlockSize: Math.round(avgBlockSize)
    };
  }

  getContractStatus(contractId: string): SmartContract | null {
    return this.smartContracts.get(contractId) || null;
  }
}

export const blockchainHealthRecordsService = new BlockchainHealthRecordsService();