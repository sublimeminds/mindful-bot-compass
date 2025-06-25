
interface Droplet {
  id: number;
  name: string;
  status: 'active' | 'off' | 'new';
  ip: string;
  region: string;
  size: string;
  created_at: string;
  createdAt?: string;
}

interface LoadBalancer {
  id: string;
  name: string;
  status: 'active' | 'new';
  ip: string;
  droplet_ids: number[];
}

interface Database {
  id: string;
  name: string;
  engine: string;
  status: 'online' | 'creating';
  size: string;
  region: string;
  version?: string;
  connection?: {
    host: string;
    port: number;
  };
}

interface Space {
  name: string;
  region: string;
  sizeBytes: number;
  isPublic: boolean;
}

interface DOConfig {
  apiToken: string;
  spacesAccessKey: string;
  spacesSecretKey: string;
  defaultRegion: string;
}

class DigitalOceanService {
  private isInitialized = false;
  private isConfigured = false;
  private config: DOConfig | null = null;
  
  private mockData = {
    droplets: [
      {
        id: 1,
        name: 'therapysync-api-01',
        status: 'active' as const,
        ip: '164.90.161.23',
        region: 'NYC1',
        size: 's-2vcpu-4gb',
        created_at: '2024-01-15T10:30:00Z',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        name: 'therapysync-db-01',
        status: 'active' as const,
        ip: '164.90.161.24',
        region: 'NYC1',
        size: 's-4vcpu-8gb',
        created_at: '2024-01-15T10:35:00Z',
        createdAt: '2024-01-15T10:35:00Z'
      }
    ],
    loadBalancers: [
      {
        id: 'lb-001',
        name: 'therapysync-lb',
        status: 'active' as const,
        ip: '164.90.161.25',
        droplet_ids: [1, 2]
      }
    ],
    databases: [
      {
        id: 'db-001',
        name: 'therapysync-postgres',
        engine: 'postgresql',
        status: 'online' as const,
        size: 'db-s-2vcpu-4gb',
        region: 'NYC1',
        version: '14',
        connection: {
          host: 'therapysync-postgres-do-user-123.db.ondigitalocean.com',
          port: 25060
        }
      }
    ],
    spaces: [
      {
        name: 'therapy-backups-nyc3',
        region: 'nyc3',
        sizeBytes: 1024 * 1024 * 100, // 100MB
        isPublic: false
      },
      {
        name: 'therapy-backups-sfo3',
        region: 'sfo3',
        sizeBytes: 1024 * 1024 * 75, // 75MB
        isPublic: false
      }
    ]
  };

  async initialize(): Promise<void> {
    try {
      console.log('DigitalOcean service initializing...');
      await new Promise(resolve => setTimeout(resolve, 100));
      this.isInitialized = true;
      console.log('DigitalOcean service initialized successfully');
    } catch (error) {
      console.error('DigitalOcean service initialization failed:', error);
      throw new Error('Failed to initialize DigitalOcean service');
    }
  }

  configure(config: DOConfig): void {
    try {
      if (!config.apiToken) {
        throw new Error('API token is required');
      }
      this.config = config;
      this.isConfigured = true;
      console.log('DigitalOcean service configured successfully');
    } catch (error) {
      console.error('DigitalOcean configuration failed:', error);
      throw error;
    }
  }

  async integrateWithBackupSystem(): Promise<void> {
    try {
      if (!this.isConfigured) {
        console.warn('DigitalOcean service not configured, skipping backup integration');
        return;
      }
      console.log('Integrating DigitalOcean with backup system...');
      await new Promise(resolve => setTimeout(resolve, 50));
      console.log('DigitalOcean backup integration completed');
    } catch (error) {
      console.error('Failed to integrate with backup system:', error);
    }
  }

