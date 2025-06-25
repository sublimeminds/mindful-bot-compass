
interface Droplet {
  id: number;
  name: string;
  status: 'active' | 'off' | 'new';
  ip: string;
  region: string;
  size: string;
  created_at: string;
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
}

class DigitalOceanService {
  private isInitialized = false;
  private mockData = {
    droplets: [
      {
        id: 1,
        name: 'therapysync-api-01',
        status: 'active' as const,
        ip: '164.90.161.23',
        region: 'NYC1',
        size: 's-2vcpu-4gb',
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        name: 'therapysync-db-01',
        status: 'active' as const,
        ip: '164.90.161.24',
        region: 'NYC1',
        size: 's-4vcpu-8gb',
        created_at: '2024-01-15T10:35:00Z'
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
        region: 'NYC1'
      }
    ]
  };

  async initialize(): Promise<void> {
    try {
      console.log('DigitalOcean service initializing...');
      // Simulate initialization delay
      await new Promise(resolve => setTimeout(resolve, 100));
      this.isInitialized = true;
      console.log('DigitalOcean service initialized successfully');
    } catch (error) {
      console.error('DigitalOcean service initialization failed:', error);
      throw new Error('Failed to initialize DigitalOcean service');
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

  async getDropletMetrics(dropletId: number): Promise<any> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      // Return mock metrics for the droplet
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
}

export const digitalOceanService = new DigitalOceanService();