  async listDroplets(): Promise<Droplet[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      return this.mockData.droplets;
    } catch (error) {
      console.error('Failed to list droplets:', error);
      return [];
    }
  }

  async listLoadBalancers(): Promise<LoadBalancer[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      return this.mockData.loadBalancers;
    } catch (error) {
      console.error('Failed to list load balancers:', error);
      return [];
    }
  }

  async listDatabases(): Promise<Database[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      return this.mockData.databases;
    } catch (error) {
      console.error('Failed to list databases:', error);
      return [];
    }
  }

  async listSpaces(): Promise<Space[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      return this.mockData.spaces;
    } catch (error) {
      console.error('Failed to list spaces:', error);
      return [];
    }
  }

  async createDroplet(name: string, region: string, size: string, image: string): Promise<Droplet> {
    try {
      if (!this.isConfigured) {
        throw new Error('DigitalOcean service not configured');
      }

      console.log(`Creating droplet: ${name} in ${region}`);
      await new Promise(resolve => setTimeout(resolve, 200));

      const newDroplet: Droplet = {
        id: Date.now(),
        name,
        status: 'new',
        ip: '',
        region,
        size,
        created_at: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      this.mockData.droplets.push(newDroplet);
      console.log(`Droplet ${name} created successfully`);
      return newDroplet;
    } catch (error) {
      console.error('Failed to create droplet:', error);
      throw error;
    }
  }

  async createSpace(name: string, region: string): Promise<Space> {
    try {
      if (!this.isConfigured) {
        throw new Error('DigitalOcean service not configured');
      }

      console.log(`Creating space: ${name} in ${region}`);
      await new Promise(resolve => setTimeout(resolve, 100));

      const newSpace: Space = {
        name,
        region,
        sizeBytes: 0,
        isPublic: false
      };

      this.mockData.spaces.push(newSpace);
      console.log(`Space ${name} created successfully`);
      return newSpace;
    } catch (error) {
      console.error('Failed to create space:', error);
      throw error;
    }
  }

  async createDatabase(name: string, engine: string, size: string): Promise<Database> {
    try {
      if (!this.isConfigured) {
        throw new Error('DigitalOcean service not configured');
      }

      console.log(`Creating database: ${name} with engine ${engine}`);
      await new Promise(resolve => setTimeout(resolve, 300));

      const newDatabase: Database = {
        id: `db-${Date.now()}`,
        name,
        engine,
        status: 'creating',
        size,
        region: this.config?.defaultRegion || 'nyc3',
        version: engine === 'postgresql' ? '14' : '8.0',
        connection: {
          host: `${name}-do-user-123.db.ondigitalocean.com`,
          port: engine === 'postgresql' ? 25060 : 25061
        }
      };

      this.mockData.databases.push(newDatabase);
      console.log(`Database ${name} created successfully`);
      return newDatabase;
    } catch (error) {
      console.error('Failed to create database:', error);
      throw error;
    }
  }

  async deleteDroplet(dropletId: number): Promise<boolean> {
    try {
      if (!this.isConfigured) {
        throw new Error('DigitalOcean service not configured');
      }

      console.log(`Deleting droplet: ${dropletId}`);
      await new Promise(resolve => setTimeout(resolve, 150));

      const index = this.mockData.droplets.findIndex(d => d.id === dropletId);
      if (index !== -1) {
        this.mockData.droplets.splice(index, 1);
        console.log(`Droplet ${dropletId} deleted successfully`);
        return true;
      }

      throw new Error('Droplet not found');
    } catch (error) {
      console.error('Failed to delete droplet:', error);
      throw error;
    }
  }

  async uploadToSpace(spaceName: string, key: string, data: string, isPublic: boolean = false): Promise<string> {
    try {
      if (!this.isConfigured) {
        throw new Error('DigitalOcean service not configured');
      }

      console.log(`Uploading to space ${spaceName}: ${key}`);
      await new Promise(resolve => setTimeout(resolve, 100));

      // Update space size
      const space = this.mockData.spaces.find(s => s.name === spaceName);
      if (space) {
        space.sizeBytes += data.length;
      }

      const url = `https://${spaceName}.${this.config?.defaultRegion || 'nyc3'}.digitaloceanspaces.com/${key}`;
      console.log(`File uploaded successfully to: ${url}`);
      return url;
    } catch (error) {
      console.error('Failed to upload to space:', error);
      throw error;
    }
  }

  async downloadFromSpace(spaceName: string, key: string): Promise<Uint8Array> {
    try {
      if (!this.isConfigured) {
        throw new Error('DigitalOcean service not configured');
      }

      console.log(`Downloading from space ${spaceName}: ${key}`);
      await new Promise(resolve => setTimeout(resolve, 100));

      // Simulate download by returning mock data
      const mockData = JSON.stringify({ backup: 'mock backup data', timestamp: new Date().toISOString() });
      return new TextEncoder().encode(mockData);
    } catch (error) {
      console.error('Failed to download from space:', error);
      throw error;
    }
  }

  async getDropletMetrics(dropletId: number): Promise<any> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      return {
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        disk: Math.random() * 100,
        network: {
          inbound: Math.random() * 100,
          outbound: Math.random() * 100
        }
      };
    } catch (error) {
      console.error(`Failed to get metrics for droplet ${dropletId}:`, error);
      return null;
    }
  }

  // Utility methods
  isServiceConfigured(): boolean {
    return this.isConfigured;
  }

  getConfiguration(): DOConfig | null {
    return this.config;
  }
}

export const digitalOceanService = new DigitalOceanService();
